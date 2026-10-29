# Validación general de Sprints — 29 de octubre de 2026

| Sprint | Incremento de software | Pruebas locales | Evidencia externa |
|---|---|---|---|
| Sprint 1 | Completo | Aprobadas | HPA/failover en staging y acta humana pendientes |
| Sprint 2 | Completo | Aprobadas | Primera ejecución del pipeline y revisión de PR pendientes |
| Sprint 3 | Completo | 12/12 aprobadas | Repetición 3G/PostgreSQL en staging recomendada |

## Definition of Done verificable en el repositorio

- Cobertura backend: 91%, superior al 80%.
- Pruebas: 54 backend, 3 frontend y aceptación de navegador.
- Análisis estático: cero hallazgos Bandit medios/altos.
- Dependencias: auditorías Python y JavaScript sin vulnerabilidades conocidas en sus últimas ejecuciones completas.
- Compilación de producción: correcta.
- Contenedor, HPA, alta disponibilidad PostgreSQL, TLS y despliegue de staging: configurados.
- Evidencias publicadas por CI: cobertura, JSON de aceptación, capturas y build.

## Controles que requieren personas o infraestructura externa

No se marcan artificialmente como ejecutados:

1. Aprobación de Peer Review mediante Pull Request.
2. Capturas y estado final del tablero Jira.
3. Prueba guiada con diez conductores reales.
4. Ejecución de failover, autoescalamiento y `EXPLAIN ANALYZE` sobre el clúster de staging.

El repositorio contiene las implementaciones, scripts y procedimientos para generar esas cuatro evidencias cuando estén disponibles las cuentas y el clúster.
