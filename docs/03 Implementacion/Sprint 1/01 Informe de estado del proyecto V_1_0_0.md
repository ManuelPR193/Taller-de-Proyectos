[← Volver al README Principal](../../../README.md)

# Informe de Estado del Proyecto — Sprint 1

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

## 1. Resumen Ejecutivo

El Sprint 1 dejó operativos los módulos de vehículos y pedidos, con validaciones y persistencia local. Las historias US-001 a US-004 están implementadas y probadas. EN-01 y EN-03 conservan su alcance, pero su validación de autoescalamiento y failover requiere infraestructura externa.

## 2. Sprint Goal

> "Contar con la infraestructura base desplegada (auto-escalamiento y failover) y el módulo de gestión de flota y pedidos operativo, sentando las bases para el motor de optimización de rutas."

## 3. Estado General del Proyecto

| Dimensión | Estado (🟢 / 🟡 / 🔴) | Observaciones |
|---|---|---|
| Alcance | 🟡 | Historias funcionales completas; EN-01 y EN-03 pendientes de entorno |
| Cronograma | 🟢 | Incremento funcional disponible |
| Costo | 🟢 | Sin costo adicional registrado |
| Calidad | 🟢 | Pruebas locales aprobadas |
| Riesgos | 🟡 | Infraestructura de producción no validada |

## 4. Avance del Backlog del Sprint

| ID | Elemento | Tipo | Story Points | Estado |
|---|---|---|---|---|
| EN-01 | Auto-escalamiento del backend | Enabler | 8 | No completado: requiere staging |
| EN-03 | Failover de base de datos | Enabler | 5 | No completado: requiere staging |
| US-001 | Registrar vehículo de la flota | Historia | 3 | Hecho |
| US-002 | Actualizar datos de un vehículo | Historia | 3 | Hecho |
| US-003 | Registrar pedido con punto de referencia | Historia | 5 | Hecho |
| US-004 | Consultar estado de un pedido | Historia | 3 | Hecho |

**Requisitos involucrados:** RF-001, RF-002, RNF-001, RNF-003, RNF-008

## 5. Métricas del Sprint

| Métrica | Valor |
|---|---|
| Story Points comprometidos | 27 |
| Story Points completados | 14 |
| Velocidad del equipo | 14 SP |
| Porcentaje de cumplimiento del Sprint Goal | 52 % |
| Defectos encontrados / corregidos | 2 / 2 |

## 6. Logros del Periodo

- CRUD de vehículos y pedidos funcionando con reglas de negocio.
- Base de datos y API reproducibles en el entorno local.

## 7. Riesgos e Impedimentos

Ver `02 Registro de Impedimentos V_1_0_0.md` y el Registro de Riesgos de `docs/02 Planificación/`.

| ID | Descripción | Severidad | Estado |
|---|---|---|---|
| IMP-01 | Autoescalamiento y failover sin entorno de staging | Alta | Abierto externo |

## 8. Próximos Pasos

- Validar EN-01 y EN-03 en staging — equipo — antes del cierre externo

## 9. Decisiones Tomadas

| Fecha | Decisión | Responsable |
|---|---|---|
| 2026-09-25 | Aceptar el incremento funcional y mantener EN-01/EN-03 como validación externa | Equipo del proyecto |

## Historial de Control de Cambios

| Versión | Fecha | Autor | Descripción del cambio |
|---|---|---|---|
| 1.0.0 | 2026-09-25 | Equipo del proyecto | Información completada con evidencia del repositorio |
