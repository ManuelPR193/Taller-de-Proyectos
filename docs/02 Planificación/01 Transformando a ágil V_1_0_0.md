[← Volver al README Principal](../../README.md)

# Transformando a Ágil

**Proyecto:** EcoLogística Huancayo — Optimizador de Rutas Sostenibles para "DistriRápido S.A.C."
**Versión:** 1.0.0 | **Fecha:** 28 de agosto de 2026

---

## A. Metodología de Transformación

Los Requerimientos Funcionales (RF-001 a RF-008, ver `docs/01 Inicio/06. Requisitos funcionales V_1_0_0.md`) se agruparon en **6 Épicas** según el módulo funcional al que pertenecen, y cada Épica se descompuso en Historias de Usuario (US). Los Requerimientos No Funcionales (RNF-001 a RNF-010, ver `docs/01 Inicio/07. Requisitos no funcionales V_1_0_0.md`) se transformaron en **6 Historias Técnicas (Enablers)** de infraestructura, seguridad, accesibilidad y rendimiento, y se integran además de forma transversal en el Definition of Done global (sección D).

### Mapa de Trazabilidad RF/RNF → Épicas → Historias

| Épica | RF de Origen | Historias de Usuario |
|---|---|---|
| EP-01: Gestión de Flota | RF-001 | US-001, US-002 |
| EP-02: Gestión de Pedidos | RF-002 | US-003, US-004 |
| EP-03: Motor de Optimización de Rutas | RF-003, RF-007 | US-005, US-006 |
| EP-04: Visualización y Mapas | RF-004 | US-007, US-008 |
| EP-05: Sostenibilidad e Indicadores | RF-005, RF-006 | US-009, US-010 |
| EP-06: Gestión de Conductores | RF-008 | US-011, US-012 |

| Enabler | RNF de Origen |
|---|---|
| EN-01: Auto-escalamiento del Backend | RNF-001, RNF-008 |
| EN-02: Cifrado y Seguridad de Datos | RNF-002 |
| EN-03: Failover y Alta Disponibilidad | RNF-003 |
| EN-04: Modo Conductor Accesible (WCAG 2.1 AA) | RNF-005, RNF-009 |
| EN-05: Optimización de Consultas (Green Software) | RNF-010 |
| EN-06: Pipeline CI/CD y Calidad de Código | RNF-007 |

---

## B. Épicas e Historias de Usuario

### EP-01: Gestión de Flota

**ID:** US-001
**Título:** Registrar un vehículo de la flota
**Épica Relacionada:** EP-01 Gestión de Flota
**Redacción:**
Como operador de flota,
quiero registrar un vehículo con su placa, tipo, capacidad, consumo y factor de emisión de CO₂,
para poder asignarlo posteriormente a rutas optimizadas.

**Criterios de Aceptación:**

Escenario: Registro exitoso de un vehículo nuevo
Dado que soy un operador autenticado en el módulo de flota
Cuando ingreso placa, tipo, capacidad, consumo y factor de emisión válidos y confirmo
Entonces el sistema registra el vehículo y lo muestra en el listado de flota activa

Escenario: Rechazo por datos inválidos
Dado que estoy registrando un vehículo
Cuando ingreso un año de fabricación posterior al año actual
Entonces el sistema rechaza el registro y muestra un mensaje de error explícito

---

**ID:** US-002
**Título:** Actualizar los datos de un vehículo existente
**Épica Relacionada:** EP-01 Gestión de Flota
**Redacción:**
Como operador de flota,
quiero actualizar los datos de un vehículo ya registrado,
para mantener actualizada la información usada por el motor de optimización.

**Criterios de Aceptación:**

Escenario: Actualización exitosa de un vehículo
Dado que un vehículo con placa existente ya está registrado
Cuando modifico su consumo de combustible y confirmo el cambio
Entonces el sistema actualiza el registro sin duplicar el vehículo

