from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime, date

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    usuario_id: str
    email: str
    rol: str
    nombre_completo: Optional[str] = None

class LoginRequest(BaseModel):
    email: str
    password: str

# User Schemas
class UsuarioCreate(BaseModel):
    email: EmailStr
    password: str
    rol: str # ADMINISTRADOR, OPERADOR, CONDUCTOR, CLIENTE, AUDITOR
    nombre_completo: Optional[str] = None

class UsuarioOut(BaseModel):
    usuario_id: str
    email: str
    rol: str
    nombre_completo: Optional[str] = None
    estado: str
    creado_en: datetime

    class Config:
        from_attributes = True

# Vehicle Schemas (RF-001)
class VehiculoCreate(BaseModel):
    placa: str
    tipo: str # CAMIONETA, FURGON, MOTO
    capacidad_kg: float = Field(gt=0, allow_inf_nan=False)
    consumo_km_l: float = Field(gt=0, allow_inf_nan=False)
    factor_emision_co2: float = Field(ge=0, allow_inf_nan=False)
    anio_fabricacion: int

class VehiculoOut(VehiculoCreate):
    vehiculo_id: str
    estado: str
    es_alto_emisor: bool = False # RN-002: > 15 years old badge
    creado_en: datetime

    class Config:
        from_attributes = True

# Driver Schemas (RF-008)
class ConductorCreate(BaseModel):
    nombre: str
    dni: str = Field(pattern=r'^\d{8}$')
    categoria_licencia: str
    anios_experiencia: int = 0
    horas_conducidas_dia: float = 0.0 # RN-003 <= 8h limit
    contacto: Optional[str] = None

class ConductorOut(ConductorCreate):
    conductor_id: str
    estado: str
    creado_en: datetime

    class Config:
        from_attributes = True

# Client Schemas
class ClienteCreate(BaseModel):
    nombre_negocio: str
    distrito: str
    contacto: Optional[str] = None
    direccion_referencia: Optional[str] = None
    latitud: float = Field(ge=-90, le=90, allow_inf_nan=False)
    longitud: float = Field(ge=-180, le=180, allow_inf_nan=False)

class ClienteOut(ClienteCreate):
    cliente_id: str
    creado_en: datetime

    class Config:
        from_attributes = True

# Order Schemas (RF-002)
class PedidoCreate(BaseModel):
    cliente_id: str
    latitud: float = Field(ge=-90, le=90, allow_inf_nan=False)
    longitud: float = Field(ge=-180, le=180, allow_inf_nan=False)
    punto_referencia: Optional[str] = None
    peso_kg: float = Field(gt=0, allow_inf_nan=False)
    volumen_m3: float = Field(ge=0, allow_inf_nan=False)
    prioridad: str = "ESTANDAR" # EXPRESS, ESTANDAR, ECONOMICO
    tipo_producto: str = "NO_PERECEDERO"
    ventana_inicio: datetime
    ventana_fin: datetime

class PedidoOut(PedidoCreate):
    pedido_id: str
    estado: str
    motivo_no_asignado: Optional[str] = None
    creado_en: datetime
    cliente: Optional[ClienteOut] = None

    class Config:
        from_attributes = True

# Route Detail & Route Schemas (RF-003, RF-004, RF-007)
class RutaDetalleOut(BaseModel):
    ruta_detalle_id: str
    pedido_id: str
    orden_visita: int
    hora_estimada: Optional[datetime] = None
    hora_real_entrega: Optional[datetime] = None
    latitud: float = Field(ge=-90, le=90, allow_inf_nan=False)
    longitud: float = Field(ge=-180, le=180, allow_inf_nan=False)
    pedido: Optional[PedidoOut] = None

    class Config:
        from_attributes = True

class RutaOut(BaseModel):
    ruta_id: str
    vehiculo_id: str
    conductor_id: str
    fecha: date
    distancia_total_km: float
    co2_total_kg: float
    combustible_estimado_l: float
    estado: str
    vehiculo: Optional[VehiculoOut] = None
    conductor: Optional[ConductorOut] = None
    detalles: List[RutaDetalleOut] = []

    class Config:
        from_attributes = True

# Route Generation Request
class RouteGenerationRequest(BaseModel):
    fecha: Optional[date] = None

# Delivery Confirmation Request (RN-010)
class DeliveryConfirmationRequest(BaseModel):
    ruta_detalle_id: str
    latitud: float = Field(ge=-90, le=90, allow_inf_nan=False)
    longitud: float = Field(ge=-180, le=180, allow_inf_nan=False)

# Express Re-optimization Request (RN-004, RF-007)
class ExpressOrderInsertRequest(BaseModel):
    pedido_id: str

# Dashboard Analytics Schema (RF-005, RN-008, RN-009)
class DashboardMetrics(BaseModel):
    periodo: str
    distancia_total_km: float
    co2_total_kg: float
    combustible_ahorrado_l: float
    cumplimiento_ventanas_porcentaje: float
    ahorro_vs_secuencial_porcentaje: float
    arboles_equivalentes: float # RN-009
    rutas_totales: int
    pedidos_totales: int
    pedidos_entregados: int
