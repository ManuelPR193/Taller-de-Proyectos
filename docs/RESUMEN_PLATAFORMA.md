# EcoLogística Huancayo: resumen de la plataforma

**Proyecto:** Taller de Proyectos 2 — DistriRápido S.A.C.
**Estado de esta descripción:** código local de la rama `redesign/taste-ecologistica`, revisado el 23/11/2026. Las capacidades descritas corresponden a módulos presentes en el repositorio; una instalación productiva no está verificada aquí.

## 1. Propósito

EcoLogística Huancayo es una aplicación web para planificar y supervisar entregas de última milla en el Valle del Mantaro. Reúne pedidos, clientes, conductores y vehículos, calcula recorridos sujetos a restricciones operativas y muestra indicadores ambientales estimados. El sistema está orientado a Huancayo y distritos cercanos.

## 2. Usuarios y funciones

| Rol | Funciones principales |
|---|---|
| Administrador | Consulta el dashboard, gestiona flota, conductores y pedidos, genera rutas, revisa auditoría y reportes. |
| Operador | Gestiona pedidos y recursos operativos, genera y consulta rutas y reportes. |
| Conductor | Consulta las rutas vinculadas a su cuenta y confirma entregas con ubicación GPS. |
| Cliente | Consulta sus pedidos y el estado de sus entregas; puede registrar una cuenta de cliente. |
| Auditor | Consulta la vista de auditoría y reportes según las rutas autorizadas. |

El menú y la API restringen operaciones según el rol. El registro público solo permite cuentas de cliente. La autenticación emite tokens JWT; las contraseñas se almacenan como hashes bcrypt y hay bloqueo temporal por intentos fallidos.

## 3. Flujo operativo

1. Un usuario autorizado registra o consulta vehículos, conductores, clientes y pedidos.
2. El operador o administrador solicita la generación de rutas para los pedidos elegibles.
3. El servicio de optimización evalúa capacidad, ventanas de entrega, jornada del conductor y restricciones de negocio; usa OR-Tools y costos de viaje sobre la red vial cuando está disponible.
4. La interfaz presenta rutas y paradas en un mapa Leaflet/OpenStreetMap, junto con el detalle tabular.
5. El conductor consulta la ruta asociada a su cuenta y confirma una entrega con coordenadas proporcionadas por el navegador; el backend registra la hora real.
6. El dashboard agrega distancia, emisiones estimadas, ahorro estimado y cumplimiento de ventanas para el periodo seleccionado. El módulo de reportes genera PDF.

Los pedidos exprés pueden insertarse en rutas activas con las restricciones implementadas en el backend. El tráfico corresponde a observaciones registradas por el operador con vigencia definida; no hay prueba de un proveedor de tráfico en tiempo real.

## 4. Arquitectura y datos

| Capa | Implementación |
|---|---|
| Cliente | React 18, Vite 8, React Router, CSS/Tailwind, Leaflet y React Leaflet. Vistas secundarias cargadas bajo demanda. |
| API | Python, FastAPI, Pydantic y Uvicorn; endpoints bajo `/api/v1/` y salud en `/api/health`. |
| Persistencia | SQLAlchemy con SQLite para desarrollo y configuración para PostgreSQL. El índice espacial R*Tree se instala sobre SQLite. |
| Optimización | OR-Tools para asignación y secuenciación; servicio de red vial para costos y geometría de caminos. |
| Reportes | ReportLab para PDF; cálculos de sostenibilidad en servicios del backend. |
| Seguridad | JWT, bcrypt, autorización por roles y cifrado de DNI de conductores en reposo. |

Entidades principales: `Usuario`, `Vehiculo`, `Conductor`, `Cliente`, `Pedido`, `Ruta`, `RutaDetalle`, `ReporteSostenibilidad`, `CuentaConductor`, `CuentaCliente`, `RutaBase` y `TraficoTramo`. Los modelos están en `backend/app/models/domain.py`.

## 5. Pantallas y API

El frontend contiene Inicio de sesión, Dashboard, Vehículos, Conductores, Pedidos, Rutas, Modo Conductor, Portal Cliente, Portal Auditor y Reportes. Su cliente HTTP está en `frontend/src/services/api.js`.

Los routers del backend separan autenticación, vehículos, conductores, clientes, pedidos, rutas, caminos, dashboard y reportes. FastAPI expone documentación interactiva en `/docs` cuando el servidor está activo. La respuesta de `/api/health` permite comprobar disponibilidad puntual; no equivale a un porcentaje de uptime.

## 6. Sostenibilidad y alcance de las métricas

La plataforma estima emisiones de CO₂ de rutas y ahorro frente a una base de comparación registrada. Los indicadores del dashboard son cálculos derivados de datos y factores configurados. No son mediciones directas de combustible consumido ni de emisiones reales de los vehículos. El repositorio incluye benchmarks de CPU geoespacial y un modelo de intensidad de carbono del software; para afirmar una reducción del impacto de la plataforma web se necesita una línea base reproducible y auditorías Lighthouse antes/después.

## 7. Ejecución y pruebas

Para iniciar localmente: instalar `backend/requirements.txt`, ejecutar `backend/seed_data.py`, iniciar `uvicorn app.main:app` desde `backend/`, instalar con `npm ci` y ejecutar `npm run dev` desde `frontend/`. Se requiere Python 3.11 o superior y Node.js 22.12 o superior. Los datos de `seed_data.py` son solo para desarrollo y pruebas.

En la validación local del 20/11/2026: 54 pruebas de backend aprobaron con 90 % de cobertura, tres pruebas unitarias de frontend aprobaron y la compilación Vite terminó correctamente. La suite Playwright ejecutó 27 casos en Chromium, Firefox y WebKit con la API local. La imagen Docker se construyó y un contenedor local respondió HTTP 200 en `/api/health` y `/login`, con estado `healthy`. Los resultados y límites metodológicos se detallan en el [informe del Sprint 4](03%20Implementacion/Sprint%204/03%20Analisis%20PlayWrigth%20V_1_0_0.md).

## 8. Entrega y pendientes verificables

El repositorio incluye Dockerfile, Compose y workflows de GitHub Actions para compilación, pruebas y despliegue mediante webhook. La existencia de los archivos no acredita una URL de producción: se necesitan los secretos `PRODUCTION_DEPLOY_HOOK` y `PRODUCTION_URL`, una ejecución remota aprobada y un health check exitoso.

Quedan pendientes la evidencia de una demostración a interesados, los formularios originales de la encuesta SUS, mediciones Lighthouse de una instalación desplegada, una línea base ambiental y la verificación de uptime durante un periodo definido. El [README principal](../README.md) enlaza la documentación formal de inicio, planificación, implementación, seguimiento y cierre.
