import { dataEnv } from '@/lib/data/config/env';
import type {
  ApiFootballFixture,
  ApiFootballFixturesResponse,
  ApiFootballLineupsResponse,
  ApiFootballStandingsEntry,
  ApiFootballStandingsResponse,
} from '@/lib/data/providers/providerTypes';

function toYmd(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export class ApiFootballProvider {
  readonly providerName = 'api-football';

  isConfigured(): boolean {
    return Boolean(dataEnv.apiFootballApiKey);
  }

  async getFeaturedFixtures(limit: number): Promise<ApiFootballFixture[]> {
    if (!dataEnv.apiFootballApiKey) {
      return [];
    }

    const endpoint = `${dataEnv.apiFootballBaseUrl}/fixtures?date=${toYmd(new Date())}`;
    const response = await fetch(endpoint, {
      headers: {
        'x-apisports-key': dataEnv.apiFootballApiKey,
      },
      next: { revalidate: 30 },
    });

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as ApiFootballFixturesResponse;
    return (payload.response ?? []).slice(0, Math.max(limit, 4));
  }

  async getFixtureById(id: string): Promise<ApiFootballFixture | null> {
    if (!dataEnv.apiFootballApiKey) {
      return null;
    }

    const endpoint = `${dataEnv.apiFootballBaseUrl}/fixtures?id=${encodeURIComponent(id)}`;
    const response = await fetch(endpoint, {
      headers: {
        'x-apisports-key': dataEnv.apiFootballApiKey,
      },
      next: { revalidate: 30 },
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as ApiFootballFixturesResponse;
    return payload.response?.[0] ?? null;
  }

  async getFixturesByDate(date: Date): Promise<ApiFootballFixture[]> {
    if (!dataEnv.apiFootballApiKey) {
      return [];
    }

    const endpoint = `${dataEnv.apiFootballBaseUrl}/fixtures?date=${toYmd(date)}`;
    const response = await fetch(endpoint, {
      headers: {
        'x-apisports-key': dataEnv.apiFootballApiKey,
      },
      next: { revalidate: 30 },
    });

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as ApiFootballFixturesResponse;
    return payload.response ?? [];
  }

  async getHeadToHead(homeTeamId: number, awayTeamId: number): Promise<ApiFootballFixture[]> {
    if (!dataEnv.apiFootballApiKey) {
      return [];
    }

    const endpoint = `${dataEnv.apiFootballBaseUrl}/fixtures/headtohead?h2h=${homeTeamId}-${awayTeamId}`;
    const response = await fetch(endpoint, {
      headers: {
        'x-apisports-key': dataEnv.apiFootballApiKey,
      },
      next: { revalidate: 30 },
    });

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as ApiFootballFixturesResponse;
    return payload.response ?? [];
  }

  async getRecentFixtures(teamId: number, limit = 5): Promise<ApiFootballFixture[]> {
    const apiKey = dataEnv.apiFootballApiKey;
    if (!apiKey) return [];

    const fetchRecent = async (requestedLimit: number): Promise<ApiFootballFixture[]> => {
      const endpoint = `${dataEnv.apiFootballBaseUrl}/fixtures?team=${teamId}&last=${requestedLimit}`;
      const response = await fetch(endpoint, {
        headers: { 'x-apisports-key': apiKey },
        next: { revalidate: 120 },
      });

      if (!response.ok) return [];
      const payload = (await response.json()) as ApiFootballFixturesResponse;
      return payload.response ?? [];
    };

    const fixtures = await fetchRecent(limit);
    if (fixtures.length > 0) return fixtures;

    // Some provider responses omit a team's recent window; retry with a wider one.
    return fetchRecent(Math.max(limit * 2, 10));
  }

  async getStandings(leagueId: number, season?: number): Promise<ApiFootballStandingsEntry[]> {
    if (!dataEnv.apiFootballApiKey || !season) return [];

    const endpoint = `${dataEnv.apiFootballBaseUrl}/standings?league=${leagueId}&season=${season}`;
    const response = await fetch(endpoint, {
      headers: { 'x-apisports-key': dataEnv.apiFootballApiKey },
      next: { revalidate: 300 },
    });

    if (!response.ok) return [];
    const payload = (await response.json()) as ApiFootballStandingsResponse;
    return payload.response?.[0]?.league?.standings?.flat() ?? [];
  }

  async getLineups(fixtureId: number): Promise<ApiFootballLineupsResponse['response']> {
    if (!dataEnv.apiFootballApiKey) return [];

    const endpoint = `${dataEnv.apiFootballBaseUrl}/fixtures/lineups?fixture=${fixtureId}`;
    const response = await fetch(endpoint, {
      headers: { 'x-apisports-key': dataEnv.apiFootballApiKey },
      next: { revalidate: 60 },
    });

    if (!response.ok) return [];
    const payload = (await response.json()) as ApiFootballLineupsResponse;
    return payload.response ?? [];
  }
}

export const apiFootballProvider = new ApiFootballProvider();
