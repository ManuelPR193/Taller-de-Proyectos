[← Volver](README.md)

# Informe Final del Proyecto

**Fecha:** 2026-10-30 · **Versión:** 1.0.0

EcoLogística Huancayo es una aplicación FastAPI/React para registrar flota, conductores, clientes y pedidos; calcular rutas VRPTW sobre distancias viales Dijkstra; visualizar tráfico observado; confirmar entregas; y reportar métricas de sostenibilidad.

## Entregables

- API autenticada con roles administrador, operador, conductor, cliente y auditor.
- Solver OR-Tools con capacidad, ventanas, jornada y costo ambiental.
- Mapa Leaflet, dashboard, PDF y modo conductor.
- Cifrado AES-256-GCM de DNI, bcrypt y JWT.
- SQLite/R*Tree local y consulta portable para PostgreSQL.
- Contenedor, manifiestos Kubernetes y PostgreSQL HA preparados.
- 54 pruebas backend, 3 frontend, Playwright y documentación de reproducción.

## Resultado cuantitativo

Cobertura 89%, build correcto, cero vulnerabilidades conocidas en auditorías locales, Bandit sin hallazgos medios/altos y mejora R*Tree de 98,9% en CPU.

## Limitaciones

El tráfico no proviene de un proveedor en tiempo real: son observaciones de operador con 30 minutos de vigencia. Los ahorros se comparan con una línea base secuencial, no con combustible físico medido. Staging y pruebas humanas necesitan evidencia externa.
