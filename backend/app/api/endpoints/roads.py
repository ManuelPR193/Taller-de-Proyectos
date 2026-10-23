from fastapi import APIRouter, HTTPException, Query
from app.services.road_network import get_road_network

router = APIRouter()


@router.get("/path")
def road_path(coordinates: str = Query(..., max_length=12000)):
    try:
        pairs = [tuple(map(float, pair.split(','))) for pair in coordinates.split(';')]
        if not 2 <= len(pairs) <= 150 or any(len(pair) != 2 for pair in pairs):
            raise ValueError()
        points = [(lat, lng) for lng, lat in pairs]
    except ValueError:
        raise HTTPException(422, "Se requieren entre 2 y 150 coordenadas longitud,latitud.")
    return get_road_network().route(points)
