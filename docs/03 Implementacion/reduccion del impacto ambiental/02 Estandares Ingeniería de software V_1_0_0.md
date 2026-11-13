# Estándares de ingeniería de software y guía de desarrollo verde – EcoLogística Huancayo

**Versión:** 1.0.0  
**Stack:** React/Vite, FastAPI, SQLAlchemy y SQLite/PostgreSQL

## 1. Propósito

Establecer reglas de arquitectura y desarrollo para que EcoLogística mantenga un código comprensible, seguro y eficiente en el uso de recursos. La actividad menciona el stack MERN como referencia; las reglas de este documento se aplican a la arquitectura real del proyecto, sin introducir MongoDB o Express.

## 2. Normativas y principios

### 2.1 ISO/IEC 25010

- **Eficiencia de desempeño:** evaluar comportamiento temporal, utilización de recursos y capacidad. En EcoLogística se relaciona con consultas SQL acotadas, paginación, división de código, compresión y mediciones Lighthouse.
- **Mantenibilidad:** mantener modularidad, analizabilidad y facilidad de modificación. Se relaciona con separación entre endpoints, servicios, modelos y componentes React, además de pruebas y auditorías automatizadas.

### 2.2 Green Software Foundation (GSF): cuatro principios

1. **Carbon Efficiency (eficiencia de carbono):** reducir emisiones por unidad funcional. Para la aplicación, la unidad de análisis es una visita o carga de página y se estima a partir de los bytes transferidos.
2. **Energy Efficiency (eficiencia energética):** realizar el mismo trabajo con menos energía; se favorecen consultas limitadas, menos JavaScript inicial y compresión.
3. **Hardware Efficiency (eficiencia del hardware):** utilizar CPU, memoria, almacenamiento y red de forma proporcional; se evitan cargas y cálculos innecesarios.
4. **Carbon Awareness (conciencia del carbono):** reconocer que la intensidad de carbono de la electricidad cambia según lugar y momento. En esta versión se deja documentado como principio de diseño; no existe una programación dinámica de tareas según intensidad de red eléctrica.

La fórmula de transferencia de este proyecto es una estimación académica basada en los factores del material de la actividad. No se debe presentar como medición completa del consumo energético del proveedor cloud ni como cálculo integral de SCI.

### 2.3 W3C Web Sustainability Guidelines (WSG 1.0)

- **Pauta 1.2 – Media:** optimizar medios, dimensiones y formatos; aplicar WebP/AVIF cuando existan imágenes raster locales.
- **Pauta 2.4 – Architecture:** diseñar una arquitectura eficiente, con separación de responsabilidades, carga bajo demanda y políticas de caché apropiadas.
- **Pauta 3.1 – Network:** reducir transferencia, respuestas innecesarias y peso de recursos mediante paginación, compresión y reutilización segura.

## 3. Reglas de Clean Code, SOLID, DRY y YAGNI

| Principio | Backend (FastAPI/SQLAlchemy) | Frontend (React/Vite) |
|---|---|---|
| Clean Code | Nombres descriptivos, endpoints pequeños, validación explícita y errores controlados. | Componentes con una responsabilidad, nombres claros y estados de carga/error visibles. |
| SOLID | Separar rutas, servicios, modelos y acceso a datos; depender de contratos y no mezclar reglas de negocio con HTTP. | Separar presentación, estado, servicios API y autenticación; evitar componentes que concentren toda la lógica. |
| DRY | Centralizar paginación, validaciones y reglas repetidas en servicios o utilidades comunes. | Reutilizar componentes, funciones API y formatos comunes sin duplicar lógica. |
| YAGNI | No añadir índices, endpoints, middleware o dependencias sin un caso de uso medible. | No incorporar paquetes grandes ni abstracciones que no respondan a una necesidad actual. |

### 3.1 Reglas verdes para Backend

1. Los endpoints de colecciones deben paginar resultados; tamaño predeterminado: 12 y máximo: 100.
2. Seleccionar solo las columnas necesarias para las vistas mediante proyecciones SQLAlchemy.
3. Crear índices según filtros y ordenamientos frecuentes, y verificar su utilidad con el motor de base de datos.
4. Evitar consultas repetidas dentro de ciclos y cargas de relaciones innecesarias.
5. Comprimir respuestas de texto/JSON cuando superen 1 KB.
6. No almacenar en caché compartida información personal u operativa; las respuestas de API privadas mantienen `private, no-store`.
7. Medir consultas y tiempos antes de optimizar; no añadir complejidad sin evidencia.

### 3.2 Reglas verdes para Frontend

1. Cargar rutas secundarias con `React.lazy()` y `Suspense`.
2. Evitar dependencias cuando una API nativa cubra el requerimiento.
3. Preferir SVG en línea para iconos pequeños y reutilizables.
4. Las imágenes nuevas deben tener dimensiones apropiadas, compresión y formatos modernos cuando sea posible; usar `srcset`, `sizes`, `<picture>`, `loading="lazy"` y `decoding="async"` según corresponda.
5. Mantener el tamaño de paquetes bajo revisión con build y Lighthouse CI.
6. Reutilizar solicitudes GET equivalentes y deduplicar llamadas concurrentes; invalidar caché después de escrituras.
7. Mantener caché inmutable solo para recursos estáticos versionados con hash; no aplicar esa política a datos privados.

