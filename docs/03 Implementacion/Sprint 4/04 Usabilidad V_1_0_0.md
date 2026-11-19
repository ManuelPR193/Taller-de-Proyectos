[← Volver al README Principal](../../../README.md)

# Evaluación Cuantitativa de Usabilidad (Escala SUS)

**Proyecto:** EcoLogística Huancayo — Optimizador de Rutas Sostenibles para "DistriRápido S.A.C."  
**Versión del Documento:** 1.0.0 | **Fecha:** 2026-11-19  
**Responsable de la Evaluación:** Equipo de UX y Calidad de Software  
**Instrumento Aplicado:** Escala de Usabilidad del Sistema (SUS - System Usability Scale, Brooke, 1996)  

---

## 1. Ficha Técnica de la Evaluación

Para cuantificar de manera rigurosa la experiencia de usuario y facilidad de adopción del sistema **EcoLogística Huancayo**, se aplicó el instrumento psicométrico estandarizado **System Usability Scale (SUS)**, reconocido a nivel global como el estándar de la industria para evaluar la efectividad, eficiencia y satisfacción de sistemas interactivos.

### 1.1. Parámetros del Instrumento
- **Formato:** Cuestionario estandarizado de 10 ítems (5 formulaciones positivas y 5 formulaciones negativas alternadas).
- **Escala de Valoración:** Escala Likert de 5 puntos:
  - `1`: Totalmente en desacuerdo
  - `2`: En desacuerdo
  - `3`: Neutral / Indiferente
  - `4`: De acuerdo
  - `5`: Totalmente de acuerdo
- **Fórmula de Normalización SUS:**
  - Para preguntas impares (1, 3, 5, 7, 9): Puntuación individual = $X_i - 1$
  - Para preguntas pares (2, 4, 6, 8, 10): Puntuación individual = $5 - X_i$
  - Puntaje SUS del participante = $(\sum \text{puntuaciones individuales}) \times 2.5$ (Escala resultante de 0 a 100).

### 1.2. Perfil y Tamaño de la Muestra ($n = 10$)
La muestra de evaluación estuvo conformada por **10 evaluadores representativos**, distribuidos en los roles operativos clave de la empresa "DistriRápido S.A.C." en Huancayo:
- **4 Conductores / Repartidores de Última Milla:** Usuarios que operan vehículos en rutas del Valle del Mantaro y utilizan el Modo Conductor desde dispositivos móviles.
- **3 Operadores de Despacho y Logística:** Responsables de la carga de pedidos, visualización de rutas en mapa e inspección de niveles de tráfico.
- **2 Administradores de Operaciones:** Usuarios encargados de la supervisión global de flota y consulta del dashboard de sostenibilidad de emisiones de CO₂.
- **1 Auditor / Stakeholder Externo:** Evaluador independiente con enfoque en cumplimiento de estándares de accesibilidad y reportes ejecutivos.

### 1.3. Protocolo de Tareas Previas a la Evaluación
Antes de responder el cuestionario SUS, cada participante completó de forma autónoma una batería de tareas representativas del flujo de negocio:
1. **Tarea 1:** Iniciar sesión con su rol asignado y navegar al panel principal.
2. **Tarea 2:** (Operadores) Registrar un pedido con punto de referencia en El Tambo y generar la ruta optimizada.
3. **Tarea 3:** (Conductores) Ingresar al Modo Conductor, ubicar la primera parada en el mapa interactivo y registrar la confirmación de entrega.
4. **Tarea 4:** (Administradores) Consultar los indicadores de ahorro de combustible y descargar el informe de sostenibilidad en formato PDF.

---

## 2. Resultados Cuantitativos de la Evaluación

### 2.1. Matriz de Puntuaciones Brutas por Participante (Ítems 1 a 10)

Las 10 preguntas estándar de la escala SUS corresponden a:
- **P1:** Creo que me gustaría utilizar este sistema con frecuencia.
- **P2:** Encontré el sistema innecesariamente complejo.
- **P3:** Pensé que el sistema era fácil de usar.
- **P4:** Creo que necesitaría la ayuda de una persona técnica para poder utilizar este sistema.
- **P5:** Sentí que las diversas funciones del sistema estaban bien integradas.
- **P6:** Pensé que había demasiada inconsistencia en este sistema.
- **P7:** Imagino que la mayoría de las personas aprenderían a utilizar este sistema muy rápidamente.
- **P8:** Encontré el sistema muy engorroso / pesado de usar.
- **P9:** Me sentí muy seguro utilizando el sistema.
- **P10:** Necesité aprender muchas cosas antes de poder empezar a utilizar este sistema.

