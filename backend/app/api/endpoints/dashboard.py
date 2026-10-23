from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from datetime import date
from app.db.session import get_db
from app.models.domain import Ruta, Pedido
from app.schemas.schemas import DashboardMetrics
from app.core.config import settings

router = APIRouter()

@router.get("/metrics", response_model=DashboardMetrics)
def get_dashboard_metrics(
    fecha_inicio: Optional[date] = None,
    fecha_fin: Optional[date] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Ruta)
    if fecha_inicio:
        query = query.filter(Ruta.fecha >= fecha_inicio)
    if fecha_fin:
        query = query.filter(Ruta.fecha <= fecha_fin)

    routes = query.all()
    
    total_km = sum(r.distancia_total_km for r in routes)
    total_co2 = sum(r.co2_total_kg for r in routes)
    total_fuel = sum(r.combustible_estimado_l for r in routes)

    # Saved fuel vs unoptimized sequential routing (~22% estimated savings)
    fuel_saved_l = 0.0  # No measured baseline is stored
    
    # Trees equivalent (RN-009: 1 tree absorbs ~22kg CO2/year)
    trees_equiv = round(total_co2 / settings.TREE_CO2_ABSORPTION_KG_YEAR, 1) if total_co2 > 0 else 0.0

    total_orders = db.query(Pedido).count()
    delivered_orders = db.query(Pedido).filter(Pedido.estado == "ENTREGADO").count()
    
    deliveries = [d for r in routes for d in r.detalles if d.hora_real_entrega and d.pedido]
    on_time = sum(d.pedido.ventana_inicio <= d.hora_real_entrega <= d.pedido.ventana_fin for d in deliveries)
    compliance_pct = round(on_time / len(deliveries) * 100, 1) if deliveries else 0.0

    return DashboardMetrics(
        periodo=f"{fecha_inicio or 'Inicio'} a {fecha_fin or 'Hoy'}",
        distancia_total_km=round(total_km, 2),
        co2_total_kg=round(total_co2, 2),
        combustible_ahorrado_l=round(fuel_saved_l, 1),
        cumplimiento_ventanas_porcentaje=compliance_pct,
        ahorro_vs_secuencial_porcentaje=0.0, # Average metaheuristic improvement
        arboles_equivalentes=trees_equiv,
        rutas_totales=len(routes),
        pedidos_totales=total_orders,
        pedidos_entregados=delivered_orders
    )
