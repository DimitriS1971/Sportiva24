import { apiFootballProvider } from '@/lib/data/providers/apiFootballProvider';
import type { ApiFootballFixture } from '@/lib/data/providers/providerTypes';

export interface RealHeadToHeadMatch {
  date: string;
  dateTimeUtc?: string;
  homeTeam: string;
  awayTeam: string;
  score: string;
}

export interface RealRecentMatch {
  date: string;
  dateTimeUtc?: string;
  opponent: string;
  score: string;
  result: 'V' | 'E' | 'D';
}

export interface RealTeamStanding {
  teamId: number;
  teamName: string;
  position: number;
  points?: number;
  played?: number;
}

export interface RealLineup {
  teamName: string;
  formation?: string;
  starters: string[];
  substitutes: string[];
}

export interface RealLiveTeamStatistics {
  teamName: string;
  shotsOnTarget?: number;
  yellowCards?: number;
  redCards?: number;
  corners?: number;
  fouls?: number;
  possession?: string;
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
  recentForm: {
    home: RealRecentMatch[];
    away: RealRecentMatch[];
  };
  standings: RealTeamStanding[];
  lineups: RealLineup[];
  liveStatistics: RealLiveTeamStatistics[];
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
    dateTimeUtc: fixture.fixture?.date,
    homeTeam,
    awayTeam,
    score: `${homeGoals}-${awayGoals}`,
  };
}

function toRecentMatch(fixture: ApiFootballFixture, teamId: number): RealRecentMatch | null {
  const home = fixture.teams?.home;
  const away = fixture.teams?.away;
  const homeGoals = fixture.goals?.home;
  const awayGoals = fixture.goals?.away;
  if (!home?.id || !away?.name || !home?.name || homeGoals === null || homeGoals === undefined || awayGoals === null || awayGoals === undefined) return null;

  const isHome = home.id === teamId;
  const teamGoals = isHome ? homeGoals : awayGoals;
  const opponentGoals = isHome ? awayGoals : homeGoals;
  const result = teamGoals > opponentGoals ? 'V' : teamGoals === opponentGoals ? 'E' : 'D';
  return {
    date: formatDate(fixture.fixture?.date),
    dateTimeUtc: fixture.fixture?.date,
    opponent: isHome ? away.name : home.name,
    score: `${teamGoals}-${opponentGoals}`,
    result,
  };
}

function sortNewestFirst(fixtures: ApiFootballFixture[]): ApiFootballFixture[] {
  return [...fixtures].sort((left, right) => {
    const leftTime = left.fixture?.date ? Date.parse(left.fixture.date) : 0;
    const rightTime = right.fixture?.date ? Date.parse(right.fixture.date) : 0;
    return rightTime - leftTime;
  });
}

function isLiveFixture(fixture: ApiFootballFixture): boolean {
  return ['LIVE', '1H', '2H', 'HT', 'ET', 'BT', 'P', 'INT'].includes(fixture.fixture?.status?.short ?? '');
}

function statisticValue(statistics: { type?: string; value?: string | number | null }[], type: string): string | number | null | undefined {
  return statistics.find((item) => item.type?.toLowerCase() === type.toLowerCase())?.value;
}

function numericStatistic(value: string | number | null | undefined): number | undefined {
  if (typeof value === 'number') return value;
  if (typeof value !== 'string') return undefined;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? undefined : parsed;
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
  const [homeRecent, awayRecent, standings, lineups] = await Promise.all([
    apiFootballProvider.getRecentFixtures(homeTeamId),
    apiFootballProvider.getRecentFixtures(awayTeamId),
    apiFootballProvider.getStandings(fixture.league?.id ?? 0, fixture.league?.season),
    fixtureId ? apiFootballProvider.getLineups(fixtureId) : Promise.resolve([]),
  ]);
  const liveStatistics = isLiveFixture(fixture)
    ? await apiFootballProvider.getFixtureStatistics(fixtureId)
    : [];
  const headToHeadMatches = sortNewestFirst(history)
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

  const toStanding = standings.filter((entry) => entry.team?.id && entry.team.name && entry.rank).map((entry) => ({
    teamId: entry.team!.id!,
    teamName: entry.team!.name!,
    position: entry.rank!,
    points: entry.points,
    played: entry.all?.played,
  }));
  const recentForm = {
    home: sortNewestFirst(homeRecent)
      .filter((item) => item.fixture?.id !== fixtureId)
      .map((item) => toRecentMatch(item, homeTeamId))
      .filter((item): item is RealRecentMatch => item !== null)
      .slice(0, 5),
    away: sortNewestFirst(awayRecent)
      .filter((item) => item.fixture?.id !== fixtureId)
      .map((item) => toRecentMatch(item, awayTeamId))
      .filter((item): item is RealRecentMatch => item !== null)
      .slice(0, 5),
  };
  const realLineups = (lineups ?? []).filter((lineup) => lineup.team?.name).map((lineup) => ({
    teamName: lineup.team!.name!,
    formation: lineup.formation ?? undefined,
    starters: (lineup.startXI ?? []).map((item) => item.player?.name).filter((name): name is string => Boolean(name)),
    substitutes: (lineup.substitutes ?? []).map((item) => item.player?.name).filter((name): name is string => Boolean(name)),
  }));
  const realLiveStatistics = (liveStatistics ?? []).filter((item) => item.team?.name).map((item) => ({
    teamName: item.team!.name!,
    shotsOnTarget: numericStatistic(statisticValue(item.statistics ?? [], 'Shots on Goal')),
    yellowCards: numericStatistic(statisticValue(item.statistics ?? [], 'Yellow Cards')),
    redCards: numericStatistic(statisticValue(item.statistics ?? [], 'Red Cards')),
    corners: numericStatistic(statisticValue(item.statistics ?? [], 'Corner Kicks')),
    fouls: numericStatistic(statisticValue(item.statistics ?? [], 'Fouls')),
    possession: typeof statisticValue(item.statistics ?? [], 'Ball Possession') === 'string'
      ? statisticValue(item.statistics ?? [], 'Ball Possession') as string
      : undefined,
  }));

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
    recentForm,
    standings: toStanding.filter((entry) => entry.teamId === homeTeamId || entry.teamId === awayTeamId),
    lineups: realLineups,
    liveStatistics: realLiveStatistics,
    summary: `${homeTeamName} vs ${awayTeamName} se juega el ${formatDate(fixture.fixture?.date)} en ${fixture.league?.name ?? 'la competicion informada'}. ${h2hSummary}`,
    unavailableData: [
      ...(toStanding.length === 0 ? ['Clasificacion y puntos de la temporada'] : []),
      ...(recentForm.home.length === 0 || recentForm.away.length === 0 ? ['Forma reciente completa por equipo'] : []),
      ...(realLineups.length === 0 ? ['Alineaciones confirmadas del partido'] : []),
      'Estadisticas agregadas de goles y rendimiento por temporada',
    ],
  };
}
