import uuid
from datetime import datetime, date
from sqlalchemy import Column, String, Float, Integer, ForeignKey, DateTime, Date, Text, Boolean
from sqlalchemy.orm import relationship
from app.db.session import Base

def generate_uuid():
    return str(uuid.uuid4())

class Usuario(Base):
    __tablename__ = "usuarios"

    usuario_id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    rol = Column(String(30), nullable=False)  # ADMINISTRADOR, OPERADOR, CONDUCTOR, CLIENTE, AUDITOR
    nombre_completo = Column(String(150), nullable=True)
    estado = Column(String(20), nullable=False, default="ACTIVO")
    creado_en = Column(DateTime, default=datetime.utcnow)

class Vehiculo(Base):
    __tablename__ = "vehiculos"

    vehiculo_id = Column(String(36), primary_key=True, default=generate_uuid)
    placa = Column(String(10), unique=True, nullable=False, index=True) # RF-001
    tipo = Column(String(20), nullable=False) # CAMIONETA, FURGON, MOTO
    capacidad_kg = Column(Float, nullable=False)
    consumo_km_l = Column(Float, nullable=False)
    factor_emision_co2 = Column(Float, nullable=False) # kg CO2 / km
    anio_fabricacion = Column(Integer, nullable=False) # RN-002: > 15 years old badge
    estado = Column(String(20), nullable=False, default="DISPONIBLE") # DISPONIBLE, EN_RUTA, MANTENIMIENTO, INACTIVO
    creado_en = Column(DateTime, default=datetime.utcnow)

class Conductor(Base):
    __tablename__ = "conductores"

    conductor_id = Column(String(36), primary_key=True, default=generate_uuid)
    nombre = Column(String(150), nullable=False)
    dni = Column(String(8), unique=True, nullable=False, index=True)
    categoria_licencia = Column(String(10), nullable=False)
    anios_experiencia = Column(Integer, default=0)
    horas_conducidas_dia = Column(Float, default=0.0) # RN-003 <= 8h limit
    contacto = Column(String(30), nullable=True)
    estado = Column(String(20), default="DISPONIBLE")
    creado_en = Column(DateTime, default=datetime.utcnow)

class Cliente(Base):
    __tablename__ = "clientes"

    cliente_id = Column(String(36), primary_key=True, default=generate_uuid)
    nombre_negocio = Column(String(150), nullable=False)
    distrito = Column(String(50), nullable=False) # Huancayo, El Tambo, Chilca, Pilcomayo
    contacto = Column(String(30), nullable=True)
    direccion_referencia = Column(Text, nullable=True)
    latitud = Column(Float, nullable=False)
    longitud = Column(Float, nullable=False)
    creado_en = Column(DateTime, default=datetime.utcnow)

    pedidos = relationship("Pedido", back_populates="cliente")

class Pedido(Base):
    __tablename__ = "pedidos"

    pedido_id = Column(String(36), primary_key=True, default=generate_uuid)
    cliente_id = Column(String(36), ForeignKey("clientes.cliente_id"), nullable=False)
    latitud = Column(Float, nullable=False)
    longitud = Column(Float, nullable=False)
    punto_referencia = Column(Text, nullable=True)
    peso_kg = Column(Float, nullable=False)
    volumen_m3 = Column(Float, nullable=False)
    prioridad = Column(String(15), nullable=False, default="ESTANDAR") # EXPRESS, ESTANDAR, ECONOMICO
    tipo_producto = Column(String(30), default="NO_PERECEDERO")
    ventana_inicio = Column(DateTime, nullable=False)
    ventana_fin = Column(DateTime, nullable=False)
    estado = Column(String(30), nullable=False, default="PENDIENTE") # PENDIENTE, ASIGNADO, EN_CAMINO, ENTREGADO, CANCELADO
    motivo_no_asignado = Column(String(255), nullable=True)
    creado_en = Column(DateTime, default=datetime.utcnow)

    cliente = relationship("Cliente", back_populates="pedidos")
    detalles_ruta = relationship("RutaDetalle", back_populates="pedido")

class Ruta(Base):
    __tablename__ = "rutas"

    ruta_id = Column(String(36), primary_key=True, default=generate_uuid)
    vehiculo_id = Column(String(36), ForeignKey("vehiculos.vehiculo_id"), nullable=False)
    conductor_id = Column(String(36), ForeignKey("conductores.conductor_id"), nullable=False)
    fecha = Column(Date, nullable=False, default=date.today)
    distancia_total_km = Column(Float, default=0.0)
    co2_total_kg = Column(Float, default=0.0)
    combustible_estimado_l = Column(Float, default=0.0)
    estado = Column(String(30), default="PLANIFICADA") # PLANIFICADA, EN_PROGRESO, COMPLETADA, CANCELADA
    creado_en = Column(DateTime, default=datetime.utcnow)

    vehiculo = relationship("Vehiculo")
    conductor = relationship("Conductor")
    detalles = relationship("RutaDetalle", back_populates="ruta", order_by="RutaDetalle.orden_visita", cascade="all, delete-orphan")

class RutaDetalle(Base):
    __tablename__ = "ruta_detalle"

    ruta_detalle_id = Column(String(36), primary_key=True, default=generate_uuid)
    ruta_id = Column(String(36), ForeignKey("rutas.ruta_id"), nullable=False)
    pedido_id = Column(String(36), ForeignKey("pedidos.pedido_id"), nullable=False)
    orden_visita = Column(Integer, nullable=False)
    hora_estimada = Column(DateTime, nullable=True)
    hora_real_entrega = Column(DateTime, nullable=True) # RN-010
    latitud = Column(Float, nullable=False)
    longitud = Column(Float, nullable=False)

    ruta = relationship("Ruta", back_populates="detalles")
    pedido = relationship("Pedido", back_populates="detalles_ruta")

class ReporteSostenibilidad(Base):
    __tablename__ = "reportes_sostenibilidad"

    reporte_id = Column(String(36), primary_key=True, default=generate_uuid)
    periodo_inicio = Column(Date, nullable=False)
    periodo_fin = Column(Date, nullable=False)
    co2_total_kg = Column(Float, default=0.0)
    combustible_ahorrado_l = Column(Float, default=0.0)
    arboles_equivalentes = Column(Float, default=0.0)
    generado_por = Column(String(36), ForeignKey("usuarios.usuario_id"), nullable=True)
    creado_en = Column(DateTime, default=datetime.utcnow)