Escenario: Intento de duplicar placa
Dado que intento registrar un vehículo nuevo con una placa ya existente
Cuando elijo la opción "actualizar datos" en lugar de crear uno nuevo
Entonces el sistema actualiza el vehículo existente en vez de crear un duplicado

---

### EP-02: Gestión de Pedidos

**ID:** US-003
**Título:** Registrar un pedido con punto de referencia local
**Épica Relacionada:** EP-02 Gestión de Pedidos
**Redacción:**
Como operador de despacho,
quiero registrar un pedido usando un punto de referencia textual además de coordenadas GPS,
para poder atender direcciones sin nomenclatura estándar en zonas altas de Huancayo.

**Criterios de Aceptación:**

Escenario: Registro con punto de referencia
Dado que la dirección del cliente no tiene nomenclatura estándar
Cuando ingreso un punto de referencia y selecciono la ubicación aproximada en el mapa
Entonces el sistema registra el pedido asociado a esas coordenadas

Escenario: Ventana de tiempo inválida
Dado que estoy registrando un pedido
Cuando la hora de fin de la ventana de entrega es anterior a la hora de inicio
Entonces el sistema rechaza el registro y explica el motivo del error

---

**ID:** US-004
**Título:** Consultar el estado de mi pedido
**Épica Relacionada:** EP-02 Gestión de Pedidos
**Redacción:**
Como cliente final (bodega o mercado),
quiero consultar el estado y tiempo estimado de entrega de mi pedido,
para organizar la recepción de mi mercadería.

**Criterios de Aceptación:**

Escenario: Consulta de un pedido en ruta
Dado que mi pedido fue asignado a una ruta activa
Cuando consulto el estado de mi pedido
Entonces el sistema muestra el tiempo estimado de llegada y el estado actual

Escenario: Consulta de un pedido aún no asignado
Dado que mi pedido está pendiente de ruteo
Cuando consulto su estado
Entonces el sistema indica "Pendiente de asignación" sin mostrar un tiempo estimado

---

### EP-03: Motor de Optimización de Rutas

**ID:** US-005
**Título:** Generar rutas optimizadas del día
**Épica Relacionada:** EP-03 Motor de Optimización de Rutas
**Redacción:**
Como operador de despacho,
quiero generar automáticamente las rutas del día para todos los pedidos pendientes,
para minimizar distancia, combustible y emisiones de CO₂.

**Criterios de Aceptación:**

Escenario: Generación exitosa de rutas
Dado que existen pedidos pendientes y vehículos disponibles con capacidad suficiente
Cuando ejecuto "Generar rutas"
Entonces el sistema retorna una asignación de rutas en un tiempo menor o igual a 45 segundos

Escenario: Capacidad insuficiente de la flota
Dado que el volumen total de pedidos supera la capacidad de la flota disponible
Cuando ejecuto "Generar rutas"
Entonces el sistema genera rutas para los pedidos asignables y marca los restantes como "Capacidad insuficiente"

---

**ID:** US-006
**Título:** Re-optimizar rutas ante un pedido urgente
**Épica Relacionada:** EP-03 Motor de Optimización de Rutas
**Redacción:**
Como operador de despacho,
quiero re-optimizar las rutas activas cuando llega un pedido con prioridad express,
para atenderlo sin afectar las entregas ya completadas.

**Criterios de Aceptación:**

Escenario: Inserción de pedido urgente en ruta activa
Dado que existen rutas en ejecución y llega un pedido con prioridad "express"
Cuando confirmo la re-optimización
Entonces el sistema inserta el pedido en la ruta activa más cercana con capacidad disponible

Escenario: Avería de vehículo durante la ejecución
Dado que un vehículo con pedidos pendientes se reporta como averiado
Cuando lo marco como "No disponible"
Entonces el sistema reasigna sus pedidos pendientes a otros vehículos disponibles

---

### EP-04: Visualización y Mapas

