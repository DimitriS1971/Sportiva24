import { dataEnv } from '@/lib/data/config/env';
import type { Sport } from '@/lib/data/types/domain';

export type DataOperation = 'featuredMatches' | 'todayMatches' | 'todayMatchesCount' | 'matchBySlug';

export interface ProviderConfigEntry {
  id: string;
  enabled: boolean;
  timeoutMs: number;
  ttlSeconds: number;
}

const providerConfigById: Record<string, ProviderConfigEntry> = {
  'api-football': {
    id: 'api-football',
    enabled: Boolean(dataEnv.apiFootballApiKey),
    timeoutMs: dataEnv.providerTimeoutMs,
    ttlSeconds: dataEnv.dataCacheTtlSeconds,
  },
  'football-data': {
    id: 'football-data',
    enabled: Boolean(dataEnv.footballDataApiToken),
    timeoutMs: dataEnv.providerTimeoutMs,
    ttlSeconds: dataEnv.dataCacheTtlSeconds,
  },
  'sportsdb': {
    id: 'sportsdb',
    enabled: true,
    timeoutMs: dataEnv.providerTimeoutMs,
    ttlSeconds: dataEnv.dataCacheTtlSeconds,
  },
  mock: {
    id: 'mock',
    enabled: true,
    timeoutMs: dataEnv.providerTimeoutMs,
    ttlSeconds: dataEnv.dataCacheTtlSeconds,
  },
};

const priorityBySportAndOperation: Record<Sport, Record<DataOperation, string[]>> = {
  football: {
    featuredMatches: ['api-football', 'football-data', 'sportsdb', 'mock'],
    todayMatches: ['api-football', 'football-data', 'sportsdb', 'mock'],
    todayMatchesCount: ['api-football', 'football-data', 'sportsdb', 'mock'],
    matchBySlug: ['api-football', 'football-data', 'sportsdb', 'mock'],
  },
  basketball: {
    featuredMatches: ['sportsdb', 'mock'],
    todayMatches: ['sportsdb', 'mock'],
    todayMatchesCount: ['sportsdb', 'mock'],
    matchBySlug: ['mock'],
  },
  tennis: {
    featuredMatches: ['mock'],
    todayMatches: ['mock'],
    todayMatchesCount: ['mock'],
    matchBySlug: ['mock'],
  },
  formula1: {
    featuredMatches: ['mock'],
    todayMatches: ['mock'],
    todayMatchesCount: ['mock'],
    matchBySlug: ['mock'],
  },
  cycling: {
    featuredMatches: ['mock'],
    todayMatches: ['mock'],
    todayMatchesCount: ['mock'],
    matchBySlug: ['mock'],
  },
  baseball: {
    featuredMatches: ['mock'],
    todayMatches: ['mock'],
    todayMatchesCount: ['mock'],
    matchBySlug: ['mock'],
  },
  esports: {
    featuredMatches: ['mock'],
    todayMatches: ['mock'],
    todayMatchesCount: ['mock'],
    matchBySlug: ['mock'],
  },
};

export interface ProviderManagerConfig {
  debug: boolean;
  defaultTimeoutMs: number;
  defaultTtlSeconds: number;
}

export const providerManagerConfig: ProviderManagerConfig = {
  debug: dataEnv.dataDebugLogs,
  defaultTimeoutMs: dataEnv.providerTimeoutMs,
  defaultTtlSeconds: dataEnv.dataCacheTtlSeconds,
};

export function getProviderPriority(sport: Sport, operation: DataOperation): ProviderConfigEntry[] {
  const ids = priorityBySportAndOperation[sport][operation];
  return ids.map((id) => providerConfigById[id]).filter((entry): entry is ProviderConfigEntry => Boolean(entry));
}

export function getProviderConfigById(providerId: string): ProviderConfigEntry | null {
  return providerConfigById[providerId] ?? null;
}
