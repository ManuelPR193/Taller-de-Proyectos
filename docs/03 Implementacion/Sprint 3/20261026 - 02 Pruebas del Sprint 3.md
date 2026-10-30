[← Volver al README Principal](../../../README.md)

# Pruebas del Sprint 3

**Proyecto:** EcoLogística Huancayo — Optimizador de Rutas Sostenibles para "DistriRápido S.A.C."
**Sprint:** 3 | **Fecha:** 26 de octubre de 2026

---

## 1. Casos de Prueba

> Resultados consolidados con la ejecución local del 30 de octubre de 2026.

| ID | Caso de prueba | Requisito | Resultado esperado | Resultado obtenido | Estado |
|---|---|---|---|---|---|
| PT-01 | Ver una ruta generada en el mapa | RF-004 / US-007 | Trazado completo con paradas numeradas en orden de visita | Trazado completo y 3 marcadores numerados | Aprobada |
| PT-02 | Tramo sin datos de tráfico | RF-004 / US-007 | El tramo se marca "Sin datos de tráfico" y el resto de la ruta se muestra | Estado “Sin datos de tráfico” visible | Aprobada |
| PT-03 | Congestión por tramo | RF-004 / US-008 | Cada tramo se colorea en verde, amarillo o rojo | Colores verde, amarillo y rojo verificados | Aprobada |
| PT-04 | Servicio de mapas no disponible | RF-004 / US-008 | Mensaje de error y vista alternativa en lista de paradas | Alerta, reintento y lista alternativa visibles | Aprobada |
| PT-05 | Dashboard con datos | RF-005 / US-009 | Se muestran los 5 indicadores del periodo | Cinco indicadores renderizados | Aprobada |
| PT-06 | Dashboard sin datos | RF-005 / US-009 | Valores en cero y mensaje "Sin datos para el periodo seleccionado" | Ceros y mensaje de periodo sin datos correctos | Aprobada |
| PT-07 | Reporte PDF | RF-006 / US-010 | PDF descargable en menos de 10 segundos | PDF válido descargado en 0,336 s | Aprobada |
| PT-08 | Reporte con datos parciales | RF-006 / US-010 | Reporte con los datos disponibles e indicación de los días sin información | Días sin información incluidos por la API | Aprobada |
| PT-09 | Rendimiento del algoritmo | RNF-001 | Solución válida en ≤ 45 s con 150 pedidos y 15 vehículos | 150 pedidos y 15 vehículos en 18,806 s | Aprobada |
| PT-10 | Carga con conexión lenta | RNF-006 | Vista esencial en ≤ 5 s con 3G simulado | Vista esencial en 2,997 s con 3G simulado | Aprobada |
| PT-11 | Accesibilidad | RNF-009 | 0 errores críticos WCAG 2.1 AA | 0 violaciones WCAG A/AA en axe-core | Aprobada |
| PT-12 | Consultas con índices | RNF-010 / EN-05 | Tiempo de CPU ≥ 15% menor (`EXPLAIN ANALYZE`) | R*Tree redujo 98,9% el tiempo CPU local | Aprobada |

## 2. Resumen de Resultados

| Total de pruebas | Aprobadas | Fallidas | Pendientes |
|---|---|---|---|
| 12 | 12 | 0 | 0 |

## 3. Defectos Encontrados

| ID | Descripción | Prueba relacionada | Severidad | Estado |
|---|---|---|---|---|
| BUG-01 | Pruebas dependían de OSM y bloqueaban CI | PT-09 | Alta | Corregido con red determinista |

