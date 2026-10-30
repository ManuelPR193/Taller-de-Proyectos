[← Volver al README Principal](../../../README.md)

# Informe de Estado del Proyecto — Sprint 3

| Campo | Detalle |
|---|---|
| **Proyecto** | EcoLogística Huancayo — Optimizador de Rutas Sostenibles para "DistriRápido S.A.C." |
| **Sprint** | 3 (semanas 8 a 11) |
| **Versión del documento** | 1.0.0 |
| **Fecha** | 2026-10-30 |
| **Elaborado por** | Equipo del proyecto |
| **Equipo** | Manuel Yeferson Parraga Recuay, Sheila Suarez Suarez, David André Guevara Moscoso, Jair Felix Romero |
| **Docente** | Job Daniel Gamarra Moreno |

---

## 1. Resumen Ejecutivo

El Sprint 3 completó mapa de rutas, congestión por tramo, dashboard, PDF e índice espacial. Se aprobaron 54 pruebas backend, 3 pruebas frontend y 9 verificaciones de navegador. La cobertura backend fue 89%; staging y validaciones con usuarios reales siguen siendo evidencia externa.

## 2. Sprint Goal

> "Visualizar las rutas generadas en un mapa interactivo, mostrar los indicadores de sostenibilidad en un dashboard y generar el reporte descargable, validando cada funcionalidad con pruebas."

## 3. Estado General del Proyecto

| Dimensión | Estado (🟢 / 🟡 / 🔴) | Observaciones |
|---|---|---|
| Alcance | 🟢 | Historias y enabler implementados |
| Cronograma | 🟢 | Incremento técnico completado |
| Costo | 🟢 | Sin costo adicional registrado |
| Calidad | 🟢 | 54 backend, 3 frontend y navegador aprobados |
| Riesgos | 🟡 | Staging y usuarios reales pendientes |

## 4. Avance del Backlog del Sprint

| ID | Elemento | Tipo | Story Points | Estado |
|---|---|---|---|---|
| US-007 | Visualizar la ruta asignada en el mapa (modo conductor) | Historia | 5 | Hecho |
| US-008 | Visualizar el nivel de congestión por tramo | Historia | 5 | Hecho |
| US-009 | Consultar el dashboard de sostenibilidad | Historia | 8 | Hecho |
| US-010 | Descargar el reporte de sostenibilidad en PDF | Historia | 5 | Hecho |
| EN-05 | Optimizar consultas SQL con índices geoespaciales | Enabler | 5 | Hecho local; repetir en PostgreSQL |

**Requisitos involucrados:** RF-004, RF-005, RF-006, RNF-001, RNF-006, RNF-009, RNF-010, RN-007, RN-008, RN-009

## 5. Métricas del Sprint

| Métrica | Valor |
|---|---|
| Story Points comprometidos | 28 |
| Story Points completados | 28 |
| Velocidad del equipo | 28 SP |
| Porcentaje de cumplimiento del Sprint Goal | 100 % |
| Defectos encontrados / corregidos | 3 / 3 |

## 6. Logros del Periodo

- Mapa, tráfico, dashboard y PDF validados en navegador.
- Cobertura de 89% y mejora R*Tree de 98,9% en benchmark local.

## 7. Riesgos e Impedimentos

Ver `02 Registro de Impedimentos V_1_0_0.md` y el Registro de Riesgos de `docs/02 Planificación/`.

| ID | Descripción | Severidad | Estado |
|---|---|---|---|
| IMP-01 | Pruebas dependían de OSM y bloqueaban CI | Alta | Resuelto |

## 8. Próximos Pasos

- Ejecutar validación final en GitHub Actions y staging — equipo — 2026-10-30

## 9. Decisiones Tomadas

| Fecha | Decisión | Responsable |
|---|---|---|
| 2026-10-30 | Usar red determinista en pruebas y dejar despliegue como acción manual | Equipo del proyecto |

## Historial de Control de Cambios

| Versión | Fecha | Autor | Descripción del cambio |
|---|---|---|---|
| 1.0.0 | 2026-10-30 | Equipo del proyecto | Información completada con evidencia del repositorio |