**ID:** US-007
**Título:** Visualizar mi ruta asignada en el mapa (modo conductor)
**Épica Relacionada:** EP-04 Visualización y Mapas
**Redacción:**
Como conductor,
quiero ver mi ruta asignada del día en un mapa simple,
para saber el orden de mis entregas sin necesidad de interpretar datos técnicos.

**Criterios de Aceptación:**

Escenario: Visualización de ruta asignada
Dado que tengo una ruta asignada para el día
Cuando abro el modo conductor
Entonces el sistema muestra el trazado con los puntos de entrega numerados en orden de visita

Escenario: Zona sin datos de tráfico
Dado que un tramo de mi ruta no tiene datos de congestión disponibles
Cuando visualizo el mapa
Entonces el tramo se muestra como "Sin datos de tráfico" sin interrumpir el resto de la ruta

---

**ID:** US-008
**Título:** Visualizar el nivel de congestión por tramo
**Épica Relacionada:** EP-04 Visualización y Mapas
**Redacción:**
Como operador de despacho,
quiero ver el nivel de congestión de cada tramo de una ruta,
para anticipar retrasos y comunicarlos al cliente si es necesario.

**Criterios de Aceptación:**

Escenario: Visualización de congestión en tiempo real
Dado que existe una ruta generada con datos de tráfico disponibles
Cuando la selecciono desde el listado
Entonces el sistema muestra cada tramo coloreado según su nivel de congestión (verde/amarillo/rojo)

Escenario: Servicio de mapas no disponible
Dado que el servicio externo de mapas no responde
Cuando intento visualizar una ruta
Entonces el sistema muestra un mensaje de error y ofrece una vista alternativa en lista de paradas

---

### EP-05: Sostenibilidad e Indicadores

**ID:** US-009
**Título:** Consultar el dashboard de indicadores de sostenibilidad
**Épica Relacionada:** EP-05 Sostenibilidad e Indicadores
**Redacción:**
Como administrador,
quiero consultar los indicadores de distancia, CO₂, combustible ahorrado y cumplimiento,
para evaluar el desempeño ambiental y operativo de la flota.

**Criterios de Aceptación:**

Escenario: Consulta con datos disponibles
Dado que existen rutas ejecutadas en el periodo consultado
Cuando accedo al dashboard y selecciono el rango de fechas
Entonces el sistema muestra los cinco indicadores de sostenibilidad para ese periodo

Escenario: Consulta sin datos en el periodo
Dado que no existen rutas ejecutadas en el rango seleccionado
Cuando consulto el dashboard
Entonces el sistema muestra valores en cero con el mensaje "Sin datos para el periodo seleccionado"

---

**ID:** US-010
**Título:** Descargar el reporte de sostenibilidad en PDF
**Épica Relacionada:** EP-05 Sostenibilidad e Indicadores
**Redacción:**
Como administrador,
quiero descargar un reporte en PDF con el resumen de emisiones y costos del ciclo de vida,
para presentarlo como evidencia de cumplimiento ambiental.

**Criterios de Aceptación:**

Escenario: Generación exitosa del reporte
Dado que selecciono un rango de fechas con rutas ejecutadas
Cuando ejecuto "Generar reporte"
Entonces el sistema produce un archivo PDF descargable en menos de 10 segundos

Escenario: Periodo con datos parciales
Dado que solo parte del periodo solicitado tiene rutas ejecutadas
Cuando genero el reporte
Entonces el sistema lo genera con los datos disponibles e indica los días sin información

---

### EP-06: Gestión de Conductores

**ID:** US-011
**Título:** Registrar un conductor
**Épica Relacionada:** EP-06 Gestión de Conductores
**Redacción:**
Como administrador,
quiero registrar a un conductor con sus datos y disponibilidad horaria,
para poder asignarlo a rutas respetando la Ley de Tránsito.

**Criterios de Aceptación:**

