# Validación del Sprint 1 — 29 de octubre de 2026

## Dictamen

**Incremento funcional aprobado; infraestructura lista para aceptación en staging.** US-001 a US-004 están implementadas, aisladas por rol y cubiertas por pruebas. EN-01 y EN-03 cuentan con artefactos ejecutables, pero su aceptación final exige un clúster Kubernetes real y no se simula como aprobada.

| Elemento | Estado | Evidencia |
|---|---|---|
| US-001 | Aprobada | Alta de vehículo, datos positivos, año futuro rechazado y listado autenticado. |
| US-002 | Aprobada | Una placa existente actualiza el mismo vehículo sin duplicarlo. |
| US-003 | Aprobada | Pedido georreferenciado con referencia local; ventana/coordenadas inválidas rechazadas. |
| US-004 | Aprobada | Cliente ve únicamente su perfil, pedidos, estado, ETA y rutas asociadas. |
| EN-01 | Implementado | Deployment, HPA 2–10, límites, probes y PDB en `deploy/k8s/app.yaml`. Prueba de carga en staging pendiente de credenciales. |
| EN-03 | Implementado | PostgreSQL HA de tres nodos, Pgpool redundante y PDB. Ensayo de conmutación <60 s pendiente del clúster. |

Pruebas asociadas: creación/actualización de vehículo, año futuro, pedido válido/inválido, autenticación obligatoria, aislamiento de cliente y endpoint viewport.

No se adjuntaron capturas ficticias de Jira. Las capturas, aprobación de revisión y acta de negocio siguen siendo evidencias humanas externas.
