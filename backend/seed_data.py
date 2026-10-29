import sys
import os
from datetime import datetime, timedelta, date

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.session import SessionLocal, engine, Base
from app.models.domain import Usuario, Vehiculo, Conductor, Cliente, Pedido, Ruta, RutaDetalle, ReporteSostenibilidad, CuentaConductor
from app.core.security import get_password_hash

def seed():
    print("[+] Creando tablas y sembrando datos para EcoLogistica Huancayo...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # 1. Usuarios (RBAC)
        u_admin = Usuario(
            email="admin@distrirapido.pe",
            password_hash=get_password_hash("admin123"),
            rol="ADMINISTRADOR",
            nombre_completo="Manuel Parraga (Admin)",
            estado="ACTIVO"
        )
        u_operador = Usuario(
            email="operador@distrirapido.pe",
            password_hash=get_password_hash("operador123"),
            rol="OPERADOR",
            nombre_completo="Sheila Suarez (Despachadora)",
            estado="ACTIVO"
        )
        u_conductor = Usuario(
            email="conductor@distrirapido.pe",
            password_hash=get_password_hash("conductor123"),
            rol="CONDUCTOR",
            nombre_completo="David Guevara (Conductor Flota)",
            estado="ACTIVO"
        )
        u_auditor = Usuario(
            email="auditor@distrirapido.pe",
            password_hash=get_password_hash("auditor123"),
            rol="AUDITOR",
            nombre_completo="Jair Romero (Auditor Ambiental)",
            estado="ACTIVO"
        )
        db.add_all([u_admin, u_operador, u_conductor, u_auditor])
        db.flush()

        # 2. Vehículos (RF-001 & RN-002)
        v1 = Vehiculo(
            placa="W3F-892",
            tipo="FURGON",
            capacidad_kg=1200.0,
            consumo_km_l=11.5,
            factor_emision_co2=0.23,
            anio_fabricacion=2021, # Normal
            estado="DISPONIBLE"
        )
        v2 = Vehiculo(
            placa="W1A-456",
            tipo="CAMIONETA",
            capacidad_kg=800.0,
            consumo_km_l=13.0,
            factor_emision_co2=0.19,
            anio_fabricacion=2023, # Modern
            estado="DISPONIBLE"
        )
        v3 = Vehiculo(
            placa="W2B-109",
            tipo="FURGON",
            capacidad_kg=1500.0,
            consumo_km_l=9.0,
            factor_emision_co2=0.31,
            anio_fabricacion=2008, # >15 years -> RN-002 Alto Emisor!
            estado="DISPONIBLE"
        )
        v4 = Vehiculo(
            placa="W4C-771",
            tipo="MOTO",
            capacidad_kg=150.0,
            consumo_km_l=35.0,
            factor_emision_co2=0.07,
            anio_fabricacion=2022,
            estado="DISPONIBLE"
        )
        db.add_all([v1, v2, v3, v4])
        db.flush()

        # 3. Conductores (RF-008 & RN-003)
        c1 = Conductor(
            nombre="Carlos Mendoza Alarcon",
            dni="45892301",
            categoria_licencia="A-IIb",
            anios_experiencia=8,
            horas_conducidas_dia=4.5,
            contacto="964123456",
            estado="DISPONIBLE"
        )
        c2 = Conductor(
            nombre="Jorge Huaman Quispe",
            dni="71238944",
            categoria_licencia="A-IIIa",
            anios_experiencia=12,
            horas_conducidas_dia=3.0,
            contacto="954889123",
            estado="DISPONIBLE"
        )
        c3 = Conductor(
            nombre="Luis Raul Pomachagua",
            dni="40912388",
            categoria_licencia="A-IIa",
            anios_experiencia=5,
            horas_conducidas_dia=6.0,
            contacto="964998811",
            estado="DISPONIBLE"
        )
        db.add_all([c1, c2, c3])
        db.flush()
        db.add(CuentaConductor(usuario_id=u_conductor.usuario_id, conductor_id=c1.conductor_id))

        # 4. Clientes en el Valle del Mantaro (Huancayo, El Tambo, Chilca, Pilcomayo)
        cli1 = Cliente(
            nombre_negocio="Bodega San Juan - El Tambo",
            distrito="El Tambo",
            contacto="964001122",
            direccion_referencia="Av. Mariscal Castilla 1240, frente al parque",
            latitud=-12.0528,
            longitud=-75.2104
        )
        cli2 = Cliente(
            nombre_negocio="Comercial Mayorista Mantaro",
            distrito="Huancayo Centro",
            contacto="954112233",
            direccion_referencia="Jr. Cajamarca 450, Mercado Modelo",
            latitud=-12.0682,
            longitud=-75.2078
        )
        cli3 = Cliente(
            nombre_negocio="Bodega La Flor de Chilca",
            distrito="Chilca",
            contacto="964334455",
            direccion_referencia="Av. Real 1890, altura del paradero Molinos",
            latitud=-12.0841,
            longitud=-75.2012
        )
        cli4 = Cliente(
            nombre_negocio="Supermercado Pilcomayo",
            distrito="Pilcomayo",
            contacto="954778899",
            direccion_referencia="Av. Las Camelias S/N",
            latitud=-12.0490,
            longitud=-75.2420
        )
        cli5 = Cliente(
            nombre_negocio="Minimarket El Carmen - Cochas",
            distrito="El Tambo",
            contacto="964223344",
            direccion_referencia="Subida a Cochas Chico, paradero Andino",
            latitud=-12.0395,
            longitud=-75.1950
        )
        db.add_all([cli1, cli2, cli3, cli4, cli5])
        db.flush()

        # 5. Pedidos con ventanas de tiempo
        now = datetime.now()
        p1 = Pedido(
            cliente_id=cli1.cliente_id,
            latitud=cli1.latitud,
            longitud=cli1.longitud,
            punto_referencia=cli1.direccion_referencia,
            peso_kg=180.0,
            volumen_m3=0.8,
            prioridad="EXPRESS",
            tipo_producto="PERECEDERO",
            ventana_inicio=now.replace(hour=8, minute=30),
            ventana_fin=now.replace(hour=11, minute=30),
            estado="PENDIENTE"
        )
        p2 = Pedido(
            cliente_id=cli2.cliente_id,
            latitud=cli2.latitud,
            longitud=cli2.longitud,
            punto_referencia=cli2.direccion_referencia,
            peso_kg=450.0,
            volumen_m3=2.1,
            prioridad="ESTANDAR",
            tipo_producto="NO_PERECEDERO",
            ventana_inicio=now.replace(hour=9, minute=0),
            ventana_fin=now.replace(hour=14, minute=0),
            estado="PENDIENTE"
        )
        p3 = Pedido(
            cliente_id=cli3.cliente_id,
            latitud=cli3.latitud,
            longitud=cli3.longitud,
            punto_referencia=cli3.direccion_referencia,
            peso_kg=320.0,
            volumen_m3=1.4,
            prioridad="ESTANDAR",
            tipo_producto="NO_PERECEDERO",
            ventana_inicio=now.replace(hour=10, minute=0),
            ventana_fin=now.replace(hour=15, minute=0),
            estado="PENDIENTE"
        )
        p4 = Pedido(
            cliente_id=cli4.cliente_id,
            latitud=cli4.latitud,
            longitud=cli4.longitud,
            punto_referencia=cli4.direccion_referencia,
            peso_kg=120.0,
            volumen_m3=0.5,
            prioridad="ECONOMICO",
            tipo_producto="NO_PERECEDERO",
            ventana_inicio=now.replace(hour=11, minute=0),
            ventana_fin=now.replace(hour=17, minute=0),
            estado="PENDIENTE"
        )
        p5 = Pedido(
            cliente_id=cli5.cliente_id,
            latitud=cli5.latitud,
            longitud=cli5.longitud,
            punto_referencia=cli5.direccion_referencia,
            peso_kg=210.0,
            volumen_m3=0.9,
            prioridad="EXPRESS",
            tipo_producto="PERECEDERO",
            ventana_inicio=now.replace(hour=9, minute=0),
            ventana_fin=now.replace(hour=12, minute=0),
            estado="PENDIENTE"
        )
        db.add_all([p1, p2, p3, p4, p5])
        db.commit()

        print("[OK] Base de datos inicializada exitosamente.")
    except Exception as e:
        db.rollback()
        print(f"[ERROR] Error sembrando base de datos: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed()
