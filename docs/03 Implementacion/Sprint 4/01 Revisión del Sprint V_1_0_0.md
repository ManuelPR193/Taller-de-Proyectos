[← Volver al README Principal](../../../README.md)

# Revisión del sprint

**Nombre del Proyecto:** EcoLogística Huancayo — Optimizador de Rutas Sostenibles para "DistriRápido S.A.C."

**Líder del Proyecto:** Parraga Recuay Manuel Yeferson

## Historias de Usuario completadas en este Sprint

Durante el Sprint 4 (semanas 12 a 14) se consolidó la etapa de estabilización técnica, optimización avanzada, automatización completa de pruebas End-to-End y cierre del ciclo de entrega continua. A continuación se detallan las Historias de Usuario y Enablers técnicos terminados bajo el estándar Definition of Done (DoD):

| Código | Título | Criterios de Aceptación Verificados | Enlace de Trazabilidad (Commit / PR) |
|---|---|---|---|
| **US-011** | Registrar un conductor y disponibilidad horaria | Criterio 1: Registro exitoso con validación de categoría de licencia A-IIb y restricción de jornada máxima de 8 horas continuas (Ley N° 30224). Criterio 2: Rechazo preventivo de asignaciones que excedan la jornada legal o superpongan horarios de ruta. | [Commit adc9a5c](https://github.com/ManuelPR193/Taller-de-Proyectos/commit/adc9a5c) / [PR #1](https://github.com/ManuelPR193/Taller-de-Proyectos/pull/1) |
| **US-012** | Confirmar entrega desde el Modo Conductor | Criterio 1: Interfaz PWA móvil con geolocalización automática, botón de confirmación de entrega en un solo toque y registro de timestamp UTC-5. Criterio 2: Manejo de estado en desconexión o conectividad deficiente en zonas altas de Huancayo (Cochas/Chilca Alta) y sincronización reactiva al reconectar. | [Commit 15432e9](https://github.com/ManuelPR193/Taller-de-Proyectos/commit/15432e9) / [Commit 7ce4987](https://github.com/ManuelPR193/Taller-de-Proyectos/commit/7ce4987) |
| **EN-04** | Modo Conductor Accesible (WCAG 2.1 AA) | Criterio 1: Verificación de contraste cromático superior a 4.5:1 en elementos de texto y 3:1 en componentes gráficos interactivos. Criterio 2: Navegación completa por teclado accesible, áreas táctiles mínimas de 48x48 px y validación automatizada mediante axe-core sin errores críticos. | [Commit 7ce4987](https://github.com/ManuelPR193/Taller-de-Proyectos/commit/7ce4987) / [PR #1](https://github.com/ManuelPR193/Taller-de-Proyectos/pull/1) |
| **EN-06** | Pipeline de Integración y Despliegue Continuo (CI/CD) | Criterio 1: Modularización en 3 flujos independientes en GitHub Actions: `ci.yml` (lint y build), `tests.yml` (pruebas backend, frontend y Playwright E2E) y `deploy-production.yml` (despliegue automatizado vía Docker y webhook seguro). Criterio 2: Almacenamiento de reportes como artefactos descargables (`playwright-report` y `coverage.xml`). | [Commit aefab44](https://github.com/ManuelPR193/Taller-de-Proyectos/commit/aefab44) / [Commit 38e5a72](https://github.com/ManuelPR193/Taller-de-Proyectos/commit/38e5a72) |

## Demostración del trabajo completado

La demostración del incremento se llevó a cabo ante el docente evaluador y los representantes de "DistriRápido S.A.C." utilizando un entorno pre-productivo idéntico a producción (staging desplegado bajo Docker en Linux x86_64 y réplica de base de datos con topología del Valle del Mantaro):

1. **Flujo Demostrado 1 — Modo Conductor PWA y Confirmación de Entregas:**
   - Se exhibió la vista accesible para móviles `http://staging.ecologistica.pe/conductor` operada por un conductor simulado en ruta por Calle Real y Av. Huancavelica.
   - Se verificó la lectura de paradas en secuencia óptima, confirmación de entrega con captura de coordenadas GPS y actualización instantánea en el panel de monitoreo central.
2. **Flujo Demostrado 2 — Ejecución Automatizada de Suite Playwright E2E:**
   - Demostración en vivo de la ejecución de pruebas E2E cross-browser abarcando los motores Chromium, Firefox y WebKit.
   - Presentación de los reportes HTML con métricas Web Vitals (TTFB de 412 ms, FCP de 890 ms y LCP de 1.42 s), corroborando tiempos de respuesta de API inferiores al umbral de 500 ms.
3. **Flujo Demostrado 3 — Pipeline CI/CD en GitHub Actions:**
   - Ejecución de un commit en la rama de integración que disparó en paralelo la compilación, el análisis estático de vulnerabilidades (`bandit`, `pip-audit`), las 54 pruebas unitarias de backend, benchmarks Green Software (ISO/IEC 21031) y el empaquetado del contenedor de producción.
4. **Retroalimentación Recibida:**
   - Los interesados resaltaron la simplicidad del Modo Conductor, señalando que la tipografía de alto contraste reduce distracciones al volante en comparación con sistemas legados.
   - El docente evaluador aprobó la cobertura de pruebas y validó la trazabilidad entre el modelo C4, los requisitos funcionales iniciales y el incremento del Sprint 4.

## Pendientes

No existen Historias de Usuario funcionales comprometidas para el Sprint 4 en estado inconcluso. Sin embargo, se identificaron los siguientes aspectos de evolución y deuda técnica administrada para la fase de mantenimiento operativo:

1. **Evolución Geoespacial a PostGIS Nativo:**
   - *Estado actual:* La capa geoespacial opera eficientemente con índices espaciales R\*Tree en SQLite (desarrollo local) y consultas de filtrado por bounding-box optimizadas en PostgreSQL.
   - *Tratamiento posterior:* Migrar a la extensión PostGIS formal en PostgreSQL Cloud administrado una vez que se incremente el volumen a más de 5,000 pedidos diarios concurrentes.
2. **Telemetría IoT en Tiempo Real con Dispositivos OBD-II:**
   - *Estado actual:* El cálculo de consumo y emisiones se realiza mediante el modelo Green VRP calibrado a la altitud de Huancayo (3,259 m s. n. m.).
   - *Tratamiento posterior:* Integrar lecturas telemáticas directas de sensores de combustible mediante MQTT en una fase 2 post-académica.

---
[← Volver al README Principal](../../../README.md)
