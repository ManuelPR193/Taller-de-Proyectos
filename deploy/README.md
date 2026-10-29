# Despliegue y alta disponibilidad

El contenedor raíz sirve la SPA compilada y la API FastAPI como un único artefacto. `compose.yml` permite una ejecución local reproducible. Staging usa Kubernetes con dos réplicas mínimas, HPA de 2–10 réplicas, probes, presupuesto de disrupción e Ingress TLS.

La base de datos de staging se instala con el chart `bitnami/postgresql-ha` y `deploy/k8s/postgresql-ha-values.yaml`: tres nodos PostgreSQL administrados por repmgr y dos instancias Pgpool para conmutación automática. Las credenciales no se almacenan en Git; el pipeline crea `ecologistica-secrets` desde secretos protegidos.

Prueba de EN-01: ejecutar carga sobre `/api/v1/routes/generate`, observar `kubectl get hpa -n ecologistica-staging -w` y verificar el aumento/reducción de réplicas.

Prueba de EN-03: eliminar el pod primario de PostgreSQL, medir la recuperación mediante Pgpool y confirmar que `/api/health` y una consulta autenticada se recuperan en menos de 60 segundos. El ensayo debe ejecutarse en el clúster de staging y adjuntar su registro al acta del sprint.