## 4. Matriz de mapeo: ocho optimizaciones y estándares

| N.º | Optimización adaptada a EcoLogística | ISO/IEC 25010 | Principio GSF | W3C WSG 1.0 |
|---:|---|---|---|---|
| 1 | Proyecciones SQLAlchemy `load_only()` e índices | Eficiencia de desempeño: utilización de recursos y comportamiento temporal; mantenibilidad: analizabilidad | Energy Efficiency y Hardware Efficiency: menos lectura y procesamiento | 3.1 Network: limitar datos devueltos |
| 2 | Paginación backend/frontend por bloques de 12 | Eficiencia: capacidad y utilización de recursos | Energy Efficiency y Carbon Efficiency: transferir solo el bloque necesario | 3.1 Network: reducir payload por respuesta |
| 3 | Auditoría de peso y patrón WebP/AVIF con `<picture>` | Eficiencia: comportamiento temporal; mantenibilidad: facilidad de actualización de recursos | Carbon Efficiency y Energy Efficiency: reducir bytes transferidos | 1.2 Media: optimización de medios |
| 4 | `React.lazy()` y `Suspense` | Eficiencia: comportamiento temporal; mantenibilidad: modularidad | Hardware Efficiency: no ejecutar/cargar vistas no solicitadas | 2.4 Architecture: carga bajo demanda |
| 5 | APIs nativas y auditoría de dependencias | Eficiencia: utilización de recursos; mantenibilidad: analizabilidad | Energy Efficiency y Hardware Efficiency: evitar código y dependencias innecesarias | 2.4 Architecture: arquitectura y librerías eficientes |
| 6 | Iconos SVG en línea con Lucide | Eficiencia: comportamiento temporal; mantenibilidad: reutilización | Carbon Efficiency: menos solicitudes de recursos repetidos | 3.1 Network: reducir solicitudes y transferencia |
| 7 | Caché GET/deduplicación, assets inmutables y API privada `no-store` | Eficiencia: comportamiento temporal; mantenibilidad: modularidad del servicio | Energy Efficiency y Carbon Efficiency: evitar descargas repetidas | 2.4 Architecture: política de caché segura |
| 8 | Gzip en FastAPI para respuestas >1 KB | Eficiencia: comportamiento temporal y utilización de recursos | Energy Efficiency y Carbon Efficiency: menos bytes en tránsito | 3.1 Network: compresión de transferencia |

## 5. Integración continua y control de calidad

El archivo `.github/workflows/green-audit.yml` automatiza:

1. Checkout del repositorio.
2. Instalación reproducible de dependencias con `npm ci`.
3. Auditoría de imágenes raster y pruebas frontend.
4. Build de producción.
5. Tres ejecuciones Lighthouse CI sobre el build local.
6. Cálculo de energía y CO₂e a partir del peso transferido reportado por Lighthouse.
7. Publicación de reportes JSON, resumen SWDM y `dist/` como artefacto de GitHub Actions.

Los umbrales de Lighthouse de la rúbrica se configuran inicialmente como advertencias para conservar evidencia aunque una meta no se alcance. El informe debe consignar los resultados reales y no modificar los reportes para aparentar cumplimiento.

## 6. Versionado y estructura documental

La entrega de esta actividad se ubica en:

```text
docs/
└── 03 Implementación/
    └── reduccion del impacto ambiental/
        ├── 01 Informe de reduccion del impacto ambiental V_1_0_0.md
        └── 02 Estandares Ingeniería de software V_1_0_0.md
```

La versión documental es **1.0.0**. Los cambios deben registrarse mediante commits descriptivos y subirse a la rama del repositorio que corresponda.

## 7. Referencias

- International Organization for Standardization. (2023). *ISO/IEC 25010:2023 Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — Product quality model*. ISO.
- Green Software Foundation. (s. f.). *Principles of Green Software Engineering*. https://principles.green/
- Green Software Foundation. (s. f.). *Software Carbon Intensity (SCI) Specification*. https://sci.greensoftware.foundation/
- World Wide Web Consortium (W3C). (s. f.). *Web Sustainability Guidelines (WSG) 1.0*. https://www.w3.org/TR/web-sustainability-guidelines/
- Lighthouse. (s. f.). *Lighthouse CI*. https://github.com/GoogleChrome/lighthouse-ci
- Sustainable Web Design. (s. f.). *Sustainable Web Design Model*. https://sustainablewebdesign.org/

> Nota: las referencias web se incluyen para identificar los marcos utilizados. Antes de la entrega académica, verificar el formato APA solicitado por el docente y la fecha/versión vigente de cada documento.
