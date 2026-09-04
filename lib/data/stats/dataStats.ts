export interface DataPlatformStats {
  cacheHits: number;
  cacheMisses: number;
  providerSuccess: number;
  providerFailures: number;
  fallbackActivations: number;
  averageResponseTimeMs: number;
}

class DataStatsTracker {
  private cacheHits = 0;
  private cacheMisses = 0;
  private providerSuccess = 0;
  private providerFailures = 0;
  private fallbackActivations = 0;
  private responseTimeTotalMs = 0;
  private responseTimeSamples = 0;

  trackCacheHit(): void {
    this.cacheHits += 1;
  }

  trackCacheMiss(): void {
    this.cacheMisses += 1;
  }

  trackProviderSuccess(durationMs: number): void {
    this.providerSuccess += 1;
    this.responseTimeTotalMs += durationMs;
    this.responseTimeSamples += 1;
  }

  trackProviderFailure(durationMs: number): void {
    this.providerFailures += 1;
    this.responseTimeTotalMs += durationMs;
    this.responseTimeSamples += 1;
  }

  trackFallbackActivation(): void {
    this.fallbackActivations += 1;
  }

  getSnapshot(): DataPlatformStats {
    return {
      cacheHits: this.cacheHits,
      cacheMisses: this.cacheMisses,
      providerSuccess: this.providerSuccess,
      providerFailures: this.providerFailures,
      fallbackActivations: this.fallbackActivations,
      averageResponseTimeMs: this.responseTimeSamples > 0
        ? Math.round(this.responseTimeTotalMs / this.responseTimeSamples)
        : 0,
    };
  }
}

export const dataStatsTracker = new DataStatsTracker();
