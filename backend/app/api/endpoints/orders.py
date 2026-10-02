from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.db.session import get_db
from app.models.domain import Pedido, Cliente
from app.schemas.schemas import PedidoCreate, PedidoOut

router = APIRouter()

@router.get("/", response_model=List[PedidoOut])
def get_orders(db: Session = Depends(get_db)):
    return db.query(Pedido).all()

@router.post("/", response_model=PedidoOut)
def create_order(o_in: PedidoCreate, db: Session = Depends(get_db)):
    # Check client existence
    client = db.query(Cliente).filter(Cliente.cliente_id == o_in.cliente_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="El cliente especificado no existe.")

    # RF-002 Ruta Infeliz: Check valid time window & valid coordinates
    if o_in.ventana_fin <= o_in.ventana_inicio:
        raise HTTPException(
            status_code=400,
            detail="La hora fin de la ventana de entrega debe ser posterior a la hora inicio."
        )

    # Check bounds for Huancayo area (-12.2 to -11.9 lat, -75.4 to -75.0 lng)
    if not (-12.3 <= o_in.latitud <= -11.8 and -75.5 <= o_in.longitud <= -75.0):
        raise HTTPException(
            status_code=400,
            detail="Las coordenadas GPS proporcionadas se encuentran fuera del área de cobertura de Huancayo / Valle del Mantaro."
        )

    pedido = Pedido(
        cliente_id=o_in.cliente_id,
        latitud=o_in.latitud,
        longitud=o_in.longitud,
        punto_referencia=o_in.punto_referencia,
        peso_kg=o_in.peso_kg,
        volumen_m3=o_in.volumen_m3,
        prioridad=o_in.prioridad.upper(),
        tipo_producto=o_in.tipo_producto.upper(),
        ventana_inicio=o_in.ventana_inicio,
        ventana_fin=o_in.ventana_fin,
        estado="PENDIENTE"
    )
    db.add(pedido)
    db.commit()
    db.refresh(pedido)
    return pedido
