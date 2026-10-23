"""Deterministic road routing tests, without internet or the application database."""
import unittest
from datetime import datetime, time, timedelta
from itertools import permutations
from unittest.mock import patch

import networkx as nx
from app.services.road_network import RoadNetwork, RoadNetworkError, dijkstra
from app.services.vrptw_solver import VRPTWSolver


class DijkstraTests(unittest.TestCase):
    def graph(self):
        graph = nx.MultiDiGraph()
        for node in range(4):
            graph.add_node(node, x=-75.2 + node * .001, y=-12.06)
        for a, b, distance in [(0, 1, 10), (0, 2, 2), (2, 1, 2), (1, 3, 1), (2, 3, 20)]:
            graph.add_edge(a, b, length=distance)
        return graph

    def test_shortest_path_is_not_greedy_direct_edge(self):
        distances, previous = dijkstra(self.graph(), 0, [3])
        self.assertEqual(distances[3], 5)
        self.assertEqual([previous[3], previous[1], previous[2]], [1, 2, 0])

    def test_one_way_and_disconnected_nodes(self):
        distances, _ = dijkstra(self.graph(), 3, [0])
        self.assertNotIn(0, distances)
        network = RoadNetwork(self.graph())
        with patch.object(network, 'snap', return_value=[3, 0]):
            with self.assertRaises(RoadNetworkError):
                network.route([(0, 0), (0, 0)])

    def test_geometry_matches_shortest_path_distance(self):
        network = RoadNetwork(self.graph())
        with patch.object(network, 'snap', return_value=[0, 3]):
            result = network.route([(0, 0), (0, 0)])
        self.assertEqual(result['algorithm'], 'dijkstra')
        self.assertEqual(result['routes'][0]['distance'], 5)
        self.assertEqual(result['routes'][0]['geometry']['coordinates'],
                         [[network.graph.nodes[n]['x'], -12.06] for n in [0, 2, 1, 3]])

    def test_parallel_edges_choose_shortest(self):
        graph = self.graph()
        graph.add_edge(0, 1, length=1)
        self.assertEqual(dijkstra(graph, 0, [3])[0][3], 2)

    def test_solver_uses_road_costs_for_order_and_metrics(self):
        # All coordinates coincide: only the road matrix can determine the order/cost.
        matrix = [[0, 1000, 9000, 9000], [9000, 0, 1000, 9000],
                  [9000, 9000, 0, 1000], [1000, 9000, 9000, 0]]
        class Network:
            def matrix(self, points):
                return matrix
        base = datetime.combine(datetime.now().date(), time(8))
        orders = [dict(id=str(i), lat=-12.06, lng=-75.2, peso_kg=10,
                       inicio=base, fin=base+timedelta(hours=8)) for i in range(1, 4)]
        result = VRPTWSolver(road_network=Network()).solve(
            [dict(id='v', capacidad_kg=100, factor_emision_co2=.2, consumo_km_l=10, anio=2026)],
            [dict(id='d', horas_conducidas=0)], orders)
        self.assertEqual(result['unassigned_orders'], [])
        route = result['routes'][0]
        optimum = min(sum(matrix[a][b] for a, b in zip((0,)+p, p+(0,)))
                      for p in permutations((1, 2, 3))) / 1000
        self.assertEqual(route['distancia_total_km'], optimum)
        self.assertEqual([s['pedido_id'] for s in route['stops']], ['1', '2', '3'])
        self.assertEqual(route['co2_total_kg'], .8)
        self.assertEqual(route['combustible_estimado_l'], .4)


if __name__ == '__main__':
    unittest.main()
