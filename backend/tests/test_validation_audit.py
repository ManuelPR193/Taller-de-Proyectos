"""Functional audit. Failing assertions document real unmet requirements.

Run from backend: venv/Scripts/python -m unittest discover -s tests -v
Requires httpx. Uses a temporary SQLite database, never the running app database.
"""
import os
import sys
import tempfile
import unittest
from datetime import datetime, timedelta, time
from itertools import permutations
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
_temp = tempfile.TemporaryDirectory(prefix="ecologistica-audit-")
os.environ["DATABASE_URL"] = "sqlite:///" + str(Path(_temp.name) / "audit.db").replace("\\", "/")

from fastapi.testclient import TestClient
from app.main import app
from app.db.session import Base, get_db
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Build an isolated engine even if another test already imported app settings.
engine = create_engine(os.environ['DATABASE_URL'], connect_args={'check_same_thread': False})
SessionLocal = sessionmaker(bind=engine)

def audit_db():
    with SessionLocal() as db:
        yield db

app.dependency_overrides[get_db] = audit_db
from app.models.domain import Cliente, Conductor, Pedido, Ruta, RutaDetalle, Usuario, Vehiculo
from app.core.security import get_password_hash, failed_login_tracker
from app.services.vrptw_solver import VRPTWSolver, haversine_distance

BASE = datetime.combine(datetime.now().date(), time(8))


def tearDownModule():
    # Release pooled SQLite handles before deleting the temporary DB on Windows.
    app.dependency_overrides.pop(get_db, None)
    engine.dispose()
    _temp.cleanup()


def vehicle(**changes):
    return dict(id="v1", placa="TEST-1", capacidad_kg=100, consumo_km_l=10,
                factor_emision_co2=0.2, anio=2025, **changes)


def order(identifier="o1", **changes):
    value = dict(id=identifier, lat=-12.0656, lng=-75.2048, peso_kg=10,
                 prioridad="ESTANDAR", inicio=BASE, fin=BASE + timedelta(hours=8))
    value.update(changes)
    return value


