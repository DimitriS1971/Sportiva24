import { dataStatsTracker } from '@/lib/data/stats/dataStats';

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class MemoryCache {
  private readonly store = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) {
      dataStatsTracker.trackCacheMiss();
      return null;
    }

    if (entry.expiresAt < Date.now()) {
      this.store.delete(key);
      dataStatsTracker.trackCacheMiss();
      return null;
    }

    dataStatsTracker.trackCacheHit();
    return entry.value as T;
  }

  set<T>(key: string, value: T, ttlSeconds: number): void {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.store.set(key, { value, expiresAt });
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}

export const dataMemoryCache = new MemoryCache();
