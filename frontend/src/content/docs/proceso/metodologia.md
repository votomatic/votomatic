---
title: "Nuestra metodología"
description: "Cómo generamos las preguntas y posiciones de Votomatic"
category: "proceso"
order: 1
---

La calidad de Votomatic depende de la calidad de las preguntas y de cómo se extraen las posiciones de los partidos. Aquí te explicamos cómo funciona nuestro proceso.

## Principios fundamentales

Cada pregunta en Votomatic debe cumplir con estos requisitos:

### 1. Clara y simple
- Usamos lenguaje sencillo que todos puedan entender
- Evitamos términos muy técnicos o especializados
- Una sola idea por pregunta (no mezclamos varios temas)

### 2. Diferenciadora
- Los partidos deben tener posiciones diferentes
- Si todos los partidos están de acuerdo, la pregunta no sirve
- Buscamos temas donde hay debate real

### 3. Relevante
- Trata temas importantes para las elecciones
- Es algo que el Congreso o el gobierno pueden decidir
- Los ciudadanos se interesan en el tema

### 4. Justa
- No favorece a ningún partido en particular
- No usa lenguaje emotivo o cargado
- Permite que todos los partidos expresen su posición

## Fuente de datos: Planes de gobierno oficiales

Toda la información de los partidos proviene de los **planes de gobierno oficiales** publicados en el portal del Jurado Nacional de Elecciones (JNE). Estos documentos son:

- Obligatorios para todos los partidos que participan en las elecciones
- De acceso público
- La fuente oficial de las propuestas de cada partido

## Proceso de extracción con IA

### 1. Recopilación de planes de gobierno
- Descargamos los 37 planes de gobierno del portal del JNE
- Procesamos los documentos PDF para extraer el texto

### 2. Análisis por inteligencia artificial
Utilizamos modelos de lenguaje (IA) para:
- Identificar los temas principales de cada plan de gobierno
- Extraer las propuestas específicas de cada partido
- Determinar la posición del partido en cada tema (a favor, neutral, en contra)

### 3. Generación de preguntas
Las preguntas se generan basándose en:
- Temas donde los partidos tienen posiciones diferentes
- Propuestas concretas mencionadas en los planes de gobierno
- Asuntos de interés público para las elecciones

### 4. Asignación de posiciones
Para cada pregunta, la IA determina la posición de cada partido:
- **De acuerdo (+1)**: El plan de gobierno apoya claramente esta posición
- **Neutral (0)**: El plan no menciona el tema o tiene una posición ambigua
- **En desacuerdo (-1)**: El plan de gobierno se opone a esta posición

### 5. Justificaciones
Cada posición incluye una justificación extraída o resumida del plan de gobierno original, citando las propuestas relevantes del partido.

## Lo que NO hacemos

Es importante que sepas lo que **no** hacemos:

- ❌ **No inventamos** posiciones que no están en los planes de gobierno
- ❌ **No editamos** las propuestas de los partidos
- ❌ **No favorecemos** a ningún partido
- ❌ **No incluimos** preguntas trampa o ambiguas

## Limitaciones del proceso

Reconocemos las siguientes limitaciones:

### La IA puede cometer errores
- Puede malinterpretar el contexto de una propuesta
- Puede no detectar matices importantes
- Puede asignar posiciones incorrectas en casos ambiguos

### Los planes de gobierno tienen limitaciones
- No todos los partidos cubren todos los temas
- Algunos planes son más detallados que otros
- Las propuestas pueden ser vagas o generales

### Las posiciones pueden cambiar
- Los partidos pueden modificar sus posiciones después de publicar el plan
- Las declaraciones públicas pueden contradecir el plan de gobierno
- La realidad política es más compleja que un documento

## Control de calidad

Para minimizar errores:

1. **Revisión de coherencia** - Verificamos que las posiciones asignadas sean coherentes con las justificaciones
2. **Verificación de fuentes** - Las justificaciones deben estar respaldadas por el plan de gobierno
3. **Transparencia** - Publicamos las justificaciones para que los usuarios puedan verificar

## Transparencia

Publicamos:

- Los criterios que usamos para generar preguntas
- El proceso completo de extracción
- Las justificaciones de cada posición
- La metodología de cálculo de resultados
- El código fuente de la plataforma

## ¿Por qué usar IA?

Usamos inteligencia artificial porque:

- Permite procesar 37 planes de gobierno de manera consistente
- Reduce el sesgo humano en la interpretación
- Hace el proceso más rápido y escalable
- Es transparente sobre sus limitaciones

Sin embargo, reconocemos que el método ideal sería que los propios partidos respondan directamente las preguntas, como hace el Wahl-O-Mat en Alemania.
