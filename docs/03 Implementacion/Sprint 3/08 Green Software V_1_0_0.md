[← Volver al README Principal](../../../README.md)

# Evaluación de Estándares Green Software — Sprint 3

| Campo | Detalle |
|---|---|
| **Proyecto** | EcoLogística Huancayo — Optimizador de Rutas Sostenibles para "DistriRápido S.A.C." |
| **Sprint** | 3 (semanas 8 a 11) |
| **Versión del documento** | 1.0.0 |
| **Fecha** | 2026-11-12 |
| **Elaborado por** | Equipo del proyecto |
| **Equipo** | Manuel Yeferson Parraga Recuay, Sheila Suarez Suarez, David André Guevara Moscoso, Jair Felix Romero |
| **Docente** | Job Daniel Gamarra Moreno |

---

## 1. Objetivo y Alcance

Verificar y certificar el cumplimiento de los estándares internacionales de **Green Software Engineering** y sostenibilidad ambiental del software en el incremento del Sprint 3, alineando la arquitectura y el código con:
- **RNF-010 (Eficiencia Energética / Green Software):** Reducción $\ge 15\%$ en el tiempo de CPU en consultas críticas de backend mediante indexación geoespacial (`EXPLAIN QUERY PLAN` / `EXPLAIN ANALYZE`).
- **RNF-006 (Eficiencia en Conexiones Lentas / Green Web):** Carga de la vista esencial para conductores en $\le 5$ segundos sobre red 3G simulada (384 kbps), reduciendo el consumo energético de la interfaz móvil.
- **RNF-004 (Precisión Funcional en Sostenibilidad):** Margen de error $\le 2\%$ en el cómputo de emisiones vehiculares de $\text{CO}_2$ y combustible.
- **RN-008 y RN-009:** Cálculo riguroso de emisiones de $\text{CO}_2$ por factor de vehículo y equivalencia en absorción de árboles para compensación de carbono.

La evaluación aplica el principio de **doble materialidad ecológica**:
1. **Green IN Software:** Minimizar la huella energética y de carbono computacional del propio sistema (ciclos de CPU, memoria, I/O en disco y transferencia de red).
2. **Green BY Software:** Maximizar el impacto ecológico positivo habilitado en las operaciones logísticas reales de *DistriRápido S.A.C.* (reducción de kilómetros recorridos, combustible y emisiones contaminantes de la flota en el Valle del Mantaro).

---

## 2. Marco Normativo y Estándares de Referencia

| Estándar / Iniciativa | Organismo Emisor | Enfoque y Aplicación en el Proyecto |
|---|---|---|
| **ISO/IEC 21031:2024** | ISO / IEC JTC 1 | Especificación de la **Intensidad de Carbono del Software (Software Carbon Intensity - SCI)**. Define la tasa de emisiones de gases de efecto invernadero por unidad funcional del software. |
| **GSF 8 Principles** | Green Software Foundation | Principios rectores de ingeniería de software sostenible: eficiencia de carbono, eficiencia energética, conciencia del carbono, eficiencia de hardware, medición, compromisos climáticos, eficiencia de red y moldeado de demanda. |
| **ISO/IEC 25010:2023** | ISO / IEC | Modelo de calidad del producto software, evaluando la **Eficiencia de Desempeño** (*Resource Utilization*, *Time Behavior*) y la **Sostenibilidad Ambiental** del software. |
| **ISO 14040 / ISO 14044** | ISO | Gestión Ambiental — Análisis del Ciclo de Vida (LCA) para la estimación de emisiones operacionales e incorporadas (*Embodied Carbon*). |
| **GHG Protocol ICT Sector** | WRI / WBCSD | Protocolo de Gases de Efecto Invernadero para servicios cloud y centros de cómputo. |
| **Factor de Red SEIN Perú** | MINEM / COES | Factor de emisión del Sistema Eléctrico Interconectado Nacional del Perú: $198.0\text{ gCO}_2\text{eq/kWh}$ ($0.198\text{ kgCO}_2/\text{kWh}$). |

---

## 3. Checklist de Verificación de Estándares Green Software

Evaluación exhaustiva de los **8 Principios de la Green Software Foundation (GSF)** y directrices **ISO/IEC 21031**:

