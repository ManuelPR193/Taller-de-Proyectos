# Informe de reducción del impacto ambiental – EcoLogística Huancayo

**Versión:** 1.0.0  
**Sistema:** EcoLogística Huancayo  
**Arquitectura evaluada:** React 18 + Vite, FastAPI, SQLAlchemy y SQLite/PostgreSQL  
**Fecha de elaboración:** noviembre de 2026

## 1. Objetivo y alcance

El objetivo es reducir el trabajo de procesamiento, las transferencias de datos y las solicitudes innecesarias del sistema EcoLogística Huancayo. Se revisan ocho áreas de optimización indicadas en la actividad y se adaptan a las tecnologías que realmente utiliza el proyecto.

La consigna presenta ejemplos MERN (MongoDB, Express, React y Node.js). EcoLogística no utiliza MongoDB ni Express. Por ello, las consultas magras e índices se implementan con SQLAlchemy; la API se desarrolla con FastAPI; y las optimizaciones de interfaz se realizan con React y Vite. No se agregan dependencias o servicios ajenos solo para reproducir literalmente el ejemplo MERN.

## 2. Diagnóstico técnico y evidencia del proyecto

La inspección del código fuente identifica estas medidas implementadas:

- Proyecciones de columnas con `load_only()` e índices definidos en los modelos SQLAlchemy.
- Paginación de API mediante `page` y `limit`, con límite máximo de 100 registros. El tamaño predeterminado y el tamaño solicitado por el cliente se establecen en **12 registros** para alinearse con la rúbrica.
- Carga diferida de vistas secundarias mediante `React.lazy()` y `Suspense`.
- Uso de `Intl.DateTimeFormat` en lugar de incorporar una librería de fechas para el formato utilizado.
- Iconos `lucide-react`, renderizados como SVG en el DOM.
- Caché GET temporal en memoria y deduplicación de solicitudes concurrentes en el cliente.
- Cabeceras de caché inmutable para archivos estáticos con hash y `private, no-store` para respuestas de API con información operativa.
- Compresión Gzip en FastAPI para respuestas superiores a 1 KB.

**Límite del diagnóstico:** el frontend no contiene actualmente un conjunto de imágenes PNG/JPG locales que justifique una conversión masiva a WebP/AVIF. Se incorpora una auditoría para evitar que se agreguen imágenes raster pesadas sin optimización. Tampoco se ha migrado el cliente a TanStack Query ni se habilita caché compartida/ETag en respuestas privadas. Estas decisiones se explican en cada área y no se presentan como funcionalidades inexistentes.

## 3. Ocho áreas de optimización: comparación ANTES y DESPUÉS

Los fragmentos ANTES muestran el patrón que se busca evitar; cuando no existe un registro histórico del código anterior, se identifican como **ejemplo de referencia**, no como una medición o commit anterior del repositorio. Los fragmentos DESPUÉS corresponden al enfoque aplicado en el código actual.

### 3.1 Consultas magras e índices de base de datos

**ANTES – ejemplo de consulta sin proyección:**

```python
# Ejemplo de referencia: recuperar todas las columnas y filas
vehiculos = db.query(Vehiculo).all()
```

**DESPUÉS – implementación aplicada:**

```python
from sqlalchemy.orm import load_only

query = db.query(Vehiculo).options(load_only(
    Vehiculo.id,
    Vehiculo.placa,
    Vehiculo.marca,
    Vehiculo.estado,
))
```

Los listados de vehículos, conductores, clientes y pedidos aplican proyecciones `load_only()` para limitar las columnas recuperadas. Los modelos incluyen índices compuestos para campos utilizados en filtros y ordenamientos, por ejemplo estado/placa, estado/nombre y estado/fecha.

**Beneficio esperado:** menor lectura de columnas, menor transferencia desde la base de datos y mejor respuesta en listados. Se debe confirmar el efecto con el mismo conjunto de datos antes y después.

### 3.2 Paginación en backend y frontend: 12 registros

**ANTES – ejemplo de listado sin límite:**

```python
items = query.all()
```

**DESPUÉS – implementación aplicada:**

```python
DEFAULT_PAGE_SIZE = 12
MAX_PAGE_SIZE = 100

def page_query(query, response, page: int, limit: int):
    total = query.order_by(None).count()
    response.headers["X-Total-Count"] = str(total)
    response.headers["X-Page"] = str(page)
    response.headers["X-Page-Size"] = str(limit)
    response.headers["Cache-Control"] = "private, no-store"
    return query.offset((page - 1) * limit).limit(limit).all()
```

