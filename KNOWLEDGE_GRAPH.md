# EPIC 5 - KNOWLEDGE GRAPH S24

## Objetivo

Construir el grafo de conocimiento de Sportiva24 para representar entidades deportivas y sus relaciones, de forma reutilizable por el Motor S24, Narrative Engine, IA Hibrida y Centro de Inteligencia.

## Objetos Del Grafo

El modelo implementado incluye los objetos solicitados:

- Club
- Jugador
- Entrenador
- Competicion
- Partido
- Temporada
- Arbitro
- Estadio
- Pais
- Narrativa
- Insight
- Evidencia

## Implementacion Tecnica

### Modulo

- `lib/intelligence-s24/knowledge-graph/types.ts`
- `lib/intelligence-s24/knowledge-graph/engine.ts`
- `lib/intelligence-s24/knowledge-graph/service.ts`
- `lib/intelligence-s24/knowledge-graph/index.ts`

### Export Publico

- `lib/intelligence-s24/index.ts` exporta:
  - `getKnowledgeGraphData`
  - `buildKnowledgeGraphData`
  - tipos de nodos, edges, stats y opciones

## Fuentes Reutilizadas

El grafo no duplica motores existentes. Se construye sobre:

- Historial S24 (`s24HistoryEngine`)
- Centro de Inteligencia (`getIntelligenceCenterData`)
- Club Intelligence Hub (`getClubIntelligenceHubData`)
- Player Intelligence Hub (`getPlayerIntelligenceHubData`)

## Relaciones Implementadas

Relaciones entre los objetos solicitados y sus conexiones principales:

- club_competes_in_competition
- club_located_in_country
- club_uses_stadium
- player_belongs_to_club
- player_nationality_country
- coach_trains_club
- coach_nationality_country
- competition_in_country
- competition_has_season
- season_includes_match
- match_in_competition
- match_in_season
- match_has_club
- match_officiated_by_referee
- match_played_at_stadium
- stadium_located_in_country
- narrative_describes_match
- narrative_describes_competition
- insight_from_narrative
- insight_references_entity
- evidence_supports_insight
- evidence_references_entity

## Estructura De Salida

`getKnowledgeGraphData()` retorna:

- `generatedAt`
- `version`
- `nodes[]`
- `edges[]`
- `stats`:
  - `nodeCount`
  - `edgeCount`
  - `nodesByType`

## Consumo Posterior

Este Knowledge Graph queda listo para consumo posterior por:

- Motor S24
- Narrative Engine
- IA Hibrida
- Centro de Inteligencia

## Nota De Modelado

Cuando un proveedor no reporta directamente ciertos objetos (por ejemplo arbitro o entrenador), el grafo crea nodos sinteticos trazables (`source: synthetic`) para conservar continuidad relacional sin romper contratos.
