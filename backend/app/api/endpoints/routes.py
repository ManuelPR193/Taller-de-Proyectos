from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date, datetime
from app.db.session import get_db
from app.models.domain import Ruta, RutaDetalle, Pedido, Vehiculo, Conductor
from app.schemas.schemas import RutaOut, RouteGenerationRequest, DeliveryConfirmationRequest, ExpressOrderInsertRequest
from app.services.vrptw_solver import VRPTWSolver

router = APIRouter()

@router.get("/", response_model=List[RutaOut])
def get_routes(fecha: Optional[date] = None, db: Session = Depends(get_db)):
    query = db.query(Ruta)
    if fecha:
        query = query.filter(Ruta.fecha == fecha)
    return query.all()

@router.get("/{ruta_id}", response_model=RutaOut)
def get_route_by_id(ruta_id: str, db: Session = Depends(get_db)):
    route = db.query(Ruta).filter(Ruta.ruta_id == ruta_id).first()
    if not route:
        raise HTTPException(status_code=404, detail="Ruta no encontrada")
    return route

@router.post("/generate", response_model=List[RutaOut])
def generate_routes(payload: RouteGenerationRequest, db: Session = Depends(get_db)):
    target_date = payload.fecha or date.today()

    # Get pending orders (RF-003)
    pending_orders = db.query(Pedido).filter(Pedido.estado == "PENDIENTE").all()
    if not pending_orders:
        raise HTTPException(status_code=400, detail="No existen pedidos pendientes de ruteo.")

    # Get available vehicles & drivers
    vehicles = db.query(Vehiculo).filter(Vehiculo.estado == "DISPONIBLE").all()
    drivers = db.query(Conductor).filter(Conductor.estado == "DISPONIBLE").all()

    # RF-003 Infeliz: No vehicles available
    if not vehicles or not drivers:
        raise HTTPException(status_code=400, detail="No existen vehículos o conductores disponibles para la generación de rutas (RF-003).")

    # Format data for VRPTWSolver
    solver_vehicles = [{
        "id": v.vehiculo_id,
        "placa": v.placa,
        "capacidad_kg": v.capacidad_kg,
        "consumo_km_l": v.consumo_km_l,
        "factor_emision_co2": v.factor_emision_co2,
        "anio": v.anio_fabricacion
    } for v in vehicles]

    solver_drivers = [{
        "id": d.conductor_id,
        "nombre": d.nombre,
        "horas_conducidas": d.horas_conducidas_dia
    } for d in drivers]

    solver_orders = [{
        "id": p.pedido_id,
        "lat": p.latitud,
        "lng": p.longitud,
        "peso_kg": p.peso_kg,
        "prioridad": p.prioridad,
        "inicio": p.ventana_inicio,
        "fin": p.ventana_fin
    } for p in pending_orders]

    solver = VRPTWSolver()
    solution = solver.solve(solver_vehicles, solver_drivers, solver_orders)

    created_routes = []
    
    # Process solution
    for r_data in solution.get("routes", []):
        new_route = Ruta(
            vehiculo_id=r_data["vehiculo_id"],
            conductor_id=r_data["conductor_id"],
            fecha=target_date,
            distancia_total_km=r_data["distancia_total_km"],
            co2_total_kg=r_data["co2_total_kg"],
            combustible_estimado_l=r_data["combustible_estimado_l"],
            estado="PLANIFICADA"
        )
        db.add(new_route)
        db.flush()

        for idx, stop in enumerate(r_data["stops"], start=1):
            detail = RutaDetalle(
                ruta_id=new_route.ruta_id,
                pedido_id=stop["pedido_id"],
                orden_visita=idx,
                hora_estimada=stop["hora_estimada"],
                latitud=stop["lat"],
                longitud=stop["lng"]
            )
            db.add(detail)
            
            # Update order status
            order_obj = db.query(Pedido).filter(Pedido.pedido_id == stop["pedido_id"]).first()
            if order_obj:
                order_obj.estado = "ASIGNADO"

        created_routes.append(new_route)

    # Mark unassigned orders (RF-003 Ruta Feliz)
    for unassigned_id in solution.get("unassigned_orders", []):
        order_obj = db.query(Pedido).filter(Pedido.pedido_id == unassigned_id).first()
        if order_obj:
            order_obj.motivo_no_asignado = solution.get("reason", "Capacidad insuficiente")

    db.commit()
    for r in created_routes:
        db.refresh(r)

    return created_routes

@router.post("/deliver-confirm")
def confirm_delivery(payload: DeliveryConfirmationRequest, db: Session = Depends(get_db)):
    """RN-010: Mandatory delivery confirmation with GPS and timestamp from Driver Mode."""
    detail = db.query(RutaDetalle).filter(RutaDetalle.ruta_detalle_id == payload.ruta_detalle_id).first()
    if not detail:
        raise HTTPException(status_code=404, detail="Detalle de ruta no encontrado.")

    detail.hora_real_entrega = datetime.now()
    order = db.query(Pedido).filter(Pedido.pedido_id == detail.pedido_id).first()
    if order:
        order.estado = "ENTREGADO"

    db.commit()
    return {"message": "Entrega confirmada exitosamente (RN-010).", "hora_entrega": detail.hora_real_entrega}

@router.post("/reoptimize-express")
def insert_express_order(payload: ExpressOrderInsertRequest, db: Session = Depends(get_db)):
    """RN-004 / RF-007: Insert express order into nearest active route with available capacity."""
    order = db.query(Pedido).filter(Pedido.pedido_id == payload.pedido_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Pedido no encontrado.")

    if order.prioridad != "EXPRESS":
        order.prioridad = "EXPRESS"

    active_routes = db.query(Ruta).filter(Ruta.estado.in_(["PLANIFICADA", "EN_PROGRESO"])).all()
    if not active_routes:
        raise HTTPException(status_code=400, detail="No existen rutas activas para insertar la orden express.")

    solver = VRPTWSolver()
    routes_payload = []
    for r in active_routes:
        routes_payload.append({
            "ruta_id": r.ruta_id,
            "stops": [{"pedido_id": d.pedido_id, "lat": d.latitud, "lng": d.longitud} for d in r.detalles]
        })

    res = solver.insert_express_order({"id": order.pedido_id, "lat": order.latitud, "lng": order.longitud}, routes_payload)
    if res["success"]:
        order.estado = "ASIGNADO"
        db.commit()
        return {"message": f"Pedido Express insertado exitosamente en la ruta {res['route_id']} (RN-004).", "detalles": res}
    else:
        raise HTTPException(status_code=400, detail=res["message"])
