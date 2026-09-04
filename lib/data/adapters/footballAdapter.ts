import type { SportAdapter } from '@/lib/data/adapters/adapterTypes';
import {
  normalizeDateToLabel,
  normalizeInternalId,
  normalizeLeagueName,
  normalizeSlug,
  normalizeTeamName,
} from '@/lib/data/normalization/normalizers';
import type { ApiFootballFixture, FootballDataMatch, TheSportsDbEvent } from '@/lib/data/providers/providerTypes';
import type { Match } from '@/lib/data/types/domain';

function mapStatus(status: string): Match['status'] {
  if (new Set(['LIVE', 'IN_PLAY', 'PAUSED']).has(status)) return 'EN VIVO';
  if (new Set(['FINISHED', 'CANCELLED']).has(status)) return 'FINALIZADO';
  return 'PRÓXIMO';
}

function mapApiFootballStatus(statusShort?: string): Match['status'] {
  if (!statusShort) return 'PRÓXIMO';
  if (new Set(['1H', '2H', 'HT', 'LIVE', 'P']).has(statusShort)) return 'EN VIVO';
  if (new Set(['FT', 'AET', 'PEN', 'CANC']).has(statusShort)) return 'FINALIZADO';
  return 'PRÓXIMO';
}

function mapSportsDbStatus(status?: string): Match['status'] {
  const normalized = (status ?? '').toUpperCase();
  if (normalized.includes('LIVE')) return 'EN VIVO';
  if (normalized.includes('FT') || normalized.includes('FINISHED')) return 'FINALIZADO';
  return 'PRÓXIMO';
}

export class FootballAdapter implements SportAdapter {
  sport = 'football' as const;

  adaptFeaturedMatches(input: FootballDataMatch[], limit: number): Match[] {
    return input.slice(0, limit).map((match, index) => ({
      id: normalizeInternalId('fd', match.id),
      slug: `fd-match-${match.id}`,
      sport: 'football',
      competition: normalizeLeagueName((match.competition?.name ?? 'Liga').toUpperCase()),
      time: normalizeDateToLabel(match.utcDate),
      dateTimeUtc: match.utcDate,
      status: mapStatus(match.status),
      homeTeam: {
        id: normalizeInternalId('team', match.homeTeam?.id ?? `h-${index}`),
        name: normalizeTeamName(match.homeTeam?.name ?? 'Equipo local'),
        shortName: match.homeTeam?.shortName,
      },
      awayTeam: {
        id: normalizeInternalId('team', match.awayTeam?.id ?? `a-${index}`),
        name: normalizeTeamName(match.awayTeam?.name ?? 'Equipo visitante'),
        shortName: match.awayTeam?.shortName,
      },
      indexScore: 82 + index * 3,
      confidence: index % 2 === 0 ? 'Media' : 'Alta',
      probabilityHomeWin: 50 + (index % 4) * 3,
    }));
  }

  adaptApiFootballFeaturedMatches(input: ApiFootballFixture[], limit: number): Match[] {
    return input.slice(0, limit).map((fixture, index) => {
      const fixtureId = fixture.fixture?.id ?? `api-${index}`;
      const homeName = normalizeTeamName(fixture.teams?.home?.name ?? 'Equipo local');
      const awayName = normalizeTeamName(fixture.teams?.away?.name ?? 'Equipo visitante');

      return {
        id: normalizeInternalId('af', fixtureId),
        slug: `af-match-${fixtureId}`,
        sport: 'football',
        competition: normalizeLeagueName((fixture.league?.name ?? 'Liga').toUpperCase()),
        time: normalizeDateToLabel(fixture.fixture?.date ?? new Date().toISOString()),
        dateTimeUtc: fixture.fixture?.date,
        status: mapApiFootballStatus(fixture.fixture?.status?.short),
        homeTeam: {
          id: normalizeInternalId('team', fixture.teams?.home?.id ?? `h-${index}`),
          name: homeName,
          badgeUrl: fixture.teams?.home?.logo,
        },
        awayTeam: {
          id: normalizeInternalId('team', fixture.teams?.away?.id ?? `a-${index}`),
          name: awayName,
          badgeUrl: fixture.teams?.away?.logo,
        },
        indexScore: 83 + index * 2,
        confidence: index % 2 === 0 ? 'Alta' : 'Media',
        probabilityHomeWin: 51 + index * 2,
      };
    });
  }

  adaptSportsDbFeaturedMatches(input: TheSportsDbEvent[], limit: number): Match[] {
    return input.slice(0, limit).map((event, index) => {
      const eventId = event.idEvent ?? `sdb-${index}`;
      const homeName = normalizeTeamName(event.strHomeTeam ?? 'Equipo local');
      const awayName = normalizeTeamName(event.strAwayTeam ?? 'Equipo visitante');
      const composedSlug = normalizeSlug(`${homeName}-${awayName}`);

      return {
        id: normalizeInternalId('sdb', eventId),
        slug: `sdb-match-${eventId}-${composedSlug}`,
        sport: 'football',
        competition: normalizeLeagueName((event.strLeague ?? 'Liga').toUpperCase()),
        time: normalizeDateToLabel(event.strTimestamp ?? new Date().toISOString()),
        dateTimeUtc: event.strTimestamp,
        status: mapSportsDbStatus(event.strStatus),
        homeTeam: {
          id: normalizeInternalId('team', `${eventId}-h`),
          name: homeName,
        },
        awayTeam: {
          id: normalizeInternalId('team', `${eventId}-a`),
          name: awayName,
        },
        indexScore: 80 + index * 2,
        confidence: 'Media',
        probabilityHomeWin: 50,
      };
    });
  }
}

export const footballAdapter = new FootballAdapter();