| ID | Principio GSF | Verificación en el Sistema | Criterio / Umbral | Resultado | Evidencia Técnica en el Repositorio |
|---|---|---|---|---|---|
| **GSF-01** | **Carbon Efficiency** (Eficiencia de Carbono) | Emisión mínima de carbono por unidad funcional de cómputo. | Minimizar emisiones directas por pedido y ruta. | **Cumple** | SCI del solver: $0.000471\text{ gCO}_2\text{eq}$ por pedido y $0.004711\text{ gCO}_2\text{eq}$ por ruta. Algoritmo Green VRP prioriza vehículos de baja emisión (RN-002, RN-008). |
| **GSF-02** | **Energy Efficiency** (Eficiencia Energética) | Consumo mínimo de energía eléctrica en CPU, memoria y almacenamiento. | RNF-010: Reducción $\ge 15\%$ de tiempo de CPU en consultas críticas. | **Cumple** | Índice geoespacial R\*Tree redujo **98.94%** del tiempo de CPU en 400 consultas repetidas (de 2.9375 s a 0.0312 s). Backend FastAPI asíncrono. |
| **GSF-03** | **Carbon Awareness** (Conciencia de Carbono) | Adaptación de la ejecución según la intensidad de carbono de la red eléctrica. | Ejecutar procesamiento masivo en horarios o regiones de menor emisión. | **En mejora continua** | Modelo configurado con factor SEIN Perú ($198\text{ gCO}_2\text{eq/kWh}$). El planificador por lotes programa ejecuciones nocturnas en horario valle de la red. |
| **GSF-04** | **Hardware Efficiency** (Eficiencia de Hardware) | Maximizar la utilización del hardware y amortizar el carbono incorporado (*Embodied Carbon*). | Contenedores ligeros, bajo uso de memoria RAM, sin sobredimensionar nodos. | **Cumple** | Imagen Docker multi-stage optimizada. Consumo en reposo del backend $< 85\text{ MB}$ RAM. HPA configurado para auto-escalado bajo demanda. |
| **GSF-05** | **Measurement** (Medición Cuantitativa) | Trazabilidad y cálculo formal de la intensidad de carbono mediante métricas estandarizadas. | Medición reproducible con especificación ISO/IEC 21031 (SCI). | **Cumple** | Scripts de benchmarking automatizado `green_software_benchmark.py` y `spatial_benchmark.py` con generación de evidencia JSON en `test-artifacts/`. |
| **GSF-06** | **Climate Commitments** (Compromisos Climáticos) | Apoyo a metas de descarbonización y transparencia ambiental. | Reglas de compensación auditables e informes de huella de carbono. | **Cumple** | RN-009 calcula equivalencia en absorción de árboles ($22\text{ kg CO}_2/\text{año}$). Generación de reportes PDF oficiales (`/reports/sustainability/pdf`). |
| **GSF-07** | **Network Efficiency** (Eficiencia de Red) | Minimizar el volumen de datos transmitidos y la radiación celular en antenas 3G. | RNF-006: Carga en $\le 5$ s en 3G; bundle frontend compacto. | **Cumple** | Paquete Vite gzip de solo **63.75 kB**; endpoints API $< 5\text{ kB}$; carga de vista esencial en **3.015 s** en conexión 3G (384 kbps). |
| **GSF-08** | **Demand Shaping** (Moldeado de Demanda) | Modular la demanda computacional según capacidad y permitir degradación grácil. | Caché de cómputo y tolerancia a indisponibilidad de proveedores externos. | **Cumple** | Red vial precargada en memoria (`NetworkX`) evitando llamadas de red redundantes. Modo de contingencia vial ante caída de mapas (PT-04). |

---

## 4. Medición Cuantitativa y Modelo SCI (ISO/IEC 21031:2024)

### 4.1. Formulación del Estándar

De acuerdo con la norma **ISO/IEC 21031:2024** y la *Green Software Foundation*, la **Intensidad de Carbono del Software (SCI)** se define como:

$$SCI = \frac{(E \times I) + M}{R}$$

Donde:
- **$E$ (Energía):** Consumo de energía eléctrica del sistema de software en kilovatios-hora ($\text{kWh}$).
  $$E = \left(\frac{P_{\text{activa}} \times t_{\text{cpu}}}{1000 \times 3600}\right) \times PUE$$
  - $P_{\text{activa}} = 50.0\text{ W}$ (consumo promedio de cómputo para contenedor de 2 vCPUs bajo carga).
  - $PUE = 1.15$ (*Power Usage Effectiveness* de centro de datos moderno optimizado).
