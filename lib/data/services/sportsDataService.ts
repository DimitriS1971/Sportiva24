import { footballAdapter } from '@/lib/data/adapters/footballAdapter';
import { dataMemoryCache } from '@/lib/data/cache/memoryCache';
import { getProviderPriority } from '@/lib/data/config/providers';
import { dataHealthMonitor } from '@/lib/data/health/dataHealthMonitor';
import { providerManager, type ProviderExecution } from '@/lib/data/manager/providerManager';
import {
  mockAnalysisBySport,
  mockEventsBySport,
  mockFeaturedMatchesBySport,
  mockLeaguesBySport,
  mockNewsBySport,
  mockRankingsBySport,
} from '@/lib/data/mock/mockData';
import { normalizeInternalId } from '@/lib/data/normalization/normalizers';
import { apiFootballProvider } from '@/lib/data/providers/apiFootballProvider';
import { footballDataProvider } from '@/lib/data/providers/footballDataProvider';
import { theSportsDbProvider } from '@/lib/data/providers/sportsDbProvider';
import { dataStatsTracker } from '@/lib/data/stats/dataStats';
import type { Analysis, Event, League, Match, News, Ranking, Sport } from '@/lib/data/types/domain';

export interface MatchLookupResult {
  match: Match | null;
  providerId: string;
  usedFallback: boolean;
}

function extractMatchIdFromSlug(slug: string): string {
  if (slug.startsWith('fd-match-')) {
    return slug.slice('fd-match-'.length);
  }

  if (slug.startsWith('af-match-')) {
    return slug.slice('af-match-'.length);
  }

  if (slug.startsWith('sdb-match-')) {
    const afterPrefix = slug.slice('sdb-match-'.length);
    const idToken = afterPrefix.split('-')[0];
    return idToken;
  }

  return slug;
}

function isSameLocalDay(dateIso: string): boolean {
  const eventDate = new Date(dateIso);
  if (Number.isNaN(eventDate.getTime())) {
    return false;
  }

  const now = new Date();
  return eventDate.getFullYear() === now.getFullYear()
    && eventDate.getMonth() === now.getMonth()
    && eventDate.getDate() === now.getDate();
}

function filterPlayableToday(matches: Match[], limit: number): Match[] {
  return matches
    .filter((match) => match.status !== 'FINALIZADO')
    .filter((match) => {
      if (!match.dateTimeUtc) {
        return true;
      }

      return isSameLocalDay(match.dateTimeUtc);
    })
    .slice(0, limit);
}

export class SportsDataService {
  private withCache<T>(key: string, loader: () => Promise<T>, ttlSeconds: number): Promise<T> {
    const cached = dataMemoryCache.get<T>(key);
    if (cached !== null) {
      return Promise.resolve(cached);
    }

    return loader().then((value) => {
      dataMemoryCache.set(key, value, ttlSeconds);
      return value;
    });
  }

  async getFeaturedMatches(sport: Sport, limit = 4): Promise<Match[]> {
    const providerPriority = getProviderPriority(sport, 'featuredMatches');
    const ttlSeconds = providerPriority[0]?.ttlSeconds ?? 300;

    return this.withCache(`featured:${sport}:${limit}`, async () => {
      if (sport !== 'football') {
        return mockFeaturedMatchesBySport[sport].slice(0, limit);
      }

      const providerExecutions: Record<string, ProviderExecution<Match[]>> = {
        'api-football': {
          id: 'api-football',
          enabled: providerPriority.some((p) => p.id === 'api-football' && p.enabled),
          timeoutMs: providerPriority.find((p) => p.id === 'api-football')?.timeoutMs,
          execute: async () => footballAdapter.adaptApiFootballFeaturedMatches(await apiFootballProvider.getFeaturedFixtures(limit), limit),
          isValid: (data) => data.length > 0,
        },
        'football-data': {
          id: 'football-data',
          enabled: providerPriority.some((p) => p.id === 'football-data' && p.enabled),
          timeoutMs: providerPriority.find((p) => p.id === 'football-data')?.timeoutMs,
          execute: async () => footballAdapter.adaptFeaturedMatches(await footballDataProvider.getMatchesByRange(2), limit),
          isValid: (data) => data.length > 0,
        },
        sportsdb: {
          id: 'sportsdb',
          enabled: providerPriority.some((p) => p.id === 'sportsdb' && p.enabled),
          timeoutMs: providerPriority.find((p) => p.id === 'sportsdb')?.timeoutMs,
          execute: async () => footballAdapter.adaptSportsDbFeaturedMatches(await theSportsDbProvider.getEventsBySportOnDate('Soccer', new Date()), limit),
          isValid: (data) => data.length > 0,
        },
        mock: {
          id: 'mock',
          enabled: providerPriority.some((p) => p.id === 'mock' && p.enabled),
          timeoutMs: providerPriority.find((p) => p.id === 'mock')?.timeoutMs,
          execute: async () => mockFeaturedMatchesBySport.football.slice(0, limit),
          isValid: (data) => data.length > 0,
        },
      };

      const orderedExecutions = providerPriority
        .map((provider) => providerExecutions[provider.id])
        .filter((entry): entry is ProviderExecution<Match[]> => Boolean(entry));

      const result = await providerManager.executeWithFailover({
        sport,
        operation: 'getFeaturedMatches',
      }, orderedExecutions);

      return result.data;
    }, ttlSeconds);
  }

