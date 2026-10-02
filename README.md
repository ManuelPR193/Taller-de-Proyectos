# 🌿 EcoLogística Huancayo 🚛

> **Optimizador de Rutas Sostenibles de Última Milla (VRPTW & Green VRP)** desarrollado para la empresa **"DistriRápido S.A.C."** como Proyecto Final de Asignatura (PFA).

---

## 📌 Información del Proyecto

- **Asignatura:** Taller de Proyectos
- **Docente:** Job Daniel Gamarra Moreno
- **Ubicación de Impacto:** Valle del Mantaro (Huancayo, El Tambo, Chilca, Pilcomayo)
- **Integrantes del Equipo:**
  - 👨‍💻 **Manuel Yeferson Parraga Recuay**
  - 👩‍💻 **Sheila Suarez Suarez**
  - 👨‍💻 **David André Guevara Moscoso**
  - 👨‍💻 **Jair Felix Romero**

---

## 🚀 Resumen Ejecutivo

**EcoLogística Huancayo** es una plataforma web integral diseñada para resolver los desafíos logísticos de distribución urbana en el Valle del Mantaro. La solución combina algoritmos de optimización combinatoria (**Vehicle Routing Problem with Time Windows - VRPTW**) con enfoques de sostenibilidad medioambiental (**Green VRP**), logrando reducir las emisiones de CO₂, el consumo de combustible y los costos operativos de la empresa *DistriRápido S.A.C.*

---

## ✨ Características Principales

- 📊 **Dashboard de Sostenibilidad:** Métricas en tiempo real de emisiones de CO₂ (kg), ahorro de combustible (L), porcentaje de puntualidad y estimación de árboles equivalentes para compensación ambiental.
- ⚙️ **Motor de Optimización Inteligente (Google OR-Tools):** Asignación eficiente de pedidos con restricciones de capacidad vehicular (kg/m³), ventanas de tiempo de clientes y jornadas laborales máximas (RN-003).
- 📍 **Mapa Interactivo (Leaflet / OpenStreetMap):** Trazado dinámico de rutas de entrega, secuencia numerada de paradas y alertas geoespaciales para vías de alto riesgo.
- ⚡ **Re-optimización Dinámica (Pedidos Exprés):** Reorganización automática de rutas activas ante la llegada de pedidos urgentes sin alterar entregas ya completadas (RN-004).
- 📲 **Modo Conductor (PWA / Responsive):** Interfaz optimizada para móviles que permite a los repartidores visualizar su ruta, reportar entregas en tiempo real y registrar timestamp con geolocalización (RN-010).
- 📄 **Reportes Ejecutivos en PDF:** Generación e impresión automatizada de informes de huella de carbono y costos operativos mediante ReportLab (RF-006).

---

## 🛠️ Stack Tecnológico

| Capa | Tecnologías Utilizadas |
|---|---|
| **Backend API** | Python 3.12, FastAPI, Uvicorn, SQLAlchemy |
| **Frontend Web** | React 18, Vite, JavaScript (ES6+), Vanilla CSS3 |
| **Motor de Optimización** | Google OR-Tools (`pywrapcp`), Haversine Geo-distance |
| **Mapas y Geoespacial** | Leaflet.js, React-Leaflet, OpenStreetMap |
| **Generación de Reportes** | ReportLab (PDF Engine) |
| **Base de Datos** | SQLite (Desarrollo) / PostgreSQL 16 + PostGIS (Producción proyectada) |
| **Seguridad & Auth** | OAuth2 con Tokens JWT, Passlib (Bcrypt hashing) |

---

## 📁 Estructura del Proyecto

```text
Taller-de-Proyectos/
├── backend/                     # API RESTful en FastAPI
│   ├── app/
│   │   ├── api/endpoints/       # Rutas de la API (Auth, Vehículos, Pedidos, Rutas, etc.)
│   │   ├── core/                # Configuración global y seguridad JWT
│   │   ├── db/                  # Sesión de base de datos SQLAlchemy
│   │   ├── models/              # Modelos de entidad ORM (domain.py)
│   │   ├── schemas/             # Esquemas de validación Pydantic
│   │   └── services/            # Solver VRPTW (OR-Tools) y Generador PDF
│   ├── ecologistica.db          # Base de datos SQLite local
│   ├── requirements.txt         # Dependencias de Python
│   └── seed_data.py             # Script de datos semilla para pruebas
├── frontend/                    # Aplicación SPA en React + Vite
│   ├── src/
│   │   ├── components/          # Componentes reutilizables (Navegación, Mapas, Modales)
│   │   ├── context/             # Contexto global de Autenticación
│   │   ├── pages/               # Páginas principales (Dashboard, Rutas, Pedidos, etc.)
│   │   └── services/            # Clientes API HTTP (Axios/Fetch)
│   └── package.json             # Dependencias de Node.js
└── docs/                        # Artefactos y Documentación Formal PFA
    ├── 01 Inicio/               # Fichas de inicio, requisitos, C4 y arquitectura
    └── 02 Planificación/        # Metodología ágil, Jira, riesgos y presupuesto
```

