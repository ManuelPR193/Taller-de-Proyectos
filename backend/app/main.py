from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Autenticación"])
app.include_router(vehicles.router, prefix=f"{settings.API_V1_STR}/vehicles", tags=["Vehículos (RF-001)"])
app.include_router(drivers.router, prefix=f"{settings.API_V1_STR}/drivers", tags=["Conductores (RF-008)"])
app.include_router(clients.router, prefix=f"{settings.API_V1_STR}/clients", tags=["Clientes / Bodegas"])
app.include_router(orders.router, prefix=f"{settings.API_V1_STR}/orders", tags=["Pedidos (RF-002)"])
app.include_router(routes.router, prefix=f"{settings.API_V1_STR}/routes", tags=["Rutas Optimizadas (RF-003, RF-004, RF-007)"])
app.include_router(dashboard.router, prefix=f"{settings.API_V1_STR}/dashboard", tags=["Dashboard Sostenibilidad (RF-005)"])
app.include_router(reports.router, prefix=f"{settings.API_V1_STR}/reports", tags=["Reportes PDF (RF-006)"])

@app.get("/")
def root():
    return {
        "status": "online",
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs_url": "/docs"
    }