  async getTodayMatches(sport: Sport, limit = 8): Promise<Match[]> {
    const providerPriority = getProviderPriority(sport, 'todayMatches');
    const ttlSeconds = providerPriority[0]?.ttlSeconds ?? 300;

    return this.withCache(`today:${sport}:${limit}`, async () => {
      if (sport === 'football') {
        const providerExecutions: Record<string, ProviderExecution<Match[]>> = {
          'football-data': {
            id: 'football-data',
            enabled: providerPriority.some((p) => p.id === 'football-data' && p.enabled),
            timeoutMs: providerPriority.find((p) => p.id === 'football-data')?.timeoutMs,
            execute: async () => filterPlayableToday(
              footballAdapter.adaptFeaturedMatches(await footballDataProvider.getMatchesByRange(0), limit * 3),
              limit,
            ),
            isValid: (data) => data.length > 0,
          },
          sportsdb: {
            id: 'sportsdb',
            enabled: providerPriority.some((p) => p.id === 'sportsdb' && p.enabled),
            timeoutMs: providerPriority.find((p) => p.id === 'sportsdb')?.timeoutMs,
            execute: async () => filterPlayableToday(
              footballAdapter.adaptSportsDbFeaturedMatches(await theSportsDbProvider.getEventsBySportOnDate('Soccer', new Date()), limit * 3),
              limit,
            ),
            isValid: (data) => data.length > 0,
          },
          'api-football': {
            id: 'api-football',
            enabled: providerPriority.some((p) => p.id === 'api-football' && p.enabled),
            timeoutMs: providerPriority.find((p) => p.id === 'api-football')?.timeoutMs,
            execute: async () => filterPlayableToday(
              footballAdapter.adaptApiFootballFeaturedMatches(await apiFootballProvider.getFixturesByDate(new Date()), limit * 3),
              limit,
            ),
            isValid: (data) => data.length > 0,
          },
          mock: {
            id: 'mock',
            enabled: providerPriority.some((p) => p.id === 'mock' && p.enabled),
            timeoutMs: providerPriority.find((p) => p.id === 'mock')?.timeoutMs,
            execute: async () => mockFeaturedMatchesBySport.football.slice(0, limit),
            isValid: (data) => data.length > 0,
          },
        };

        const orderedExecutions = providerPriority
          .map((provider) => providerExecutions[provider.id])
          .filter((entry): entry is ProviderExecution<Match[]> => Boolean(entry));

        const result = await providerManager.executeWithFailover({
          sport,
          operation: 'getTodayMatches',
        }, orderedExecutions);

        return result.data;
      }

      if (sport === 'basketball') {
        const providerExecutions: Record<string, ProviderExecution<Match[]>> = {
          sportsdb: {
            id: 'sportsdb',
            enabled: providerPriority.some((p) => p.id === 'sportsdb' && p.enabled),
            timeoutMs: providerPriority.find((p) => p.id === 'sportsdb')?.timeoutMs,
            execute: async () => footballAdapter.adaptSportsDbFeaturedMatches(await theSportsDbProvider.getEventsBySportOnDate('Basketball', new Date()), limit).map((item) => ({
              ...item,
              sport: 'basketball',
            })),
            isValid: (data) => data.length > 0,
          },
          mock: {
            id: 'mock',
            enabled: providerPriority.some((p) => p.id === 'mock' && p.enabled),
            timeoutMs: providerPriority.find((p) => p.id === 'mock')?.timeoutMs,
            execute: async () => mockFeaturedMatchesBySport.basketball.slice(0, limit),
            isValid: (data) => data.length > 0,
          },
        };

        const orderedExecutions = providerPriority
          .map((provider) => providerExecutions[provider.id])
          .filter((entry): entry is ProviderExecution<Match[]> => Boolean(entry));

        const result = await providerManager.executeWithFailover({
          sport,
          operation: 'getTodayMatches',
        }, orderedExecutions);

        return result.data;
      }

      return mockFeaturedMatchesBySport[sport].slice(0, limit);
    }, ttlSeconds);
  }

