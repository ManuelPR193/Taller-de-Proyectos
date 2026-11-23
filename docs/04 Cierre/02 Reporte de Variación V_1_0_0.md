[← Volver al README principal](../../README.md)

# Reporte de Variación

**Proyecto:** EcoLogística Huancayo
**Periodo reportado:** Sprints 1–4, según evidencias fechadas disponibles
**Fecha de corte:** 23/11/2026
**Versión:** 1.0.0

> Convención: “N/D” significa que la fuente requerida no fue registrada; no equivale a cero. Los puntos de historia se reportan aparte del costo y no se convierten a soles.

## 1. Variación de cronograma

| Métrica / sprint | Resultado planificado | Resultado real documentado | Variación obtenible | Causa raíz documentada | Respuesta / dato pendiente |
|---|---|---|---|---|---|
| Calendario global | 4 iteraciones / 14 semanas; hitos por semana en el acta | Informes fechados 25/09, 09/10, 30/10 y evidencia técnica 20/11/2026 | N/D días: faltan fechas de inicio, fin y baseline aprobada | El acta usa semanas relativas sin fechas de calendario | Versionar calendario con fechas, relaciones y ruta crítica. |
| Sprint 1 | 27 SP | 14 SP; informe del 25/09 | −13 SP; 48,1 % del compromiso no completado en ese corte | EN-01 y EN-03 requerían staging externo | Mantenerlos abiertos hasta validación de infraestructura. |
| Sprint 2 | 18 SP | 18 SP; informe del 09/10 | 0 SP de variación en el reporte | No se documenta desviación | Conservar evidencia de aceptación por historia. |
| Sprint 3 | 28 SP | 28 SP; informe del 30/10 | 0 SP de variación en el reporte | El informe indica que CI requirió correcciones; no aporta duración | Exportar datos diarios si se requiere análisis de ritmo. |
| Sprint 4 | No consta compromiso calendarizado ni SP | 27/27 E2E local al 20/11 | N/D | Sin backlog de sprint exportado | Vincular entregables a historias/aceptación antes de atribuir SP. |

## 2. Variación de costo

| Métrica / aspecto | Resultado planificado | Resultado real | Variación | Causa raíz | Respuesta planificada |
|---|---|---|---|---|---|
| Presupuesto académico | Acta: S/ 0–250 aprox.; presupuesto detallado: S/ 11 319 estimados (incluye costo de oportunidad y contingencia) | No hay registro de horas efectivas, pagos, recibos ni consumo de infraestructura | N/D; no restar estimación de costo real no medido | Dos documentos usan bases distintas; no hay cost ledger ni aprobación de rebaseline | Acordar si BAC es desembolso o costo de oportunidad; aprobar una única base y registrar horas por rol. |
| Contingencia | S/ 1 029 estimados en presupuesto detallado | Saldo real no informado | N/D | No hay registro de consumo | Conciliar gastos y reservar solo importes documentados. |
| Licencias / nube | S/ 0 en planes gratuitos; S/ 100 margen estimado para excedentes | No hay comprobantes ni extracto de consumo | N/D; no se presume gasto cero | Los servicios gratuitos no prueban ausencia de consumo fuera de cuota | Adjuntar facturas/uso y fecha de consulta. |

## 3. Variación de calidad

| Métrica / criterio | Resultado planificado | Resultado real verificable | Variación | Causa raíz | Respuesta planificada |
|---|---|---|---|---|---|
| Backend | Suite aprobada y cobertura ≥80 % según el workflow | 54/54 tests; cobertura local 90 % en validación de cierre | +10 puntos porcentuales sobre umbral; 0 tests fallidos | Suite local aislada con SQLite | Adjuntar artefacto CI y repetir sobre PostgreSQL/staging. |
| Frontend | Pruebas unitarias y build correctos | 3/3 tests; `npm run build` correcto | Sin desviación observada | Validación local, no publicación remota | Conservar workflow y auditoría de dependencias. |
| Navegadores | E2E Chromium, Firefox y WebKit | 27/27 aprobadas en ejecución local | Sin desviación observada | La corrida usa API local sembrada | Adjuntar ejecución remota al publicar. |
| Usabilidad | La documentación previa refiere diez respuestas SUS | Promedio aritmético 87,0 en matriz; formularios y acta fuente ausentes | No se puede validar aplicación ni representatividad | Falta evidencia primaria | Reaplicar con consentimiento y guardar formularios anonimizados. |
| Accesibilidad / despliegue | WCAG y operación objetivo documentados | No hay nueva auditoría Lighthouse ni deployment en este corte | N/D | No se ejecutó sobre un entorno publicado | Ejecutar axe/Lighthouse con versión y URL registradas; revisar con teclado/lector. |

## Lectura

La variación medible está limitada a puntos por sprint y verificaciones locales. No existe base suficiente para expresar desviaciones de cronograma en días ni costo en soles. La falta de dato no se reemplaza por una estimación presentada como resultado real.

## Historial de cambios

| Versión | Fecha | Cambio |
|---|---|---|
| 1.0.0 | 23/11/2026 | Consolidación de variaciones comprobables y datos no medidos. |
