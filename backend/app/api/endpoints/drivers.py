from typing import List

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import current_user
from app.db.session import get_db
from app.models.domain import Conductor, CuentaConductor, Usuario
from app.schemas.schemas import ConductorCreate, ConductorOut

router = APIRouter()


class AccountInput(BaseModel):
    email: EmailStr


@router.get("/", response_model=List[ConductorOut])
def get_drivers(db: Session = Depends(get_db)):
    return db.query(Conductor).all()


@router.post("/", response_model=ConductorOut)
def create_driver(d_in: ConductorCreate, db: Session = Depends(get_db)):
    # RN-003 Check max driving hours limit (8 hours limit)
    if d_in.horas_conducidas_dia > settings.MAX_DRIVER_HOURS_PER_DAY:
        raise HTTPException(
            status_code=400,
            detail=(
                f"La jornada asignada ({d_in.horas_conducidas_dia}h) excede "
                "el máximo legal de 8.0h continuas de conducción "
                "(RN-003 - Ley N° 30224)."
            ),
        )

    # Randomized authenticated encryption prevents equality queries; compare the
    # decrypted values in the small driver registry instead.
    existing = next(
        (driver for driver in db.query(Conductor).all() if driver.dni == d_in.dni),
        None,
    )
    if existing:
        raise HTTPException(status_code=400, detail="El DNI ya se encuentra registrado.")

    conductor = Conductor(
        nombre=d_in.nombre,
        dni=d_in.dni,
        categoria_licencia=d_in.categoria_licencia.upper(),
        anios_experiencia=d_in.anios_experiencia,
        horas_conducidas_dia=d_in.horas_conducidas_dia,
        contacto=d_in.contacto,
        estado="DISPONIBLE",
    )
    db.add(conductor)
    db.commit()
    db.refresh(conductor)
    return conductor
@router.put("/{conductor_id}/account")
def link_account(
    conductor_id: str,
    payload: AccountInput,
    db: Session = Depends(get_db),
    user=Depends(current_user),
):
    if user.rol != "ADMINISTRADOR":
        raise HTTPException(403, "Solo el administrador puede vincular cuentas")
    driver = db.get(Conductor, conductor_id)
    account = (
        db.query(Usuario)
        .filter(
            Usuario.email == payload.email.lower(),
            Usuario.rol == "CONDUCTOR",
        )
        .first()
    )
    if not driver or not account:
        raise HTTPException(404, "No existe el conductor o la cuenta con rol CONDUCTOR")
    other = (
        db.query(CuentaConductor)
        .filter(
            CuentaConductor.conductor_id == conductor_id,
            CuentaConductor.usuario_id != account.usuario_id,
        )
        .first()
    )
    if other:
        raise HTTPException(409, "Este conductor ya tiene una cuenta vinculada")
    link = db.get(CuentaConductor, account.usuario_id) or CuentaConductor(
        usuario_id=account.usuario_id
    )
    link.conductor_id = conductor_id
    db.add(link)
    db.commit()
    return {"message": "Cuenta vinculada", "conductor_id": conductor_id}
