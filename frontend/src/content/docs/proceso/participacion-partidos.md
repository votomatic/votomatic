---
title: "Datos de los partidos"
description: "Cómo obtenemos las posiciones de los partidos políticos"
category: "proceso"
order: 3
---

Para que Votomatic funcione, necesitamos conocer las posiciones de los partidos políticos. Aquí te explicamos de dónde provienen estos datos.

## Fuente de información

Las posiciones de los partidos en Votomatic provienen de los **planes de gobierno oficiales** que cada partido presenta al Jurado Nacional de Elecciones (JNE) para participar en las elecciones.

### ¿Por qué los planes de gobierno?

- Son documentos **oficiales y públicos**
- Son **obligatorios** para todos los partidos que participan
- Representan las **propuestas formales** de cada partido
- Están disponibles en el portal del JNE para cualquier ciudadano

## ¿Qué partidos están incluidos?

**Todos los 37 partidos** con inscripción vigente para las Elecciones Generales 2026 están incluidos en Votomatic.

**Principio de igualdad**: Todos los partidos reciben exactamente el mismo trato, sin importar si son:

- Grandes o pequeños
- Nuevos o tradicionales
- Con representación actual en el Congreso o sin ella

## Proceso de extracción

### 1. Obtención de documentos
- Descargamos los planes de gobierno del portal oficial del JNE
- Procesamos los archivos PDF para extraer el texto

### 2. Análisis con inteligencia artificial
- La IA analiza el contenido de cada plan de gobierno
- Identifica las propuestas y posiciones del partido
- Extrae citas relevantes que respaldan cada posición

### 3. Asignación de posiciones
Para cada pregunta de Votomatic, la IA determina:

**a) La posición del partido:**
- De acuerdo (+1)
- Neutral (0)
- En desacuerdo (-1)

**b) La justificación:**
- Extracto o resumen del plan de gobierno
- Cita de las propuestas relevantes
- Contexto de la posición del partido

## Diferencia con el Wahl-O-Mat

En el Wahl-O-Mat alemán, los propios partidos responden directamente las preguntas. En Votomatic, las posiciones son **extraídas por IA** de los planes de gobierno.

### Ventajas de nuestro enfoque:
- No depende de la participación activa de los partidos
- Todos los partidos están incluidos
- Basado en documentos oficiales y verificables

### Limitaciones de nuestro enfoque:
- La IA puede malinterpretar algunas posiciones
- Los planes de gobierno no cubren todos los temas
- No refleja cambios de posición posteriores a la publicación del plan

## Transparencia

Para cada posición de cada partido, mostramos:

- La posición asignada (a favor, neutral, en contra)
- La justificación basada en el plan de gobierno
- El contexto de las propuestas del partido

Esto permite que los usuarios:
- Verifiquen si la posición asignada es correcta
- Lean las propuestas originales del partido
- Formen su propia opinión

## ¿Qué pasa si un partido no tiene posición clara?

Si el plan de gobierno de un partido no menciona un tema específico:

- Se asigna posición **Neutral (0)**
- Se indica que el tema no está cubierto en el plan de gobierno
- El usuario puede decidir si esto es relevante para su comparación

## Verificación de datos

Reconocemos que el proceso de extracción por IA puede tener errores. Por eso:

1. **Publicamos las justificaciones** - Para que cualquiera pueda verificar
2. **El código es abierto** - El proceso es transparente y auditable [aquí](https://github.com/votomatic/votomatic)
3. **Aceptamos correcciones** - Si detectas un error, puedes reportarlo [aquí](https://github.com/votomatic/votomatic/issues)

## Nota importante

Las posiciones mostradas en Votomatic son una **interpretación automatizada** de los planes de gobierno. Para conocer la posición oficial de un partido sobre cualquier tema, te recomendamos:

- Leer el plan de gobierno completo
- Consultar las declaraciones oficiales del partido
- Revisar las propuestas de los candidatos

Votomatic es un punto de partida para tu investigación, no la última palabra sobre las posiciones de los partidos.
