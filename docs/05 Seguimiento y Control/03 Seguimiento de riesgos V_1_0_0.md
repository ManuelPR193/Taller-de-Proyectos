[← Volver](README.md)

# Seguimiento de Riesgos

**Fecha de corte:** 2026-10-30 · **Responsable:** Equipo del proyecto

| Riesgo | Exposición actual | Control | Estado |
|---|---|---|---|
| Dependencia de OSM/Overpass | Media | Caché para integración y red determinista para unidad | Mitigado |
| CI bloqueado o concurrente | Baja | Timeout 30 min y cancelación de ejecuciones anteriores | Mitigado; verificar push final |
| Falta de staging | Alta | Despliegue manual y lista de secretos | Abierto externo |
| Evidencias Jira/PR inexistentes | Media | Documentación transparente y solicitud a propietarios | Abierto externo |
| Bloqueo de login en memoria | Media | Tres intentos en instancia; plan de persistencia/Redis | Riesgo residual |
| JWT en localStorage | Media | CSP/validación y plan de cookie HttpOnly | Riesgo residual |
| PostgreSQL sin prueba de carga | Media | Índice compuesto y protocolo `EXPLAIN ANALYZE` | Abierto externo |
| Uso de credenciales demo | Baja | UI demo solo en desarrollo | Mitigado |

Los riesgos residuales se aceptan únicamente para el entorno académico/local y no deben trasladarse sin tratamiento a producción.