class SolverAudit(unittest.TestCase):
    def solve(self, orders, vehicles=None, hours=0):
        return VRPTWSolver().solve(vehicles or [vehicle()],
                                  [dict(id="d1", nombre="Test", horas_conducidas=hours)], orders)

    def test_normal_assignment(self):
        result = self.solve([order()])
        self.assertEqual(result["unassigned_orders"], [])
        self.assertEqual(len(result["routes"][0]["stops"]), 1)

    def test_overweight_rejected(self):
        result = self.solve([order(peso_kg=101)])
        self.assertEqual(result["unassigned_orders"], ["o1"])

    def test_fractional_weight_capacity(self):
        result = self.solve([order("a", peso_kg=50.9), order("b", peso_kg=50.9)])
        self.assertLessEqual(sum(50.9 * len(r["stops"]) for r in result["routes"]), 100,
                             "A 100 kg vehicle must not carry 101.8 kg")

    def test_exhausted_driver_rejected(self):
        self.assertEqual(self.solve([order()], hours=8)["routes"], [],
                         "Driver with 8 hours already driven must not receive another route")

    def test_expired_window_rejected(self):
        result = self.solve([order(inicio=BASE-timedelta(hours=2), fin=BASE-timedelta(hours=1))])
        self.assertEqual(result["routes"], [], "07:00 deadline must not become an 08:00+ delivery")

    def test_tight_window_not_extended(self):
        end = BASE + timedelta(minutes=1)
        result = self.solve([order(lat=-12.07, fin=end)])
        for route in result["routes"]:
            for stop in route["stops"]:
                self.assertLessEqual(stop["hora_estimada"], end)

    def test_future_window_does_not_crash(self):
        result = self.solve([order(inicio=BASE+timedelta(days=1), fin=BASE+timedelta(days=1, hours=4))])
        self.assertIn("routes", result)

    def test_best_vehicle_not_excluded_by_input_order(self):
        small = vehicle()
        small["capacidad_kg"] = 1
        large = vehicle()
        large["id"] = "v2"
        result = self.solve([order(peso_kg=50)], vehicles=[small, large])
        self.assertEqual(result["unassigned_orders"], [], "Second vehicle can serve the order with the one driver")

    def test_green_objective_selects_lower_emission_vehicle(self):
        clean, dirty = vehicle(), vehicle()
        clean.update(id="clean", factor_emision_co2=0.01, consumo_km_l=30)
        dirty.update(id="dirty", factor_emision_co2=2, consumo_km_l=2)
        results = []
        for fleet in ([clean, dirty], [dirty, clean]):
            result = VRPTWSolver().solve(fleet, [dict(id=f"d{i}", horas_conducidas=0) for i in range(2)],
                                         [order(lat=-12.07)])
            results.append(result["routes"][0]["vehiculo_id"])
        self.assertEqual(results, ["clean", "clean"], "Vehicle choice should account for CO2, not input order")

    def test_small_instance_matches_exhaustive_optimum(self):
        orders = [order(str(i), lat=lat, lng=lng) for i, (lat, lng) in enumerate([
            (-12.06, -75.21), (-12.07, -75.22), (-12.075, -75.205), (-12.05, -75.215)])]
        depot = (-12.0656, -75.2048)
        def length(points):
            return sum(haversine_distance(*a, *b) for a, b in zip(points, points[1:]))
        from app.services.road_network import get_road_network
        matrix = get_road_network().matrix([depot] + [(o['lat'], o['lng']) for o in orders])
        optimum = min(sum(matrix[a][b] for a, b in zip((0,) + p, p + (0,)))
                      for p in permutations(range(1, len(orders) + 1))) / 1000
        result = self.solve(orders)
        self.assertEqual(result["unassigned_orders"], [])
        route = result["routes"][0]
        self.assertAlmostEqual(route["distancia_total_km"], optimum, delta=0.02)
        self.assertAlmostEqual(route["co2_total_kg"], round(route["distancia_total_km"] * .2, 2))
        self.assertAlmostEqual(route["combustible_estimado_l"], round(route["distancia_total_km"] / 10, 2))
        print(f"\nExact 4-stop benchmark: optimum={optimum:.4f} km, solver={route['distancia_total_km']} km", flush=True)


