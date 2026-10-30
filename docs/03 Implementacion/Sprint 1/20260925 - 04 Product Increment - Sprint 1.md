[← Volver al README Principal](../../../README.md)

# Product Increment — Sprint 1

**Proyecto:** EcoLogística Huancayo — Optimizador de Rutas Sostenibles para "DistriRápido S.A.C."
**Fecha de inicio:** 25 de septiembre de 2026 | **Duración:** 2 semanas
**Sprint Goal:** "Contar con la infraestructura base desplegada (auto-escalamiento y failover) y el módulo de gestión de flota y pedidos operativo, sentando las bases para el motor de optimización de rutas del Sprint 2."

---

## 1. Elementos Comprometidos para el Sprint 1

| Elemento | Tipo | Story Points | Estado al Inicio |
|---|---|---|---|
| EN-01 Auto-escalamiento del backend | Enabler | 8 | Por Hacer |
| EN-03 Failover de base de datos | Enabler | 5 | Por Hacer |
| US-001 Registrar vehículo de la flota | Historia | 3 | Por Hacer |
| US-002 Actualizar datos de un vehículo existente | Historia | 3 | Por Hacer |
| US-003 Registrar pedido con punto de referencia | Historia | 5 | Por Hacer |
| US-004 Consultar estado de mi pedido | Historia | 3 | Por Hacer |
| **Total comprometido** | | **27 pts** | |

## 2. Incremento de Producto Esperado

Al cierre del Sprint 1, el sistema debe permitir de punta a punta:

1. Autenticarse en la plataforma con control de acceso por rol (RBAC).
2. Registrar y actualizar vehículos de la flota, con validación de datos (placa, capacidad, consumo, factor de emisión).
3. Registrar un pedido, incluyendo pedidos con puntos de referencia no estandarizados propios de zonas altas de Huancayo.
4. Consultar el estado de un pedido registrado.
5. Contar con la infraestructura desplegada en Staging con auto-escalamiento y failover de base de datos activos.

Este incremento es **funcional y demostrable**: no se trata de código aislado, sino de un conjunto de pantallas y endpoints integrados y navegables (ver `20260925 - 03 Mapa de navegación.md`), listo para ser mostrado en la Revisión del Sprint.

## 3. Trazabilidad con el Backlog y la Arquitectura

- La base de datos utilizada corresponde al modelo físico definido en `20260925 - 02 Diseño de la base de datos.md` (tablas `usuarios`, `vehiculos`, `clientes`, `pedidos`).
- Los componentes desplegados corresponden al alcance arquitectónico descrito en `20260925 - 01 Arquitectura de software.md`, sección 5.
- El cumplimiento del Definition of Done global (`docs/02 Planificación/01 Transformando a ágil V_1_0_0.md`, sección D) es condición obligatoria para que cualquiera de estos elementos se declare "Done" en el tablero Scrum.

## 4. Checklist de Cierre del Incremento

- **Cumple en la suite consolidada:** cobertura backend 89%, superior al 80%.
- **Cumple con las herramientas ejecutadas:** Bandit sin hallazgos medios/altos y auditorías de dependencias sin vulnerabilidades conocidas.
- **No existe evidencia:** el repositorio no contiene Pull Requests; el peer review humano queda pendiente.
- **Pendiente externo:** staging requiere clúster y secretos que no están en el repositorio.
- **Cumple:** OpenAPI/Swagger se genera desde FastAPI para los endpoints publicados.
- **Cumple localmente:** los elementos funcionales tienen pruebas; EN-01 y EN-03 requieren aceptación de infraestructura.

Este cierre diferencia implementación local, evidencia automatizada y aceptación externa.
