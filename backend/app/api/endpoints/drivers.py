from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.domain import Conductor
from app.schemas.schemas import ConductorCreate, ConductorOut
from app.core.config import settings

router = APIRouter()

@router.get("/", response_model=List[ConductorOut])
def get_drivers(db: Session = Depends(get_db)):
    return db.query(Conductor).all()

@router.post("/", response_model=ConductorOut)
def create_driver(d_in: ConductorCreate, db: Session = Depends(get_db)):
    # RN-003 Check max driving hours limit (8 hours limit)
    if d_in.horas_conducidas_dia > settings.MAX_DRIVER_HOURS_PER_DAY:
        raise HTTPException(
            status_code=400,
            detail=f"La jornada asignada ({d_in.horas_conducidas_dia}h) excede el máximo legal de 8.0h continuas de conducción (RN-003 - Ley N° 30224)."
        )

    existing = db.query(Conductor).filter(Conductor.dni == d_in.dni).first()
    if existing:
        raise HTTPException(status_code=400, detail="El DNI ya se encuentra registrado.")

    conductor = Conductor(
        nombre=d_in.nombre,
        dni=d_in.dni,
        categoria_licencia=d_in.categoria_licencia.upper(),
        anios_experiencia=d_in.anios_experiencia,
        horas_conducidas_dia=d_in.horas_conducidas_dia,
        contacto=d_in.contacto,
        estado="DISPONIBLE"
    )
    db.add(conductor)
    db.commit()
    db.refresh(conductor)
    return conductor