  async getUpcomingEvents(sport: Sport, limit = 4): Promise<Event[]> {
    const ttlSeconds = getProviderPriority(sport, 'featuredMatches')[0]?.ttlSeconds ?? 300;
    return this.withCache(`events:${sport}:${limit}`, async () => mockEventsBySport[sport].slice(0, limit), ttlSeconds);
  }

  async getLatestNews(sport: Sport, limit = 3): Promise<News[]> {
    const ttlSeconds = getProviderPriority(sport, 'featuredMatches')[0]?.ttlSeconds ?? 300;
    return this.withCache(`news:${sport}:${limit}`, async () => mockNewsBySport[sport].slice(0, limit), ttlSeconds);
  }

  async getRankings(sport: Sport, limit = 10): Promise<Ranking[]> {
    const ttlSeconds = getProviderPriority(sport, 'featuredMatches')[0]?.ttlSeconds ?? 300;
    return this.withCache(`rankings:${sport}:${limit}`, async () => mockRankingsBySport[sport].slice(0, limit), ttlSeconds);
  }

  async getLeagues(sport: Sport, limit = 8): Promise<League[]> {
    const ttlSeconds = getProviderPriority(sport, 'featuredMatches')[0]?.ttlSeconds ?? 300;
    return this.withCache(`leagues:${sport}:${limit}`, async () => mockLeaguesBySport[sport].slice(0, limit), ttlSeconds);
  }

  async getLatestAnalysis(sport: Sport, limit = 4): Promise<Analysis[]> {
    const ttlSeconds = getProviderPriority(sport, 'featuredMatches')[0]?.ttlSeconds ?? 300;
    return this.withCache(`analysis:${sport}:${limit}`, async () => mockAnalysisBySport[sport].slice(0, limit), ttlSeconds);
  }

  async getMatchBySlugWithMeta(slug: string): Promise<MatchLookupResult> {
    const matchId = extractMatchIdFromSlug(slug);
    const ttlSeconds = getProviderPriority('football', 'matchBySlug')[0]?.ttlSeconds ?? 300;

    return this.withCache(`match-meta:${slug}`, async () => {
      const providerPriority = getProviderPriority('football', 'matchBySlug');

      const providerExecutions: Record<string, ProviderExecution<Match | null>> = {
        'api-football': {
          id: 'api-football',
          enabled: providerPriority.some((p) => p.id === 'api-football' && p.enabled),
          timeoutMs: providerPriority.find((p) => p.id === 'api-football')?.timeoutMs,
          execute: async () => {
            const fixture = await apiFootballProvider.getFixtureById(matchId);
            if (!fixture) return null;
            return footballAdapter.adaptApiFootballFeaturedMatches([fixture], 1)[0] ?? null;
          },
          isValid: (data) => data !== null,
        },
        'football-data': {
          id: 'football-data',
          enabled: providerPriority.some((p) => p.id === 'football-data' && p.enabled),
          timeoutMs: providerPriority.find((p) => p.id === 'football-data')?.timeoutMs,
          execute: async () => {
            const match = await footballDataProvider.getMatchById(matchId);
            if (!match) return null;
            return footballAdapter.adaptFeaturedMatches([match], 1)[0] ?? null;
          },
          isValid: (data) => data !== null,
        },
        sportsdb: {
          id: 'sportsdb',
          enabled: providerPriority.some((p) => p.id === 'sportsdb' && p.enabled),
          timeoutMs: providerPriority.find((p) => p.id === 'sportsdb')?.timeoutMs,
          execute: async () => {
            const event = await theSportsDbProvider.getEventById(matchId);
            if (!event) return null;
            return footballAdapter.adaptSportsDbFeaturedMatches([event], 1)[0] ?? null;
          },
          isValid: (data) => data !== null,
        },
        mock: {
          id: 'mock',
          enabled: providerPriority.some((p) => p.id === 'mock' && p.enabled),
          timeoutMs: providerPriority.find((p) => p.id === 'mock')?.timeoutMs,
          execute: async () => {
            const local = Object.values(mockFeaturedMatchesBySport)
              .flat()
              .find((match) => match.slug === slug) ?? null;
            return local
              ? { ...local, id: normalizeInternalId('mock', local.id) }
              : null;
          },
          isValid: (data) => data !== null,
        },
      };

      const orderedExecutions = providerPriority
        .map((provider) => providerExecutions[provider.id])
        .filter((entry): entry is ProviderExecution<Match | null> => Boolean(entry));

      try {
        const result = await providerManager.executeWithFailover({
          sport: 'football',
          operation: 'getMatchBySlug',
        }, orderedExecutions);

        return {
          match: result.data,
          providerId: result.providerId,
          usedFallback: result.usedFallback,
        };
      } catch {
        return {
          match: null,
          providerId: 'none',
          usedFallback: true,
        };
      }
    }, ttlSeconds);
  }

