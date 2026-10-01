import { apiFootballProvider } from '@/lib/data/providers/apiFootballProvider';
import type { ApiFootballFixture, ApiFootballTeamStatistics } from '@/lib/data/providers/providerTypes';

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
  venue: 'home' | 'away';
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
  totalShots?: number;
  shotsOnTarget?: number;
  shotsOffTarget?: number;
  blockedShots?: number;
  yellowCards?: number;
  redCards?: number;
  corners?: number;
  fouls?: number;
  goalkeeperSaves?: number;
  totalPasses?: number;
  accuratePasses?: number;
  possession?: string;
}

export interface RealTeamSeasonStatistics {
  teamId: number;
  teamName: string;
  homePlayed?: number;
  awayPlayed?: number;
  homeGoalsFor?: number;
  awayGoalsFor?: number;
  homeGoalsAgainst?: number;
  awayGoalsAgainst?: number;
  homeCleanSheets?: number;
  awayCleanSheets?: number;
}

export interface RealPlayerAvailability {
  teamId: number;
  teamName: string;
  unavailablePlayers: Array<{ name: string; type?: string; reason?: string }>;
}

export interface RealMarketConsensus {
  bookmakers: number;
  home: number;
  draw: number;
  away: number;
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
  seasonStatistics: RealTeamSeasonStatistics[];
  playerAvailability: RealPlayerAvailability[];
  marketConsensus?: RealMarketConsensus;
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

const demoFixtureLookup: Record<string, { homeTeamId: number; awayTeamId: number; mode: 'last' | 'next' }> = {
  'demo-barcelona-sevilla-finalizado': { homeTeamId: 529, awayTeamId: 536, mode: 'last' },
  'demo-arsenal-chelsea-en-vivo': { homeTeamId: 42, awayTeamId: 49, mode: 'last' },
  'demo-atletico-madrid-real-madrid': { homeTeamId: 530, awayTeamId: 541, mode: 'next' },
};

async function resolveDemoFixture(homeTeamId: number, awayTeamId: number): Promise<ApiFootballFixture | null> {
  const season = new Date().getUTCFullYear();
  const candidates = await Promise.all([
    apiFootballProvider.getFixtureByTeams(homeTeamId, awayTeamId, 'next'),
    apiFootballProvider.getFixturesByLeagueSeason(140, season, 100),
  ]);
  const leagueFixture = candidates[1].find((item) => item.teams?.home?.id === homeTeamId && item.teams?.away?.id === awayTeamId);
  return leagueFixture ?? candidates[0];
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
    venue: isHome ? 'home' : 'away',
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

function isCompletedFixture(fixture: ApiFootballFixture): boolean {
  return ['FT', 'AET', 'PEN', 'AWD', 'WO'].includes(fixture.fixture?.status?.short ?? '');
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

function toNumber(value?: string): number | undefined {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function normalizeMarketConsensus(odds: Awaited<ReturnType<typeof apiFootballProvider.getFixtureOdds>>): RealMarketConsensus | undefined {
  const probabilities = odds.map((bookmaker) => {
    const values = bookmaker.bets?.find((bet) => bet.name?.toLowerCase() === 'match winner')?.values ?? [];
    const home = toNumber(values.find((value) => value.value === 'Home')?.odd);
    const draw = toNumber(values.find((value) => value.value === 'Draw')?.odd);
    const away = toNumber(values.find((value) => value.value === 'Away')?.odd);
    if (!home || !draw || !away || home <= 1 || draw <= 1 || away <= 1) return null;
    const inverseTotal = (1 / home) + (1 / draw) + (1 / away);
    return { home: (1 / home) / inverseTotal, draw: (1 / draw) / inverseTotal, away: (1 / away) / inverseTotal };
  }).filter((value): value is { home: number; draw: number; away: number } => value !== null);

  if (probabilities.length === 0) return undefined;
  const totals = probabilities.reduce((total, value) => ({
    home: total.home + value.home,
    draw: total.draw + value.draw,
    away: total.away + value.away,
  }), { home: 0, draw: 0, away: 0 });
  return {
    bookmakers: probabilities.length,
    home: totals.home / probabilities.length,
    draw: totals.draw / probabilities.length,
    away: totals.away / probabilities.length,
  };
}

export async function getRealMatchContext(slug: string, providerId: string): Promise<RealMatchContext | null> {
  if (providerId !== 'api-football') {
    return null;
  }

  const fixtureId = fixtureIdFromSlug(slug);
  const demoLookup = demoFixtureLookup[slug];
  if (!fixtureId && !demoLookup) {
    return null;
  }

  const fixture = fixtureId
    ? await apiFootballProvider.getFixtureById(String(fixtureId))
    : await resolveDemoFixture(demoLookup!.homeTeamId, demoLookup!.awayTeamId);
  const homeTeamId = fixture?.teams?.home?.id;
  const awayTeamId = fixture?.teams?.away?.id;
  const homeTeamName = fixture?.teams?.home?.name;
  const awayTeamName = fixture?.teams?.away?.name;

  if (!fixture || !homeTeamId || !awayTeamId || !homeTeamName || !awayTeamName) {
    return null;
  }

  const resolvedFixtureId = fixture.fixture?.id;
  if (!resolvedFixtureId) {
    return null;
  }

  const matchIsLive = isLiveFixture(fixture);
  const matchIsCompleted = isCompletedFixture(fixture);
  const leagueId = fixture.league?.id ?? 0;
  const season = fixture.league?.season;
  const [lineupsResult, liveStatisticsResult, historyResult, homeRecentResult, awayRecentResult, standingsResult, homeStatsResult, awayStatsResult, homeInjuriesResult, awayInjuriesResult] = await Promise.allSettled([
    apiFootballProvider.getLineups(resolvedFixtureId),
    matchIsLive || matchIsCompleted ? apiFootballProvider.getFixtureStatistics(resolvedFixtureId) : Promise.resolve([]),
    apiFootballProvider.getHeadToHead(homeTeamId, awayTeamId),
    apiFootballProvider.getRecentFixtures(homeTeamId, 10),
    apiFootballProvider.getRecentFixtures(awayTeamId, 10),
    apiFootballProvider.getStandings(leagueId, season),
    apiFootballProvider.getTeamSeasonStatistics(homeTeamId, leagueId, season),
    apiFootballProvider.getTeamSeasonStatistics(awayTeamId, leagueId, season),
    apiFootballProvider.getTeamInjuries(homeTeamId, leagueId, season),
    apiFootballProvider.getTeamInjuries(awayTeamId, leagueId, season),
  ]);
  const valueOr = <T,>(result: PromiseSettledResult<T>, fallback: T): T => result.status === 'fulfilled' ? result.value : fallback;
  const lineups = valueOr(lineupsResult, []);
  const liveStatistics = valueOr(liveStatisticsResult, []);
  const history = valueOr(historyResult, []);
  const homeRecent = valueOr(homeRecentResult, []);
  const awayRecent = valueOr(awayRecentResult, []);
  const standings = valueOr(standingsResult, []);
  const homeStats = valueOr(homeStatsResult, null);
  const awayStats = valueOr(awayStatsResult, null);
  const homeInjuries = valueOr(homeInjuriesResult, []);
  const awayInjuries = valueOr(awayInjuriesResult, []);
  const headToHeadMatches = sortNewestFirst(history)
    .filter((item) => item.fixture?.id !== fixture.fixture?.id && isCompletedFixture(item))
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
  const matchStandings = [...new Map(
    toStanding
      .filter((entry) => entry.teamId === homeTeamId || entry.teamId === awayTeamId)
      .map((entry) => [entry.teamId, entry] as const),
  ).values()].sort((left, right) => {
    if (left.teamId === homeTeamId) return -1;
    if (right.teamId === homeTeamId) return 1;
    return 0;
  });
  const recentForm = {
    home: sortNewestFirst(homeRecent)
      .filter((item) => item.fixture?.id !== fixtureId && isCompletedFixture(item))
      .map((item) => toRecentMatch(item, homeTeamId))
      .filter((item): item is RealRecentMatch => item !== null)
      .slice(0, 10),
    away: sortNewestFirst(awayRecent)
      .filter((item) => item.fixture?.id !== fixtureId && isCompletedFixture(item))
      .map((item) => toRecentMatch(item, awayTeamId))
      .filter((item): item is RealRecentMatch => item !== null)
      .slice(0, 10),
  };
  const realLineups = (lineups ?? []).filter((lineup) => lineup.team?.name).map((lineup) => ({
    teamName: lineup.team!.name!,
    formation: lineup.formation ?? undefined,
    starters: (lineup.startXI ?? []).map((item) => item.player?.name).filter((name): name is string => Boolean(name)),
    substitutes: (lineup.substitutes ?? []).map((item) => item.player?.name).filter((name): name is string => Boolean(name)),
  }));
  const realLiveStatistics = (liveStatistics ?? []).filter((item) => item.team?.name).map((item) => ({
    teamName: item.team!.name!,
    totalShots: numericStatistic(statisticValue(item.statistics ?? [], 'Total Shots')),
    shotsOnTarget: numericStatistic(statisticValue(item.statistics ?? [], 'Shots on Goal')),
    shotsOffTarget: numericStatistic(statisticValue(item.statistics ?? [], 'Shots off Goal')),
    blockedShots: numericStatistic(statisticValue(item.statistics ?? [], 'Blocked Shots')),
    yellowCards: numericStatistic(statisticValue(item.statistics ?? [], 'Yellow Cards')),
    redCards: numericStatistic(statisticValue(item.statistics ?? [], 'Red Cards')),
    corners: numericStatistic(statisticValue(item.statistics ?? [], 'Corner Kicks')),
    fouls: numericStatistic(statisticValue(item.statistics ?? [], 'Fouls')),
    goalkeeperSaves: numericStatistic(statisticValue(item.statistics ?? [], 'Goalkeeper Saves')),
    totalPasses: numericStatistic(statisticValue(item.statistics ?? [], 'Total passes')),
    accuratePasses: numericStatistic(statisticValue(item.statistics ?? [], 'Passes accurate')),
    possession: typeof statisticValue(item.statistics ?? [], 'Ball Possession') === 'string'
      ? statisticValue(item.statistics ?? [], 'Ball Possession') as string
      : undefined,
  }));
  const toSeasonStatistics = (teamId: number, teamName: string, statistics: ApiFootballTeamStatistics | null): RealTeamSeasonStatistics | null => {
    const leagueStats = statistics?.league;
    if (!leagueStats?.fixtures?.played?.total) return null;
    return {
      teamId,
      teamName,
      homePlayed: leagueStats.fixtures.played.home,
      awayPlayed: leagueStats.fixtures.played.away,
      homeGoalsFor: leagueStats.goals?.for?.total?.home,
      awayGoalsFor: leagueStats.goals?.for?.total?.away,
      homeGoalsAgainst: leagueStats.goals?.against?.total?.home,
      awayGoalsAgainst: leagueStats.goals?.against?.total?.away,
      homeCleanSheets: leagueStats.clean_sheet?.home,
      awayCleanSheets: leagueStats.clean_sheet?.away,
    };
  };
  const seasonStatistics = [
    toSeasonStatistics(homeTeamId, homeTeamName, homeStats),
    toSeasonStatistics(awayTeamId, awayTeamName, awayStats),
  ].filter((value): value is RealTeamSeasonStatistics => value !== null);
  const playerAvailability = [
    { teamId: homeTeamId, teamName: homeTeamName, injuries: homeInjuries },
    { teamId: awayTeamId, teamName: awayTeamName, injuries: awayInjuries },
  ].map(({ teamId, teamName, injuries }) => ({
    teamId,
    teamName,
    unavailablePlayers: Array.from(injuries.reduce((unique, injury) => {
      const name = injury.player?.name ?? 'Jugador no informado';
      const type = injury.player?.type;
      const reason = injury.player?.reason;
      unique.set(`${name}|${type ?? ''}|${reason ?? ''}`, { name, type, reason });
      return unique;
    }, new Map<string, { name: string; type?: string; reason?: string }>()).values()),
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
    standings: matchStandings,
    lineups: realLineups,
    liveStatistics: realLiveStatistics,
    seasonStatistics,
    playerAvailability,
    summary: `${homeTeamName} vs ${awayTeamName} se juega el ${formatDate(fixture.fixture?.date)} en ${fixture.league?.name ?? 'la competicion informada'}. ${h2hSummary}`,
    unavailableData: [
      ...(toStanding.length === 0 ? ['Clasificacion y puntos de la temporada'] : []),
      ...(recentForm.home.length === 0 || recentForm.away.length === 0 ? ['Forma reciente completa por equipo'] : []),
      ...(realLineups.length === 0 ? ['Alineaciones confirmadas del partido'] : []),
      ...(seasonStatistics.length !== 2 ? ['Estadisticas de temporada por equipo'] : []),
      'Estadisticas agregadas de goles y rendimiento por temporada',
    ],
  };
}
