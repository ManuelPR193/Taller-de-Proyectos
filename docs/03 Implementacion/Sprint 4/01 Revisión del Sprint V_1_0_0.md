[← Volver al README principal](../../../README.md)

# Revisión del sprint

**Nombre del Proyecto:** EcoLogística Huancayo — Optimizador de Rutas Sostenibles para DistriRápido S.A.C.

**Líder del Proyecto:** Manuel Yeferson Parraga Recuay

## Historias de Usuario completadas en este Sprint

El repositorio permite verificar el incremento técnico del Sprint 4, pero **no permite atribuir con seguridad las historias US-011 y US-012 a ese sprint**. Su código ya existía antes del commit de cierre del Sprint 4. Los enlaces a commits usados anteriormente en este documento (`adc9a5c`, `15432e9`, `aefab44`, `38e5a72`) modifican documentación ambiental y no prueban la implementación de esas historias. Se retiran como evidencia de aceptación.

| Código | Entrega verificable | Criterio comprobable | Evidencia |
|---|---|---|---|
| EN-06 | Tres flujos GitHub Actions | Existen archivos separados para compilación, pruebas y despliegue | [Commit de cierre 76645e4](https://github.com/ManuelPR193/Taller-de-Proyectos/commit/76645e4), [ci.yml](../../../.github/workflows/ci.yml), [tests.yml](../../../.github/workflows/tests.yml), [deploy-production.yml](../../../.github/workflows/deploy-production.yml) |
| QA-E2E | Suite Playwright para tres motores | 27 pruebas ejecutadas localmente con API sembrada; 27 aprobadas el 20/11/2026 | [Código E2E](../../../frontend/e2e/), [configuración](../../../frontend/playwright.config.ts), [informe](03%20Analisis%20PlayWrigth%20V_1_0_0.md) |
| DOC-S4 | Revisión, retrospectiva, pruebas y usabilidad | Cuatro documentos Markdown enlazados desde el README | [Commit de cierre 76645e4](https://github.com/ManuelPR193/Taller-de-Proyectos/commit/76645e4), [README](../../../README.md) |

Los códigos `QA-E2E` y `DOC-S4` identifican entregables técnicos en esta revisión; **no son historias de usuario del backlog**. Para cerrar el requisito de trazabilidad al 100 %, el equipo debe aportar el backlog de Sprint 4 y vincular cada historia a su PR o commit real y a sus criterios de aceptación comprobados.

## Demostración del trabajo completado

La demostración **reproducible en entorno local** consiste en sembrar la base de datos de prueba, iniciar FastAPI, construir el frontend y ejecutar `npx playwright test` desde `frontend/`. Se verificaron autenticación, navegación entre módulos, mapa, indicadores obtenidos de la API, respuesta de `/api/health` y reacción del panel ante un fallo de red simulado. El reporte HTML se genera en `frontend/playwright-report/index.html` y `tests.yml` lo publica como artefacto cuando se ejecute en GitHub Actions.

Además, `docker build -t ecologistica-sprint4-local .` terminó correctamente el 20/11/2026. El contenedor iniciado con configuración local respondió HTTP 200 en `/api/health` y `/login`, y Docker informó estado `healthy`. Esta prueba acredita empaquetado y arranque local, no despliegue público.

No hay en el repositorio un acta, grabación, captura o lista de asistentes que demuestre una sesión con el docente o representantes de DistriRápido. Tampoco se verificó una URL de staging o producción. La demostración ante interesados y su retroalimentación se mantienen como **evidencia pendiente**, sin atribuirles aprobación.

## Pendientes

1. **Trazabilidad del backlog:** identificar las historias realmente comprometidas para Sprint 4 y asociarlas a cambios y pruebas específicos.
2. **Demostración a interesados:** anexar acta, fecha, asistentes, entorno y retroalimentación verificable.
3. **Usabilidad:** conservar formularios SUS anonimizados o acta de aplicación; la matriz documentada aún carece de evidencia de campo.
4. **Rendimiento y disponibilidad:** registrar Lighthouse, tiempos de API y uptime en un entorno desplegado; las mediciones locales de Playwright no prueban disponibilidad de producción.
5. **Despliegue:** configurar `PRODUCTION_DEPLOY_HOOK` y `PRODUCTION_URL` como GitHub Secrets, ejecutar el flujo y conservar la URL y el resultado de salud. El workflow ahora falla explícitamente si faltan secretos o falla el health check.

[← Volver al README principal](../../../README.md)