Escenario: Registro exitoso de conductor
Dado que ingreso nombre, DNI, categoría de licencia y disponibilidad horaria válidos
Cuando confirmo el registro
Entonces el sistema almacena al conductor y lo habilita para asignación de rutas

Escenario: Jornada que excede el límite legal
Dado que intento asignar una jornada mayor a 8 horas continuas a un conductor
Cuando confirmo la asignación
Entonces el sistema rechaza la operación citando el límite establecido por la Ley N° 30224

---

**ID:** US-012
**Título:** Confirmar una entrega desde el modo conductor
**Épica Relacionada:** EP-06 Gestión de Conductores
**Redacción:**
Como conductor,
quiero confirmar la entrega de un pedido desde mi celular,
para que el sistema actualice el estado del pedido y de la ruta.

**Criterios de Aceptación:**

Escenario: Confirmación exitosa de entrega
Dado que llego al punto de entrega de un pedido asignado
Cuando registro la confirmación de entrega con hora y ubicación
Entonces el sistema marca el pedido como "Entregado" y actualiza el avance de la ruta

Escenario: Intento de marcar entrega sin confirmación
Dado que un pedido no ha sido confirmado desde el modo conductor
Cuando el sistema procesa el cierre del día
Entonces el pedido permanece en estado "Pendiente" y se reporta como incidencia

---

## C. Historias Técnicas (Enablers)

**ID:** EN-01
**Título:** Configurar auto-escalamiento horizontal del backend
**Origen:** RNF-001 (Eficiencia de Desempeño), RNF-008 (Escalabilidad)
**Redacción:**
Como equipo de DevOps,
quiero configurar el auto-escalamiento horizontal de los contenedores del backend,
para mantener el SLA de generación de rutas (≤ 45 s) incluso al crecer el volumen de pedidos.

**Criterios de Aceptación:**

Escenario: Escalamiento ante carga alta
Dado que el número de pedidos concurrentes supera el umbral configurado
Cuando el sistema detecta la carga
Entonces se despliegan automáticamente instancias adicionales del backend

Escenario: Reducción de instancias en baja demanda
Dado que la carga desciende por debajo del umbral mínimo
Cuando el sistema lo detecta
Entonces se reduce el número de instancias activas para optimizar el costo de infraestructura

---

**ID:** EN-02
**Título:** Implementar cifrado de datos sensibles
**Origen:** RNF-002 (Seguridad)
**Redacción:**
Como equipo de seguridad,
quiero cifrar los datos sensibles de clientes y conductores en reposo y en tránsito,
para cumplir con la Ley N° 29733 de Protección de Datos Personales.

**Criterios de Aceptación:**

Escenario: Cifrado en tránsito
Dado que un usuario envía credenciales de acceso
Cuando la petición viaja por la red
Entonces se transmite exclusivamente bajo TLS 1.3

Escenario: Cifrado en reposo
Dado que se almacena el DNI de un conductor en la base de datos
Cuando se persiste el registro
Entonces el campo se guarda cifrado con AES-256

---

**ID:** EN-03
**Título:** Configurar failover automático de base de datos
**Origen:** RNF-003 (Disponibilidad)
**Redacción:**
Como equipo de DevOps,
quiero configurar un mecanismo de failover automático de la base de datos,
para cumplir el SLA de disponibilidad de 99.5% en horario operativo.

**Criterios de Aceptación:**

Escenario: Caída del nodo primario
Dado que el nodo primario de base de datos deja de responder
Cuando el sistema de monitoreo lo detecta
Entonces el tráfico conmuta automáticamente hacia el nodo secundario en menos de 60 segundos

Escenario: Recuperación del nodo primario
Dado que el nodo primario vuelve a estar disponible
Cuando se restablece la conexión
Entonces el sistema lo reincorpora como nodo secundario sin interrumpir el servicio

---

