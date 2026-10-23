import os
from fastapi import FastAPI, Depends, HTTPException
from app.core.security import require_write_user
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.responses import JSONResponse
from app.api.endpoints import roads
from app.services.road_network import RoadNetworkError
from app.core.config import settings
from app.db.session import engine, Base
from app.api.endpoints import auth, vehicles, drivers, clients, orders, routes, dashboard, reports

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="API para el Optimizador de Rutas Sostenibles de Última Milla en Huancayo - DistriRápido S.A.C."
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
@app.exception_handler(RoadNetworkError)
async def road_error(request, exc):
    return JSONResponse(status_code=422, content={"detail": str(exc)})

app.include_router(roads.router, prefix=f"{settings.API_V1_STR}/roads", tags=["Caminos mínimos Dijkstra"])
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Autenticación"])
app.include_router(vehicles.router, dependencies=[Depends(require_write_user)], prefix=f"{settings.API_V1_STR}/vehicles", tags=["Vehículos (RF-001)"])
app.include_router(drivers.router, dependencies=[Depends(require_write_user)], prefix=f"{settings.API_V1_STR}/drivers", tags=["Conductores (RF-008)"])
app.include_router(clients.router, dependencies=[Depends(require_write_user)], prefix=f"{settings.API_V1_STR}/clients", tags=["Clientes / Bodegas"])
app.include_router(orders.router, dependencies=[Depends(require_write_user)], prefix=f"{settings.API_V1_STR}/orders", tags=["Pedidos (RF-002)"])
app.include_router(routes.router, dependencies=[Depends(require_write_user)], prefix=f"{settings.API_V1_STR}/routes", tags=["Rutas Optimizadas (RF-003, RF-004, RF-007)"])
app.include_router(dashboard.router, prefix=f"{settings.API_V1_STR}/dashboard", tags=["Dashboard Sostenibilidad (RF-005)"])
app.include_router(reports.router, prefix=f"{settings.API_V1_STR}/reports", tags=["Reportes PDF (RF-006)"])

@app.get("/api/health")
def health():
    return {
        "status": "online",
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs_url": "/docs"
    }

# Mount Frontend Static Files if built
frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))
if os.path.exists(frontend_dist):
    assets_dir = os.path.join(frontend_dist, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        if full_path.startswith("api") or full_path.startswith("docs") or full_path.startswith("openapi.json"):
            raise HTTPException(404, "Recurso no encontrado")
        target_path = os.path.join(frontend_dist, full_path)
        if os.path.commonpath([frontend_dist, os.path.abspath(target_path)]) != frontend_dist:
            raise HTTPException(404, "Recurso no encontrado")
        if os.path.isfile(target_path):
            return FileResponse(target_path)
        return FileResponse(os.path.join(frontend_dist, "index.html"))

