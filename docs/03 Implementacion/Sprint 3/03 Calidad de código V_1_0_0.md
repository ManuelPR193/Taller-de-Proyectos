[← Volver al README Principal](../../../README.md)

# Calidad de Código — Sprint 3

| Campo | Detalle |
|---|---|
| **Proyecto** | EcoLogística Huancayo — Optimizador de Rutas Sostenibles para "DistriRápido S.A.C." |
| **Sprint** | 3 (semanas 8 a 11) |
| **Versión del documento** | 1.0.0 |
| **Fecha** | [AAAA-MM-DD] |
| **Elaborado por** | [Autor] |
| **Equipo** | Manuel Yeferson Parraga Recuay, Sheila Suarez Suarez, David André Guevara Moscoso, Jair Felix Romero |
| **Docente** | Job Daniel Gamarra Moreno |

---

## 1. Objetivo

Verificar que el código del sprint cumpla el Definition of Done global del proyecto.

## 2. Métricas de Calidad

| Métrica | Umbral | Resultado | Estado |
|---|---|---|---|
| Cobertura de pruebas unitarias | ≥ 80% | [ ] % | [Cumple / No cumple] |
| Vulnerabilidades críticas (SonarQube / CodeQL) | 0 | [ ] | |
| Bugs de severidad alta | 0 | [ ] | |
| Duplicación de código | ≤ 3% | [ ] % | |
| Deuda técnica (SonarQube) | Calificación A o B | [ ] | |

## 3. Revisión de Código (Peer Review)

| Pull Request | Autor | Revisor | Resultado | Fecha |
|---|---|---|---|---|
| #14 — Mapa de rutas con paradas numeradas (US-007) | Manuel Yeferson Parraga Recuay | Jair Felix Romero | Aprobado | 2026-10-13 |
| #15 — Congestión por tramo en el mapa (US-008) | Manuel Yeferson Parraga Recuay | David André Guevara Moscoso | Aprobado con cambios (H-03) | 2026-10-15 |
| #16 — Dashboard de indicadores de sostenibilidad (US-009) | Jair Felix Romero | Sheila Suarez Suarez | Aprobado con cambios (H-02, H-04) | 2026-10-20 |
| #17 — Reporte de sostenibilidad en PDF (US-010) | Jair Felix Romero | Manuel Yeferson Parraga Recuay | Aprobado | 2026-10-22 |
| #18 — Índices geoespaciales y consultas optimizadas (EN-05) | David André Guevara Moscoso | Sheila Suarez Suarez | Aprobado | 2026-10-23 |
| #19 — Correcciones de los hallazgos H-01 a H-05 | Sheila Suarez Suarez | David André Guevara Moscoso | Aprobado | 2026-10-27 |

**Resumen:** 6 Pull Requests revisados por un integrante distinto del autor; 4 aprobados directamente y 2 aprobados con cambios, ya corregidos en el PR #19.

## 4. Herramientas Utilizadas

| Herramienta | Uso |
|---|---|
| pytest y pytest-cov | Pruebas unitarias y cobertura del backend |
| SonarQube / SonarCloud | Análisis estático |
| GitHub Actions | Ejecución automática del pipeline |
| ESLint | Calidad del código del frontend |

## 5. Hallazgos y Correcciones

| ID | Hallazgo | Severidad | Corrección | Estado |
|---|---|---|---|---|
| H-01 | La validación de la ventana de entrega (fin posterior al inicio) solo se aplicaba al crear un pedido y no al actualizarlo | Media | Se aplicó la misma validación en el esquema de actualización y se agregó una prueba unitaria | Corregido |
| H-02 | La consulta del dashboard recorría todas las rutas sin índice por fecha, con tiempos altos en periodos largos | Alta | Se agregó el índice sobre la fecha de las rutas y se unificó el cálculo en una sola consulta agregada (EN-05) | Corregido |
| H-03 | No había tiempo máximo de espera cuando el servicio de mapas no respondía, y la pantalla se quedaba cargando | Media | Se agregó un tiempo máximo de espera y una vista alternativa con la lista de paradas | Corregido |
| H-04 | El cálculo de distancia estaba duplicado en el servicio de rutas y en el de reportes | Baja | Se extrajo a una función común que usan ambos módulos | Corregido |
| H-05 | Faltaban pruebas unitarias del cálculo de CO₂ cuando el vehículo no tiene factor de emisión o el valor está en el límite | Media | Se agregaron pruebas de esos casos | Corregido |
| H-06 | Nombres de variables mezclados en inglés y español en el módulo de reportes | Baja | Unificar la nomenclatura en todo el módulo | Pendiente (Sprint 4) |

**Resumen:** 6 hallazgos, 5 corregidos y 1 pendiente de severidad baja, que pasa al Sprint 4.

## Historial de Control de Cambios

| Versión | Fecha | Autor | Descripción del cambio |
|---|---|---|---|
| 1.0.0 | [AAAA-MM-DD] | [Autor] | Versión inicial del documento |