**ID:** EN-04
**Título:** Implementar el modo conductor accesible (WCAG 2.1 AA)
**Origen:** RNF-005 (Usabilidad), RNF-009 (Accesibilidad)
**Redacción:**
Como equipo de frontend,
quiero implementar el modo conductor con iconografía de alto contraste y navegación simplificada,
para que conductores con bajo dominio tecnológico puedan usarlo sin capacitación extensa.

**Criterios de Aceptación:**

Escenario: Verificación automática de accesibilidad
Dado que se despliega una nueva versión del modo conductor
Cuando se ejecuta la herramienta automatizada de verificación WCAG
Entonces no se reportan errores críticos de nivel AA

Escenario: Prueba de usabilidad con conductores reales
Dado que se realiza una prueba guiada con 10 conductores
Cuando se mide el tiempo de aprendizaje de la interfaz
Entonces el 90% completa la tarea básica en 10 minutos o menos

---

**ID:** EN-05
**Título:** Optimizar consultas SQL y reducir consumo de cómputo
**Origen:** RNF-010 (Eficiencia Energética / Green Software)
**Redacción:**
Como equipo de backend,
quiero optimizar las consultas críticas mediante índices geoespaciales,
para reducir el consumo de CPU y la huella de carbono del propio sistema.

**Criterios de Aceptación:**

Escenario: Verificación de mejora de rendimiento
Dado que se aplican los índices definidos en el modelo físico de base de datos
Cuando se ejecuta `EXPLAIN ANALYZE` sobre las consultas críticas
Entonces el tiempo de CPU se reduce en al menos 15% respecto a la versión sin índices

Escenario: Monitoreo continuo de consultas lentas
Dado que el sistema está en producción
Cuando una consulta supera el umbral de tiempo configurado
Entonces se registra una alerta para revisión del equipo de backend

---

**ID:** EN-06
**Título:** Configurar pipeline de CI/CD con calidad de código
**Origen:** RNF-007 (Mantenibilidad)
**Redacción:**
Como equipo de desarrollo,
quiero configurar un pipeline de integración y despliegue continuo con análisis estático,
para garantizar que cada cambio cumpla el Definition of Done antes de llegar a producción.

**Criterios de Aceptación:**

Escenario: Bloqueo por baja cobertura de pruebas
Dado que un Pull Request reduce la cobertura de pruebas por debajo del 80%
Cuando se ejecuta el pipeline de CI
Entonces el pipeline falla y bloquea el merge hasta corregir la cobertura

Escenario: Despliegue automático a Staging
Dado que un Pull Request es aprobado y pasa todas las validaciones de CI
Cuando se hace merge a la rama principal
Entonces el sistema se despliega automáticamente al ambiente de Staging

---

## D. Definition of Done (DoD) Global del Proyecto

Toda Historia de Usuario o Enabler se considera **"Done"** únicamente cuando cumple, de forma simultánea, los siguientes criterios objetivos:

1. **Cobertura de pruebas unitarias ≥ 80%** sobre el código nuevo o modificado, verificada automáticamente en el pipeline de CI/CD.
2. **Análisis estático sin vulnerabilidades críticas**, validado mediante SonarQube o CodeQL, con cero hallazgos de severidad "Critical" o "Blocker".
3. **Revisión de código (Peer Review) aprobada** por al menos un integrante técnico distinto del autor, mediante Pull Request en el repositorio Git.
4. **Despliegue automatizado ejecutable en el ambiente de Staging**, sin intervención manual y sin errores en el pipeline.
5. **Documentación de API y/o código actualizada**, incluyendo la especificación OpenAPI/Swagger de los endpoints afectados y comentarios de código donde corresponda.
6. La funcionalidad cumple **todos los Criterios de Aceptación** (Gherkin) definidos en su Historia de Usuario o Enabler correspondiente.

Ninguna Historia se marca como "Done" en el tablero Scrum si incumple alguno de los seis criterios anteriores.
