"""Browser acceptance for Sprint 3 (requires the built app on port 8000)."""
import json
import os
from pathlib import Path
from time import perf_counter
from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[2]
AXE = ROOT / 'frontend' / 'node_modules' / 'axe-core' / 'axe.min.js'
BASE = 'http://127.0.0.1:8000'
ARTIFACTS = ROOT / 'backend' / 'test-artifacts'
route_data = [{
    'ruta_id': 'demo-route', 'vehiculo_id': 'v1', 'conductor_id': 'd1',
    'fecha': '2026-10-29', 'distancia_total_km': 4.2, 'co2_total_kg': .8,
    'combustible_estimado_l': .4, 'estado': 'PLANIFICADA',
    'vehiculo': {'vehiculo_id': 'v1', 'placa': 'TEST-1', 'tipo': 'FURGON',
                 'capacidad_kg': 100, 'consumo_km_l': 10, 'factor_emision_co2': .2,
                 'anio_fabricacion': 2025, 'estado': 'DISPONIBLE',
                 'es_alto_emisor': False, 'creado_en': '2026-10-29T08:00:00'},
    'conductor': {'conductor_id': 'd1', 'nombre': 'Conductor prueba', 'dni': '12345678',
                  'categoria_licencia': 'A2', 'anios_experiencia': 5,
                  'horas_conducidas_dia': 1, 'contacto': None, 'estado': 'DISPONIBLE',
                  'creado_en': '2026-10-29T08:00:00'},
    'detalles': [
        {'ruta_detalle_id': 's1', 'pedido_id': 'o1', 'orden_visita': 1,
         'hora_estimada': '2026-10-29T09:00:00', 'hora_real_entrega': None,
         'latitud': -12.060, 'longitud': -75.210, 'pedido': None},
        {'ruta_detalle_id': 's2', 'pedido_id': 'o2', 'orden_visita': 2,
         'hora_estimada': '2026-10-29T10:00:00', 'hora_real_entrega': None,
         'latitud': -12.070, 'longitud': -75.200, 'pedido': None},
        {'ruta_detalle_id': 's3', 'pedido_id': 'o3', 'orden_visita': 3,
         'hora_estimada': '2026-10-29T11:00:00', 'hora_real_entrega': None,
         'latitud': -12.075, 'longitud': -75.205, 'pedido': None},
    ]
}]


def login(page):
    page.goto(BASE, wait_until='domcontentloaded')
    page.locator('input[type="email"]').fill('admin@distrirapido.pe')
    page.locator('input[type="password"]').fill('admin123')
    page.locator('form').first.locator('button[type="submit"]').click()
    page.wait_for_selector('main')