class APIAudit(unittest.TestCase):
    def setUp(self):
        Base.metadata.drop_all(engine)
        Base.metadata.create_all(engine)
        failed_login_tracker.clear()
        self.client = TestClient(app, raise_server_exceptions=False)
        with SessionLocal() as db:
            db.add_all([
                Cliente(cliente_id="c1", nombre_negocio="Test", distrito="Huancayo", latitud=-12.0656, longitud=-75.2048),
                Vehiculo(vehiculo_id="v1", placa="TEST-1", tipo="FURGON", capacidad_kg=100,
                         consumo_km_l=10, factor_emision_co2=.2, anio_fabricacion=2025),
                Conductor(conductor_id="d1", nombre="Test", dni="12345678", categoria_licencia="A2"),
                Usuario(usuario_id="u1", email="test@example.com", password_hash=get_password_hash("test123"),
                        rol="ADMINISTRADOR", estado="ACTIVO")])
            db.commit()
        from app.core.security import create_access_token
        self.client.headers['Authorization'] = 'Bearer ' + create_access_token({'sub': 'test@example.com'})

    def tearDown(self):
        self.client.close()

    def add_order(self, identifier="o1", **changes):
        values = dict(pedido_id=identifier, cliente_id="c1", latitud=-12.0656, longitud=-75.2048,
                      peso_kg=10, volumen_m3=.1, prioridad="ESTANDAR", ventana_inicio=BASE,
                      ventana_fin=BASE+timedelta(hours=8), estado="PENDIENTE")
        values.update(changes)
        with SessionLocal() as db:
            db.add(Pedido(**values))
            db.commit()

    def add_route(self, delivered=False, route_date=None):
        self.add_order(estado="ENTREGADO" if delivered else "ASIGNADO", peso_kg=100)
        with SessionLocal() as db:
            db.add(Ruta(ruta_id="r1", vehiculo_id="v1", conductor_id="d1", fecha=route_date or BASE.date(),
                        estado="EN_PROGRESO" if delivered else "PLANIFICADA"))
            db.flush()
            db.add(RutaDetalle(ruta_detalle_id="s1", ruta_id="r1", pedido_id="o1", orden_visita=1,
                               latitud=-12.0656, longitud=-75.2048, hora_estimada=BASE+timedelta(minutes=5),
                               hora_real_entrega=BASE+timedelta(minutes=5) if delivered else None))
            db.commit()

    def test_read_endpoints(self):
        for path in ("/api/health", "/api/v1/vehicles/", "/api/v1/drivers/", "/api/v1/clients/",
                     "/api/v1/orders/", "/api/v1/routes/", "/api/v1/dashboard/metrics"):
            with self.subTest(path=path):
                self.assertEqual(self.client.get(path).status_code, 200)

    def test_login_and_lockout(self):
        path = "/api/v1/auth/login"
        self.assertEqual(self.client.post(path, json=dict(email="test@example.com", password="test123")).status_code, 200)
        for expected in (401, 401, 403):
            self.assertEqual(self.client.post(path, json=dict(email="test@example.com", password="bad")).status_code, expected)
        self.assertEqual(self.client.post(path, json=dict(email="test@example.com", password="test123")).status_code, 403)

    def test_inactive_user_cannot_login(self):
        with SessionLocal() as db:
            db.get(Usuario, "u1").estado = "INACTIVO"
            db.commit()
        response = self.client.post("/api/v1/auth/login", json=dict(email="test@example.com", password="test123"))
        self.assertIn(response.status_code, (401, 403))

    def test_write_requires_authentication(self):
        self.client.headers.pop("Authorization")
        response = self.client.post("/api/v1/clients/", json=dict(nombre_negocio="Anonymous", distrito="Huancayo", latitud=-12.06, longitud=-75.2))
        self.assertIn(response.status_code, (401, 403))

    def test_invalid_token_rejected(self):
        self.client.headers['Authorization'] = 'Bearer invalid-token'
        response = self.client.post('/api/v1/clients/', json=dict(nombre_negocio='Test', distrito='Huancayo', latitud=-12.06, longitud=-75.2))
        self.assertEqual(response.status_code, 401)

    def test_client_cannot_write_administrative_data(self):
        with SessionLocal() as db:
            db.get(Usuario, 'u1').rol = 'CLIENTE'
            db.commit()
        response = self.client.post('/api/v1/clients/', json=dict(nombre_negocio='Test', distrito='Huancayo', latitud=-12.06, longitud=-75.2))
        self.assertEqual(response.status_code, 403)

    def test_public_client_registration_and_login(self):
        self.client.headers.pop('Authorization')
        response = self.client.post('/api/v1/auth/register', json=dict(email='new@example.com', password='test123', rol='CLIENTE'))
        self.assertEqual(response.status_code, 200, response.text)
        response = self.client.post('/api/v1/auth/login', json=dict(email='new@example.com', password='test123'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['rol'], 'CLIENTE')

    def test_registration_cannot_self_grant_admin(self):
        response = self.client.post("/api/v1/auth/register", json=dict(email="new@example.com", password="test123", rol="ADMINISTRADOR"))
        self.assertIn(response.status_code, (400, 401, 403, 422))

    def test_crud_normal_and_invalid_window(self):
        response = self.client.post("/api/v1/clients/", json=dict(nombre_negocio="New", distrito="Huancayo", latitud=-12.06, longitud=-75.2))
        self.assertEqual(response.status_code, 200)
        payload = dict(cliente_id=response.json()["cliente_id"], latitud=-12.06, longitud=-75.2,
                       peso_kg=10, volumen_m3=.1, ventana_inicio=BASE.isoformat(), ventana_fin=(BASE+timedelta(hours=2)).isoformat())
        self.assertEqual(self.client.post("/api/v1/orders/", json=payload).status_code, 200)
        payload["ventana_fin"] = payload["ventana_inicio"]
        self.assertEqual(self.client.post("/api/v1/orders/", json=payload).status_code, 400)

    def test_negative_order_weight_rejected(self):
        response = self.client.post("/api/v1/orders/", json=dict(cliente_id="c1", latitud=-12.06, longitud=-75.2,
             peso_kg=-10, volumen_m3=-1, ventana_inicio=BASE.isoformat(), ventana_fin=(BASE+timedelta(hours=2)).isoformat()))
        self.assertIn(response.status_code, (400, 422))

    def test_actual_pdf_endpoint(self):
        response = self.client.get("/api/v1/reports/sustainability/pdf")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.content.startswith(b"%PDF"))

    def test_frontend_pdf_url_returns_pdf(self):
        response = self.client.get("/api/v1/reports/sostenibilidad/pdf")
        self.assertTrue(response.content.startswith(b"%PDF"), f"Frontend download returned {response.status_code}: {response.text[:80]}")

    def test_generate_and_deliver(self):
        self.add_order()
        response = self.client.post("/api/v1/routes/generate", json={})
        self.assertEqual(response.status_code, 200, response.text)
        routes = response.json()
        self.assertEqual(len(routes), 1)
        detail = routes[0]["detalles"][0]
        response = self.client.post("/api/v1/routes/deliver-confirm", json=dict(ruta_detalle_id=detail["ruta_detalle_id"], latitud=-12.0656, longitud=-75.2048))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.client.get("/api/v1/routes/" + routes[0]["ruta_id"]).json()["estado"], "COMPLETADA")

    def test_route_missing_resources_return_404(self):
        responses = [
            self.client.get("/api/v1/routes/missing"),
            self.client.post("/api/v1/routes/deliver-confirm", json=dict(
                ruta_detalle_id="missing", latitud=-12.06, longitud=-75.2)),
            self.client.post("/api/v1/routes/reoptimize-express", json=dict(pedido_id="missing")),
        ]
        for response in responses:
            self.assertEqual(response.status_code, 404, response.text)

    def test_route_date_filter(self):
        self.add_route()
        response = self.client.get("/api/v1/routes/", params=dict(fecha=BASE.date().isoformat()))
        self.assertEqual(response.status_code, 200)
        self.assertEqual([r["ruta_id"] for r in response.json()], ["r1"])
        response = self.client.get("/api/v1/routes/", params=dict(
            fecha=(BASE + timedelta(days=1)).date().isoformat()))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), [])

    def test_generate_without_orders(self):
        response = self.client.post("/api/v1/routes/generate", json={})
        self.assertEqual(response.status_code, 400, response.text)
        with SessionLocal() as db:
            self.assertEqual(db.query(Ruta).count(), 0)

    def test_generate_without_available_vehicle_preserves_order(self):
        self.add_order()
        with SessionLocal() as db:
            db.get(Vehiculo, "v1").estado = "MANTENIMIENTO"
            db.commit()
        response = self.client.post("/api/v1/routes/generate", json={})
        self.assertEqual(response.status_code, 400, response.text)
        with SessionLocal() as db:
            self.assertEqual(db.get(Pedido, "o1").estado, "PENDIENTE")
            self.assertEqual(db.query(Ruta).count(), 0)

    def test_generate_preserves_routes_on_other_dates(self):
        yesterday = (BASE - timedelta(days=1)).date()
        self.add_route(route_date=yesterday)
        self.client.post("/api/v1/routes/generate", json=dict(fecha=BASE.date().isoformat()))
        with SessionLocal() as db:
            route = db.get(Ruta, "r1")
            self.assertIsNotNone(route, "Generating today must not delete yesterday's route")
            self.assertEqual(route.fecha, yesterday)
            self.assertEqual(db.get(Pedido, "o1").estado, "ASIGNADO")

    def test_express_without_routes_preserves_order(self):
        self.add_order(prioridad="ESTANDAR")
        response = self.client.post("/api/v1/routes/reoptimize-express", json=dict(pedido_id="o1"))
        self.assertEqual(response.status_code, 400, response.text)
        with SessionLocal() as db:
            self.assertEqual(db.get(Pedido, "o1").prioridad, "ESTANDAR")
            self.assertEqual(db.get(Pedido, "o1").estado, "PENDIENTE")

    def test_repeat_delivery_preserves_original_timestamp(self):
        self.add_route(delivered=True)
        original = BASE + timedelta(minutes=5)
        response = self.client.post("/api/v1/routes/deliver-confirm", json=dict(
            ruta_detalle_id="s1", latitud=-12.0656, longitud=-75.2048))
        self.assertIn(response.status_code, (200, 400, 409))
        with SessionLocal() as db:
            self.assertEqual(db.get(RutaDetalle, "s1").hora_real_entrega, original)

    def test_unknown_api_path_returns_404(self):
        response = self.client.get("/api/v1/nonexistent-audit-endpoint")
        self.assertEqual(response.status_code, 404, response.text)

    def test_generate_respects_requested_date(self):
        self.add_order()
        tomorrow = (BASE+timedelta(days=1)).date()
        response = self.client.post("/api/v1/routes/generate", json=dict(fecha=tomorrow.isoformat()))
        self.assertEqual(response.status_code, 200)
        for route in response.json():
            for stop in route["detalles"]:
                self.assertEqual(stop["hora_estimada"][:10], route["fecha"])

    def test_generate_does_not_reuse_busy_resources(self):
        self.add_route()
        self.add_order("o2")
        self.client.post("/api/v1/routes/generate", json={})
        routes = self.client.get("/api/v1/routes/").json()
        assignments = [(r["fecha"], r["vehiculo_id"], r["conductor_id"]) for r in routes]
        self.assertEqual(len(assignments), len(set(assignments)), "Same vehicle and driver assigned to multiple independent routes")

    def test_express_capacity_checked(self):
        self.add_route()
        self.add_order("express", peso_kg=1000, prioridad="EXPRESS")
        response = self.client.post("/api/v1/routes/reoptimize-express", json=dict(pedido_id="express"))
        self.assertEqual(response.status_code, 400, response.text)

    def test_express_not_inserted_before_delivered_stop(self):
        self.add_route(delivered=True)
        self.add_order("express", prioridad="EXPRESS")
        response = self.client.post("/api/v1/routes/reoptimize-express", json=dict(pedido_id="express"))
        self.assertEqual(response.status_code, 200)
        details = self.client.get("/api/v1/routes/r1").json()["detalles"]
        self.assertEqual(details[0]["pedido_id"], "o1", "Completed first stop must remain first")

    def test_express_cannot_duplicate_assigned_order(self):
        self.add_route()
        response = self.client.post("/api/v1/routes/reoptimize-express", json=dict(pedido_id="o1"))
        self.assertIn(response.status_code, (400, 409))

    def test_delivery_rejects_invalid_gps(self):
        self.add_route()
        response = self.client.post("/api/v1/routes/deliver-confirm", json=dict(ruta_detalle_id="s1", latitud=999, longitud=999))
        self.assertIn(response.status_code, (400, 422))

    def test_dashboard_late_delivery_not_counted_on_time(self):
        self.add_route(delivered=True)
        with SessionLocal() as db:
            db.get(RutaDetalle, "s1").hora_real_entrega = BASE+timedelta(hours=10)
            db.commit()
        value = self.client.get("/api/v1/dashboard/metrics").json()
        self.assertEqual(value["cumplimiento_ventanas_porcentaje"], 0)

    def test_dashboard_empty_has_no_measured_savings(self):
        value = self.client.get("/api/v1/dashboard/metrics").json()
        self.assertEqual(value["ahorro_vs_secuencial_porcentaje"], 0)


if __name__ == "__main__":
    unittest.main(verbosity=2)
