[← Volver al README principal](../../README.md)

# Reporte Final del Proyecto

**Proyecto:** EcoLogística Huancayo — optimizador de rutas sostenibles de última milla para DistriRápido S.A.C.
**Fecha de corte técnico:** 23/11/2026 · **Versión:** 1.0.0
**Naturaleza del cierre:** técnico local documentado; aceptación académica, evidencia humana y transición productiva pendientes.

## 1. Descripción general

La plataforma web integra operaciones de pedidos, flota y conductores con generación de rutas VRPTW mediante OR-Tools, mapa Leaflet, reportes PDF e indicadores ambientales estimados. El alcance declarado sitúa el uso en Huancayo y distritos cercanos. La solución tiene componentes React/Vite y FastAPI, persistencia SQLite para ejecución local y soporte preparado para PostgreSQL. El tráfico se alimenta con observaciones manuales de vigencia limitada; no se verifica un proveedor de tráfico en vivo.

## 2. Resumen de desempeño

### 2.1 Alcance predictivo y adaptativo

| Línea / criterio | Resultado verificable | Variación / límite |
|---|---|---|
| Objetivo de MVP: verificar al menos 7 de 10 RF | Los módulos implementados cubren las operaciones principales descritas en resumen y pruebas. | La matriz final de RF aceptados con firma y criterio uno-a-uno no está consolidada; no certificar porcentaje definitivo. |
| Sprints 1–3 | S1 14/27 SP; S2 18/18; S3 28/28 | Reportes por sprint; Sprint 4 carece de compromiso/SP y backlog exportado. |
| Cambios adaptativos CC-01–CC-06 | Cambios técnicos documentados como implementados | No hay actas individuales de aprobación del patrocinador. |

### 2.2 Calidad

| Control | Resultado local | Alcance de la afirmación |
|---|---|---|
| Backend | 54/54; 90 % cobertura | Ejecución aislada SQLite; no equivale a PostgreSQL productivo. |
| Frontend | 3/3 pruebas; build Vite correcto | Local. |
| Playwright | 27/27 en Chromium, Firefox y WebKit | API local con base de prueba. |
| Latencia de API | 20 solicitudes por endpoint: p95 de `/api/health` 5,01 ms, login 232,83 ms y listado de vehículos 5,22 ms | Medición local del 23/11/2026; no mide uptime ni latencia de producción. [Datos JSON](evidencias/api-latency-local-20261123.json). |
| Seguridad | Informes previos indican Bandit y auditorías sin hallazgos medios/altos al corte señalado | Repetir CI actual y revisar advisories antes de publicación final. |
| SUS | Media aritmética 87,0 consignada | Sin formularios fuente/acta; validez de aplicación no confirmada. |
| Requisitos eximidos | Ninguno declarado como eximido formalmente | Las capacidades externas y mediciones no probadas siguen pendientes, no se declaran aceptadas. |

### 2.3 Cronograma

| Hito | Enfoque | Fecha planificada | Fecha real documentada | Variación / impacto |
|---|---|---|---|---|
| Inicio / Charter | Predictivo | Semana 2; sin fecha calendario en baseline | 28/08/2026 (fecha de documento) | N/D días; fecha de documento no prueba aprobación. |
| Iteración 1 | Híbrido | Semana 3; sin fecha calendario | 25/09/2026 (informe) | N/D días; 14/27 SP en el corte. |
| Iteración 2 | Adaptativo | Semana 7; sin fecha calendario | 09/10/2026 (informe) | N/D días; 18/18 SP reportados. |
| Iteración 3 | Adaptativo | Semana 11; sin fecha calendario | 30/10/2026 (informe) | N/D días; 28/28 SP reportados. |
| Iteración 4 / cierre | Híbrido | Semana 14; sin fecha calendario | Evidencia de validación local 20/11/2026; revisión sin SP | N/D días y alcance aceptado; quedan evidencias externas. |

### 2.4 Costo

El presupuesto académico detallado estima S/ 11 319 (incluye costo de oportunidad, infraestructura prevista y contingencia); el acta inicial indica S/ 0–250 aprox. No hay acuerdo de rebase, horas reales ni desembolsos consolidados. En consecuencia, costo final real y desviación quedan **no determinados**. El presupuesto empresarial simulado de S/ 500 000 no es el costo del proyecto académico.

## 3. Riesgos, incidentes e impedimentos al cierre

| ID / tema | Tipo | Impacto observado | Respuesta / estado |
|---|---|---|---|
| RSK-01: fuente vial externa/OSM | Riesgo técnico | Puede degradar generación de rutas cuando el servicio externo no está disponible | Pruebas usan red determinista; conservar gestión de fallos y documentar cobertura. |
| IMP-01: infraestructura de staging | Impedimento externo | Autoescalamiento, failover y PostgreSQL no validados | Configuración en repo; desplegar y adjuntar health check antes de afirmar operación. |
| Jira sin exportación | Impedimento de trazabilidad | No hay burndown/burnup/taskboard original ni SP del Sprint 4 | Solicitar exportación al propietario de la cuenta. |
| Usabilidad sin fuentes SUS | Brecha de validación | 87,0 no acredita diez participantes ni representatividad | Reaplicar con consentimiento y formularios anonimizados. |
| Video y demo a interesados ausentes | Entregable externo | No se demuestra exposición/evaluación | Grabar demo, adjuntar MP4 y acta; registrar asistentes solo si ocurrió. |
| Baseline financiero/calendario inconsistente | Incidente documental | EVM y variación global no calculables | Resolver bases y versionar cambios; ver informes de variación/EVM. |

## 4. Evaluación de éxito y cierre

- **Éxito técnico local:** favorable para las funciones que cubren las pruebas y builds reportados.
- **Satisfacción de interesados:** N/D; no hay encuesta, acta o aprobación del docente/negocio. El SUS documentado no se usa como sustituto.
- **Satisfacción del equipo:** retrospectivas S1–S3 registran 4/5 grupal; no existe corte equivalente para S4/cierre.
- **Transición operativa:** pendiente. Docker y workflows están en el repo, pero no prueban despliegue, capacitación, monitoreo ni entrega de credenciales administradas.
- **Cierre administrativo:** preparado, no firmado. Las actas previas ya marcan aprobación docente y empresarial como pendientes.

### Decisión de cierre

Se presenta como **cierre técnico del incremento local**, no como aceptación final ni producción. El cierre académico/operativo se completará cuando se adjunten evidencia audiovisual, aceptación, costos/horas, radiadores y ejecución externa.

## Historial de cambios

| Versión | Fecha | Cambio |
|---|---|---|
| 1.0.0 | 23/11/2026 | Consolidación final con fuentes disponibles y pendientes sin atribución falsa. |
