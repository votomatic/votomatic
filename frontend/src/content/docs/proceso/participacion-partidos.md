---
title: "Datos de los partidos"
description: "Cómo obtenemos las posiciones de los partidos políticos"
category: "proceso"
order: 3
---

## Fuente de información

Las posiciones provienen de los **planes de gobierno oficiales** del JNE: documentos obligatorios, públicos y verificables.

## Partidos incluidos

**Todos los 37 partidos** con inscripción vigente para las Elecciones Generales 2026, sin importar tamaño, antigüedad o representación actual.

## Proceso de extracción

1. Descarga de planes de gobierno del portal del JNE
2. Análisis con IA para identificar propuestas y posiciones
3. Asignación: De acuerdo (+1), Neutral (0), En desacuerdo (-1)
4. Generación de justificaciones citando el documento original

**Detalles técnicos:** [Pipeline](https://github.com/votomatic/votomatic/blob/main/.claude/commands/extraction/pipeline.md) | [Clasificación](https://github.com/votomatic/votomatic/blob/main/.claude/commands/extraction/classify.md)

## Si un partido no tiene posición clara

Se asigna **Neutral (0)** indicando que el tema no está cubierto en su plan de gobierno.

## Verificación

- [Justificaciones públicas](https://github.com/votomatic/votomatic/tree/main/data/extractions)
- [Código abierto](https://github.com/votomatic/votomatic)
- [Reportar errores](https://github.com/votomatic/votomatic/issues)

**Nota:** Las posiciones son una interpretación automatizada. Para la posición oficial de un partido, consulta su plan de gobierno completo.
