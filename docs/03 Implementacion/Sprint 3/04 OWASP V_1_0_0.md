[← Volver al README Principal](../../../README.md)

# Evaluación de Seguridad OWASP — Sprint 3

| Campo | Detalle |
|---|---|
| **Proyecto** | EcoLogística Huancayo — Optimizador de Rutas Sostenibles para "DistriRápido S.A.C." |
| **Sprint** | 3 (semanas 8 a 11) |
| **Versión del documento** | 1.0.0 |
| **Fecha** | [2026-10-24] |
| **Elaborado por** | [Manuel Parraga] |
| **Equipo** | Manuel Yeferson Parraga Recuay, Sheila Suarez Suarez, David André Guevara Moscoso, Jair Felix Romero |
| **Docente** | Job Daniel Gamarra Moreno |

---

## 1. Objetivo

Evaluar el sistema frente a los 10 riesgos más críticos de seguridad web de OWASP, conforme a RNF-002 (0% de vulnerabilidades críticas explotables).

## 2. Checklist OWASP Top 10

| ID | Riesgo OWASP Top 10 (2021) | Verificación en el sistema | Resultado | Evidencia |
|---|---|---|---|---|
| A01 | Control de acceso roto | Un rol no puede acceder a módulos fuera de su matriz RBAC | [Cumple / No cumple / No aplica] | |
| A02 | Fallos criptográficos | Contraseñas con bcrypt, TLS en tránsito, datos sensibles cifrados | [Cumple / No cumple / No aplica] | |
| A03 | Inyección | Consultas parametrizadas; sin inyección SQL en endpoints | [Cumple / No cumple / No aplica] | |
| A04 | Diseño inseguro | Validaciones de entrada en esquemas; reglas de negocio aplicadas en el servidor | [Cumple / No cumple / No aplica] | |
| A05 | Configuración de seguridad incorrecta | Clave secreta fuera del código, CORS restringido, modo depuración desactivado | [Cumple / No cumple / No aplica] | |
| A06 | Componentes vulnerables y desactualizados | Revisión de dependencias del backend y del frontend | [Cumple / No cumple / No aplica] | |
| A07 | Fallos de identificación y autenticación | Bloqueo tras 3 intentos fallidos (RN-001), expiración de sesión | [Cumple / No cumple / No aplica] | |
| A08 | Fallos de integridad de software y datos | Pipeline CI/CD con verificación antes del despliegue | [Cumple / No cumple / No aplica] | |
| A09 | Fallos de registro y monitoreo | Registro de auditoría de accesos y acciones críticas | [Cumple / No cumple / No aplica] | |
| A10 | Falsificación de solicitudes del lado del servidor (SSRF) | Llamadas a APIs externas (mapas y tráfico) restringidas a dominios permitidos | [Cumple / No cumple / No aplica] | |

## 3. Vulnerabilidades Encontradas

| ID | Descripción | Severidad | Corrección | Estado |
|---|---|---|---|---|
| V-01 | **A01 Control de acceso roto:** el endpoint de descarga del reporte PDF no verificaba el rol del usuario | Media | Se aplicó el control de acceso por rol: solo Administrador y Auditor pueden descargar reportes | Corregido |
| V-02 | **A05 Configuración incorrecta:** en el ambiente de pruebas el CORS aceptaba cualquier origen | Media | Se restringió a la dirección del frontend y se movió la configuración a variables de entorno | Corregido |
| V-03 | **A06 Componentes desactualizados:** `pip-audit` detectó una librería del backend con una vulnerabilidad conocida de severidad baja | Baja | Se actualizó la dependencia a la versión corregida | Corregido |

**Resumen:** 3 vulnerabilidades encontradas, ninguna crítica, y las 3 corregidas en el sprint.

## 4. Herramientas

| Herramienta | Uso |
|---|---|
| OWASP ZAP | Escaneo dinámico de la aplicación |
| SonarQube / CodeQL | Análisis estático |
| pip-audit / npm audit | Auditoría de dependencias |

## Historial de Control de Cambios

| Versión | Fecha | Autor | Descripción del cambio |
|---|---|---|---|
| 1.0.0 | [AAAA-MM-DD] | [Autor] | Versión inicial del documento |
