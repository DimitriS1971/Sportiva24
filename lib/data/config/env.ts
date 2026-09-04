export interface DataEnvConfig {
  apiFootballApiKey?: string;
  apiFootballBaseUrl: string;
  footballDataApiToken?: string;
  ballDontLieApiKey?: string;
  pandaScoreApiToken?: string;
  theSportsDbApiKey: string;
  mlbApiBaseUrl: string;
  providerTimeoutMs: number;
  dataCacheTtlSeconds: number;
  dataDebugLogs: boolean;
}

function toNumber(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const dataEnv: DataEnvConfig = {
  apiFootballApiKey: process.env.APIFOOTBALL_API_KEY,
  apiFootballBaseUrl: process.env.APIFOOTBALL_BASE_URL ?? 'https://v3.football.api-sports.io',
  footballDataApiToken: process.env.FOOTBALL_DATA_API_TOKEN,
  ballDontLieApiKey: process.env.BALLDONTLIE_API_KEY,
  pandaScoreApiToken: process.env.PANDASCORE_API_TOKEN,
  theSportsDbApiKey: process.env.THESPORTSDB_API_KEY ?? '123',
  mlbApiBaseUrl: process.env.MLB_API_BASE_URL ?? 'https://statsapi.mlb.com/api/v1',
  providerTimeoutMs: toNumber(process.env.DATA_PROVIDER_TIMEOUT_MS, 6000),
  dataCacheTtlSeconds: toNumber(process.env.DATA_CACHE_TTL_SECONDS, 300),
  dataDebugLogs: process.env.DATA_DEBUG_LOGS === '1' || process.env.DATA_DEBUG_LOGS === 'true',
};