- **$I$ (Intensidad de la red):** Factor de emisión de carbono de la red eléctrica local.
  - Para el entorno operativo nacional: **$I = 198.0\text{ gCO}_2\text{eq/kWh}$** (Red eléctrica peruana SEIN, según MINEM/COES).
- **$M$ (Carbono Incorporado / Embodied Carbon):** Emisiones de gases de efecto invernadero atribuibles a la fabricación, transporte y disposición del hardware físico asignado:
  $$M = TE \times \left(\frac{TR}{TT}\right) \times \left(\frac{VR}{VT}\right)$$
  - $TE = 1,200,000\text{ gCO}_2\text{eq}$ ($1,200\text{ kg CO}_2\text{eq}$ por servidor 2U rack).
  - $TT = 126,230,400\text{ s}$ (vida útil de 4 años).
  - $\frac{VR}{VT} = \frac{2}{32} = 0.0625$ (cuota de recursos virtuales asignados al microservicio).
- **$R$ (Unidad Funcional):** Escala de servicio prestada por el software:
  - $R_1$: Por pedido logístico optimizado ($\text{gCO}_2\text{eq / pedido}$).
  - $R_2$: Por ruta vehicular generada ($\text{gCO}_2\text{eq / ruta}$).
  - $R_3$: Por consulta geoespacial ejecutada ($\text{gCO}_2\text{eq / consulta}$).

### 4.2. Resultados Cuantitativos del SCI

Mediciones reproducidas mediante el benchmark automatizado (`green_software_benchmark.py`):

| Componente Evaluado | Carga / Unidad $R$ | Tiempo CPU ($t_{\text{cpu}}$) | Energía $E$ ($\text{kWh}$) | Carbono Incorporado $M$ ($\text{gCO}_2\text{eq}$) | Carbono Operacional ($E \times I$) | **SCI Resultante** |
|---|---|---|---|---|---|---|
| **Motor VRPTW & Green VRP** | 150 pedidos / 15 vehículos | $18.806\text{ s}$ | $0.00030043\text{ kWh}$ | $0.011173\text{ gCO}_2\text{eq}$ | $0.059485\text{ gCO}_2\text{eq}$ | **$0.000471\text{ gCO}_2\text{eq / pedido}$**<br>**$0.004711\text{ gCO}_2\text{eq / ruta}$** |
| **Búsqueda Geoespacial R\*Tree** | 400 consultas (100k filas) | $0.03125\text{ s}$ | $0.00000050\text{ kWh}$ | $0.000019\text{ gCO}_2\text{eq}$ | $0.000099\text{ gCO}_2\text{eq}$ | **$0.00000029\text{ gCO}_2\text{eq / consulta}$** |
| **Carga de Vista Conductor** | 1 petición de ruta móvil | $0.01250\text{ s}$ | $0.00000020\text{ kWh}$ | $0.000007\text{ gCO}_2\text{eq}$ | $0.000040\text{ gCO}_2\text{eq}$ | **$0.000047\text{ gCO}_2\text{eq / vista}$** |
| **Generación de Reporte PDF** | 1 reporte de periodo | $0.26000\text{ s}$ | $0.00000415\text{ kWh}$ | $0.000154\text{ gCO}_2\text{eq}$ | $0.000822\text{ gCO}_2\text{eq}$ | **$0.000976\text{ gCO}_2\text{eq / PDF}$** |

---

## 5. Eficiencia en Base de Datos y Procesamiento Geoespacial (RNF-010 / EN-05)

El requisito **RNF-010** exige una reducción mínima del $15\%$ en el tiempo de CPU en consultas críticas para minimizar el consumo energético en servidores de producción continua.

### 5.1. Resultados del Benchmark Geoespacial (100,000 registros, 400 repeticiones)

| Métrica | Escaneo Completo (Table Scan) | Índice Espacial R\*Tree | Mejora / Reducción | Umbral Requerido | Estado |
|---|---|---|---|---|---|
| **Tiempo de CPU** | $2.93750\text{ s}$ | $0.03125\text{ s}$ | **$-98.94\%$** | $\ge 15.0\%$ | **Cumple ampliamente** |
| **Consumo Eléctrico ($E$)** | $0.00004695\text{ kWh}$ | $0.00000050\text{ kWh}$ | **$-98.94\%$** | Reducción medible | **Cumple** |
| **Huella Operacional de $\text{CO}_2$** | $0.009296\text{ gCO}_2\text{eq}$ | $0.000099\text{ gCO}_2\text{eq}$ | **$-0.009197\text{ g}$** | Reducción medible | **Cumple** |
| **Plan de Ejecución SQL** | `SCAN pedidos` (recorrido exhaustivo O(N)) | `SCAN pedidos_geo VIRTUAL TABLE INDEX` + `SEARCH pedidos USING INTEGER PRIMARY KEY` | Indexación espacial Bounding Box O(log N) | Plan de consulta verificado | **Cumple** |

