[← Volver al README principal](../../README.md)

# Reporte Final de Lecciones Aprendidas

**Proyecto:** EcoLogística Huancayo
**Fecha de corte documental:** 23/11/2026
**Reunión de cierre:** no hay acta de una reunión final en el repositorio
**Versión:** 1.0.0

> Las observaciones combinan retrospectivas escritas de Sprints 1–4 y resultados reproducibles. No se atribuyen opiniones individuales ni acuerdos de una reunión que no está evidenciada.

## 1. Matriz consolidada

| Categoría | Práctica efectiva observada | Oportunidad / riesgo observado | Recomendación verificable para futuros equipos |
|---|---|---|---|
| Desempeño del equipo | Informes por sprint y retrospectivas identifican acciones; roles técnicos se integran para probar flujos completos. | Los registros de ánimo son grupales y no hay acta final ni evidencia individual. | Definir una cadencia de sincronización y guardar acuerdos, responsables y seguimiento; anonimizar encuestas. |
| Evolución y control del alcance | Cambios CC-01 a CC-06 quedaron descritos; se separa entrega técnica de historias no trazables. | No está el backlog exportado y el Sprint 4 no tiene puntos/aceptación por historia. | Vincular historia → criterio → PR/commit → prueba → aceptación; adjuntar historial de alcance. |
| Cronograma híbrido | Fechas de algunos cortes y totales SP S1–S3 están documentados. | Baseline usa semanas sin fecha calendario; no hay serie diaria ni ruta crítica calculable. | Aprobar fechas, dependencias, calendario laboral y radiadores desde la planificación. |
| Presupuesto | La estimación separa costo de oportunidad, herramientas y contingencia. | Acta y presupuesto detallado difieren; horas/costos reales no se capturaron. | Distinguir presupuesto de caja y costo de oportunidad; registrar horas/tarifas/gastos por periodo. |
| Técnicas de estimación | Los reportes registran comprometido/completado para S1–S3. | Un caso de 14/27 SP en S1 y ausencia de S4 impiden usar velocidad completa; no hay serie diaria. | Mantener puntos de aceptación consistentes y ajustar forecast usando varias iteraciones, sin rellenar vacíos retroactivamente. |
| Aseguramiento de calidad | Tests deterministas evitan dependencia de red; cobertura, pruebas de API, UI y E2E reproducibles. | Una ejecución local no demuestra CI, PostgreSQL, staging, accesibilidad completa ni validación de usuarios. | Ejecutar controles en pipeline y guardar artefactos fechados; separar pruebas funcionales, accesibilidad y operativas. |
| Involucramiento de interesados | El proyecto nombra grupos de interés y diseña módulos para roles operativos. | No hay acta de demo, aceptación docente/negocio ni formularios SUS. | Planificar sesiones con consentimiento, registrar contexto y feedback, cerrar acciones con responsables. |
| Riesgos, incidentes e impedimentos | Riesgos de OSM y staging se reflejan en pruebas/impedimentos; el test usa proveedor determinista. | Configuración de despliegue y proveedor externo puede confundirse con disponibilidad real. | Mantener fallos controlados y health checks; registrar dueño, disparador, respuesta y evidencia del cierre. |

## 2. Conclusiones de la retrospectiva de cierre

1. La reproducibilidad mejora cuando las pruebas unitarias no requieren internet; la integración externa debe tener pruebas propias y explícitas.
2. Un archivo de despliegue es preparación, no evidencia de que el sistema está desplegado.
3. Las métricas financieras requieren registros de horas y costos desde el inicio; una estimación de presupuesto no sustituye AC.
4. Los puntos de historia sirven para avance del backlog y no equivalen a moneda sin una regla aprobada.
5. La documentación resulta más creíble cuando expresa los límites de los datos y corrige atribuciones a sprints que Git no demuestra.
6. Las cifras ambientales deben mantener separados los cálculos del modelo y las mediciones de impacto real.
7. Las evidencias de Jira, encuestas, demos y aceptación deben exportarse y archivarse antes de cerrar el periodo.

## 3. Acciones recomendadas

| Acción | Evidencia de cierre |
|---|---|
| Conciliar y aprobar baseline presupuesto/calendario | Versión revisada con aprobación y supuestos explícitos. |
| Completar EVM con datos reales | Fuente de PV/EV/AC por periodo, fórmulas revisadas y comparación. |
| Exportar radiadores y backlog | Archivos originales con fecha, sprint y filtros visibles. |
| Registrar validación de usuarios | Consentimiento, instrumento, resultados anonimizados y resumen. |
| Grabar pitch/demo y aceptación | MP4 válido, duración/segmentos revisados, acta real y asistentes reales. |
| Validar entorno externo | URL, commit, job de CI y health check con secretos resguardados. |

## Historial de cambios

| Versión | Fecha | Cambio |
|---|---|---|
| 1.0.0 | 23/11/2026 | Consolidación basada en retrospectivas y validaciones existentes. |
