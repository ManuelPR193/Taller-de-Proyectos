"""Shared dashboard and PDF calculations without fabricated measurements."""
from datetime import date, timedelta
from fastapi import HTTPException
from sqlalchemy.orm import selectinload
from app.models.domain import Ruta, RutaDetalle, RutaBase
from app.core.config import settings


def period(start=None, end=None):
    end = end or date.today()
    start = start or end - timedelta(days=30)
    if start > end or (end - start).days > 366:
        raise HTTPException(422, 'Seleccione un periodo válido de hasta 367 días.')
    return start, end


def metrics(db, start=None, end=None):
    start, end = period(start, end)
    routes = db.query(Ruta).options(selectinload(Ruta.detalles).selectinload(RutaDetalle.pedido),
                                   selectinload(Ruta.vehiculo), selectinload(Ruta.conductor)).filter(
        Ruta.fecha.between(start, end), Ruta.estado != 'CANCELADA').all()
    bases = {b.ruta_id: b for b in db.query(RutaBase).join(Ruta).filter(Ruta.fecha.between(start, end)).all()}
    delivered = [d for r in routes for d in r.detalles if d.hora_real_entrega and d.pedido]
    on_time = sum(d.pedido.ventana_inicio <= d.hora_real_entrega <= d.pedido.ventana_fin for d in delivered)
    km = sum(r.distancia_total_km for r in routes)
    co2 = sum(r.co2_total_kg for r in routes)
    comparable = [r for r in routes if r.ruta_id in bases]
    base_km = sum(bases[r.ruta_id].distancia_km for r in comparable)
    saved_km = sum(bases[r.ruta_id].distancia_km - r.distancia_total_km for r in comparable)
    saved_fuel = sum(bases[r.ruta_id].combustible_l - r.combustible_estimado_l for r in comparable)
    present = {r.fecha for r in routes}
    missing = [(start + timedelta(days=i)).isoformat() for i in range((end-start).days+1)
               if start + timedelta(days=i) not in present]
    values = dict(periodo=f'{start} a {end}', fecha_inicio=start, fecha_fin=end,
        distancia_total_km=round(km, 2), co2_total_kg=round(co2, 2),
        combustible_ahorrado_l=round(saved_fuel, 2),
        cumplimiento_ventanas_porcentaje=round(100*on_time/len(delivered), 1) if delivered else 0,
        ahorro_vs_secuencial_porcentaje=round(100*saved_km/base_km, 1) if base_km else 0,
        arboles_equivalentes=round(co2/settings.TREE_CO2_ABSORPTION_KG_YEAR, 1),
        rutas_totales=len(routes), pedidos_totales=len({d.pedido_id for r in routes for d in r.detalles}),
        pedidos_entregados=len(delivered), sin_datos=not routes, dias_sin_informacion=missing,
        rutas_con_base=len(comparable), rutas_sin_base=len(routes)-len(comparable),
        por_vehiculo=[dict(placa=r.vehiculo.placa if r.vehiculo else '-', fecha=r.fecha,
                          distancia_km=r.distancia_total_km, co2_kg=r.co2_total_kg) for r in routes])
    return values, routes
