from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.db.session import get_db
from app.models.domain import Vehiculo
from app.schemas.schemas import VehiculoCreate, VehiculoOut

router = APIRouter()

@router.get("/", response_model=List[VehiculoOut])
def get_vehicles(db: Session = Depends(get_db)):
    vehicles = db.query(Vehiculo).all()
    current_year = datetime.now().year
    res = []
    for v in vehicles:
        v_out = VehiculoOut.model_validate(v)
        v_out.es_alto_emisor = (current_year - v.anio_fabricacion) > 15 # RN-002
        res.append(v_out)
    return res

@router.post("/", response_model=VehiculoOut)
def create_vehicle(v_in: VehiculoCreate, db: Session = Depends(get_db)):
    # Check duplicate placa
    existing = db.query(Vehiculo).filter(Vehiculo.placa == v_in.placa.upper()).first()
    if existing:
        # RF-001 Ruta Feliz: update existing if placa exists
        existing.tipo = v_in.tipo.upper()
        existing.capacidad_kg = v_in.capacidad_kg
        existing.consumo_km_l = v_in.consumo_km_l
        existing.factor_emision_co2 = v_in.factor_emision_co2
        existing.anio_fabricacion = v_in.anio_fabricacion
        db.commit()
        db.refresh(existing)
        v_out = VehiculoOut.model_validate(existing)
        v_out.es_alto_emisor = (datetime.now().year - existing.anio_fabricacion) > 15
        return v_out

    # RF-001 Infeliz: validate year
    current_year = datetime.now().year
    if v_in.anio_fabricacion > current_year:
        raise HTTPException(status_code=400, detail=f"El año de fabricación ({v_in.anio_fabricacion}) no puede ser futuro.")

    veh = Vehiculo(
        placa=v_in.placa.upper(),
        tipo=v_in.tipo.upper(),
        capacidad_kg=v_in.capacidad_kg,
        consumo_km_l=v_in.consumo_km_l,
        factor_emision_co2=v_in.factor_emision_co2,
        anio_fabricacion=v_in.anio_fabricacion,
        estado="DISPONIBLE"
    )
    db.add(veh)
    db.commit()
    db.refresh(veh)

    v_out = VehiculoOut.model_validate(veh)
    v_out.es_alto_emisor = (current_year - veh.anio_fabricacion) > 15 # RN-002
    return v_out
