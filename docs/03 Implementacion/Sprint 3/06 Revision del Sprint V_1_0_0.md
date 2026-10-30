[← Volver al README Principal](../../../README.md)

# Revisión del Sprint — Sprint 3

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

## 1. Objetivo de la Revisión

Presentar al docente y a los interesados el incremento construido en el Sprint 3 y contrastarlo con el Sprint Goal.

> "Visualizar las rutas generadas en un mapa interactivo, mostrar los indicadores de sostenibilidad en un dashboard y generar el reporte descargable, validando cada funcionalidad con pruebas."

## 2. Asistentes

| Nombre | Rol |
|---|---|
| Job Daniel Gamarra Moreno | Docente / Evaluador; validación externa pendiente |
| Equipo del proyecto | Revisión técnica interna |

## 3. Agenda

| Tiempo | Actividad | Responsable |
|---|---|---|
| 0-5 min | Recordar el Sprint Goal y los elementos comprometidos | Scrum Master |
| 5-25 min | Demostración del incremento | Equipo de desarrollo |
| 25-32 min | Comparación entre lo planificado y lo entregado | Project Manager |
| 32-38 min | Retroalimentación de los interesados | Interesados |
| 38-40 min | Ajustes al backlog del siguiente sprint | Equipo |

## 4. Incremento Presentado

| ID | Elemento | Tipo | Story Points | Estado |
|---|---|---|---|---|
| US-007 | Visualizar la ruta asignada en el mapa (modo conductor) | Historia | 5 | Hecho; DoD técnico aprobado |
| US-008 | Visualizar el nivel de congestión por tramo | Historia | 5 | Hecho; DoD técnico aprobado |
| US-009 | Consultar el dashboard de sostenibilidad | Historia | 8 | Hecho; DoD técnico aprobado |
| US-010 | Descargar el reporte de sostenibilidad en PDF | Historia | 5 | Hecho; DoD técnico aprobado |
| EN-05 | Optimizar consultas SQL con índices geoespaciales | Enabler | 5 | Hecho local; repetir en PostgreSQL |

## 5. Elementos No Completados

| ID | Motivo | Decisión (reprogramar / descartar) |
|---|---|---|
| Ninguno técnico | Staging, PostgreSQL y prueba con usuarios son validaciones externas | Reprogramar validación externa |

## 6. Retroalimentación Recibida

| Interesado | Comentario | Acción derivada |
|---|---|---|
| Revisión técnica interna | Se demostró mapa, congestión, dashboard, estado vacío y PDF; 54 pruebas backend, 3 frontend y 9 casos de navegador aprobaron | Publicar resultados de CI y repetir la demostración con docente y stakeholders |

## 7. Ajustes al Backlog

- Corregir CI no determinista y dejar el despliegue bajo ejecución manual.

## 8. Acuerdos

- No atribuir PR, Jira, staging ni usuarios reales sin evidencia verificable.

## Historial de Control de Cambios

| Versión | Fecha | Autor | Descripción del cambio |
|---|---|---|---|
| 1.0.0 | 2026-10-30 | Equipo del proyecto | Información completada con evidencia del repositorio |
