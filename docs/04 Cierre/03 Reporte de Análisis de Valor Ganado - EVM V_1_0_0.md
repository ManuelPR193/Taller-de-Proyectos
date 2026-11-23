[← Volver al README principal](../../README.md)

# Reporte de Análisis de Valor Ganado (EVM)

**Proyecto:** EcoLogística Huancayo
**Presupuesto de referencia hallado (BAC propuesto, no aprobado):** S/ 11 319,00
**Estado general:** EVM no calculable con rigor
**Fecha de corte:** 23/11/2026 · **Versión:** 1.0.0

## 1. Base de cálculo y limitación

El presupuesto detallado de `docs/02 Planificación/04 Presupuesto del proyecto V_1_0_0.md` estima S/ 11 319,00: costo de oportunidad y contingencia. El acta de constitución plantea S/ 0–250 para el equipo académico. Ninguno presenta aprobación de una rebase presupuestaria ni distribución temporal del costo por paquete de trabajo. Tampoco hay registro de horas reales o costo real por periodo.

Por ello, los puntos de historia no se convierten a moneda, el costo presupuestado no se declara BAC aprobado y ningún valor N/D se trata como cero.

## 2. Métricas EVM

| Métrica | Periodo actual | Acumulado al corte | Acumulado anterior | Estado |
|---|---:|---:|---:|---|
| PV (Valor planificado) | N/D | N/D | N/D | No hay baseline de costo calendarizada. |
| EV (Valor ganado) | N/D | N/D | N/D | No hay regla aprobada para asignar presupuesto a entregables aceptados. |
| AC (Costo real) | N/D | N/D | N/D | No hay registro de horas/costos reales. |
| SV = EV − PV | N/D | N/D | N/D | Requiere PV y EV. |
| CV = EV − AC | N/D | N/D | N/D | Requiere EV y AC. |
| SPI = EV / PV | N/D | N/D | N/D | Requiere PV > 0 y EV. |
| CPI = EV / AC | N/D | N/D | N/D | Requiere AC > 0 y EV. |

## 3. Avance financiero respecto al BAC

| Porcentaje | Cálculo requerido | Resultado |
|---|---|---|
| Planificado | PV / BAC × 100 | N/D; PV y BAC aprobado no disponibles. |
| Ganado | EV / BAC × 100 | N/D; EV y BAC aprobado no disponibles. |
| Gastado | AC / BAC × 100 | N/D; AC y BAC aprobado no disponibles. |

Los informes de sprint sí registran avance técnico: S1 14/27 SP, S2 18/18 y S3 28/28. Esos cocientes no sustituyen PV/EV/CPI/SPI porque los SP no tienen conversión presupuestal validada y no existe distribución por fechas.

## 4. Análisis de desviaciones

- **Cronograma:** el acta expresa hitos en semanas relativas; los informes aportan algunas fechas de corte, no fechas planeadas por hito ni dependencias calculadas. No se puede atribuir una desviación en días ni una causa con evidencia suficiente.
- **Costo:** no hay AC; el presupuesto tiene dos cifras incompatibles y no consta su rebase. Una afirmación de sobrecosto, ahorro o consumo de contingencia sería especulativa.

## 5. Estimaciones a la conclusión (EAC)

| Fórmula solicitada | Resultado al corte |
|---|---|
| EAC₁ = BAC / CPI | N/D: BAC/CPI aprobados no disponibles. |
| EAC₂ = BAC / (CPI × SPI) | N/D: BAC, CPI y SPI no disponibles. |
| EAC₃ = AC + [(BAC − EV) / (CPI × SPI)] | N/D: AC, BAC, EV, CPI y SPI no disponibles. |

**EAC seleccionado:** ninguno. No se selecciona una proyección hasta conciliar presupuesto, calendario de costos, avance aceptado y horas/gastos reales. Cuando existan esas entradas, calcular las tres fórmulas con la misma fecha de corte, validar divisores y justificar si el trabajo restante mantendrá el desempeño histórico.

## Datos necesarios para emitir EVM válido

1. BAC aprobado y diccionario de paquetes de trabajo con presupuesto asignado.
2. Baseline temporal PV por periodo y registro de cambios aprobados.
3. Criterio objetivo de EV y aceptación por entregable.
4. AC por periodo, con horas reales/tarifas y desembolsos separados.
5. Corte anterior comparable y evidencia de la fuente.

## Historial de cambios

| Versión | Fecha | Cambio |
|---|---|---|
| 1.0.0 | 23/11/2026 | Reporte transparente; no asigna métricas financieras inexistentes. |
