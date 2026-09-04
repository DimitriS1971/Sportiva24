# DATA PLATFORM V1 - Sportiva24

## Objetivo
Construir una capa unificada de datos para desacoplar proveedores externos de la interfaz.

## Estructura
- lib/data/types: contratos internos comunes.
- lib/data/providers: llamadas HTTP a proveedores externos.
- lib/data/adapters: transformación proveedor -> contrato interno.
- lib/data/cache: cache en memoria con TTL configurable.
- lib/data/services: API interna reusable para frontend/backend.
- lib/data/config: variables de entorno centralizadas.
- lib/data/logs: logs de proveedor, latencia, fallback y errores.
- lib/data/mock: datos de respaldo.

## Flujo de datos
1. UI/feature llama a un servicio interno (SportsDataService).
2. El servicio consulta cache por llave.
3. Si no hay cache, el servicio llama al provider correspondiente.
4. La respuesta cruda se transforma con adapter del deporte.
5. Si falla proveedor o no hay datos, el servicio activa fallback mock.
6. El resultado final siempre respeta el contrato interno en types/domain.ts.

## Adapters por deporte
- FootballAdapter
- BasketballAdapter
- TennisAdapter
- Formula1Adapter
- CyclingAdapter
- BaseballAdapter
- EsportsAdapter

Todos implementan el contrato base de adaptación hacia Match interno.

## Servicios principales
- getFeaturedMatches(sport, limit)
- getUpcomingEvents(sport, limit)
- getLatestNews(sport, limit)
- getRankings(sport, limit)
- getLeagues(sport, limit)
- getMatchBySlug(slug)
- getTodayMatchesCount(sport)

## Cache
- Implementación actual: memoria en proceso (Map).
- TTL configurable con DATA_CACHE_TTL_SECONDS.
- API simple: get/set/delete/clear.
- Diseño preparado para reemplazo futuro por Redis manteniendo la capa de servicios.

## Fallback
- Si proveedor falla o devuelve vacío, se usan datos mock.
- El fallback queda logueado con bandera fallback=true.
- El frontend mantiene experiencia estable sin errores visuales.

## Logs
Se registran:
- provider
- operation
- durationMs
- fallback
- error (si aplica)

## Variables de entorno
Centralizadas en lib/data/config/env.ts:
- FOOTBALL_DATA_API_TOKEN
- BALLDONTLIE_API_KEY
- PANDASCORE_API_TOKEN
- THESPORTSDB_API_KEY
- MLB_API_BASE_URL
- DATA_CACHE_TTL_SECONDS
- DATA_DEBUG_LOGS

## Futuras integraciones
1. Implementar providers reales para balldontlie, PandaScore, OpenF1 y MLB.
2. Expandir adapters no implementados (basketball/tennis/f1/cycling/baseball/esports).
3. Sustituir cache en memoria por Redis sin cambiar contratos de servicios.
4. Agregar métricas de observabilidad y circuit breaker por proveedor.
