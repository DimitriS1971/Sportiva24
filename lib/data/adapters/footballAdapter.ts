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
  if (status === 'LIVE' || status === 'IN_PLAY') return 'EN VIVO';
  if (status === 'PAUSED') return 'DESCANSO';
  if (status === 'FINISHED') return 'FINALIZADO';
  if (status === 'CANCELLED') return 'CANCELADO';
  return 'PRÓXIMO';
}

function mapApiFootballStatus(statusShort?: string): Match['status'] {
  const statusLabels: Record<string, Match['status']> = {
    NS: 'PRÓXIMO', TBD: 'PRÓXIMO', PST: 'POSTERGADO', CANC: 'CANCELADO', ABD: 'ABANDONADO', AWD: 'ADJUDICADO', WO: 'ADJUDICADO',
    LIVE: 'EN VIVO', '1H': 'EN VIVO', '2H': 'EN VIVO', HT: 'ENTRETIEMPO', ET: 'PRÓRROGA', BT: 'DESCANSO', P: 'PENALES', PEN: 'PENALES', FT: 'FINALIZADO', AET: 'DESPUÉS DE PRÓRROGA',
  };
  return statusLabels[statusShort ?? ''] ?? 'RETRASADO';
}

function mapSportsDbStatus(status?: string): Match['status'] {
  const normalized = (status ?? '').toUpperCase();
  if (normalized.includes('LIVE')) return 'EN VIVO';
  if (normalized.includes('FT') || normalized.includes('FINISHED')) return 'FINALIZADO';
  return 'PRÓXIMO';
}

function shouldHideApiFootballFixture(fixture: ApiFootballFixture): boolean {
  const status = fixture.fixture?.status?.short;
  if (status === 'TBD') {
    return true;
  }

  if (status !== 'NS' || !fixture.fixture?.date) {
    return false;
  }

  const scheduledAt = new Date(fixture.fixture.date).getTime();
  return Number.isFinite(scheduledAt) && scheduledAt < Date.now() - 15 * 60 * 1000;
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
    }));
  }

  adaptApiFootballFeaturedMatches(input: ApiFootballFixture[], limit: number): Match[] {
    return input.filter((fixture) => !shouldHideApiFootballFixture(fixture)).slice(0, limit).map((fixture, index) => {
      const fixtureId = fixture.fixture?.id ?? `api-${index}`;
      const homeName = normalizeTeamName(fixture.teams?.home?.name ?? 'Equipo local');
      const awayName = normalizeTeamName(fixture.teams?.away?.name ?? 'Equipo visitante');

      return {
        id: normalizeInternalId('af', fixtureId),
        slug: `af-match-${fixtureId}`,
        sport: 'football',
        competition: normalizeLeagueName((fixture.league?.name ?? 'Liga').toUpperCase()),
        country: fixture.league?.country,
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
        homeScore: fixture.goals?.home ?? undefined,
        awayScore: fixture.goals?.away ?? undefined,
        elapsedMinutes: fixture.fixture?.status?.elapsed ?? undefined,
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
      };
    });
  }
}

export const footballAdapter = new FootballAdapter();
