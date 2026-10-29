[← Volver al README Principal](../../../README.md)

# Preparación: Revisión del Sprint y Retrospectiva del Sprint

**Proyecto:** EcoLogística Huancayo — Optimizador de Rutas Sostenibles para "DistriRápido S.A.C."
**Fecha:** 25 de septiembre de 2026 | **Sprint:** 1

---

## 1. Revisión del Sprint (Sprint Review)

**Objetivo:** presentar al docente y a los interesados el incremento funcional construido en el Sprint 1, contrastándolo contra el Sprint Goal.

### 1.1. Agenda Sugerida (30-40 minutos)

| Tiempo | Actividad | Responsable |
|---|---|---|
| 0-5 min | Recordar el Sprint Goal y los elementos comprometidos | Scrum Master |
| 5-25 min | Demostración en vivo del incremento: login, registro de flota, registro de pedidos, consulta de estado | Equipo de desarrollo |
| 25-32 min | Comparación de lo planificado vs. lo entregado (Backlog vs. Incremento) | Project Manager |
| 32-38 min | Retroalimentación de los interesados (docente, representantes simulados de "DistriRápido S.A.C.") | Interesados |
| 38-40 min | Ajustes propuestos al Backlog para el Sprint 2 | Equipo completo |

### 1.2. Guion de Apertura (para leer)

> "Buenos días/tardes. Vamos a mostrarles el resultado del primer Sprint del proyecto EcoLogística Huancayo. Nuestra meta para este sprint fue tener lista la infraestructura base del sistema y el módulo de gestión de flota y pedidos funcionando de punta a punta. A continuación, se lo mostramos en vivo."

### 1.3. Preguntas Guía para Recoger Retroalimentación

- ¿El flujo de registro de un pedido con punto de referencia (sin dirección estándar) resulta claro para un operador de Huancayo?
- ¿La información solicitada al registrar un vehículo es suficiente, o falta algún dato relevante del contexto local?
- ¿Hay alguna prioridad del negocio que deba adelantarse al Sprint 2 en lugar de mantener el orden actual del Backlog?

### 1.4. Checklist Previo a la Revisión

- [ ] El ambiente de Staging está desplegado y accesible.
- [ ] Se cuenta con datos de prueba (vehículos y pedidos de ejemplo) cargados.
- [ ] El equipo validó que el Definition of Done se cumple en los 6 elementos comprometidos.
- [ ] Se preparó el Product Increment (`20260925 - 04 Product Increment - Sprint 1.md`) como respaldo documental de la demostración.

---

## 2. Retrospectiva del Sprint (Sprint Retrospective)

**Objetivo:** que el equipo reflexione sobre cómo trabajó durante el Sprint 1 — no sobre el producto, sino sobre el proceso — e identifique mejoras concretas para el Sprint 2.

### 2.1. Formato: Empezar / Dejar de Hacer / Continuar (Start / Stop / Continue)

| Columna | Pregunta Guía |
|---|---|
| **Empezar a hacer** | ¿Qué práctica no tuvimos este sprint y nos hubiera ayudado? |
| **Dejar de hacer** | ¿Qué nos quitó tiempo o generó fricción sin aportar valor? |
| **Continuar haciendo** | ¿Qué funcionó bien y debemos mantener en el Sprint 2? |

### 2.2. Agenda Sugerida (20-25 minutos)

| Tiempo | Actividad |
|---|---|
| 0-3 min | Recordar el propósito de la retrospectiva: mejorar el proceso, no señalar culpables |
| 3-12 min | Cada integrante escribe/comparte sus aportes en las tres columnas |
| 12-18 min | Agrupar ideas similares y priorizar 2-3 acciones concretas |
| 18-23 min | Definir un responsable y una fecha para cada acción priorizada |
| 23-25 min | Cierre: cada integrante comparte en una frase cómo se sintió con el sprint |

### 2.3. Preguntas de Apoyo

- ¿La estimación en Story Points de este sprint se ajustó a la realidad, o subestimamos/sobrestimamos alguna tarea?
- ¿El riesgo RSK-02 (curva de aprendizaje en metaheurísticas) impactó de alguna forma este sprint, aunque el motor de optimización no estaba planificado aún?
- ¿Hubo bloqueos por dependencias entre integrantes (ej. backend esperando al modelo de base de datos) que se puedan evitar en el Sprint 2?

### 2.4. Plantilla de Registro de Acciones

| # | Acción Acordada | Responsable | Para cuándo |
|---|---|---|---|
| 1 | | | |
| 2 | | | |
| 3 | | | |

*(El equipo completa esta tabla durante la retrospectiva y la traslada como entrada al Sprint 2 Planning.)*
