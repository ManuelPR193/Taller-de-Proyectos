# Validación del Sprint 2 — 29 de octubre de 2026

## Dictamen

**Incremento funcional aprobado; pipeline preparado.** La generación y reoptimización cubren restricciones, escenarios infelices y avería de vehículo. El workflow de CI/CD contiene los controles del DoD y despliegue a staging, cuya primera ejecución depende de configurar secretos del repositorio y del clúster.

| Elemento | Estado | Evidencia |
|---|---|---|
| US-005 | Aprobada | Rutas viales optimizadas, capacidad, ventanas, conductor, vehículo, emisiones y no asignados. Benchmark 150/15 en 18,806 s. |
| US-006 — express | Aprobada | Inserción con capacidad, sin duplicados y sin mover paradas entregadas. |
| US-006 — avería | Aprobada | Al marcar mantenimiento se cancela la ruta afectada y sus entregas pendientes se reasignan a un vehículo disponible. |
| EN-02 | Aprobado en aplicación | JWT autenticado, RBAC, CORS limitado y DNI cifrado en reposo con AES-256-GCM; migración de datos legados. TLS 1.3 se termina en el Ingress de staging. |
| EN-06 | Implementado | Workflow con cobertura ≥80%, Bandit, `pip-audit`, `npm audit`, build, benchmark y navegador. El despliegue a staging es manual y condicionado a secretos. |

Resultados reproducidos el 30 de octubre: 54 pruebas backend, 89% de cobertura, tres pruebas frontend, build correcto, cero vulnerabilidades conocidas en las auditorías y cero hallazgos Bandit medios/altos.

La aprobación humana del Pull Request y el despliegue real no se pueden sustituir desde el repositorio; el workflow queda listo para producir esas evidencias.
