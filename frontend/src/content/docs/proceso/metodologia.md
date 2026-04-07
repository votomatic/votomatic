---
title: "Nuestra metodología"
description: "Cómo generamos las preguntas y posiciones de Votomatic"
category: "proceso"
order: 1
---

## Principios de las preguntas

Cada pregunta debe ser:

1. **Clara** - Lenguaje sencillo, una sola idea por pregunta
2. **Diferenciadora** - Los partidos tienen posiciones distintas
3. **Relevante** - Temas que el Congreso o gobierno pueden decidir
4. **Justa** - Sin lenguaje emotivo ni favoritismo

## Proceso de extracción

1. **Fuente**: Planes de gobierno oficiales del JNE (obligatorios y públicos)
2. **Análisis con IA**: Identificamos temas, extraemos propuestas y determinamos posiciones
3. **Asignación**: De acuerdo (+1), Neutral (0), En desacuerdo (-1)
4. **Justificación**: Cada posición cita el plan de gobierno original

Ver detalles técnicos: [Proceso de extracción](https://github.com/votomatic/votomatic/blob/main/.claude/commands/extraction/pipeline.md)

## Limitaciones

- La IA puede malinterpretar contexto o matices
- No todos los planes cubren todos los temas
- Las posiciones pueden cambiar después de publicado el plan

## Control de calidad

- Verificamos coherencia entre posiciones y justificaciones
- Las justificaciones están respaldadas por el documento original
- Todo es público para verificación independiente

## ¿Por qué IA?

Permite procesar 37 planes de manera consistente y reduce sesgo humano. El método ideal sería que los partidos respondan directamente (como el Wahl-O-Mat), pero sin recursos para contactarlos, la IA es la alternativa más transparente.
