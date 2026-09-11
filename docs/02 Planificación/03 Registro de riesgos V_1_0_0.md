[← Volver al README Principal](../../README.md)

# Registro de Riesgos

**Proyecto:** EcoLogística Huancayo — Optimizador de Rutas Sostenibles para "DistriRápido S.A.C."
**Versión:** 1.0.0 | **Fecha:** 28 de agosto de 2026
**Estándares de referencia:** PMBOK 8ª Edición / CMMI-DEV

---

## Fórmula de Cálculo

**Severidad (Exposición) = Probabilidad (1 a 5) × Impacto (1 a 5)**

- **Probabilidad:** 1 (Muy baja) a 5 (Muy alta).
- **Impacto:** 1 (Insignificante) a 5 (Catastrófico).
- **Severidad:** Low (1-6) · Medium (8-12) · High (15-25).

---

## Matriz de Evaluación de Riesgos

| ID | Descripción del Riesgo | Categoría | Prob. | Imp. | Severidad | Plan de Mitigación (Preventivo) | Plan de Contingencia (Reactivo) | Responsable |
|---|---|---|---|---|---|---|---|---|
| RSK-01 | Indisponibilidad de servicios cloud por límites de cuota gratuita del proveedor. | Técnica / Infraestructura | 2 | 4 | 8 (Media) | Monitorear consumo de cuotas e implementar alertas de umbral al 70%. | Migrar temporalmente los contenedores a una cuenta secundaria de respaldo. | DevOps Engineer |
| RSK-02 | Curva de aprendizaje elevada del equipo en algoritmos metaheurísticos (VRPTW/Green VRP). | Técnica / Capacidades | 4 | 4 | 16 (Alta) | Realizar sesiones internas de nivelación con bibliografía de referencia y prototipos simples antes del Sprint 2. | Reducir el alcance inicial a un Algoritmo Genético básico y escalar la complejidad en sprints posteriores. | Software Architect |
| RSK-03 | Cobertura insuficiente de datos de tráfico en tiempo real (Waze/Google Maps) en zonas periféricas de Huancayo. | Técnica / Datos Externos | 4 | 3 | 12 (Media) | Validar la cobertura real de las APIs en las zonas críticas durante la Iteración 1. | Habilitar carga manual de reportes de tráfico como mecanismo de respaldo (RF-004, Ruta Feliz). | Backend Developer |
| RSK-04 | Datos geográficos incompletos de OpenStreetMap para vías no pavimentadas de zonas altas (Chilca, Cochas). | Técnica / Datos Geoespaciales | 3 | 3 | 9 (Media) | Complementar manualmente la cartografía de zonas críticas antes del hito de generación de rutas. | Clasificar dichas vías como "no verificadas" y excluirlas por defecto de la optimización automática. | GIS / Backend Developer |
| RSK-05 | Disponibilidad limitada de los integrantes del equipo por carga académica simultánea. | Recursos Humanos | 4 | 3 | 12 (Media) | Planificación de sprints con margen de holgura del 15% sobre la capacidad estimada del equipo. | Reasignar tareas críticas a los integrantes con mayor disponibilidad en la semana afectada. | Scrum Master |
| RSK-06 | Incumplimiento del SLA de rendimiento del algoritmo (≤ 45 s) al escalar a mayor número de pedidos. | Técnica / Rendimiento | 3 | 4 | 12 (Media) | Pruebas de carga incrementales desde la Iteración 2, con perfiles de 50, 100 y 150 pedidos. | Reducir el espacio de búsqueda del algoritmo (parámetros de la metaheurística) para priorizar tiempo sobre precisión marginal. | QA Engineer |
| RSK-07 | Vulnerabilidades de seguridad no detectadas en el manejo de datos personales de conductores y clientes. | Seguridad / Normativa | 2 | 5 | 10 (Media) | Integrar SonarQube/CodeQL en el pipeline de CI/CD desde el primer sprint (EN-06). | Aplicar el protocolo de respuesta a incidentes: aislar el servicio afectado y notificar según la Ley N° 29733. | Security / DevOps Engineer |
| RSK-08 | Retrasos en la validación funcional por baja disponibilidad de representantes del negocio ("DistriRápido S.A.C." simulado) y conductores de prueba. | Stakeholders | 3 | 3 | 9 (Media) | Coordinar y confirmar sesiones de validación con al menos una semana de antelación (ver Registro de Interesados). | Ejecutar la validación con un subconjunto reducido de usuarios de prueba disponibles, y completarla en la siguiente ventana. | Project Manager |
| RSK-09 | Condiciones climáticas de Huancayo (heladas, lluvias) no reflejadas correctamente en el modelo de rutas durante las pruebas. | Operativa / Contexto Local | 2 | 2 | 4 (Baja) | Incorporar un factor de ajuste estacional simplificado desde el diseño de datos (C-06). | Documentar la limitación como alcance futuro si no se logra implementar a tiempo, sin bloquear la entrega del MVP. | Software Architect |
| RSK-10 | Fuga de alcance (scope creep) al incorporar nuevas condiciones locales no previstas durante el levantamiento. | Gestión de Proyecto | 3 | 3 | 9 (Media) | Control de cambios formal: toda modificación de alcance debe registrarse en el historial de control de cambios de `docs/01 Inicio/` con incremento de versión semántica. | Congelar el alcance del Sprint en curso y trasladar la solicitud al backlog para priorización en el siguiente sprint. | Project Manager |

---

## Resumen por Nivel de Severidad

| Severidad | Cantidad de Riesgos | IDs |
|---|---|---|
| Alta (15-25) | 1 | RSK-02 |
| Media (8-12) | 8 | RSK-01, RSK-03, RSK-04, RSK-05, RSK-06, RSK-07, RSK-08, RSK-10 |
| Baja (1-6) | 1 | RSK-09 |

El riesgo **RSK-02** (curva de aprendizaje en metaheurísticas) concentra la mayor exposición del proyecto y se gestiona de forma prioritaria en la planificación del Sprint 1, alineado con la mitigación declarada en el Registro de Supuestos y Restricciones (`docs/01 Inicio/04. Registro de supuestos y restricciones V_1_0_0.md`, S-03).
