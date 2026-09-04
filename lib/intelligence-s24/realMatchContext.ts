import { apiFootballProvider } from '@/lib/data/providers/apiFootballProvider';
import type { ApiFootballFixture } from '@/lib/data/providers/providerTypes';

export interface RealHeadToHeadMatch {
  date: string;
  homeTeam: string;
  awayTeam: string;
  score: string;
}

export interface RealMatchContext {
  source: 'api-football';
  fixture: {
    competition: string;
    country?: string;
    round?: string;
    scheduledAt?: string;
    venue?: string;
    referee?: string;
  };
  headToHead: {
    matches: RealHeadToHeadMatch[];
    homeWins: number;
    draws: number;
    awayWins: number;
  };
  summary: string;
  unavailableData: string[];
}

function fixtureIdFromSlug(slug: string): number | null {
  if (!slug.startsWith('af-match-')) {
    return null;
  }

  const parsed = Number(slug.slice('af-match-'.length));
  return Number.isInteger(parsed) ? parsed : null;
}

function formatDate(value?: string): string {
  if (!value) return 'fecha no informada';

  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return value;

  return date.toLocaleString('es-ES', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'UTC',
  });
}

function toHeadToHeadMatch(fixture: ApiFootballFixture): RealHeadToHeadMatch | null {
  const homeTeam = fixture.teams?.home?.name;
  const awayTeam = fixture.teams?.away?.name;
  const homeGoals = fixture.goals?.home;
  const awayGoals = fixture.goals?.away;

  if (!homeTeam || !awayTeam || homeGoals === null || homeGoals === undefined || awayGoals === null || awayGoals === undefined) {
    return null;
  }

  return {
    date: formatDate(fixture.fixture?.date),
    homeTeam,
    awayTeam,
    score: `${homeGoals}-${awayGoals}`,
  };
}

export async function getRealMatchContext(slug: string, providerId: string): Promise<RealMatchContext | null> {
  if (providerId !== 'api-football') {
    return null;
  }

  const fixtureId = fixtureIdFromSlug(slug);
  if (!fixtureId) {
    return null;
  }

  const fixture = await apiFootballProvider.getFixtureById(String(fixtureId));
  const homeTeamId = fixture?.teams?.home?.id;
  const awayTeamId = fixture?.teams?.away?.id;
  const homeTeamName = fixture?.teams?.home?.name;
  const awayTeamName = fixture?.teams?.away?.name;

  if (!fixture || !homeTeamId || !awayTeamId || !homeTeamName || !awayTeamName) {
    return null;
  }

  const history = await apiFootballProvider.getHeadToHead(homeTeamId, awayTeamId);
  const headToHeadMatches = history
    .filter((item) => item.fixture?.id !== fixtureId)
    .map(toHeadToHeadMatch)
    .filter((item): item is RealHeadToHeadMatch => item !== null)
    .slice(0, 5);

  const homeWins = headToHeadMatches.filter((item) => {
    const [homeGoals, awayGoals] = item.score.split('-').map(Number);
    return item.homeTeam === homeTeamName ? homeGoals > awayGoals : awayGoals > homeGoals;
  }).length;
  const awayWins = headToHeadMatches.filter((item) => {
    const [homeGoals, awayGoals] = item.score.split('-').map(Number);
    return item.awayTeam === awayTeamName ? awayGoals > homeGoals : homeGoals > awayGoals;
  }).length;
  const draws = headToHeadMatches.length - homeWins - awayWins;

  const h2hSummary = headToHeadMatches.length > 0
    ? `En los ${headToHeadMatches.length} enfrentamientos directos disponibles, ${homeTeamName} suma ${homeWins} victoria${homeWins === 1 ? '' : 's'}, hay ${draws} empate${draws === 1 ? '' : 's'} y ${awayTeamName} registra ${awayWins} victoria${awayWins === 1 ? '' : 's'}.`
    : `API-Football no devolvio enfrentamientos directos finalizados entre ${homeTeamName} y ${awayTeamName}.`;

  const venue = fixture.fixture?.venue?.name
    ? `${fixture.fixture.venue.name}${fixture.fixture.venue.city ? `, ${fixture.fixture.venue.city}` : ''}`
    : undefined;

  return {
    source: 'api-football',
    fixture: {
      competition: fixture.league?.name ?? 'Competicion no informada',
      country: fixture.league?.country,
      round: fixture.league?.round,
      scheduledAt: fixture.fixture?.date,
      venue,
      referee: fixture.fixture?.referee ?? undefined,
    },
    headToHead: {
      matches: headToHeadMatches,
      homeWins,
      draws,
      awayWins,
    },
    summary: `${homeTeamName} vs ${awayTeamName} se juega el ${formatDate(fixture.fixture?.date)} en ${fixture.league?.name ?? 'la competicion informada'}. ${h2hSummary}`,
    unavailableData: [
      'Clasificacion y puntos de la temporada',
      'Forma reciente completa por equipo',
      'Estadisticas agregadas de goles y rendimiento por temporada',
    ],
  };
}