| Participante ID | Rol del Usuario | P1 | P2 | P3 | P4 | P5 | P6 | P7 | P8 | P9 | P10 |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **U-01** | Conductor (Reparto El Tambo) | 5 | 1 | 5 | 2 | 4 | 1 | 5 | 1 | 4 | 2 |
| **U-02** | Conductor (Reparto Chilca) | 4 | 2 | 4 | 1 | 5 | 2 | 4 | 2 | 5 | 1 |
| **U-03** | Conductor (Huancayo Cercado) | 5 | 1 | 4 | 2 | 4 | 1 | 5 | 1 | 4 | 2 |
| **U-04** | Conductor (Pilcomayo) | 4 | 2 | 4 | 2 | 4 | 2 | 4 | 2 | 4 | 2 |
| **U-05** | Operador de Despacho | 5 | 1 | 5 | 1 | 5 | 1 | 5 | 1 | 5 | 1 |
| **U-06** | Operador de Despacho | 4 | 2 | 5 | 2 | 4 | 2 | 4 | 1 | 4 | 2 |
| **U-07** | Operadora de Monitoreo | 5 | 1 | 4 | 1 | 5 | 1 | 5 | 2 | 5 | 1 |
| **U-08** | Administrador de Flota | 5 | 1 | 5 | 1 | 5 | 1 | 5 | 1 | 5 | 1 |
| **U-09** | Administrador Logístico | 4 | 2 | 4 | 2 | 4 | 2 | 4 | 2 | 4 | 2 |
| **U-10** | Auditor / Stakeholder | 4 | 2 | 5 | 1 | 4 | 1 | 4 | 2 | 4 | 2 |

### 2.2. Cálculo Paso a Paso del Puntaje SUS Individual

Aplicando las transformaciones de ítems impares ($X - 1$) e ítems pares ($5 - X$):

- **Participante U-01:**
  - Impares (P1, P3, P5, P7, P9): $(5-1) + (5-1) + (4-1) + (5-1) + (4-1) = 4 + 4 + 3 + 4 + 3 = 18$
  - Pares (P2, P4, P6, P8, P10): $(5-1) + (5-2) + (5-1) + (5-1) + (5-2) = 4 + 3 + 4 + 4 + 3 = 18$
  - Suma = $18 + 18 = 36$ $\rightarrow$ **Puntaje SUS = $36 \times 2.5 = 90.0$**

- **Participante U-02:**
  - Impares: $(4-1) + (4-1) + (5-1) + (4-1) + (5-1) = 3 + 3 + 4 + 3 + 4 = 17$
  - Pares: $(5-2) + (5-1) + (5-2) + (5-2) + (5-1) = 3 + 4 + 3 + 3 + 4 = 17$
  - Suma = $17 + 17 = 34$ $\rightarrow$ **Puntaje SUS = $34 \times 2.5 = 85.0$**

- **Participante U-03:**
  - Impares: $(5-1) + (4-1) + (4-1) + (5-1) + (4-1) = 4 + 3 + 3 + 4 + 3 = 17$
  - Pares: $(5-1) + (5-2) + (5-1) + (5-1) + (5-2) = 4 + 3 + 4 + 4 + 3 = 18$
  - Suma = $17 + 18 = 35$ $\rightarrow$ **Puntaje SUS = $35 \times 2.5 = 87.5$**

- **Participante U-04:**
  - Impares: $(4-1) + (4-1) + (4-1) + (4-1) + (4-1) = 3 + 3 + 3 + 3 + 3 = 15$
  - Pares: $(5-2) + (5-2) + (5-2) + (5-2) + (5-2) = 3 + 3 + 3 + 3 + 3 = 15$
  - Suma = $15 + 15 = 30$ $\rightarrow$ **Puntaje SUS = $30 \times 2.5 = 75.0$**

- **Participante U-05:**
  - Impares: $(5-1) + (5-1) + (5-1) + (5-1) + (5-1) = 4 + 4 + 4 + 4 + 4 = 20$
  - Pares: $(5-1) + (5-1) + (5-1) + (5-1) + (5-1) = 4 + 4 + 4 + 4 + 4 = 20$
  - Suma = $20 + 20 = 40$ $\rightarrow$ **Puntaje SUS = $40 \times 2.5 = 100.0$**

- **Participante U-06:**
  - Impares: $(4-1) + (5-1) + (4-1) + (4-1) + (4-1) = 3 + 4 + 3 + 3 + 3 = 16$
  - Pares: $(5-2) + (5-2) + (5-2) + (5-1) + (5-2) = 3 + 3 + 3 + 4 + 3 = 16$
  - Suma = $16 + 16 = 32$ $\rightarrow$ **Puntaje SUS = $32 \times 2.5 = 80.0$**

- **Participante U-07:**
  - Impares: $(5-1) + (4-1) + (5-1) + (5-1) + (5-1) = 4 + 3 + 4 + 4 + 4 = 19$
  - Pares: $(5-1) + (5-1) + (5-1) + (5-2) + (5-1) = 4 + 4 + 4 + 3 + 4 = 19$
  - Suma = $19 + 19 = 38$ $\rightarrow$ **Puntaje SUS = $38 \times 2.5 = 95.0$**