---

## ⚡ Guía de Instalación y Ejecución

### Prerrequisitos
- **Python** 3.10+ instalado.
- **Node.js** 18+ y `npm` instalados.

### 1. Configuración del Backend (FastAPI)

```bash
# Navegar al directorio backend
cd backend

# Crear entorno virtual (opcional pero recomendado)
python -m venv venv
# En Windows (PowerShell):
.\venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Poblar base de datos con datos semilla de prueba
python seed_data.py

# Iniciar servidor de desarrollo
uvicorn app.main:app --reload --port 8000
```
> La API estará disponible en `http://localhost:8000` y la documentación interactiva en `http://localhost:8000/docs`.

### 2. Configuración del Frontend (React + Vite)

```bash
# En una nueva terminal, navegar al directorio frontend
cd frontend

# Instalar dependencias de Node
npm install

# Iniciar servidor de desarrollo Vite
npm run dev
```
> La aplicación web estará disponible en `http://localhost:5173`.

---

## 📚 Documentación Formal del Proyecto

El proyecto cuenta con una sólida arquitectura documental desarrollada durante las distintas fases del ciclo de vida software:

### 📋 Fase 01: Inicio del Proyecto
- [01. Selección del enfoque del proyecto](docs/01%20Inicio/01.%20Selecci%C3%B3n%20del%20enfoque%20del%20proyecto%20V_1_0_0.md)
- [02. Acta de constitución](docs/01%20Inicio/02.%20Acta%20de%20constituci%C3%B3n%20V_1_0_0.md)
- [03. Declaración de la visión](docs/01%20Inicio/03.%20Declaraci%C3%B3n%20de%20la%20visi%C3%B3n%20V_1_0_0.md)
- [04. Registro de supuestos y restricciones](docs/01%20Inicio/04.%20Registro%20de%20supuestos%20y%20restricciones%20V_1_0_0.md)
- [05. Registro de interesados](docs/01%20Inicio/05.%20Registro%20de%20interesados%20V_1_0_0.md)
- [06. Requisitos funcionales](docs/01%20Inicio/06.%20Requisitos%20funcionales%20V_1_0_0.md)
- [07. Requisitos no funcionales](docs/01%20Inicio/07.%20Requisitos%20no%20funcionales%20V_1_0_0.md)
- [08. Usuarios](docs/01%20Inicio/08.%20Usuarios%20V_1_0_0.md)
- [09. Reglas de negocio](docs/01%20Inicio/09.%20Reglas%20de%20negocio%20V_1_0_0.md)
- [10. Stack tecnológico](docs/01%20Inicio/10.%20Stack%20tecnol%C3%B3gico%20V_1_0_0.md)
- [11. Base de datos](docs/01%20Inicio/11.%20Base%20de%20datos%20V_1_0_0.md)
- [12. Modelo C4](docs/01%20Inicio/12.%20Modelo%20C4%20V_1_0_0.md)
- [13. Restricciones](docs/01%20Inicio/13.%20Restricciones%20V_1_0_0.md)

### 📅 Fase 02: Planificación del Proyecto
- [01. Transformando a ágil](docs/02%20Planificaci%C3%B3n/01%20Transformando%20a%20%C3%A1gil%20V_1_0_0.md)
- [02. Artefactos Jira](docs/02%20Planificaci%C3%B3n/02%20Artefactos%20Jira%20V_1_0_0.md)
- [03. Registro de riesgos](docs/02%20Planificaci%C3%B3n/03%20Registro%20de%20riesgos%20V_1_0_0.md)
- [04. Presupuesto del proyecto](docs/02%20Planificaci%C3%B3n/04%20Presupuesto%20del%20proyecto%20V_1_0_0.md)

---

## 📜 Historial de Control de Cambios

| Fecha | Versión | Descripción | Documentos / Módulos Afectados |
|---|---|---|---|
| 28/08/2026 | **v1.0.0** | Creación inicial y aprobación de artefactos formales de las Fases 01 y 02. | `docs/01 Inicio/`, `docs/02 Planificación/` |
| 10/09/2026 | **v1.1.0** | Arquitectura base del Backend en FastAPI, modelos SQLAlchemy y Solver VRPTW con Google OR-Tools. | `backend/app/models/`, `backend/app/services/` |
| 20/09/2026 | **v1.2.0** | Desarrollo de la SPA en React + Vite, mapa interactivo Leaflet y Dashboard de Sostenibilidad. | `frontend/src/pages/`, `frontend/src/components/` |
| 28/09/2026 | **v1.3.0** | Implementación del Modo Conductor, Reglas de Negocio (RN-001 a RN-010) y Generación de Reportes PDF. | `backend/app/api/`, `frontend/src/pages/ModoConductor.jsx` |
| 01/10/2026 | **v1.4.0** | Pruebas de integración E2E, calibración de parámetros Green VRP y actualización integral de documentación README. | Todo el proyecto |

