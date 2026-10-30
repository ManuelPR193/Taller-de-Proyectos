[← Volver](README.md)

# Control de Cambios del Alcance

**Fecha de corte:** 2026-10-30 · **Responsable:** Equipo del proyecto

| ID | Cambio | Motivo | Impacto | Estado |
|---|---|---|---|---|
| CC-01 | Incorporar rutas viales Dijkstra antes del VRPTW | Evitar geometría recta ficticia | Mayor precisión y dependencia inicial de OSM | Implementado |
| CC-02 | Añadir portales de cliente, conductor y auditor | Aislar información por rol | Nuevas guardas frontend/backend | Implementado |
| CC-03 | Añadir R*Tree y consulta viewport | EN-05 | Mejora local 98,9%; consulta portable PostgreSQL | Implementado |
| CC-04 | Separar pruebas unitarias de OSM | CI agotaba seis horas | Suite determinista en aproximadamente 50 s | Implementado |
| CC-05 | Hacer staging manual | No existen secretos en el repositorio | Evita despliegues falsos/fallidos | Aprobado técnicamente |
| CC-06 | Limitar credenciales demo a Vite DEV | Reducir exposición en producción | Pruebas de navegador rellenan credenciales explícitamente | Implementado |

Los cambios no eliminan requisitos funcionales; ajustan evidencia, seguridad y reproducibilidad.
