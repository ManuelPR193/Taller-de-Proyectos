[← Volver al README principal](../../../README.md)

# Análisis de pruebas E2E, rendimiento y disponibilidad con Playwright

**Proyecto:** EcoLogística Huancayo

**Fecha de validación local:** 20/11/2026
**Entorno:** Windows, Node.js 22, Python 3.11, Vite preview en `localhost:5173` y FastAPI en `127.0.0.1:8000` con datos de prueba. Este entorno no es producción.

## Configuración y reproducción

La configuración está en [`frontend/playwright.config.ts`](../../../frontend/playwright.config.ts). Los nueve casos de `frontend/e2e/` se repiten en Chromium, Firefox y WebKit; hay captura y vídeo en fallos, informe HTML y JSON. La dependencia `@playwright/test` está declarada en `frontend/package.json`.

```text
python -m venv .venv
.venv/Scripts/python -m pip install -r backend/requirements-dev.txt
cd backend
../.venv/Scripts/python seed_data.py
../.venv/Scripts/python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
# En otra terminal:
cd frontend
npm ci
npm run build
npx playwright install chromium firefox webkit
npx playwright test
```

En Linux, usar `.venv/bin/python` en lugar de `Scripts/python`. El workflow [`tests.yml`](../../../.github/workflows/tests.yml) automatiza estas etapas y sube `playwright-report/`, `test-results/` y `coverage.xml` como artefactos.

## Casos y resultado local

| Grupo | Comprobaciones reales | Chromium | Firefox | WebKit |
|---|---|---:|---:|---:|
| Autenticación | Formulario visible, validación HTML de campos vacíos, acceso del usuario sembrado | 3/3 | 3/3 | 3/3 |
| Negocio | Mapa Leaflet en rutas, navegación a conductores, respuesta 200 y tarjetas del dashboard | 3/3 | 3/3 | 3/3 |
| Calidad operativa | Tiempos de navegación, salud HTTP 200, error visible ante fallo simulado de la API | 3/3 | 3/3 | 3/3 |
| **Total** | Ejecución local del 20/11/2026 | **9/9** | **9/9** | **9/9** |

Resultado global: **27 aprobadas, 0 fallidas**. Se conserva una [captura del reporte HTML local](evidencias/reporte-playwright-local.png) con los 27 resultados y los tres navegadores. El informe HTML interactivo queda en `frontend/playwright-report/index.html`; el JSON y las capturas de fallos se generan en las carpetas ignoradas por Git. Estos resultados no certifican que GitHub Actions haya corrido en verde: eso requiere revisar la ejecución remota tras publicar los cambios.

## Mediciones de navegación

La prueba registra `PerformanceNavigationTiming`, FCP y LCP cuando el navegador los expone. Cada ejecución guarda `navigation-metrics.json` en `frontend/test-results/`. Una muestra local de la página `/login` produjo:

| Motor | TTFB | DOM Content Loaded | Carga | FCP | LCP |
|---|---:|---:|---:|---:|---:|
| Chromium | 4,4 ms | 681 ms | 681 ms | no expuesto | no expuesto |
| Firefox | 5 ms | 2245 ms | 2352 ms | 2340 ms | no expuesto |
| WebKit | 12 ms | 440 ms | 442 ms | 665 ms | 665 ms |

Son **mediciones de una ejecución local**, sujetas a máquina, caché y carga concurrente de pruebas. No reemplazan una auditoría Lighthouse ni muestran el rendimiento de producción. El informe anterior atribuía FCP de 890 ms, LCP de 1420 ms, tiempos de API y uptime de 99,9 % sin artefactos verificables; esas cifras no se conservan como resultados.

### Latencia local de API

El script [`backend/tests/api_latency_probe.py`](../../../backend/tests/api_latency_probe.py) realizó 20 solicitudes por endpoint contra la API local sembrada. La [salida JSON conservada](evidencias/api-latency-local.json) incluye fecha UTC, mínimo, mediana, percentil 95 por rango más próximo y máximo.

| Endpoint | Muestra | Mediana | p95 | Máximo |
|---|---:|---:|---:|---:|
| `GET /api/health` | 20 | 1,36 ms | 2,01 ms | 7,29 ms |
| `POST /api/v1/auth/login` | 20 | 225,72 ms | 252,58 ms | 275,54 ms |
| `GET /api/v1/vehicles/` | 20 | 5,78 ms | 6,83 ms | 7,11 ms |

Estos tiempos excluyen red pública y carga concurrente representativa. No hay una tasa de uptime medida.

Se intentó Lighthouse CLI localmente sobre `/login` con Chromium de Playwright y Chrome instalado, tanto con configuración móvil como de escritorio. Las ejecuciones terminaron con `NO_FCP` (la herramienta no detectó pintura) y **no generaron score válido**. Los JSON de error quedan en `frontend/playwright-report/` local, que Git ignora. Se requiere repetir la auditoría en un runner o entorno que permita obtener la pintura de la página.

## Disponibilidad y resiliencia

`GET /api/health` debe responder HTTP 200 y `status: online`; la prueba falla si la API no está disponible. Otra prueba aborta la solicitud de métricas del dashboard y verifica que aparece un mensaje de error y que el encabezado del panel sigue visible. Esto comprueba **una falla simulada local**, no recuperación automática ni tolerancia a desconexión prolongada.

## Evidencia que falta para el nivel sobresaliente

- Ejecutar y conservar el artefacto de GitHub Actions para el commit que se entregue.
- Medir Lighthouse en una URL desplegada y registrar score, TBT, CLS, bytes, FCP y LCP con fecha, commit, perfil de dispositivo y versión del navegador.
- Medir latencia de endpoints críticos con muestra y percentiles; comprobar uptime durante un periodo definido con un monitor externo.
- Añadir pruebas de creación de pedido, optimización de ruta y confirmación de entrega en navegador, con datos aislados y aserciones sobre el resultado persistido.
- Conservar una grabación o acta de la demostración a usuarios y sus observaciones, además de la captura técnica ya adjunta.

[← Volver al README principal](../../../README.md)
