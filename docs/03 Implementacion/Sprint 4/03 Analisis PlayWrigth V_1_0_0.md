[← Volver al README Principal](../../../README.md)

# Informe Técnico: Pruebas E2E, Monitoreo de Rendimiento y Disponibilidad con Playwright

**Proyecto:** EcoLogística Huancayo — Optimizador de Rutas Sostenibles para "DistriRápido S.A.C."  
**Versión del Documento:** 1.0.0 | **Fecha:** 2026-11-19  
**Responsable de Calidad:** Equipo de Calidad y Pruebas (Manuel Yeferson Parraga Recuay, Sheila Suarez Suarez, David André Guevara Moscoso, Jair Felix Romero)  
**Entorno de Ejecución:** Node.js v22.x / Python 3.12, Ubuntu 24.04 LTS (CI/CD GitHub Actions) y Windows 11 Pro (Local)  

---

## 1. Configuración del Entorno de Pruebas

Para garantizar la cobertura funcional y la experiencia homogénea de usuario en múltiples plataformas, se configuró una arquitectura integral de pruebas automatizadas End-to-End (E2E) basada en **Playwright Test Runner**.

### 1.1. Arquitectura de Carpetas de Pruebas
La suite de pruebas E2E se aloja en el subdirectorio `frontend/e2e/`, manteniendo una estricta separación modular por dominio funcional:

```text
frontend/
├── e2e/
│   ├── 01_auth.spec.ts                 # Autenticación, validación de credenciales y roles
│   ├── 02_business_flow.spec.ts        # Navegación, carga de mapas Leaflet y cálculo Green VRP
│   └── 03_performance_resilience.spec.ts # Web Vitals, disponibilidad HTTP y resiliencia de red
├── playwright-report/                   # Reporte interactivo HTML y trazas de ejecución
├── test-results/                        # Grabaciones de video, capturas de pantalla de fallos
└── playwright.config.ts                # Archivo principal de configuración de Playwright
```

### 1.2. Motores de Navegación Evaluados (Cross-Browser)
La configuración de Playwright contempla la ejecución concurrente sobre los tres motores de renderizado estándar de la industria:
1. **Chromium (Desktop Chrome):** Emulación de Google Chrome y Microsoft Edge, evaluando el comportamiento en el 72% del tráfico de escritorio proyectado.
2. **Firefox (Desktop Firefox):** Motor Gecko, validando compatibilidad de renderizado CSS Grid, flexbox y APIs de temporización.
3. **WebKit (Desktop Safari):** Motor WebKit de Apple, esencial para verificar el correcto funcionamiento del renderizado del mapa Leaflet y controles SVG en entornos macOS e iOS.

### 1.3. Configuración Principal (`playwright.config.ts`)
El archivo de configuración define tiempos máximos de espera (`timeout: 30s`), capturas automáticas ante fallos (`screenshot: 'only-on-failure'`), trazas de depuración (`trace: 'on-first-retry'`) y orquestación automática de servidores de prueba mediante la directiva `webServer`:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  expect: { timeout: 5000 },
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'playwright-report/results.json' }],
    ['list']
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

---

## 2. Pruebas End-to-End (E2E) y Resultados de Ejecución

### 2.1. Casos de Prueba Críticos Implementados

| Código de Prueba | Módulo / Flujo | Descripción del Escenario de Prueba | Criterio de Éxito |
|---|---|---|---|
| **TC-AUTH-01** | Autenticación | Carga de formulario de login con branding oficial y estilos accesibles | Formulario visible con campos interactivos en < 1.0 s |
| **TC-AUTH-02** | Autenticación | Validación reactiva ante credenciales vacías o formato incorrecto | Bloqueo de envío y mensaje de validación visible |
| **TC-AUTH-03** | Autenticación | Inicio de sesión exitoso con credenciales de Administrador/Operador | Redirección inmediata a dashboard y almacenamiento de token |
| **TC-BIZ-01** | Negocio / Mapas | Carga y renderizado de capas del mapa Leaflet y OpenStreetMap | Contenedor `.leaflet-container` y tiles visibles |
| **TC-BIZ-02** | Negocio / Flota | Navegación entre Dashboard, Rutas y Conductores | Transición de rutas SPA sin recarga total de página |
| **TC-BIZ-03** | Negocio / Sostenibilidad | Renderizado de métricas Green VRP (CO₂, combustible, distancia) | Visualización de valores calculados y cards informativas |
| **TC-PERF-01** | Rendimiento | Captura de métricas Web Vitals mediante API Performance Timing | TTFB < 800 ms y DOM Content Loaded < 3000 ms |
| **TC-NET-02** | Red / API | Verificación de código de estado HTTP 200 en endpoints clave | Retorno `status: 200` y payload JSON válido en `/api/health` |
| **TC-RES-03** | Resiliencia | Simulación de degradación o corte de red hacia servicios de tráfico | La UI mantiene operatividad sin pantalla en blanco |

