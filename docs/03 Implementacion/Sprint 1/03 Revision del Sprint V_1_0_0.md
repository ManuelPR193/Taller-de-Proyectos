[← Volver al README Principal](../../../README.md)

# Revisión del Sprint — Sprint 1

| Campo | Detalle |
|---|---|
| **Proyecto** | EcoLogística Huancayo — Optimizador de Rutas Sostenibles para "DistriRápido S.A.C." |
| **Sprint** | 1 (semanas 1 a 3) |
| **Versión del documento** | 1.0.0 |
| **Fecha** | 2026-09-25 |
| **Elaborado por** | Equipo del proyecto |
| **Equipo** | Manuel Yeferson Parraga Recuay, Sheila Suarez Suarez, David André Guevara Moscoso, Jair Felix Romero |
| **Docente** | Job Daniel Gamarra Moreno |

---

## 1. Objetivo de la Revisión

Presentar al docente y a los interesados el incremento construido en el Sprint 1 y contrastarlo con el Sprint Goal.

> "Contar con la infraestructura base desplegada (auto-escalamiento y failover) y el módulo de gestión de flota y pedidos operativo, sentando las bases para el motor de optimización de rutas."

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
| EN-01 | Auto-escalamiento del backend | Enabler | 8 | No completado: requiere staging |
| EN-03 | Failover de base de datos | Enabler | 5 | No completado: requiere staging |
| US-001 | Registrar vehículo de la flota | Historia | 3 | Hecho |
| US-002 | Actualizar datos de un vehículo | Historia | 3 | Hecho |
| US-003 | Registrar pedido con punto de referencia | Historia | 5 | Hecho |
| US-004 | Consultar estado de un pedido | Historia | 3 | Hecho |

## 5. Elementos No Completados

| ID | Motivo | Decisión (reprogramar / descartar) |
|---|---|---|
| EN-01 / EN-03 | Falta entorno externo para medir autoescalamiento y failover | Reprogramar validación en staging |

## 6. Retroalimentación Recibida

| Interesado | Comentario | Acción derivada |
|---|---|---|
| Revisión técnica interna | CRUD y reglas funcionales aprobadas; falta validación de infraestructura | Mantener EN-01 y EN-03 abiertos |

## 7. Ajustes al Backlog

- Priorizar una prueba reproducible de infraestructura cuando exista staging.

## 8. Acuerdos

- No declarar EN-01 ni EN-03 como terminados sin evidencia externa.

## Historial de Control de Cambios

| Versión | Fecha | Autor | Descripción del cambio |
|---|---|---|---|
| 1.0.0 | 2026-09-25 | Equipo del proyecto | Información completada con evidencia del repositorio |
