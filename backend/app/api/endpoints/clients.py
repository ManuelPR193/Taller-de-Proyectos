from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.domain import Cliente
from app.schemas.schemas import ClienteCreate, ClienteOut

router = APIRouter()

@router.get("/", response_model=List[ClienteOut])
def get_clients(db: Session = Depends(get_db)):
    return db.query(Cliente).all()

@router.post("/", response_model=ClienteOut)
def create_client(c_in: ClienteCreate, db: Session = Depends(get_db)):
    cliente = Cliente(
        nombre_negocio=c_in.nombre_negocio,
        distrito=c_in.distrito,
        contacto=c_in.contacto,
        direccion_referencia=c_in.direccion_referencia,
        latitud=c_in.latitud,
        longitud=c_in.longitud
    )
    db.add(cliente)
    db.commit()
    db.refresh(cliente)
    return cliente