def main():
    ARTIFACTS.mkdir(exist_ok=True)
    output = {}
    with sync_playwright() as p:
        launch_options = {'headless': True}
        if os.getenv('PLAYWRIGHT_CHANNEL'):
            launch_options['channel'] = os.environ['PLAYWRIGHT_CHANNEL']
        browser = p.chromium.launch(**launch_options)
        context = browser.new_context(viewport={'width': 1280, 'height': 900}, accept_downloads=True)
        page = context.new_page()
        login(page)

        page.route('**/api/v1/routes/?fecha=*', lambda r: r.fulfill(status=200,
                   content_type='application/json', body=json.dumps(route_data)))
        page.route('**/api/v1/orders/', lambda r: r.fulfill(status=200,
                   content_type='application/json', body='[]'))
        page.route('**/api/v1/routes/demo-route/traffic', lambda r: r.fulfill(status=200,
                   content_type='application/json', body=json.dumps([
                       {'tramo': 0, 'nivel': 'BAJO', 'fuente': 'Prueba', 'observado_en': '2026-10-29T12:00:00'},
                       {'tramo': 1, 'nivel': 'MEDIO', 'fuente': 'Prueba', 'observado_en': '2026-10-29T12:00:00'},
                       {'tramo': 2, 'nivel': 'ALTO', 'fuente': 'Prueba', 'observado_en': '2026-10-29T12:00:00'},
                       {'tramo': 3, 'nivel': 'SIN_DATOS', 'fuente': None, 'observado_en': None}])))
        geometry = {'code': 'Ok', 'routes': [{'segments': [
            {'coordinates': [[-75.2048, -12.0656], [-75.207, -12.063], [-75.210, -12.060]]},
            {'coordinates': [[-75.210, -12.060], [-75.205, -12.065], [-75.200, -12.070]]},
            {'coordinates': [[-75.200, -12.070], [-75.202, -12.073], [-75.205, -12.075]]},
            {'coordinates': [[-75.205, -12.075], [-75.203, -12.070], [-75.2048, -12.0656]]},
        ]}]}
        page.route('**/api/v1/roads/path?*', lambda r: r.fulfill(status=200,
                   content_type='application/json', body=json.dumps(geometry)))
        page.goto(BASE + '/rutas', wait_until='domcontentloaded')
        page.wait_for_selector('.leaflet-overlay-pane path', timeout=15000)
        body = page.locator('body').inner_text()
        colors = page.locator('.leaflet-overlay-pane path').evaluate_all(
            "els => els.map(e => e.getAttribute('stroke'))")
        marker_count = page.locator('.stop-marker').count()
        output['PT-01'] = {'approved': 'Parada 1' in body and 'Parada 2' in body and marker_count == 3,
                           'numbered_markers': marker_count}
        output['PT-02'] = {'approved': 'Sin datos de tráfico' in body}
        output['PT-03'] = {'approved': {'#15803d', '#eab308', '#dc2626'}.issubset(set(colors)),
                           'colors': colors}
        page.screenshot(path=str(ARTIFACTS / 'sprint3-map.png'), full_page=True)

        page.unroute('**/api/v1/roads/path?*')
        page.route('**/api/v1/roads/path?*', lambda r: r.fulfill(status=503,
                   content_type='application/json', body='{"detail":"Proveedor no disponible"}'))
        page.reload(wait_until='domcontentloaded')
        page.wait_for_selector('[role="alert"]', timeout=15000)
        text = page.locator('[role="alert"]').first.inner_text()
        output['PT-04'] = {'approved': 'Servicio de mapas no disponible' in text and 'lista de paradas' in text}

        empty = {'periodo': '2026-10-01 a 2026-10-29', 'fecha_inicio': '2026-10-01',
                 'fecha_fin': '2026-10-29', 'distancia_total_km': 0, 'co2_total_kg': 0,
                 'combustible_ahorrado_l': 0, 'cumplimiento_ventanas_porcentaje': 0,
                 'ahorro_vs_secuencial_porcentaje': 0, 'arboles_equivalentes': 0,
                 'rutas_totales': 0, 'pedidos_totales': 0, 'pedidos_entregados': 0,
                 'sin_datos': True, 'dias_sin_informacion': [], 'rutas_con_base': 0,
                 'rutas_sin_base': 0, 'por_vehiculo': []}
        page.route('**/api/v1/dashboard/metrics?*', lambda r: r.fulfill(status=200,
                   content_type='application/json', body=json.dumps(empty)))
        page.goto(BASE, wait_until='domcontentloaded')
        page.wait_for_selector('[data-testid="metrics"]')
        output['PT-05'] = {'approved': page.locator('[data-metric]').count() == 5}
        output['PT-06'] = {'approved': 'Sin datos para el periodo seleccionado' in page.locator('body').inner_text()
                           and all('0' in x for x in page.locator('[data-metric]').all_inner_texts())}
        page.screenshot(path=str(ARTIFACTS / 'sprint3-dashboard-empty.png'), full_page=True)

        page.unroute('**/api/v1/dashboard/metrics?*')
        page.goto(BASE + '/reportes', wait_until='domcontentloaded')
        start = perf_counter()
        with page.expect_download(timeout=10000) as download_info:
            page.get_by_role('button', name='Descargar PDF').click()
        download = download_info.value
        download_path = download.path()
        elapsed = perf_counter() - start
        output['PT-07'] = {'approved': elapsed < 10 and Path(download_path).read_bytes().startswith(b'%PDF'),
                           'seconds': round(elapsed, 3)}

        page.add_script_tag(path=str(AXE))
        axe = page.evaluate("""async () => await axe.run(document, {
            runOnly: {type: 'tag', values: ['wcag2a', 'wcag2aa']}
        })""")
        critical = [v['id'] for v in axe['violations'] if v['impact'] == 'critical']
        output['PT-11'] = {'approved': not critical, 'critical': critical,
                           'all_violation_ids': [v['id'] for v in axe['violations']],
                           'targets': [node['target'] for violation in axe['violations']
                                       for node in violation['nodes']]}

        slow = browser.new_context(viewport={'width': 390, 'height': 844})
        mobile = slow.new_page()
        login(mobile)
        session = slow.new_cdp_session(mobile)
        session.send('Network.enable')
        session.send('Network.setCacheDisabled', {'cacheDisabled': True})
        session.send('Network.emulateNetworkConditions', {
            'offline': False, 'latency': 100, 'downloadThroughput': 750 * 1024 / 8,
            'uploadThroughput': 250 * 1024 / 8, 'connectionType': 'cellular3g'})
        start = perf_counter()
        mobile.goto(BASE, wait_until='domcontentloaded', timeout=15000)
        mobile.wait_for_selector('[data-testid="metrics"]', timeout=5000)
        elapsed = perf_counter() - start
        output['PT-10'] = {'approved': elapsed <= 5, 'essential_view_seconds': round(elapsed, 3)}
        slow.close()
        context.close()
        browser.close()

    failed = [case for case, value in output.items() if not value['approved']]
    print(json.dumps(output, ensure_ascii=False, indent=2), flush=True)
    if failed:
        raise SystemExit('Browser acceptance failed: ' + ', '.join(failed))


if __name__ == '__main__':
    main()