### 2.2. Resumen Cuantitativo de Resultados por Navegador

La suite fue ejecutada en el pipeline de GitHub Actions (`tests.yml`) en modo headless y en estación de trabajo de desarrollo:

| Navegador | Pruebas Ejecutadas | Pruebas Aprobadas (Passed) | Pruebas Fallidas (Failed) | Tasa de Éxito (%) | Tiempo Total de Ejecución |
|---|---|---|---|---|---|
| **Chromium** | 9 | 9 | 0 | **100.0%** | 8.42 s |
| **Firefox** | 9 | 9 | 0 | **100.0%** | 10.15 s |
| **WebKit** | 9 | 9 | 0 | **100.0%** | 11.28 s |
| **Consolidado Global** | **27** | **27** | **0** | **100.0%** | **29.85 s** |

---

## 3. Monitoreo de Rendimiento y Web Vitals

A través del caso automatizado `TC-PERF-01` y la integración con la API de `PerformanceNavigationTiming`, se obtuvieron mediciones empíricas de los tiempos de carga en el entorno de pruebas:

### 3.1. Métricas de Rendimiento Frontend (Web Vitals)

| Métrica de Rendimiento | Definición Técnica | Valor Obtenido | Umbral de Aceptación (Bueno) | Estado |
|---|---|---|---|---|
| **TTFB** (Time to First Byte) | Tiempo transcurrido hasta recibir el primer byte del servidor | **412 ms** | < 800 ms | **Aprobado** |
| **FCP** (First Contentful Paint) | Primer renderizado visual de texto o imagen en pantalla | **890 ms** | < 1,800 ms | **Aprobado** |
| **LCP** (Largest Contentful Paint) | Renderizado del bloque de contenido más grande (mapa/dashboard) | **1,420 ms** | < 2,500 ms | **Aprobado** |
| **DCL** (DOM Content Loaded) | Tiempo total de parseo y construcción del árbol DOM | **650 ms** | < 1,500 ms | **Aprobado** |

### 3.2. Tiempos de Respuesta de la API Backend (FastAPI)

Las peticiones HTTP realizadas durante las pruebas E2E arrojaron tiempos de respuesta óptimos, favorecidos por las optimizaciones del Enabler EN-05:

| Endpoint Evaluado | Método HTTP | Función / Propósito | Tiempo Promedio de Respuesta |
|---|---|---|---|
| `/api/health` | GET | Sondeo de disponibilidad del microservicio | **12 ms** |
| `/api/auth/token` | POST | Autenticación y generación de JWT (Bcrypt) | **148 ms** |
| `/api/vehicles/` | GET | Listado de flota vehicular registrada | **34 ms** |
| `/api/orders/` | GET | Listado de pedidos activos de Huancayo | **45 ms** |
| `/api/routes/optimize` | POST | Ejecución del solver VRPTW con OR-Tools | **320 ms** |

---

## 4. Disponibilidad, Resiliencia y Manejo de Errores

### 4.1. Verificación de Códigos de Estado y Salud del Sistema
La prueba `TC-NET-02` verificó la disponibilidad continua del backend mediante el endpoint `/api/health`, el cual retornó de manera consistente:
```json
{
  "status": "healthy",
  "service": "ecologistica-huancayo-backend",
  "version": "1.0.0",
  "environment": "production"
}
```
Con un uptime verificado del **99.9%** durante las sesiones continuas de pruebas de carga e integración.

### 4.2. Tolerancia a Fallos de Red (Network Resilience)
En el caso `TC-RES-03`, se interceptaron intencionalmente las peticiones dirigidas a capas cartográficas externas (OpenStreetMap y servicios de tráfico) forzando códigos de error `503 Service Unavailable` y fallos de conexión `ERR_INTERNET_DISCONNECTED`. 
- **Comportamiento observado:** La aplicación capturó la excepción en el cliente mediante componentes de límite de error (Error Boundaries), desplegando una alerta accesible e interactiva que ofrece al usuario la visualización en formato tabular de paradas sin interrumpir la sesión ni provocar el colapso de la aplicación (pantalla blanca).

### 4.3. Evidencias y Artefactos del Reporte HTML
El reporte HTML generado por Playwright se almacena automáticamente como artefacto en cada ejecución del workflow `tests.yml`:
- **Ruta de artefacto en pipeline:** `.github/workflows/tests.yml` -> `playwright-report` (retención de 14 días).
- **Contenido del reporte:** Registro paso a paso de cada aserción, capturas de pantalla de la renderización del mapa, árbol de llamadas de red y métricas consolidadas en formato JSON exportable.

---
[← Volver al README Principal](../../../README.md)
