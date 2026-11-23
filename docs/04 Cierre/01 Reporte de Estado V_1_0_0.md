[← Volver al README principal](../../README.md)

# Reporte de Estado del Proyecto

**Proyecto:** EcoLogística Huancayo — DistriRápido S.A.C.
**Periodo:** cierre técnico local, con corte al 23/11/2026
**Versión:** 1.0.0
**Fuentes:** documentación de Sprints 1–4, presupuesto académico, seguimiento y validaciones reproducibles del repositorio.

> **Estado general: ÁMBAR.** El producto y sus pruebas locales están disponibles. La consigna de cierre no queda satisfecha al 100 % mientras falten costos reales, línea base EVM por periodo, exportaciones/capturas de radiadores, video MP4 y aceptación externa. Los estados no representan un despliegue productivo.

## 1. Alcance

**Logros comprobables:** API FastAPI y SPA React; autenticación por roles; gestión de flota, conductores, clientes y pedidos; generación y consulta de rutas; confirmación GPS; mapas, indicadores y PDF; 54 pruebas backend, cobertura local de 90 %, 3 pruebas frontend y 27 pruebas E2E aprobadas en tres motores al corte de validación local. La interfaz de inicio de sesión recibió un rediseño visual en la rama `redesign/taste-ecologistica`.

**Cambios al alcance:** los cambios CC-01 a CC-06 están registrados en [Control de cambios](../05%20Seguimiento%20y%20Control/02%20Control%20de%20cambios%20V_1_0_0.md). La reoptimización vial, el aislamiento de datos por rol, el índice espacial y la separación de dependencias de red se describen allí. No se encontró acta que apruebe una nueva línea base de costo o calendario.

**Calidad / incidencias abiertas:** las verificaciones locales pasan. Falta validar el despliegue en PostgreSQL/staging, documentar una corrida exitosa de GitHub Actions posterior a este corte y completar validaciones con usuarios. El resultado SUS de 87,0 está documentado como cálculo, pero el repositorio no contiene formularios fuente ni acta de aplicación.

## 2. Cronograma

| Plan de referencia | Evidencia fechada en repositorio | Estado / variación |
|---|---|---|
| 4 iteraciones en 14 semanas; hitos expresados por semana en el acta | Sprint 1: 25/09; Sprint 2: 09/10; Sprint 3: 30/10; evidencia técnica Sprint 4: 20/11/2026 | Los informes registran fechas reales, pero el acta no asigna fechas de calendario a los hitos. La desviación en días y la ruta crítica son N/D. |
| Sprint 1: 27 SP comprometidos | 14 SP completados, según informe del Sprint 1 | 13 SP no completados en ese corte (48,1 %). La causa documentada es que EN-01/EN-03 requerían staging; no hay serie diaria. |
| Sprint 2: 18 SP comprometidos | 18 SP completados, según informe del Sprint 2 | 0 SP de variación en el reporte. |
| Sprint 3: 28 SP comprometidos | 28 SP completados, según informe del Sprint 3 | 0 SP de variación en el reporte. |
| Sprint 4 | La revisión registra 27 pruebas E2E aprobadas el 20/11; no registra compromiso ni velocidad del sprint | Variación de alcance/tiempo N/D. No atribuir historias sin backlog exportado. |

**Causa e impacto:** la ausencia de fechas calendario en la línea base y de exportación del backlog impide comparar duración planificada y real, calcular ruta crítica o afirmar adelanto/retraso exacto. Mantener esa limitación explícita y agregar fechas y puntos aceptados desde el tablero original.

**Acción:** publicar una línea base versionada con inicio, fin, hitos, responsables y dependencias; adjuntar exportación Jira/GitHub Projects aprobada por el equipo.

## 3. Costos

**Fondos ejecutados en este periodo:** no medidos ni registrados en el repositorio. Las retrospectivas anotan “sin costo adicional registrado”; eso no equivale a una medición contable de costo real.

**Línea de referencia:** el presupuesto detallado estima S/ 11 319, de los cuales S/ 10 190 son costo de oportunidad de 560 horas y S/ 100 infraestructura, más S/ 1 029 de contingencia. El acta de constitución presenta una estimación académica distinta de S/ 0–250. No hay constancia de aprobación del cambio ni registro de horas trabajadas. Por tanto, S/ 11 319 no se declara como BAC aprobado y no se calcula variación real.

**Causa / impacto:** no se capturaron horas reales, recibos ni consumo de servicios. No es posible separar variación por esfuerzo, herramientas o infraestructura ni calcular consumo de contingencia.

**Acción:** conciliar la línea base (incluida la diferencia entre esfuerzo académico y desembolso) y completar horas/costos desde registros del equipo antes de emitir EVM.

## 4. Proyección (Look Ahead)

| Trabajo pendiente | Costo planificado disponible |
|---|---|
| Ejecutar y archivar CI en GitHub; validar PostgreSQL/staging; aportar Jira; aplicar SUS con formularios anonimizados; demo y aceptación externa; completar video MP4 de 5 min | No recalculable: no hay horas pendientes ni costos unitarios validados. La reserva S/ 1 029 es estimada, no se confirma como saldo disponible. |

## 5. Riesgos, incidentes y comentarios

- **Riesgo externo vigente:** infraestructura, CI remoto, datos de Jira y aceptación de interesados dependen de secretos, permisos y evidencias que no están en el repositorio.
- **Incidente de planificación documental:** el acta y el presupuesto detallado presentan bases académicas diferentes; resolverlo antes de usar BAC/EAC.
- **Video:** no se encontró archivo MP4 en `docs/05 Video proyecto`; el guion sugerido no constituye grabación.
- **Comentario:** los resultados del producto en esta revisión son locales. No afirmar producción, satisfacción de interesados ni emisiones reales reducidas sin evidencia.

### Acciones correctivas prioritarias

1. Capturar horas, costos reales, calendario base aprobado y reglas de valor ganado.
2. Exportar radiadores reales y backlog; no reconstruir capturas como si fueran de Jira.
3. Grabar la exposición y demostración funcional con integrantes/equipo, y validar el MP4 antes de subirlo.
4. Ejecutar CI remota y staging cuando existan secretos y entorno autorizados.

## Historial de cambios

| Versión | Fecha | Cambio |
|---|---|---|
| 1.0.0 | 23/11/2026 | Informe de estado del corte; separa evidencia local de pendientes externos. |