El cliente solicita páginas de 12 registros y consulta las siguientes páginas cuando necesita completar una colección para mantener la compatibilidad con las pantallas actuales. Los encabezados `X-Total-Count`, `X-Page` y `X-Page-Size` permiten construir controles de paginación visibles en una futura iteración. La descarga por bloques ya está implementada; la paginación visual independiente por pantalla aún no está desplegada.

**Beneficio esperado:** evitar consultas ilimitadas y controlar el tamaño de cada respuesta.

### 3.3 Imágenes adaptativas WebP/AVIF

**ANTES – ejemplo de referencia:**

```jsx
<img src="/images/mapa-operativo.jpg" alt="Mapa operativo" />
```

**DESPUÉS – patrón recomendado cuando se incorporen imágenes locales:**

```jsx
<picture>
  <source
    type="image/avif"
    srcSet="/images/mapa-operativo-640.avif 640w, /images/mapa-operativo-1280.avif 1280w"
  />
  <source
    type="image/webp"
    srcSet="/images/mapa-operativo-640.webp 640w, /images/mapa-operativo-1280.webp 1280w"
  />
  <img
    src="/images/mapa-operativo-640.webp"
    alt="Mapa operativo"
    loading="lazy"
    decoding="async"
    sizes="(max-width: 768px) 100vw, 1280px"
  />
</picture>
```

No se encontraron imágenes raster locales que deban convertirse en esta versión. Se agrega `frontend/scripts/audit-assets.mjs`, ejecutado en CI, que detecta archivos PNG/JPG/JPEG superiores a 200 KB y solicita su conversión u optimización. El patrón `<picture>` anterior es una pauta para futuras imágenes; no se afirma que haya imágenes WebP/AVIF actualmente desplegadas.

### 3.4 Carga diferida y división de código

**ANTES – ejemplo de importación estática:**

```jsx
import { Reportes } from './pages/Reportes';
```

**DESPUÉS – implementación aplicada en `frontend/src/App.jsx`:**

```jsx
const Reportes = lazy(() =>
  import('./pages/Reportes').then(m => ({ default: m.Reportes }))
);

<Suspense fallback={<p role="status">Cargando vista...</p>}>
  <Routes>{/* rutas de la aplicación */}</Routes>
</Suspense>
```

Las vistas secundarias (rutas, vehículos, conductores, pedidos, modo conductor, portal auditor, portal cliente y reportes) se cargan bajo demanda. Esto evita incluir todas las vistas en el primer paquete de JavaScript.

### 3.5 Limpieza de dependencias y APIs nativas

**ANTES – ejemplo de dependencia adicional para fechas:**

```javascript
import moment from 'moment';
const fecha = moment().format('YYYY-MM-DD');
```

**DESPUÉS – implementación aplicada:**

```javascript
export const today = () => new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Lima',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
}).format(new Date());
```

El frontend utiliza la API nativa `Intl.DateTimeFormat` para el formato de fecha requerido. En el manifiesto actual no se declaran `moment` ni `lodash`; por tanto, no corresponde afirmar que se eliminaron de este proyecto. El flujo ejecuta `npm audit --audit-level=high` para identificar vulnerabilidades de dependencias.

**Regla de mantenimiento:** antes de añadir una librería, revisar si la plataforma ya ofrece la funcionalidad y evaluar el peso añadido al bundle.

### 3.6 Reducción de solicitudes HTTP mediante SVG en línea

**ANTES – ejemplo de icono como recurso externo:**

```jsx
<img src="/icons/truck.svg" alt="Vehículos" />
```

**DESPUÉS – implementación aplicada con Lucide:**

```jsx
import { Truck } from 'lucide-react';

<Truck aria-hidden="true" size={20} />
```

Los iconos Lucide se representan como SVG dentro del DOM y no requieren descargar un archivo de icono independiente por cada aparición.

### 3.7 Estrategia de caché

**ANTES – ejemplo de consulta repetida sin reutilización:**

```javascript
const response = await fetch(url, { headers: headers() });
return response.json();
```

**DESPUÉS – implementación aplicada en `frontend/src/services/api.js`:**

