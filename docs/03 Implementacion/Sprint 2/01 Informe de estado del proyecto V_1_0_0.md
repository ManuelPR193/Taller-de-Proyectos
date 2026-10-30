[← Volver al README Principal](../../../README.md)

# Informe de Estado del Proyecto — Sprint 2

| Campo | Detalle |
|---|---|
| **Proyecto** | EcoLogística Huancayo — Optimizador de Rutas Sostenibles para "DistriRápido S.A.C." |
| **Sprint** | 2 (semanas 4 a 7) |
| **Versión del documento** | 1.0.0 |
| **Fecha** | 2026-10-09 |
| **Elaborado por** | Equipo del proyecto |
| **Equipo** | Manuel Yeferson Parraga Recuay, Sheila Suarez Suarez, David André Guevara Moscoso, Jair Felix Romero |
| **Docente** | Job Daniel Gamarra Moreno |

---

## 1. Resumen Ejecutivo

El Sprint 2 completó autenticación, control de acceso por rol, registro de conductores y operación de pedidos desde la interfaz. Los cinco perfiles disponen de navegación diferenciada. La evidencia funcional está cubierta por pruebas locales.

## 2. Sprint Goal

> "Permitir el acceso seguro al sistema con una pantalla propia por rol, y registrar conductores y pedidos desde la interfaz."

## 3. Estado General del Proyecto

| Dimensión | Estado (🟢 / 🟡 / 🔴) | Observaciones |
|---|---|---|
| Alcance | 🟢 | Funcionalidades del sprint implementadas |
| Cronograma | 🟢 | Incremento disponible |
| Costo | 🟢 | Sin costo adicional registrado |
| Calidad | 🟢 | Pruebas locales aprobadas |
| Riesgos | 🟡 | Evidencia de Jira depende de acceso externo |

## 4. Avance del Backlog del Sprint

| ID | Elemento | Tipo | Story Points | Estado |
|---|---|---|---|---|
| EN-02 | Login y control de acceso por rol (RBAC) | Enabler | 5 | Hecho |
| US-011 | Agregar conductor | Historia | 3 | Hecho |
| US-003 | Agregar pedido desde la pantalla de operación | Historia | 5 | Hecho |
| — | Pantalla de inicio por rol (Administrador, Operador, Conductor, Cliente, Auditor) | Historia | 5 | Hecho |

**Requisitos involucrados:** RF-002, RF-008, RNF-002, RNF-005, RNF-009, RN-001, RN-003, RN-005, RN-006

## 5. Métricas del Sprint

| Métrica | Valor |
|---|---|
| Story Points comprometidos | 18 |
| Story Points completados | 18 |
| Velocidad del equipo | 18 SP |
| Porcentaje de cumplimiento del Sprint Goal | 100 % |
| Defectos encontrados / corregidos | 2 / 2 |

## 6. Logros del Periodo

- Autenticación y autorización RBAC verificadas por API.
- Interfaces de conductores, pedidos y portales por rol disponibles.

## 7. Riesgos e Impedimentos

Ver `02 Registro de Impedimentos V_1_0_0.md` y el Registro de Riesgos de `docs/02 Planificación/`.

| ID | Descripción | Severidad | Estado |
|---|---|---|---|
| IMP-01 | No se dispone de exportación o capturas del tablero Jira | Baja | Abierto externo |

## 8. Próximos Pasos

- Preparar mapa, dashboard y reportes del Sprint 3 — equipo — 2026-10-26

## 9. Decisiones Tomadas

| Fecha | Decisión | Responsable |
|---|---|---|
| 2026-10-09 | Mantener la trazabilidad técnica en Git mientras se obtiene Jira | Equipo del proyecto |

## Historial de Control de Cambios

| Versión | Fecha | Autor | Descripción del cambio |
|---|---|---|---|
| 1.0.0 | 2026-10-09 | Equipo del proyecto | Información completada con evidencia del repositorio |
