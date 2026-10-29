# Validación del Sprint 3 — 29 de octubre de 2026

## Dictamen

**Aprobado en el entorno local reproducible.** Los 12 casos de aceptación cuentan con implementación y evidencia automática. Las pruebas de navegador usan datos deterministas para tráfico y geometría, además de la API real para autenticación, dashboard y descarga PDF.

La certificación del entorno productivo sigue su propio control: PT-10 y PT-12 deben repetirse después del despliegue porque la red, el clúster y PostgreSQL pueden producir resultados distintos a Chromium y SQLite locales.

## Ejecuciones finales

- Backend: `venv/Scripts/python -m coverage run --source=app -m unittest discover -s tests` — **54 pruebas aprobadas**.
- Cobertura: `venv/Scripts/python -m coverage report --fail-under=80` — **91%**, umbral aprobado.
- Frontend: `npm test` — **3 pruebas aprobadas**.
- Build: `npm run build` con Vite 8 — correcto y con división por vistas; paquete principal de 63,75 kB gzip.
- Seguridad Python: Bandit sin hallazgos medios/altos y `pip-audit` sin vulnerabilidades conocidas.
- Seguridad JavaScript: `npm audit --audit-level=high` sin vulnerabilidades en la última ejecución completa.
- PDF API: HTTP 200, firma `%PDF`, **0,260 s**.
- Algoritmo: 150 pedidos, 15 vehículos, 150 asignados, 0 sin asignar, restricciones válidas, **18,806 s** incluyendo carga del grafo en caché.
- Navegador 3G: vista esencial en **3,015 s** (umbral 5 s).
- Accesibilidad: axe WCAG 2 A/AA, **0 violaciones** en la vista auditada.
- Índice espacial: 100 000 filas y 400 repeticiones; scan **3,18750 s CPU**, R*Tree **0,03125 s CPU**, reducción **99,0%**. El plan confirma `VIRTUAL TABLE INDEX`.

## Matriz de los 12 casos

| ID | Estado | Evidencia |
|---|---|---|
| PT-01 | Aprobada | Chromium renderizó geometría vial, tres marcadores numerados y lista en orden de visita. |
| PT-02 | Aprobada | Un cuarto tramo sin observación se mostró en gris como “Sin datos de tráfico” sin ocultar los demás. |
| PT-03 | Aprobada | Se verificaron trazos verde `#15803d`, amarillo `#eab308` y rojo `#dc2626` por tramo. |
| PT-04 | Aprobada | Una respuesta 503 simulada del proveedor produjo mensaje explícito, reintento y lista alternativa. |
| PT-05 | Aprobada | Dashboard por periodo con cinco indicadores calculados por la API; prueba backend de valores reales. |
| PT-06 | Aprobada | Periodo vacío: cinco valores en cero y mensaje “Sin datos para el periodo seleccionado”. |
| PT-07 | Aprobada | Descarga real desde la interfaz en 0,457 s; contenido con firma `%PDF`. |
| PT-08 | Aprobada | Prueba PDF extrae el texto y confirma “Días sin información” y las fechas faltantes. |
| PT-09 | Aprobada | 150/150 pedidos asignados en 18,806 s con unicidad, capacidad, ventanas y recursos sin reutilización. |
| PT-10 | Aprobada local | Chromium con perfil 3G: vista esencial en 3,015 s. Repetir en staging. |
| PT-11 | Aprobada | axe-core sobre WCAG 2 A/AA: cero violaciones después de corregir contraste del pie. |
| PT-12 | Aprobada local | R*Tree sincronizado por triggers y migración; reducción de CPU 99,0%. Repetir con `EXPLAIN ANALYZE` en PostgreSQL de staging. |

**Resumen: 12 casos aprobados localmente; 0 fallidos; 0 pendientes de implementación.**

## Historias y reglas

| Elemento | Estado | Resultado |
|---|---|---|
| US-007 | Aprobada | Cuenta de conductor vinculada; API filtra por identidad y fecha; mapa recibe solo la ruta seleccionada. |
| US-008 | Aprobada | Observaciones de tráfico con vigencia de 30 minutos, colores por tramo y estado `SIN_DATOS`. |
| US-009 | Aprobada | Periodo seleccionable, cinco métricas reales, ceros correctos y comparación solo cuando existe línea base. |
| US-010 | Aprobada | Descarga PDF rápida, valores compartidos con dashboard y días sin información enumerados. |
| EN-05 | Aprobado local | Índice R*Tree, consulta viewport, reconciliación y triggers; benchmark supera el 15%. |
| RN-007 | Aprobada | La red vial excluye superficies riesgosas/no pavimentadas y restricciones HGV antes de optimizar. |
| RN-008 | Aprobada | CO₂ por ruta usa distancia vial por factor de emisión del vehículo. |
| RN-009 | Aprobada | Compensación calculada con el factor configurado y reportada como estimación. |
| Auditor de solo lectura | Aprobado | Guardas frontend y backend; dashboard/reportes autenticados y escrituras limitadas. |

## Reproducción

```powershell
cd backend
.\venv\Scripts\python.exe -m coverage run --source=app -m unittest discover -s tests
.\venv\Scripts\python.exe -m coverage report --fail-under=80
.\venv\Scripts\python.exe tests\sprint3_probe.py
.\venv\Scripts\python.exe tests\spatial_benchmark.py
$env:PLAYWRIGHT_CHANNEL='msedge'
.\venv\Scripts\python.exe tests\browser_sprint3.py

cd ..\frontend
npm test
npm run build
npm audit --audit-level=high
```