  async getMatchBySlug(slug: string): Promise<Match | null> {
    const result = await this.getMatchBySlugWithMeta(slug);
    return result.match;
  }

  async getTodayMatchesCount(sport: Sport): Promise<number> {
    const providerPriority = getProviderPriority(sport, 'todayMatchesCount');
    const ttlSeconds = providerPriority[0]?.ttlSeconds ?? 300;

    return this.withCache(`count:${sport}:today`, async () => {
      if (sport === 'football') {
        const providerExecutions: Record<string, ProviderExecution<number>> = {
          'api-football': {
            id: 'api-football',
            enabled: providerPriority.some((p) => p.id === 'api-football' && p.enabled),
            timeoutMs: providerPriority.find((p) => p.id === 'api-football')?.timeoutMs,
            execute: async () => (await apiFootballProvider.getFeaturedFixtures(20)).length,
            isValid: (value) => value > 0,
          },
          'football-data': {
            id: 'football-data',
            enabled: providerPriority.some((p) => p.id === 'football-data' && p.enabled),
            timeoutMs: providerPriority.find((p) => p.id === 'football-data')?.timeoutMs,
            execute: async () => (await footballDataProvider.getMatchesByRange(0)).length,
            isValid: (value) => value > 0,
          },
          sportsdb: {
            id: 'sportsdb',
            enabled: providerPriority.some((p) => p.id === 'sportsdb' && p.enabled),
            timeoutMs: providerPriority.find((p) => p.id === 'sportsdb')?.timeoutMs,
            execute: async () => await theSportsDbProvider.getEventsCountBySportOnDate('Soccer', new Date()),
            isValid: (value) => value > 0,
          },
          mock: {
            id: 'mock',
            enabled: providerPriority.some((p) => p.id === 'mock' && p.enabled),
            timeoutMs: providerPriority.find((p) => p.id === 'mock')?.timeoutMs,
            execute: async () => 48,
            isValid: (value) => value > 0,
          },
        };

        const orderedExecutions = providerPriority
          .map((provider) => providerExecutions[provider.id])
          .filter((entry): entry is ProviderExecution<number> => Boolean(entry));

        const result = await providerManager.executeWithFailover({
          sport,
          operation: 'getTodayMatchesCount',
        }, orderedExecutions);

        return result.data;
      }

      if (sport === 'basketball') {
        const providerExecutions: Record<string, ProviderExecution<number>> = {
          sportsdb: {
            id: 'sportsdb',
            enabled: providerPriority.some((p) => p.id === 'sportsdb' && p.enabled),
            timeoutMs: providerPriority.find((p) => p.id === 'sportsdb')?.timeoutMs,
            execute: async () => await theSportsDbProvider.getEventsCountBySportOnDate('Basketball', new Date()),
            isValid: (value) => value > 0,
          },
          mock: {
            id: 'mock',
            enabled: providerPriority.some((p) => p.id === 'mock' && p.enabled),
            timeoutMs: providerPriority.find((p) => p.id === 'mock')?.timeoutMs,
            execute: async () => 16,
            isValid: (value) => value > 0,
          },
        };

        const orderedExecutions = providerPriority
          .map((provider) => providerExecutions[provider.id])
          .filter((entry): entry is ProviderExecution<number> => Boolean(entry));

        const result = await providerManager.executeWithFailover({
          sport,
          operation: 'getTodayMatchesCount',
        }, orderedExecutions);

        return result.data;
      }

      return 0;
    }, ttlSeconds);
  }

  getProviderHealth() {
    return dataHealthMonitor.getProviderHealthSnapshot();
  }

  getDataStats() {
    return dataStatsTracker.getSnapshot();
  }
}

export const sportsDataService = new SportsDataService();
