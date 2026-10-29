from datetime import date
from typing import Optional
from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.sustainability import metrics
from app.services.pdf_generator import generate_sustainability_pdf
from app.core.security import current_user

router = APIRouter()

@router.get('/sostenibilidad/pdf')
@router.get('/sustainability/pdf')
def download_sustainability_pdf(fecha_inicio: Optional[date] = None, fecha_fin: Optional[date] = None,
                                db: Session = Depends(get_db), user=Depends(current_user)):
    if user.rol not in ('ADMINISTRADOR', 'OPERADOR', 'AUDITOR'):
        from fastapi import HTTPException
        raise HTTPException(403, 'No tiene acceso a reportes globales')
    m, routes = metrics(db, fecha_inicio, fecha_fin)
    content = generate_sustainability_pdf(
        periodo_inicio=m['fecha_inicio'], periodo_fin=m['fecha_fin'],
        total_co2_kg=m['co2_total_kg'], total_distancia_km=m['distancia_total_km'],
        combustible_ahorrado_l=m['combustible_ahorrado_l'],
        cumplimiento_ventanas_pct=m['cumplimiento_ventanas_porcentaje'],
        arboles_equivalentes=m['arboles_equivalentes'],
        dias_sin_informacion=m['dias_sin_informacion'], rutas_sin_base=m['rutas_sin_base'],
        rutas_resumen=[dict(fecha=str(r.fecha), placa=r.vehiculo.placa if r.vehiculo else '-',
            conductor=r.conductor.nombre if r.conductor else '-', distancia=r.distancia_total_km,
            co2=r.co2_total_kg, combustible=r.combustible_estimado_l, estado=r.estado) for r in routes])
    name = f"Reporte_Sostenibilidad_{m['fecha_inicio']}_{m['fecha_fin']}.pdf"
    return Response(content, media_type='application/pdf', headers={'Content-Disposition': f'attachment; filename={name}'})
