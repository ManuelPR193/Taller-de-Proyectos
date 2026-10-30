[← Volver al README Principal](../../README.md)

# Artefactos Jira — Evidencia de Configuración

**Proyecto:** EcoLogística Huancayo — Optimizador de Rutas Sostenibles para "DistriRápido S.A.C."
**Versión:** 1.0.0 | **Fecha:** 28 de agosto de 2026
**Herramienta:** Atlassian Jira Software (proyecto tipo Scrum)

> **Estado de evidencia:** la configuración se documenta a continuación, pero las capturas reales pertenecen a una cuenta externa de Jira y no están disponibles en el repositorio. No se incluyen imágenes simuladas. El propietario de la cuenta debe exportar Roadmap, Backlog, Sprint, Tablero y Releases antes de la aceptación académica.

---

## Configuración Previa Aplicada en Jira

| Parámetro | Valor Configurado |
|---|---|
| Nombre del proyecto | EcoLogística Huancayo |
| Tipo de proyecto | Scrum |
| Jerarquía de trabajo | Épica → Historia (Story) → Historia Técnica (Enabler/Task) → Subtarea (≤ 8 h) → Error (Bug) |
| Épicas creadas | EP-01 a EP-06 (ver Artefacto 1) + 6 Enablers técnicos |
| Estimación | Puntos de Historia — secuencia Fibonacci (1, 2, 3, 5, 8, 13) |
| Versión / Release | `v1.0.0-MVP` |
| Duración del Sprint | 2 semanas |

---

## Evidencia 1: Roadmap del Proyecto

Mapeo de las 6 Épicas (EP-01 a EP-06) y los 6 Enablers en la línea de tiempo del proyecto (Roadmap de Jira), distribuidos conforme a las 4 iteraciones del cronograma sugerido (`docs/01 Inicio/02. Acta de constitución V_1_0_0.md`, sección 5):

- Iteración 1 (semanas 1-3): EN-01, EN-03 (arquitectura base) y EP-01, EP-02 (flota y pedidos).
- Iteración 2 (semanas 4-7): EP-03 (motor de optimización) y EN-06 (CI/CD).
- Iteración 3 (semanas 8-11): EP-04, EP-05 (mapas y sostenibilidad) y EN-02, EN-05.
- Iteración 4 (semanas 12-14): EP-06, EN-04 y cierre/pruebas.

**Evidencia externa pendiente:** exportación del panel Roadmap de Jira.

---

## Evidencia 2: Backlog Priorizado

El backlog se ordenó de mayor a menor valor de negocio y riesgo técnico. Estimación referencial en Story Points (Fibonacci):

| Prioridad | Elemento | Tipo | Story Points |
|---|---|---|---|
| 1 | EN-01 Auto-escalamiento del backend | Enabler | 8 |
| 2 | EN-03 Failover de base de datos | Enabler | 5 |
| 3 | US-001 Registrar vehículo de la flota | Historia | 3 |
| 4 | US-003 Registrar pedido con punto de referencia | Historia | 5 |
| 5 | US-005 Generar rutas optimizadas del día | Historia | 13 |
| 6 | US-006 Re-optimizar rutas ante pedido urgente | Historia | 8 |
| 7 | EN-06 Pipeline CI/CD | Enabler | 5 |
| 8 | US-007 Visualizar ruta en mapa (conductor) | Historia | 5 |
| 9 | US-009 Dashboard de indicadores | Historia | 8 |
| 10 | EN-02 Cifrado de datos sensibles | Enabler | 3 |

**Evidencia externa pendiente:** exportación del Backlog con Story Points y etiquetas.

---

## Evidencia 3: Sprint Planning y Sprint Goal

**Sprint Goal (Sprint 1):**
> "Contar con la infraestructura base desplegada (auto-escalamiento y failover) y el módulo de gestión de flota y pedidos operativo, sentando las bases para el motor de optimización de rutas del Sprint 2."

**Ítems seleccionados para el Sprint 1** (duración: 2 semanas): EN-01, EN-03, US-001, US-002, US-003, US-004.

**Evidencia externa pendiente:** exportación de Sprint Planning y Sprint Goal.

---

## Evidencia 4: Tablero Scrum Activo

Flujo de trabajo configurado con las columnas: **To Do → In Progress → In Review / QA → Done**, reflejando el avance de las tarjetas del Sprint 1 en curso.

**Evidencia externa pendiente:** exportación del Tablero Scrum activo.

---

## Evidencia 5: Gestión de Versiones / Release

Versión oficial creada en Jira: **`v1.0.0-MVP`**, asociada a las Historias y Enablers priorizados para el primer incremento funcional del proyecto (correspondiente al alcance del MVP: RF-001 a RF-007, según el Acta de Constitución).

**Evidencia externa pendiente:** exportación del módulo Releases para `v1.0.0-MVP`.
