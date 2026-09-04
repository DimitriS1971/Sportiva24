# INTELLIGENCE PROFILE - SPORTIVA24

## Filosofia

IntelligenceProfile es el contrato central de inteligencia de Sportiva24.

Su objetivo es que cualquier producto inteligente use la misma estructura semantica,
evite duplicaciones y permita evolucionar sin romper el nucleo.

## Arquitectura

El contrato vive en:

- lib/domain/intelligenceProfile.ts

Adaptadores de producto:

- lib/intelligence-s24/intelligence-profile/adapters.ts

Modulo publico:

- lib/intelligence-s24/intelligence-profile/index.ts

## Estructura Del Perfil

Bloques obligatorios:

- Identity
- CompetitiveState
- Indicators
- Factors
- Narrative
- Insights
- Alerts
- History
- Evidence
- Validation
- AnalyticalPassport
- Metadata
- Version

Todos los bloques reutilizan Value Objects del dominio cuando aplica
(Confidence, Risk, Trend, Rating, Version, Percentage, EntityRef).

## Herencia Y Especializacion

Contrato base:

- IntelligenceProfile

Especializaciones oficiales:

- MatchIntelligenceProfile
- ClubIntelligenceProfile
- LeagueIntelligenceProfile
- PlayerIntelligenceProfile
- SeasonIntelligenceProfile

Regla principal:

- Nunca duplicar bloques comunes.
- Solo extender con datos propios del dominio.

## Ejemplos De Extensiones

ClubIntelligenceProfile:

- stadium
- coach
- squadSize

PlayerIntelligenceProfile:

- position
- age
- availability

LeagueIntelligenceProfile:

- clubs
- rankingSize

SeasonIntelligenceProfile:

- stages
- matches

## Integracion Con Motores

Motor S24:

- agrega salida especializada con calculateMatchProfile.

Narrative Engine:

- agrega generateS24NarrativeFromProfile como entrada unificada.

Validation Engine:

- agrega buildProfileValidationReport para validar cualquier perfil.

History Engine:

- registra perfiles con registerProfile y listProfileData.

Centro de Inteligencia:

- consume perfiles como fuente primaria en centerService.

Informe S24:

- expone MatchIntelligenceProfile en el payload sin cambiar UI.

## Buenas Practicas

1. Mantener el contrato base estable y versionado.
2. Extender solo por especializacion y no por copia de bloques.
3. Evitar tipos locales que repitan semantics del perfil.
4. Mantener adapters explicitos por producto.
5. Preservar compatibilidad de APIs existentes cuando se migra.

## Compatibilidad

La consolidacion se implemento en modo backward compatible:

- se mantienen salidas historicas de cada modulo;
- se añade el contrato unificado para convergencia de Fase 2.
