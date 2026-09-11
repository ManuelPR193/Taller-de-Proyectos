[← Volver al README Principal](../../README.md)

# Presupuesto del Proyecto

**Proyecto:** EcoLogística Huancayo — Optimizador de Rutas Sostenibles para "DistriRápido S.A.C."
**Versión:** 1.0.0 | **Fecha:** 28 de agosto de 2026
**Moneda:** Soles peruanos (S/)
**Alcance presupuestado:** desarrollo del MVP académico (14 semanas / 4 iteraciones), por un equipo de 4 estudiantes con dedicación parcial (compatible con su carga de otros cursos).

> **Nota de enfoque:** al tratarse de un Proyecto Final de Asignatura y no de un encargo comercial, las tarifas y horas usadas a continuación son **referenciales**, calculadas como costo de oportunidad del tiempo del equipo (no un pago real), y se apoyan en herramientas de **plan gratuito / educativo** siempre que estuvieron disponibles, en lugar de licencias comerciales de nivel empresarial.

---

## 1. Costo de Recursos Humanos (CAPEX)

Estimado sobre una dedicación aproximada de 10 a 15 horas semanales por integrante durante las 14 semanas del proyecto, distribuidas entre los 4 roles que el propio equipo asume de forma rotativa.

| Rol | Horas Asignadas (MVP) | Tarifa Referencial por Hora (S/) | Costo Total (S/) |
|---|---|---|---|
| Project Manager (rol asumido por un integrante) | 80 | S/ 20.00 | S/ 1,600.00 |
| Software Architect (rol asumido por un integrante) | 70 | S/ 22.00 | S/ 1,540.00 |
| Desarrollador Backend / Motor de Optimización | 150 | S/ 18.00 | S/ 2,700.00 |
| Desarrollador Frontend / Modo Conductor | 150 | S/ 18.00 | S/ 2,700.00 |
| QA (pruebas, coordinado entre el equipo) | 60 | S/ 15.00 | S/ 900.00 |
| UI/UX (mockups y modo conductor accesible) | 50 | S/ 15.00 | S/ 750.00 |
| **Subtotal Recursos Humanos** | **560** | | **S/ 10,190.00** |

## 2. Costo de Licenciamiento y Herramientas

| Concepto | Detalle | Costo Estimado (S/) |
|---|---|---|
| Atlassian Jira Software | Plan Free (hasta 10 usuarios) — suficiente para un equipo de 4 integrantes | S/ 0.00 |
| Figma | Plan Education (gratuito con correo institucional) | S/ 0.00 |
| SonarQube / SonarCloud | Plan gratuito para repositorios públicos/académicos | S/ 0.00 |
| IDEs de desarrollo (VS Code y extensiones) | Herramientas de código abierto | S/ 0.00 |
| Dominio y hosting del frontend | Subdominio gratuito de la plataforma de despliegue (ej. Vercel/Netlify) durante el ciclo académico | S/ 0.00 |
| **Subtotal Licenciamiento** | | **S/ 0.00** |

## 3. Costo de Infraestructura Cloud y Servicios (OPEX)

| Concepto | Detalle | Costo Estimado (S/) |
|---|---|---|
| Backend en contenedores | Capa gratuita de un proveedor cloud (ej. Render/Railway free tier) | S/ 0.00 |
| Base de datos PostgreSQL + PostGIS | Plan gratuito de un proveedor gestionado (ej. Supabase/Neon free tier) | S/ 0.00 |
| Caché Redis | Plan gratuito (ej. Upstash free tier) | S/ 0.00 |
| CI/CD | GitHub Actions, capa gratuita para repositorios del proyecto | S/ 0.00 |
| Margen para excedentes de capa gratuita | Previsión ante un eventual consumo puntual por encima del free tier durante pruebas de carga | S/ 100.00 |
| **Subtotal Infraestructura Cloud** | | **S/ 100.00** |

---

## 4. Tabla Resumen Financiera

| Categoría | Costo Subtotal (S/) | Porcentaje del Total |
|---|---|---|
| 1. Recursos Humanos (CAPEX) | S/ 10,190.00 | 99.0% |
| 2. Licenciamiento de Software | S/ 0.00 | 0.0% |
| 3. Infraestructura Cloud (OPEX) | S/ 100.00 | 1.0% |
| **SUBTOTAL DE PROYECTO** | **S/ 10,290.00** | **100.0%** |
| 4. Reserva de Contingencia (10%) | S/ 1,029.00 | N/A |
| **PRESUPUESTO TOTAL ESTIMADO** | **S/ 11,319.00** | **100.0%** |

---

## 5. Justificación de la Reserva de Contingencia

Se establece una **Reserva de Contingencia del 10%** sobre el subtotal del proyecto (S/ 1,029.00), en el extremo inferior del rango sugerido (10%-15%), acorde al perfil de riesgo moderado de un proyecto académico que opera casi en su totalidad sobre planes gratuitos. Cubre principalmente la exposición del riesgo de mayor severidad identificado en el Registro de Riesgos (**RSK-02**, curva de aprendizaje en algoritmos metaheurísticos), que de materializarse implicaría horas adicionales de arquitectura no contempladas en el subtotal base.

## 6. Referencia al Contexto de Negocio

Este presupuesto corresponde únicamente al **costo de oportunidad del desarrollo académico del MVP** por parte del equipo del PFA, y es intencionalmente modesto por tratarse de un proyecto estudiantil sostenido con herramientas de plan gratuito. Debe distinguirse del presupuesto operativo declarado en la consigna original del negocio para una implementación real a escala empresarial (S/ 500,000 de inversión inicial y S/ 120,000 anuales de mantenimiento y soporte, según `docs/01 Inicio/02. Acta de constitución V_1_0_0.md`), el cual sigue siendo el techo presupuestal de referencia para el escenario de negocio simulado, no para el esfuerzo real del equipo.
