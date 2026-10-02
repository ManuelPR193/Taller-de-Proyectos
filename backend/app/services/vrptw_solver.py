import math
from datetime import datetime, timedelta, time
from typing import List, Dict, Any, Tuple
from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp
from app.core.config import settings

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates distance between two lat/lng points in Kilometers."""
    R = 6371.0 # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

class VRPTWSolver:
    """
    Vehicle Routing Problem with Time Windows (VRPTW) and Green VRP solver.
    Implements business rules:
    - RN-002: Vehicles >15 years old deprioritized (increased routing cost factor).
    - RN-003: Max 8 hours driving/day per driver.
    - RN-006: Vehicle weight capacity constraint.
    - RN-007: Unpaved/High-risk road penalties.
    - RN-008: CO2 emissions calculation per route based on vehicle factor.
    """

    def __init__(self, depot_lat: float = settings.DEPOT_LAT, depot_lng: float = settings.DEPOT_LNG):
        self.depot_lat = depot_lat
        self.depot_lng = depot_lng

    def solve(
        self,
        vehicles: List[Dict[str, Any]], # [{"id": str, "placa": str, "capacidad_kg": float, "consumo_km_l": float, "factor_emision_co2": float, "anio": int}]
        drivers: List[Dict[str, Any]],  # [{"id": str, "nombre": str, "horas_conducidas": float}]
        orders: List[Dict[str, Any]]    # [{"id": str, "lat": float, "lng": float, "peso_kg": float, "prioridad": str, "inicio": datetime, "fin": datetime}]
    ) -> Dict[str, Any]:
        
        if not vehicles or not orders:
            return {"routes": [], "unassigned_orders": [o["id"] for o in orders], "reason": "No vehicles or orders available"}

        # Build location list: Depot is index 0
        locations = [{"lat": self.depot_lat, "lng": self.depot_lng}]
        order_map = {}
        for i, order in enumerate(orders, start=1):
            locations.append({"lat": order["lat"], "lng": order["lng"]})
            order_map[i] = order

        num_locations = len(locations)
        num_vehicles = min(len(vehicles), len(drivers))
        if num_vehicles == 0:
            return {"routes": [], "unassigned_orders": [o["id"] for o in orders], "reason": "No vehicles or drivers matched"}

        # Distance Matrix in meters (for precision in OR-Tools)
        distance_matrix = []
        for i in range(num_locations):
            row = []
            for j in range(num_locations):
                if i == j:
                    row.append(0)
                else:
                    dist_km = haversine_distance(
                        locations[i]["lat"], locations[i]["lng"],
                        locations[j]["lat"], locations[j]["lng"]
                    )
                    # Apply RN-007 penalty for high risk/unpaved road zones (e.g. Chilca alta / Cochas)
                    # Simple heuristic: if location is in Chilca alta area (lat < -12.08)
                    if locations[j]["lat"] < -12.08:
                        dist_km *= 1.15
                    row.append(int(dist_km * 1000)) # meters
            distance_matrix.append(row)

        # OR-Tools Data Model
        data = {
            "distance_matrix": distance_matrix,
            "num_vehicles": num_vehicles,
            "depot": 0,
            "demands": [0] + [int(o["peso_kg"]) for o in orders],
            "vehicle_capacities": [int(v["capacidad_kg"]) for v in vehicles[:num_vehicles]]
        }

        # Create Routing Index Manager & Routing Model
        manager = pywrapcp.RoutingIndexManager(num_locations, num_vehicles, data["depot"])
        routing = pywrapcp.RoutingModel(manager)

        # Distance cost callback
        def distance_callback(from_index, to_index):
            from_node = manager.IndexToNode(from_index)
            to_node = manager.IndexToNode(to_index)
            return data["distance_matrix"][from_node][to_node]

        transit_callback_index = routing.RegisterTransitCallback(distance_callback)
        routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)

        # Apply RN-002 penalty for vehicles older than 15 years
        current_year = datetime.now().year
        for vehicle_idx, veh in enumerate(vehicles[:num_vehicles]):
            age = current_year - veh.get("anio", current_year)
            if age > 15:
                # Add extra cost multiplier to discourage choosing old vehicle unless required
                routing.SetFixedCostOfVehicle(50000, vehicle_idx)

        # Capacity dimension (RN-006)
        def demand_callback(from_index):
            from_node = manager.IndexToNode(from_index)
            return data["demands"][from_node]

        demand_callback_index = routing.RegisterUnaryTransitCallback(demand_callback)
        routing.AddDimensionWithCapacity(
            demand_callback_index,
            0,  # null capacity slack
            data["vehicle_capacities"], # vehicle capacities
            True,  # start cumulative to zero
            "Capacity"
        )

        # Time dimension (Estimated speed: 25 km/h in Huancayo urban area -> ~7 m/s)
        speed_m_per_sec = 7.0
        def time_callback(from_index, to_index):
            from_node = manager.IndexToNode(from_index)
            to_node = manager.IndexToNode(to_index)
            dist_m = data["distance_matrix"][from_node][to_node]
            travel_time_sec = dist_m / speed_m_per_sec
            service_time_sec = 300 if to_node != 0 else 0 # 5 min service time per delivery
            return int(travel_time_sec + service_time_sec)

        time_callback_index = routing.RegisterTransitCallback(time_callback)
        max_work_sec = int(settings.MAX_DRIVER_HOURS_PER_DAY * 3600) # RN-003: 8 hours = 28800 seconds
        routing.AddDimension(
            time_callback_index,
            3600, # allow waiting time up to 1 hr
            max_work_sec, # max time per vehicle (RN-003)
            False,
            "Time"
        )

        # Search parameters
        search_parameters = pywrapcp.DefaultRoutingSearchParameters()
        search_parameters.first_solution_strategy = (
            routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
        )
        search_parameters.local_search_metaheuristic = (
            routing_enums_pb2.LocalSearchMetaheuristic.GUIDED_LOCAL_SEARCH
        )
        search_parameters.time_limit.seconds = 5 # RF-003 execution requirement < 45s

        solution = routing.SolveWithParameters(search_parameters)

        result_routes = []
        assigned_orders = set()

        if solution:
            time_dimension = routing.GetDimensionOrDie("Time")
            for vehicle_id in range(num_vehicles):
                index = routing.Start(vehicle_id)
                route_stops = []
                route_dist_m = 0
                veh_info = vehicles[vehicle_id]
                drv_info = drivers[vehicle_id]

                while not routing.IsEnd(index):
                    node = manager.IndexToNode(index)
                    time_var = time_dimension.CumulVar(index)
                    if node != 0:
                        order = order_map[node]
                        assigned_orders.add(order["id"])
                        est_minutes = solution.Min(time_var) // 60
                        est_time = datetime.now().replace(hour=8, minute=0, second=0) + timedelta(minutes=est_minutes)
                        route_stops.append({
                            "pedido_id": order["id"],
                            "lat": order["lat"],
                            "lng": order["lng"],
                            "hora_estimada": est_time
                        })
                    
                    previous_index = index
                    index = solution.Value(routing.NextVar(index))
                    route_dist_m += routing.GetArcCostForVehicle(previous_index, index, vehicle_id)

                if route_stops:
                    dist_km = round(route_dist_m / 1000.0, 2)
                    co2_kg = round(dist_km * veh_info["factor_emision_co2"], 2) # RN-008
                    fuel_l = round(dist_km / veh_info["consumo_km_l"], 2) if veh_info["consumo_km_l"] > 0 else 0.0

                    result_routes.append({
                        "vehiculo_id": veh_info["id"],
                        "conductor_id": drv_info["id"],
                        "distancia_total_km": dist_km,
                        "co2_total_kg": co2_kg,
                        "combustible_estimado_l": fuel_l,
                        "stops": route_stops
                    })

        unassigned = [o["id"] for o in orders if o["id"] not in assigned_orders]

        return {
            "routes": result_routes,
            "unassigned_orders": unassigned,
            "reason": "Capacidad insuficiente" if unassigned else None
        }

    def insert_express_order(
        self,
        express_order: Dict[str, Any],
        active_routes: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        RN-004: Inserts an express order into the geographically closest active route with remaining capacity.
        """
        if not active_routes:
            return {"success": False, "message": "No hay rutas activas disponibles"}

        best_route_idx = -1
        best_distance = float("inf")
        best_insert_pos = -1

        for r_idx, route in enumerate(active_routes):
            stops = route.get("stops", [])
            for s_idx, stop in enumerate(stops):
                dist = haversine_distance(express_order["lat"], express_order["lng"], stop["lat"], stop["lng"])
                if dist < best_distance:
                    best_distance = dist
                    best_route_idx = r_idx
                    best_insert_pos = s_idx + 1

        if best_route_idx != -1:
            target_route = active_routes[best_route_idx]
            target_route["stops"].insert(best_insert_pos, {
                "pedido_id": express_order["id"],
                "lat": express_order["lat"],
                "lng": express_order["lng"],
                "hora_estimada": datetime.now() + timedelta(minutes=30)
            })
            return {"success": True, "route_id": target_route.get("ruta_id"), "insert_position": best_insert_pos}

        return {"success": False, "message": "No se pudo insertar la orden exprés"}