```javascript
const GET_CACHE_TTL_MS = 10_000;
const getCache = new Map();
const pendingGets = new Map();

// Antes de hacer fetch, se reutiliza una respuesta vigente o una
// solicitud concurrente para la misma URL y el mismo usuario.
```

El cliente mantiene caché GET de 10 segundos, deduplica solicitudes concurrentes e invalida el caché después de operaciones de escritura. Vite genera archivos estáticos con hash, que reciben `Cache-Control: public, max-age=31536000, immutable`. Las respuestas de API operativa y privada reciben `Cache-Control: private, no-store`.

**Decisión de seguridad:** no se habilita caché pública ni compartida para información de usuarios, pedidos, conductores o rutas. El cliente emplea una caché ligera propia; TanStack Query no forma parte de las dependencias actuales. Los recursos estáticos servidos mediante Starlette `FileResponse` disponen de validadores HTTP según el servidor, pero la aplicación no implementa un ETag personalizado para la API privada.

### 3.8 Compresión de respuestas

**ANTES – ejemplo de respuesta sin middleware de compresión:**

```python
app = FastAPI()
```

**DESPUÉS – implementación aplicada en `backend/app/main.py`:**

```python
from starlette.middleware.gzip import GZipMiddleware

app.add_middleware(
    GZipMiddleware,
    minimum_size=1024,
    compresslevel=6,
)
```

FastAPI comprime respuestas compatibles superiores a 1 KB mediante Gzip. Brotli no está configurado en el servidor ASGI actual, por lo que no se afirma que ambos algoritmos estén activos. Gzip se conserva como opción compatible y verificable en esta arquitectura.

## 4. Medición de rendimiento con Lighthouse

La auditoría automatizada se encuentra en:

- `.github/workflows/green-audit.yml`
- `frontend/lighthouserc.json`

El workflow construye el frontend, ejecuta tres auditorías Lighthouse CI sobre la versión de producción servida localmente y publica los reportes como artefacto de GitHub Actions. Las metas de la rúbrica se configuran como advertencias para registrar las brechas sin ocultar resultados ni hacer fallar el pipeline por una meta aún no alcanzada.

| Indicador | Meta de la rúbrica | Resultado de EcoLogística |
|---|---:|---|
| Performance Lighthouse | ≥ 90/100 | Pendiente de ejecución en GitHub Actions |
| FCP | ≤ 1.0 s | Pendiente de medición |
| LCP | ≤ 1.4 s | Pendiente de medición |
| TBT | ≤ 85 ms | Pendiente de medición |
| CLS | ≤ 0.02 | Pendiente de medición |
| Transferencia total | ≤ 1.1 MB | Pendiente de medición |

No se copian al proyecto las cifras de ejemplo del documento de referencia (38/96 puntos, 8.4/1.1 MB u otras), porque no son mediciones de EcoLogística. Los valores reales se obtienen del artefacto `green-audit-*` generado por GitHub Actions.

## 5. Estimación de energía y CO₂e con la fórmula indicada en la actividad

Para mantener trazabilidad con el material de la actividad se utiliza la fórmula y los factores allí indicados:

\[
E_{kWh} = Transferencia_{GB} \times 0.815\; kWh/GB
\]

\[
CO_{2e,g} = E_{kWh} \times 442\; gCO_{2e}/kWh
\]

Para la conversión se utiliza 1 GB = 1,073,741,824 bytes (base 1024). El script `backend/tests/swdm_from_lighthouse.py` lee el peso de transferencia (`total-byte-weight`) de los JSON Lighthouse, calcula energía y emisiones por visita y proyecta el resultado para 500,000 visitas al año.

**Ejemplo aritmético de referencia, no medición del sistema:**

| Transferencia por visita | Energía estimada | CO₂e estimado |
|---:|---:|---:|
| 8.4 MiB | 0.006685 kWh | 2.954 g |
| 1.1 MiB | 0.000875 kWh | 0.387 g |

Los valores de CO₂e se recalculan directamente con los factores publicados en la fórmula. En el HTML de referencia, los resultados de 2.15 g y 0.28 g no coinciden aritméticamente con `GB × 0.815 × 442`; por ello, no se reutilizan. El cálculo es una estimación simplificada basada en transferencia de datos y factores del material académico; no es una medición directa del centro de datos ni sustituye un inventario completo de emisiones o una evaluación SCI.

