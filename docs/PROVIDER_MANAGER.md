# PROVIDER MANAGER - Sportiva24

## Objetivo
Aislar completamente al frontend de los proveedores externos y garantizar continuidad de servicio mediante failover automático.

## Arquitectura
- `lib/data/config/providers.ts`
  - Configuración única de proveedores.
  - Prioridades por deporte y operación.
  - Flags de activación, timeout y TTL.
- `lib/data/manager/providerManager.ts`
  - Ejecuta proveedores por prioridad.
  - Detecta errores/timeout/datos inválidos.
  - Cambia al siguiente proveedor disponible.
  - Registra razón del cambio.
- `lib/data/health/dataHealthMonitor.ts`
  - Estado por proveedor (`healthy`, `degraded`, `down`, `unknown`).
  - Métricas de salud por proveedor.
- `lib/data/stats/dataStats.ts`
  - Métricas agregadas de plataforma.
- `lib/data/cache/memoryCache.ts`
  - Cache en memoria con TTL y métricas de hit/miss.

## Flujo de ejecución
1. `SportsDataService` solicita una operación (`getFeaturedMatches`, etc.).
2. Se consulta cache por clave de operación.
3. Si hay miss, se obtiene la prioridad de `providers.ts`.
4. `ProviderManager` intenta el proveedor principal.
5. Si falla (error, timeout o validación), activa failover al siguiente.
6. Devuelve resultado en contrato interno unificado.
7. Si todos fallan, activa fallback final (mock).

## Prioridades actuales
### Football
- `api-football`
- `football-data`
- `sportsdb`
- `mock`

### Basketball
- `sportsdb`
- `mock`

### Otros deportes
- `mock` (preparado para integrar proveedores reales sin tocar frontend)

## Failover
El failover se activa cuando:
- hay excepción de red o parseo,
- se excede timeout,
- el proveedor retorna datos vacíos/inválidos.

Cada cambio de proveedor registra:
- proveedor fallido,
- operación,
- latencia,
- fallback activado.

## Health Monitor
Se registra por proveedor:
- estado,
- última respuesta,
- latencia,
- cantidad de consultas,
- errores,
- fallbacks,
- tiempo desde la última actualización.

Estos datos quedan listos para futuros dashboards internos sin UI adicional en este sprint.

## Estadísticas de plataforma
Se registran automáticamente:
- Cache Hits,
- Cache Misses,
- Provider Success,
- Provider Failures,
- Fallback Activations,
- Average Response Time.

## Configuración centralizada
`lib/data/config/providers.ts` permite:
- activar/desactivar proveedores,
- definir orden de prioridad,
- controlar timeout,
- controlar TTL,
- usar modo debug.

Sin modificar código del servicio principal.

## Normalización
Utilidades en `lib/data/normalization/normalizers.ts`:
- logos,
- nombres de equipos,
- ligas,
- fechas,
- slugs,
- IDs internos.

## Cache y futura integración Redis
Actual: memoria en proceso (`Map`) con TTL.

Diseño: la lógica de lectura/escritura está encapsulada para reemplazar por Redis en una siguiente fase sin romper contratos de servicio.