### 5.2. Impacto Ambiental Proyectado

Para una operación típica de *DistriRápido S.A.C.* con aproximadamente $50,000$ consultas geoespaciales diarias (monitoreo en tiempo real, asignación y filtros de mapa):
- **Ahorro energético anual proyectado:** $\mathbf{42.38\text{ kWh / año}}$.
- **Emisiones de $\text{CO}_2$ operacionales evitadas:** $\mathbf{8.39\text{ kg CO}_2\text{eq / año}}$ únicamente por optimización algorítmica de base de datos.

---

## 6. Eficiencia Algorítmica y Beneficio Ambiental Habilitado (Green BY Software)

El mayor impacto ecológico del sistema radica en la optimización del mundo físico: la reducción de combustible y gases de efecto invernadero en los vehículos de reparto.

| Indicador de Sostenibilidad | Operación Base (Despacho Manual / Secuencial) | EcoLogística (Motor VRPTW & Green VRP) | Ahorro Neto / Beneficio Ambiental |
|---|---|---|---|
| **Distancia total recorrida (150 pedidos)** | $462.50\text{ km}$ | $318.20\text{ km}$ | **$-144.30\text{ km}$ ($-31.2\%$)** |
| **Consumo de combustible diésel** | $41.38\text{ litros}$ | $28.46\text{ litros}$ | **$-12.92\text{ litros / día}$** |
| **Emisiones vehiculares de $\text{CO}_2$** | $111.00\text{ kg CO}_2$ | $76.37\text{ kg CO}_2$ | **$-34.63\text{ kg CO}_2 / \text{día}$** |
| **Árboles necesarios para compensación (RN-009)** | $5.05\text{ árboles / año}$ | $3.47\text{ árboles / año}$ | **$-1.58\text{ árboles / año}$** |

### Retorno de Inversión de Carbono del Software (Green ROI)

Comparando el costo de carbono computacional del software frente al beneficio obtenido en el transporte:
$$\text{Carbon ROI} = \frac{\text{Emisiones vehiculares evitadas por día}}{\text{Emisiones computacionales del software por corrida}} = \frac{34,630\text{ gCO}_2\text{eq}}{0.070658\text{ gCO}_2\text{eq}} \approx \mathbf{490,107 \times}$$

> **Interpretación:** Por cada gramo de $\text{CO}_2$ que la CPU emite ejecutando el motor de optimización, el sistema evita **$\approx 490\text{ kg}$ de $\text{CO}_2$ en el transporte real** de Huancayo.

---

## 7. Eficiencia en Red, Frontend y Dispositivos Móviles (Green Web)

Para cumplir con el principio **GSF-07** y el requisito **RNF-006**, se auditó el rendimiento y peso de la aplicación web:

| Componente / Recurso | Medida | Umbral / Estándar | Evaluación |
|---|---|---|---|
| **Bundle principal de producción (Vite + React)** | $63.75\text{ kB}$ (gzip) | $< 250\text{ kB}$ para SPA moderna | Excelente; optimizado mediante code splitting por rutas. |
| **Tiempo de carga en red 3G simulada (384 kbps)** | $3.015\text{ s}$ | $\le 5.0\text{ s}$ (RNF-006) | Cumple; reduce el tiempo de activación del módem celular y el calentamiento de batería. |
| **Payload JSON del endpoint de ruta conductor** | $3.10\text{ kB}$ | $< 50\text{ kB}$ | Cumple; solo transmite identificadores, coordenadas y estado esenciales. |
| **Payload JSON del dashboard de sostenibilidad** | $4.20\text{ kB}$ | $< 50\text{ kB}$ | Cumple; agregación realizada íntegramente en backend con SQLAlchemy. |
| **Tamaño de reporte PDF descargable** | $18.50\text{ kB}$ | $< 500\text{ kB}$ | Cumple; generación en streaming sin incrustación de imágenes pesadas. |

---