**Proyección anual:** el script utiliza 500,000 visitas como escenario de comparación. Se debe reemplazar por el volumen real de visitas de EcoLogística cuando exista un registro validado. El ahorro se calcula como emisiones ANTES menos emisiones DESPUÉS bajo los mismos supuestos.

## 6. Evidencias y reproducción

### 6.1 Ejecución local

Desde la raíz del repositorio:

```bash
# Frontend
cd frontend
npm ci
npm run audit:assets
npm test
npm run build
npx --yes @lhci/cli@0.15.1 autorun --config=./lighthouserc.json

# Backend, en otra terminal
cd backend
pip install -r requirements-dev.txt
python -m compileall app
python -m unittest discover -s tests -v
python tests/green_software_benchmark.py
```

Para calcular emisiones desde los reportes Lighthouse:

```bash
python backend/tests/swdm_from_lighthouse.py frontend/lighthouse-reports \
  --visits 500000 \
  --output frontend/lighthouse-reports/swdm-summary.json
```

### 6.2 Evidencia de GitHub Actions

1. Abrir el repositorio en GitHub.
2. Entrar a **Actions** y seleccionar **Green IT & Lighthouse Audit**.
3. Abrir la ejecución correspondiente al commit evaluado.
4. Descargar el artefacto `green-audit-*`.
5. Revisar los JSON Lighthouse y `swdm-summary.json`.
6. Registrar en este informe la fecha, commit, score, FCP, LCP, TBT, CLS, bytes transferidos, kWh y g CO₂e.

### 6.3 Criterios de comparación ANTES/DESPUÉS

La comparación válida debe utilizar el mismo equipo o runner, versión de navegador, configuración Lighthouse, red, página, estado de autenticación y conjunto de datos. Se recomienda realizar tres o más ejecuciones por versión y comparar la mediana. Si no existe una versión anterior preservada, no se debe inventar una línea base retrospectiva: se documenta la primera medición disponible y se toma como línea base para futuras versiones.

## 7. Estado de cumplimiento frente a la rúbrica

| Área evaluada | Evidencia incorporada | Estado verificable |
|---|---|---|
| 1. Consultas magras e índices | `load_only()` e índices SQLAlchemy | Implementado |
| 2. Paginación de 12 | API `page/limit`, máximo 100, metadatos HTTP; cliente consulta bloques de 12 | Implementado en API y descarga por bloques; controles visuales pendientes |
| 3. WebP/AVIF y `<picture>` | Auditoría de assets y patrón adaptativo documentado | Parcial: no hay imágenes raster locales convertibles en esta versión |
| 4. Lazy loading | `React.lazy()` y `Suspense` | Implementado |
| 5. APIs nativas y dependencias | `Intl.DateTimeFormat`, auditoría npm | Implementado para fecha; no se declaran moment/lodash que eliminar |
| 6. SVG en línea | Lucide React | Implementado |
| 7. Caché/ETag/React Query | Caché local, deduplicación, caché inmutable de assets y `no-store` en API privada | Parcial: no se usa TanStack Query ni ETag personalizado para API |
| 8. Compresión | GZipMiddleware FastAPI | Implementado con Gzip; Brotli no habilitado |
| Lighthouse y SWDM | Workflow LHCI y calculadora automática | Automatización implementada; métricas reales pendientes de ejecución |

Este estado distingue el trabajo incorporado de las mediciones todavía no ejecutadas. No se atribuyen al sistema resultados que no estén respaldados por reportes de auditoría.

## 8. Gestión de versiones: comandos Git CLI


Ejecutar desde la raíz del repositorio. Si la carpeta ya existe, mkdir -p no genera error.


´´´bash
mkdir -p "docs/03 Implementación/reduccion del impacto ambiental"
git status

git add "docs/03 Implementación/reduccion del impacto ambiental/"

git add backend/app/api/pagination.py frontend/src/services/api.js

git add backend/tests/swdm_from_lighthouse.py backend/tests/test_swdm_from_lighthouse.py

git add frontend/lighthouserc.json .github/workflows/green-audit.yml

git commit -m "docs(green-it): complete EcoLogistica green software audit v1.0.0"

git push origin main
´´´





Si el trabajo se realiza en otra rama, reemplazar main por el nombre de esa rama en el último comando y abrir un Pull Request hacia la rama principal.
