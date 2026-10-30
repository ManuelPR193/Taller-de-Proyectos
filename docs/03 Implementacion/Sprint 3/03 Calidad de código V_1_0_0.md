[← Volver al README Principal](../../../README.md)

# Calidad de Código — Sprint 3

| Campo | Detalle |
|---|---|
| **Proyecto** | EcoLogística Huancayo — Optimizador de Rutas Sostenibles para "DistriRápido S.A.C." |
| **Sprint** | 3 (semanas 8 a 11) |
| **Versión del documento** | 1.0.0 |
| **Fecha** | 2026-10-30 |
| **Elaborado por** | Equipo del proyecto |
| **Equipo** | Manuel Yeferson Parraga Recuay, Sheila Suarez Suarez, David André Guevara Moscoso, Jair Felix Romero |
| **Docente** | Job Daniel Gamarra Moreno |

---

## 1. Objetivo

Verificar que el código del sprint cumpla el Definition of Done global del proyecto. SonarQube Community Build 26.10 analizó 48 archivos y el Quality Gate resultó **PASSED**.

## 2. Métricas de Calidad

| Métrica | Umbral | Resultado | Estado |
|---|---|---|---|
| Cobertura de pruebas unitarias | ≥ 80% | 64,9% global en SonarQube; 89% backend | No cumple global |
| Vulnerabilidades críticas (SonarQube / auditorías) | 0 | 0 vulnerabilidades; 0 hotspots | Cumple |
| Bugs de severidad alta | 0 | 0 después de corregir 8 bugs Major | Cumple |
| Duplicación de código | ≤ 3% | 0,0% | Cumple |
| Deuda técnica (SonarQube) | Calificación A o B | A; 3 h 42 min; 52 code smells | Cumple |

## 3. Revisión de Código (Peer Review)

| Pull Request | Autor | Revisor | Resultado | Fecha |
|---|---|---|---|---|
| No existe PR #14 en el repositorio | No aplica | No aplica | No verificable | 2026-10-30 |
| No existe PR #15 en el repositorio | No aplica | No aplica | No verificable | 2026-10-30 |
| No existe PR #16 en el repositorio | No aplica | No aplica | No verificable | 2026-10-30 |
| No existe PR #17 en el repositorio | No aplica | No aplica | No verificable | 2026-10-30 |
| No existe PR #18 en el repositorio | No aplica | No aplica | No verificable | 2026-10-30 |
| No existe PR #19 en el repositorio | No aplica | No aplica | No verificable | 2026-10-30 |

**Resumen:** el repositorio no contiene Pull Requests; la revisión verificable se limita al historial de commits y a las pruebas automatizadas.

## 4. Herramientas Utilizadas

| Herramienta | Uso |
|---|---|
| unittest y coverage.py | 54 pruebas y 89% de cobertura backend |
| SonarQube Community Build 26.10 | Quality Gate, cobertura, bugs, duplicación y deuda técnica |
| GitHub Actions | Pipeline de calidad con timeout de 30 minutos |
| Vitest y Vite | 3 pruebas y compilación del frontend |

## 5. Hallazgos y Correcciones

| ID | Hallazgo | Severidad | Corrección | Estado |
|---|---|---|---|---|
| H-01 | SonarQube marcó 8 bugs Major en botones, promesas y nombre `Map` | Alta | Se agregaron tipos de botón, manejo explícito de promesas y el nombre `RouteMap` | Corregido; SonarQube reporta 0 bugs |
| H-02 | SonarQube marcó 6 code smells Critical por `datetime.utcnow()` | Alta | Se centralizó UTC con `datetime.now(timezone.utc)` | Corregido; 0 Critical abiertos |
| H-03 | La cobertura global es 64,9% por falta de cobertura JavaScript | Media | Incorporar cobertura de componentes y páginas del frontend al pipeline | Pendiente; objetivo ≥80% |
| H-04 | Quedan 52 code smells: 36 Major y 16 Minor | Media | Asociar etiquetas con controles y reducir complejidad de componentes | Pendiente; deuda estimada 3 h 42 min |
| H-05 | Las pruebas dependían de OSM y el job no tenía límite | Alta | Se usó red determinista y timeout de 30 minutos | Corregido |
| H-06 | Faltan despliegue, PostgreSQL y validación en staging | Baja | Ejecutar manualmente cuando existan secretos y entorno | Pendiente externo |

**Resumen:** Quality Gate PASSED, calificación A de mantenibilidad, 0 bugs, 0 vulnerabilidades, 0 hotspots y 0,0% de duplicación. El plan de remediación prioriza elevar la cobertura global de 64,9% a 80% y resolver 52 code smells.

## Historial de Control de Cambios

| Versión | Fecha | Autor | Descripción del cambio |
|---|---|---|---|
| 1.0.0 | 2026-10-30 | Equipo del proyecto | Información completada con evidencia del repositorio |
