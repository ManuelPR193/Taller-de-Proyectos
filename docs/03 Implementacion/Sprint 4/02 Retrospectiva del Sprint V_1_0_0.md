[← Volver al README Principal](../../../README.md)

# Retrospectiva del sprint

**Nombre del Proyecto:** EcoLogística Huancayo — Optimizador de Rutas Sostenibles para "DistriRápido S.A.C."

**Líder del Proyecto:** Parraga Recuay Manuel Yeferson

## ¿Qué aprendimos?

Durante el Sprint 4, el equipo consolidó importantes lecciones técnicas, metodológicas y de ingeniería de software:
- **Automatización de pruebas E2E con Playwright:** Aprendimos que orquestar pruebas multi-navegador (Chromium, Firefox, WebKit) en entornos CI/CD sin servidor gráfico (headless) requiere una sincronización precisa entre el levantamiento del backend FastAPI y la compilación/preview de Vite, evitando condiciones de carrera mediante sondeos de salud HTTP (`curl /api/health`).
- **Medición cuantitativa de usabilidad:** La matriz SUS de diez respuestas permite comprobar el cálculo, pero faltan formularios o acta para verificar la participación real. Se aprendió a separar cálculo documental de evidencia de campo.
- **Modularización de Flujos CI/CD:** La partición de un workflow monolítico en tres pipelines especializados (`ci.yml`, `tests.yml`, `deploy-production.yml`) optimizó los tiempos de cómputo en GitHub Actions y facilitó la identificación inmediata de fallos en etapas tempranas.

## ¿Qué estamos haciendo bien?

- **Pruebas reproducibles:** La ejecución local del 20/11/2026 aprobó 54 pruebas backend con 90 % de cobertura, tres pruebas frontend y 27 casos Playwright. Esto aún no demuestra que todos los cambios anteriores hayan pasado esos controles.
- **Sostenibilidad y Green Software:** Existen benchmarks geoespaciales y cálculos de intensidad de carbono del software; falta seguimiento continuo en producción y una comparación antes/después reproducible.
- **Organización documental:** Los cuatro informes del Sprint 4 enlazan al README y el README enlaza de regreso. La trazabilidad de historias a commits requiere depuración adicional.

## ¿Qué podemos hacer mejor?

### Personas
- Equilibrar la carga de trabajo entre el equipo para evitar picos de sobrecarga en los integrantes responsables de la infraestructura de despliegue y pruebas automatizadas durante los días previos al cierre.
- Fortalecer las competencias de todo el equipo en la depuración de trazas de red y perfiles de rendimiento en WebKit/Safari.

### Relaciones
- Incrementar la frecuencia de sincronización entre el frente de desarrollo backend y frontend, coordinando los contratos de API y tipos de datos antes de iniciar la implementación de componentes reactivos.
- Establecer canales de comunicación aún más ágiles con los evaluadores externos y usuarios clave para la recolección de retroalimentación de usabilidad.

### Procesos
- Formalizar revisiones de código (Pull Request Code Reviews) con listas de chequeo predefinidas para validar no solo la funcionalidad, sino también la inclusión de enlaces relativos y limpieza de archivos temporales.
- Automatizar la ejecución local de pruebas Playwright antes de emitir commits hacia el repositorio remoto.

### Herramientas
- Incorporar herramientas de monitoreo de sintaxis Markdown (Markdown linter) en los hooks de pre-commit para prevenir enlaces rotos de forma anticipada.
- Implementar contenedores Docker multi-stage optimizados para reducir el peso de las imágenes finales de distribución en staging.

### Acciones a realizar

Para asegurar la transición exitosa del producto a su fase de operación y soporte, se establecen los siguientes compromisos concretos bajo el marco SMART:

| Acción a Realizar | Tipo de Compromiso | Responsable Asignado | Métrica de Seguimiento / Criterio de Éxito | Fecha Límite |
|---|---|---|---|---|
| Configurar pre-commit hooks locales para validación de formato y pruebas unitarias | Proceso / Herramientas | Jair Felix Romero | 100% de commits validados sin flags `-no-verify` | 2026-11-25 |
| Documentar manual de operaciones y despliegue en entornos VPS con Docker | Procesos / Documental | David André Guevara Moscoso | Guía operativa de 1 comando publicada y verificada en docs/ | 2026-11-27 |
| Realizar taller de transferencia técnica sobre Playwright y análisis de rendimiento | Personas / Relaciones | Sheila Suarez Suarez | Sesión de 60 min completada con 100% de asistencia del equipo | 2026-11-28 |
| Monitorear métricas de producción y tiempos de respuesta de API post-lanzamiento | Herramientas / Calidad | Manuel Yeferson Parraga Recuay | Uptime ≥ 99.5% y TTFB promedio < 450 ms en dashboard | 2026-12-05 |

---
[← Volver al README Principal](../../../README.md)
