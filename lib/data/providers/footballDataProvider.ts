import { dataEnv } from '@/lib/data/config/env';
import type { FootballDataMatch, FootballDataMatchesResponse } from '@/lib/data/providers/providerTypes';

function toYmd(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export class FootballDataProvider {
  readonly providerName = 'football-data.org';

  isConfigured(): boolean {
    return Boolean(dataEnv.footballDataApiToken);
  }

  async getMatchesByRange(daysForward: number): Promise<FootballDataMatch[]> {
    if (!dataEnv.footballDataApiToken) {
      return [];
    }

    const from = new Date();
    const to = new Date();
    to.setDate(from.getDate() + daysForward);

    const url = `https://api.football-data.org/v4/matches?dateFrom=${toYmd(from)}&dateTo=${toYmd(to)}`;
    const response = await fetch(url, {
      headers: {
        'X-Auth-Token': dataEnv.footballDataApiToken,
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as FootballDataMatchesResponse;
    return payload.matches ?? [];
  }

  async getMatchById(id: string): Promise<FootballDataMatch | null> {
    if (!dataEnv.footballDataApiToken) {
      return null;
    }

    const response = await fetch(`https://api.football-data.org/v4/matches/${id}`, {
      headers: {
        'X-Auth-Token': dataEnv.footballDataApiToken,
      },
      next: { revalidate: 180 },
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as FootballDataMatch;
  }
}

export const footballDataProvider = new FootballDataProvider();
