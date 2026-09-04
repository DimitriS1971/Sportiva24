import type { Sport } from '@/lib/data/types/domain';

export type ProviderHealthState = 'healthy' | 'degraded' | 'down' | 'unknown';

export interface ProviderHealthRecord {
  providerId: string;
  sport: Sport;
  state: ProviderHealthState;
  queryCount: number;
  errorCount: number;
  fallbackCount: number;
  lastLatencyMs: number;
  lastResponseAt?: string;
  lastError?: string;
  secondsSinceLastUpdate: number;
}

interface InternalHealthRecord {
  providerId: string;
  sport: Sport;
  state: ProviderHealthState;
  queryCount: number;
  errorCount: number;
  fallbackCount: number;
  lastLatencyMs: number;
  lastResponseAtTs?: number;
  lastError?: string;
}

class DataHealthMonitor {
  private readonly records = new Map<string, InternalHealthRecord>();

  private key(sport: Sport, providerId: string): string {
    return `${sport}:${providerId}`;
  }

  private ensureRecord(sport: Sport, providerId: string): InternalHealthRecord {
    const key = this.key(sport, providerId);
    const current = this.records.get(key);
    if (current) {
      return current;
    }

    const created: InternalHealthRecord = {
      providerId,
      sport,
      state: 'unknown',
      queryCount: 0,
      errorCount: 0,
      fallbackCount: 0,
      lastLatencyMs: 0,
    };
    this.records.set(key, created);
    return created;
  }

  markSuccess(sport: Sport, providerId: string, latencyMs: number): void {
    const record = this.ensureRecord(sport, providerId);
    record.queryCount += 1;
    record.lastLatencyMs = latencyMs;
    record.lastResponseAtTs = Date.now();
    record.state = 'healthy';
    record.lastError = undefined;
  }

  markFailure(sport: Sport, providerId: string, latencyMs: number, error?: unknown): void {
    const record = this.ensureRecord(sport, providerId);
    record.queryCount += 1;
    record.errorCount += 1;
    record.lastLatencyMs = latencyMs;
    record.lastResponseAtTs = Date.now();
    record.state = record.errorCount >= 3 ? 'down' : 'degraded';
    record.lastError = error instanceof Error ? error.message : String(error ?? 'Unknown error');
  }

  markFallback(sport: Sport, providerId: string): void {
    const record = this.ensureRecord(sport, providerId);
    record.fallbackCount += 1;
    if (record.state === 'healthy') {
      record.state = 'degraded';
    }
  }

  getProviderHealthSnapshot(): ProviderHealthRecord[] {
    const now = Date.now();
    return Array.from(this.records.values()).map((record) => ({
      providerId: record.providerId,
      sport: record.sport,
      state: record.state,
      queryCount: record.queryCount,
      errorCount: record.errorCount,
      fallbackCount: record.fallbackCount,
      lastLatencyMs: record.lastLatencyMs,
      lastResponseAt: record.lastResponseAtTs ? new Date(record.lastResponseAtTs).toISOString() : undefined,
      lastError: record.lastError,
      secondsSinceLastUpdate: record.lastResponseAtTs ? Math.floor((now - record.lastResponseAtTs) / 1000) : -1,
    }));
  }
}

export const dataHealthMonitor = new DataHealthMonitor();
