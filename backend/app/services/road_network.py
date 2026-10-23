"""Shortest directed road paths in Huancayo, weighted in metres.

OSMnx supplies the driving graph; the shortest-path search below is Dijkstra.
The graph is cached locally. No straight-line fallback is used.
"""
import heapq
import math
import threading
from functools import lru_cache
from pathlib import Path

import osmnx as ox

BBOX = (-75.32, -12.16, -75.13, -11.97)  # west, south, east, north
CACHE = Path(__file__).resolve().parents[2] / "data" / "roads"
_lock = threading.Lock()


class RoadNetworkError(ValueError):
    pass


def dijkstra(graph, source, targets):
    """Return distances and predecessors; stop only after all targets settle."""
    remaining = set(targets)
    distances, previous = {source: 0.0}, {}
    queue = [(0.0, source)]
    while queue and remaining:
        distance, node = heapq.heappop(queue)
        if distance != distances[node]:
            continue
        remaining.discard(node)
        for neighbor, edges in graph[node].items():
            weight = min(float(edge["length"]) for edge in edges.values())
            if not math.isfinite(weight) or weight < 0:
                raise RoadNetworkError("La red contiene una distancia inválida.")
            candidate = distance + weight
            if candidate < distances.get(neighbor, math.inf):
                distances[neighbor] = candidate
                previous[neighbor] = node
                heapq.heappush(queue, (candidate, neighbor))
    return distances, previous


class RoadNetwork:
    def __init__(self, graph):
        self.graph = graph

    def snap(self, points):
        for lat, lng in points:
            if not (math.isfinite(lat) and math.isfinite(lng)
                    and BBOX[0] <= lng <= BBOX[2] and BBOX[1] <= lat <= BBOX[3]):
                raise RoadNetworkError("El punto está fuera de la cobertura vial de Huancayo.")
        nodes, distances = ox.distance.nearest_nodes(
            self.graph, X=[p[1] for p in points], Y=[p[0] for p in points], return_dist=True)
        if any(float(distance) > 300 for distance in distances):
            raise RoadNetworkError("Un punto está a más de 300 m de una vía accesible. Corrija su ubicación.")
        return [int(node) for node in nodes]

    @lru_cache(maxsize=128)
    def searches(self, nodes):
        return {source: dijkstra(self.graph, source, nodes) for source in set(nodes)}

    def matrix(self, points):
        nodes = tuple(self.snap(points))
        searches = self.searches(nodes)
        matrix = []
        for source in nodes:
            distances = searches[source][0]
            if any(target not in distances for target in nodes):
                raise RoadNetworkError("No existe conexión vial entre algunas paradas.")
            matrix.append([int(round(distances[target])) for target in nodes])
        return matrix

    def route(self, points):
        nodes = tuple(self.snap(points))
        searches = self.searches(nodes)
        coordinates, total = [], 0.0
        for source, target in zip(nodes, nodes[1:]):
            distances, previous = searches[source]
            if target not in distances:
                raise RoadNetworkError("No existe un camino vial entre estas paradas.")
            total += distances[target]
            path = [target]
            while path[-1] != source:
                path.append(previous[path[-1]])
            for node in reversed(path):
                point = [self.graph.nodes[node]["x"], self.graph.nodes[node]["y"]]
                if not coordinates or coordinates[-1] != point:
                    coordinates.append(point)
        if len(coordinates) == 1:
            coordinates.append(coordinates[0])
        return {"code": "Ok", "algorithm": "dijkstra", "weight": "distance_m",
                "routes": [{"distance": total, "geometry": {
                    "type": "LineString", "coordinates": coordinates}}]}


@lru_cache(maxsize=1)
def get_road_network():
    with _lock:
        CACHE.mkdir(parents=True, exist_ok=True)
        path = CACHE / "huancayo.graphml"
        try:
            if path.exists():
                graph = ox.load_graphml(path)
            else:
                ox.settings.cache_folder = str(CACHE / "http")
                ox.settings.requests_timeout = 90
                # Keep every OSM node so geometry and edge distances use the same graph.
                graph = ox.graph_from_bbox(BBOX, network_type="drive", simplify=False, retain_all=True)
                ox.save_graphml(graph, path)
            return RoadNetwork(graph)
        except Exception as exc:
            raise RoadNetworkError("No se pudo cargar la red vial. Intente nuevamente.") from exc
