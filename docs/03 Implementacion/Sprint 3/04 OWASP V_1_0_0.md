[← Volver al README Principal](../../../README.md)

# Evaluación de Seguridad OWASP — Sprint 3

| Campo | Detalle |
|---|---|
| **Proyecto** | EcoLogística Huancayo — Optimizador de Rutas Sostenibles para "DistriRápido S.A.C." |
| **Sprint** | 3 (semanas 8 a 11) |
| **Versión del documento** | 1.0.0 |
| **Fecha** | 2026-10-30 |
| **Elaborado por** | Equipo del proyecto |
| **Equipo** | Manuel Yeferson Parraga Recuay, Sheila Suarez Suarez, David André Guevara Moscoso, Jair Felix Romero |
| **Docente** | Job Daniel Gamarra Moreno |

---

## 1. Objetivo

Evaluar el sistema frente a las 10 categorías OWASP exigidas por la rúbrica 2025, usando SonarQube y pruebas de seguridad, conforme a RNF-002.

## 2. Checklist OWASP Top 10

| ID | Riesgo OWASP Top 10 (2025) | Verificación en el sistema | Resultado | Evidencia |
|---|---|---|---|---|
| A01:2025 | Broken Access Control | Un rol no puede acceder a módulos fuera de su matriz RBAC | Limpio | Pruebas de permisos y aislamiento por rol |
| A02:2025 | Cryptographic Failures | Contraseñas con bcrypt, TLS en tránsito, datos sensibles cifrados | Bajo revisión | Hash y cifrado local verificados; TLS depende de staging |
| A03:2025 | Injection | Consultas parametrizadas; sin inyección SQL en endpoints | Limpio | SonarQube: 0 vulnerabilidades; SQLAlchemy parametriza consultas |
| A04:2025 | Insecure Design | Validaciones de entrada y reglas de negocio en el servidor | Limpio | Esquemas y 54 pruebas backend aprobados |
| A05:2025 | Security Misconfiguration | Secretos externos, CORS restringido y depuración desactivada | Bajo revisión | Credenciales demo retiradas de producción; falta staging |
| A06:2025 | Vulnerable and Outdated Components | Dependencias del backend y frontend | Limpio | `pip-audit` y `npm audit`: 0 vulnerabilidades conocidas |
| A07:2025 | Identification and Authentication Failures | Bloqueo tras 3 intentos y expiración de sesión | Limpio | Pruebas de autenticación, bloqueo y token aprobadas |
| A08:2025 | Software and Data Integrity Failures | CI verifica antes de un despliegue manual | Bajo revisión | Quality Gate PASSED; despliegue requiere decisión explícita |
| A09:2025 | Security Logging and Monitoring Failures | Auditoría de accesos y acciones críticas | Limpio | Registro de eventos implementado y probado |
| A10:2025 | Server-Side Request Forgery (SSRF) | Proveedores externos controlados por configuración | Bajo revisión | SonarQube: 0 hotspots; prueba dinámica de SSRF pendiente |

## 3. Vulnerabilidades Encontradas

| ID | Descripción | Severidad | Corrección | Estado |
|---|---|---|---|---|
| V-01 | **A05 Configuración incorrecta:** credenciales demo visibles en producción | Media | Se limitaron los accesos demo al modo de desarrollo | Corregido |
| V-02 | **A08 Integridad:** despliegue automático sin decisión explícita | Media | Se cambió a `workflow_dispatch` con parámetro manual | Corregido |
| V-03 | **A06 Disponibilidad:** pruebas unitarias llamaban a OSM | Media | Se usó un fixture de red determinista | Corregido |

**Resumen:** SonarQube reportó 0 vulnerabilidades y 0 Security Hotspots. Se corrigieron 3 riesgos de configuración e integridad; TLS, staging y una prueba dinámica de SSRF permanecen bajo revisión externa.

## 4. Herramientas

| Herramienta | Uso |
|---|---|
| SonarQube Community Build 26.10 | 0 vulnerabilidades, 0 hotspots y Security Rating A |
| Pruebas de API | Autenticación, autorización y validación de entradas |
| pip-audit / npm audit | Auditoría sin vulnerabilidades conocidas |

## Historial de Control de Cambios

| Versión | Fecha | Autor | Descripción del cambio |
|---|---|---|---|
| 1.0.0 | 2026-10-30 | Equipo del proyecto | Información completada con evidencia del repositorio |
