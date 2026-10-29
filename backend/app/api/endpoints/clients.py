from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.domain import Cliente, CuentaCliente
from app.schemas.schemas import ClienteCreate, ClienteOut
from app.core.security import current_user

router = APIRouter()

@router.get("/", response_model=List[ClienteOut])
def get_clients(db: Session = Depends(get_db), user=Depends(current_user)):
    if user.rol == 'CLIENTE':
        link = db.get(CuentaCliente, user.usuario_id)
        return [db.get(Cliente, link.cliente_id)] if link else []
    return db.query(Cliente).all()

@router.post("/", response_model=ClienteOut)
def create_client(c_in: ClienteCreate, db: Session = Depends(get_db), user=Depends(current_user)):
    if user.rol == 'CLIENTE':
        link = db.get(CuentaCliente, user.usuario_id)
        if link:
            raise HTTPException(409, 'La cuenta ya tiene un perfil de cliente')
    cliente = Cliente(
        nombre_negocio=c_in.nombre_negocio,
        distrito=c_in.distrito,
        contacto=c_in.contacto,
        direccion_referencia=c_in.direccion_referencia,
        latitud=c_in.latitud,
        longitud=c_in.longitud
    )
    db.add(cliente)
    db.flush()
    if user.rol == 'CLIENTE':
        db.add(CuentaCliente(usuario_id=user.usuario_id, cliente_id=cliente.cliente_id))
    db.commit()
    db.refresh(cliente)
    return cliente
