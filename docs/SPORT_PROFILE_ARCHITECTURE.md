# SPORT PROFILE ARCHITECTURE

## Objetivo

Desacoplar totalmente el deporte del nucleo del Motor S24 mediante perfiles configurables.

El nucleo del motor no contiene condicionales por deporte y opera con una sola logica compartida.

## Estructura

Ruta base:

- `lib/intelligence-s24/sports/shared/`
- `lib/intelligence-s24/sports/football/`
- `lib/intelligence-s24/sports/basketball/`
- `lib/intelligence-s24/sports/tennis/`
- `lib/intelligence-s24/sports/formula1/`
- `lib/intelligence-s24/sports/cycling/`
- `lib/intelligence-s24/sports/baseball/`
- `lib/intelligence-s24/sports/esports/`

Cada deporte contiene solo:

- `config.ts`
- `factors.ts`
- `rules.ts`
- `interpretation.ts`

## SportProfile

Interfaz universal en `lib/intelligence-s24/sports/shared/types.ts`:

- `id`
- `slug`
- `name`
- `category`
- `supportedCompetitionTypes`
- `availableFactors`
- `factorWeights`
- `indicatorConfiguration`
- `narrativeConfiguration`
- `interpretationConfiguration`
- `validationConfiguration`
- `version`
- `methodologyVersion`
- `resolutionMatchers`

Toda la especializacion deportiva sale desde este contrato.

## Registro

`lib/intelligence-s24/sports/shared/sportRegistry.ts`

Responsabilidades:

- registrar todos los perfiles
- resolver por `id`
- resolver por `slug`
- resolver por `provider`
- resolver por `competition`

No utiliza condicionales por deporte; usa registro + matchers declarativos.

## SportResolver

`lib/intelligence-s24/sports/shared/sportResolver.ts`

Servicio universal para identificar automaticamente:

- deporte
- perfil
- configuracion
- factores

Entrada:

- `sportId`
- `slug`
- `providerId`
- `competition`

Salida:

- `SportProfile` valido

## Flujo de ejecucion

1. Informe o servicio invoca `sportResolver.resolve(...)`.
2. Se obtiene `SportProfile`.
3. Motor S24 usa `availableFactors` y `factorWeights` del perfil.
4. Motor calcula indice, confianza, riesgo y tendencia con configuracion del perfil.
5. Interpretation/Narrative consumen terminologia del perfil sin alterar el nucleo.
6. Pasaporte Analitico expone:
   - `Sport Profile Version`
   - `Sport Methodology Version`
   - `Sport Identifier`

## Factor Engine compartido

El motor ejecuta una sola logica:

- ejecuta factores
- pondera
- normaliza
- calcula
- interpreta

Los factores activos y pesos se definen por perfil.

## Narrative Engine compartido

Se mantiene un unico engine narrativo.

Cada perfil aporta configuracion de narrativa:

- vocabulario
- plantillas
- expresiones
- terminologia

## Compatibilidad

Se mantiene compatibilidad con:

- Informe S24
- Narrative Engine
- Centro de Inteligencia Deportiva
- Arbol de Evidencias
- Pasaporte Analitico
- Motor de Validacion
- Motor Historico
- Post Match

## Como agregar un nuevo deporte

1. Crear carpeta en `lib/intelligence-s24/sports/<nuevo-deporte>/`
2. Implementar:
   - `config.ts`
   - `factors.ts`
   - `rules.ts`
   - `interpretation.ts`
3. Registrar `SportProfile` en `sportRegistry.ts`

No se requieren cambios en el nucleo del motor.

## Buenas practicas

- Mantener `factorWeights` con suma total 100.
- Declarar `resolutionMatchers` especificos para provider y competiciones.
- Reutilizar factores compartidos antes de crear nuevos.
- Evitar logica imperativa por deporte en capas core.
- Versionar perfil y metodologia por deporte para trazabilidad.
