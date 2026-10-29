"""Reproducible Sprint 3 measurements using an isolated test database."""
import json
from time import perf_counter
from datetime import timedelta
import test_validation_audit as audit


def main():
    case = audit.APIAudit()
    case.setUp()
    try:
        case.add_route()
        start = perf_counter()
        response = case.client.get('/api/v1/reports/sustainability/pdf')
        print(json.dumps({'pdf_status': response.status_code,
                          'pdf_signature': response.content.startswith(b'%PDF'),
                          'pdf_seconds': round(perf_counter() - start, 3)}), flush=True)
    finally:
        case.tearDown()
        from app.db.session import engine as application_engine
        application_engine.dispose()
        audit.tearDownModule()

    from app.services.road_network import get_road_network
    import networkx as nx
    start = perf_counter()
    network = get_road_network()
    component = max(nx.strongly_connected_components(network.graph), key=len)
    nodes = sorted(component, key=lambda n: (
        (network.graph.nodes[n]['y'] + 12.0656) ** 2 +
        (network.graph.nodes[n]['x'] + 75.2048) ** 2))[:150]
    orders = [audit.order(str(i), lat=network.graph.nodes[n]['y'],
                          lng=network.graph.nodes[n]['x'],
                          fin=audit.BASE + timedelta(hours=8)) for i, n in enumerate(nodes)]
    fleet = [dict(audit.vehicle(), id=f'v{i}', capacidad_kg=200) for i in range(15)]
    drivers = [dict(id=f'd{i}', horas_conducidas=0) for i in range(15)]
    result = audit.VRPTWSolver(road_network=network).solve(fleet, drivers, orders)
    seconds = perf_counter() - start
    stops = [s for r in result['routes'] for s in r['stops']]
    valid = (len(stops) == 150 and not result['unassigned_orders']
             and len({s['pedido_id'] for s in stops}) == 150
             and all(len(r['stops']) * 10 <= 200 for r in result['routes'])
             and all(audit.BASE <= s['hora_estimada'] <= audit.BASE + timedelta(hours=8) for s in stops)
             and len({r['vehiculo_id'] for r in result['routes']}) == len(result['routes'])
             and len({r['conductor_id'] for r in result['routes']}) == len(result['routes']))
    print(json.dumps({'orders': len(orders), 'vehicles': len(fleet),
                      'seconds_including_cached_graph_load': round(seconds, 3),
                      'assigned': len(stops), 'unassigned': len(result['unassigned_orders']),
                      'valid_assignment': valid, 'under_45_seconds': seconds <= 45}), flush=True)


if __name__ == '__main__':
    main()