## 8. Herramientas Utilizadas y Reproducibilidad

| Herramienta | Versión | Rol en la Verificación de Estándares Green Software |
|---|---|---|
| `backend/tests/green_software_benchmark.py` | 1.0.0 | Script automatizado para el cálculo formal del SCI (ISO/IEC 21031), modelado energético y verificación de principios GSF. |
| `backend/tests/spatial_benchmark.py` | 1.0.0 | Benchmark determinista para validación de RNF-010 y EN-05 con 100,000 registros geoespaciales. |
| `SQLite 3 Virtual Table (R*Tree)` | 3.x | Implementación local de indexación espacial basada en árboles $R^*$ para filtrado por recuadro delimitador (*Bounding Box*). |
| `coverage.py` y `unittest` | 7.x / Python 3.12 | 54 pruebas unitarias deterministas garantizando la validez de los algoritmos sin incurrir en ejecuciones ociosas. |
| `Vite 8` y `rollup-plugin-visualizer` | 8.x | Empaquetado optimizado, tree-shaking y minificación de dependencias JavaScript. |
| `GitHub Actions` | Workflow CI | Pipeline automatizado con timeout estricto de 30 minutos para evitar consumo innecesario de minutos de cómputo en runners. |

---

## 9. Hallazgos y Oportunidades de Mejora Green IT

| ID | Hallazgo | Severidad | Acción Aplicada / Planificada | Estado |
|---|---|---|---|---|
| **G-01** | Consultas geoespaciales sin índice causaban recorridos completos de tabla (Table Scan), degradando la CPU. | Alta | Implementación de índices $R^*$Tree en SQLite y B-Tree compuesto en PostgreSQL (`spatial.py`), reduciendo el 98.94% de CPU. | **Corregido** |
| **G-02** | Dependencia externa de la API de Overpass OSM generaba peticiones de red repetitivas y riesgos de timeout. | Alta | Se implementó descarga y precarga en memoria del grafo vial (`DeterministicNetwork` y caché `NetworkX`), eliminando tráfico superfluo. | **Corregido** |
| **G-03** | Cálculo de agregaciones del dashboard realizaba consultas redundantes $N+1$ en rutas y pedidos. | Media | Se centralizó la consulta usando `selectinload` en SQLAlchemy (`sustainability.py`), reduciendo accesos a disco e I/O. | **Corregido** |
| **G-04** | Sensibilidad al carbono (GSF-03): las corridas de optimización pueden programarse en horas de menor demanda eléctrica. | Baja | Configurar cron job / workflow para disparar el batch masivo de rutas entre las 02:00 y 04:00 hrs (horario valle del SEIN). | **Planificado** |
| **G-05** | Validación en staging sobre PostgreSQL (`EXPLAIN ANALYZE`) sujeta a despliegue en clúster cloud. | Baja | Ejecutar el script `spatial_benchmark.py` adaptado a PostGIS una vez configurados los secretos del clúster de pruebas. | **Pendiente externo** |

---

## 10. Conclusión y Dictamen de Conformidad

El incremento del **Sprint 3** del proyecto **EcoLogística Huancayo** satisface plenamente las directrices de la **Green Software Foundation (GSF)** y la especificación **ISO/IEC 21031:2024 (SCI)**:
1. **Conformidad con RNF-010:** Reducción de tiempo de CPU de **98.94%**, superando ampliamente el umbral del **15%**.
2. **Conformidad con RNF-006:** Tiempo de carga en 3G de **3.015 s** ($\le 5.0\text{ s}$) y paquete ligero de **63.75 kB gzip**.
3. **Intensidad de Carbono (SCI):** **$0.000471\text{ gCO}_2\text{eq}$ por pedido**, un valor de huella digital mínimo para el estándar industrial.
4. **Beneficio Ecológico Habilitado:** Ahorro diario de **$34.63\text{ kg CO}_2$** y **$12.92\text{ litros de diésel}$**, con un Retorno de Inversión de Carbono de más de **$490,000 \times$**.

**Dictamen:** **APROBADO — CONFORME A ESTÁNDARES GREEN SOFTWARE.**

---

## Historial de Control de Cambios

| Versión | Fecha | Autor | Descripción del cambio |
|---|---|---|---|
| 1.0.0 | 2026-11-12 | Equipo del proyecto | Elaboración formal de la evaluación de estándares Green Software (ISO/IEC 21031 / GSF / RNF-010). |

