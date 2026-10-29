from datetime import date
from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.sustainability import metrics
from app.core.security import current_user

router = APIRouter()

@router.get('/metrics')
def get_dashboard_metrics(fecha_inicio: Optional[date] = None, fecha_fin: Optional[date] = None,
                          db: Session = Depends(get_db), user=Depends(current_user)):
    if user.rol not in ('ADMINISTRADOR', 'OPERADOR', 'AUDITOR'):
        from fastapi import HTTPException
        raise HTTPException(403, 'No tiene acceso a indicadores globales')
    return metrics(db, fecha_inicio, fecha_fin)[0]