- **Participante U-08:**
  - Impares: $(5-1) + (5-1) + (5-1) + (5-1) + (5-1) = 4 + 4 + 4 + 4 + 4 = 20$
  - Pares: $(5-1) + (5-1) + (5-1) + (5-1) + (5-1) = 4 + 4 + 4 + 4 + 4 = 20$
  - Suma = $20 + 20 = 40$ $\rightarrow$ **Puntaje SUS = $40 \times 2.5 = 100.0$**

- **Participante U-09:**
  - Impares: $(4-1) + (4-1) + (4-1) + (4-1) + (4-1) = 3 + 3 + 3 + 3 + 3 = 15$
  - Pares: $(5-2) + (5-2) + (5-2) + (5-2) + (5-2) = 3 + 3 + 3 + 3 + 3 = 15$
  - Suma = $15 + 15 = 30$ $\rightarrow$ **Puntaje SUS = $30 \times 2.5 = 75.0$**

- **Participante U-10:**
  - Impares: $(4-1) + (5-1) + (4-1) + (4-1) + (4-1) = 3 + 4 + 3 + 3 + 3 = 16$
  - Pares: $(5-2) + (5-1) + (5-1) + (5-2) + (5-2) = 3 + 4 + 4 + 3 + 3 = 17$
  - Suma = $16 + 17 = 33$ $\rightarrow$ **Puntaje SUS = $33 \times 2.5 = 82.5$**

### 2.3. Cálculo del Puntaje SUS Promedio Global

$$\overline{SUS} = \frac{90.0 + 85.0 + 87.5 + 75.0 + 100.0 + 80.0 + 95.0 + 100.0 + 75.0 + 82.5}{10} = \frac{870.0}{10} = \mathbf{87.0}$$

- **Puntaje SUS Promedio Global:** **87.0 / 100**
- **Desviación Estándar ($\sigma$):** **9.25**
- **Rango de Puntuaciones:** Mínimo: 75.0 | Máximo: 100.0

---

## 3. Análisis e Interpretación de Resultados

### 3.1. Posicionamiento frente al Estándar de la Industria
De acuerdo con la literatura científica en ingeniería de usabilidad (Sauro & Lewis, 2016; Bangor et al., 2008):
- El **umbral estándar de aceptación promedio** de la industria se sitúa en **68 puntos**.
- Una puntuación superior a **80.3 puntos** ubica al software en el **percentil 90+** de aplicaciones a nivel mundial.
- Con un puntaje global obtenido de **87.0**, el sistema **EcoLogística Huancayo supera ampliamente el umbral exigido (+19.0 puntos por encima del estándar de 68)**.

### 3.2. Clasificación por Adjetivos y Calificación por Grados
- **Escala de Calificación por Letras (Grade Scale):** **Grado A+** (Rango 84.1 – 100).
- **Escala de Adjetivos (Adjective Rating):** **"Excelente" (Excellent)**.
- **Nivel de Aceptabilidad (Acceptability Range):** **"Altamente Aceptable" (Acceptable)**.
- **Net Promoter Score (NPS) Estimado:** Ubicado en la categoría de **Promotores**.

### 3.3. Identificación de Cuellos de Botella de Interfaz (UX Bottlenecks)
A pesar de la alta calificación global, la descomposición de los puntajes permitió identificar áreas de optimización específicas en participantes con menor puntaje (U-04 y U-09, 75.0 pts):
1. **Comprensión de Códigos de Color en Vías de Tráfico:** Ciertos conductores manifestaron ligera duda inicial al distinguir tramos en amarillo (congestión moderada) versus naranja en pantallas con brillo reducido bajo luz solar intensa en cabina.
2. **Tamaño del Área Táctil del Botón de Confirmación en Móviles de Pantalla Pequeña:** En dispositivos con pantallas menores a 5.5 pulgadas, el botón requería una precisión táctil mayor durante la conducción detenida.

### 3.4. Mejoras Implementadas y Propuestas
- **Mejora Aplicada 1:** Se incrementó el contraste y grosor del trazado de líneas viales en `InteractiveMap.jsx`, añadiendo patrones discontinuos complementarios al color para garantizar legibilidad a usuarios con discromatopsias leves.
- **Mejora Aplicada 2:** Se amplió el padding del botón flotante de confirmación de entrega en `ModoConductor.jsx` a un mínimo de **56x56 px**, cumpliendo sobradamente las directrices WCAG 2.1 nivel AAA para áreas interactivas móviles.
- **Mejora Propuesta 3:** Incorporar confirmación háptica (vibración en el dispositivo móvil) al pulsar "Confirmar Entrega" para brindar retroalimentación física sin necesidad de mirar fijamente la pantalla.

---
[← Volver al README Principal](../../../README.md)
