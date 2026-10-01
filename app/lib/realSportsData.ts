import type { IntelligenceMatch } from '@/lib/domain/intelligenceCenter';
import { footballAdapter } from '@/lib/data/adapters/footballAdapter';
import { apiFootballProvider } from '@/lib/data/providers/apiFootballProvider';
import { sportsDataService } from '@/lib/data';
import { getTeamCrest } from './teamCrests';

function toUiStatus(status: string): IntelligenceMatch['status'] {
  return status === 'PRÓXIMO' ? 'PROXIMO' : status as IntelligenceMatch['status'];
}

const topCompetitionMatchers = [
  /champions/i,
  /europa league/i,
  /premier league/i,
  /la ?liga/i,
  /serie a/i,
  /bundesliga/i,
  /ligue 1/i,
  /eredivisie/i,
  /primeira liga/i,
  /mls/i,
  /libertadores/i,
  /sudamericana/i,
  /brasileirao/i,
  /copa del rey/i,
  /fa cup/i,
];

function sourceFromSlug(slug: string): { sourceLabel: string; sourceTier: 'free' | 'paid' | 'mock' } {
  if (slug.startsWith('fd-match-')) {
    return { sourceLabel: 'football-data.org', sourceTier: 'free' };
  }

  if (slug.startsWith('sdb-match-')) {
    return { sourceLabel: 'TheSportsDB', sourceTier: 'free' };
  }

  if (slug.startsWith('af-match-')) {
    return { sourceLabel: 'API-Football', sourceTier: 'paid' };
  }

  return { sourceLabel: 'Mock local', sourceTier: 'mock' };
}

function isTopCompetition(name: string): boolean {
  return topCompetitionMatchers.some((matcher) => matcher.test(name));
}

function envFlag(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) {
    return fallback;
  }

  const normalized = value.trim().toLowerCase();
  if (normalized === '1' || normalized === 'true' || normalized === 'yes') {
    return true;
  }

  if (normalized === '0' || normalized === 'false' || normalized === 'no') {
    return false;
  }

  return fallback;
}

const strictFreeMode = envFlag(process.env.NEXT_PUBLIC_FREE_STRICT_MODE, false);
const priorityFootballLeagueIds = [39, 140, 48, 13, 11, 71, 128];

function mapToIntelligenceMatch(match: Awaited<ReturnType<typeof sportsDataService.getTodayMatches>>[number]): IntelligenceMatch {
  const source = sourceFromSlug(match.slug);
  const status = toUiStatus(match.status);

  return {
    competition: match.competition,
    country: match.country,
    time: match.time,
    dateTimeUtc: match.dateTimeUtc,
    status,
    team1: match.homeTeam.name,
    team1Logo: getTeamCrest(match.homeTeam.name, match.homeTeam.badgeUrl),
    team2: match.awayTeam.name,
    team2Logo: getTeamCrest(match.awayTeam.name, match.awayTeam.badgeUrl),
    s24Index: match.indexScore ?? 0,
    confidence: match.confidence ?? 'Baja',
    probability: match.probabilityHomeWin ?? 0,
    slug: match.slug,
    sourceLabel: source.sourceLabel,
    sourceTier: source.sourceTier,
    homeScore: match.homeScore,
    awayScore: match.awayScore,
    elapsedMinutes: match.elapsedMinutes,
  };
}

function applyQualityFilters(matches: IntelligenceMatch[], limit: number, onlyTopLeagues = false): IntelligenceMatch[] {
  let filtered = matches;

  if (onlyTopLeagues) {
    filtered = filtered.filter((match) => isTopCompetition(match.competition));
  }

  if (strictFreeMode) {
    filtered = filtered.filter((match) => match.sourceTier !== 'mock');
  }

  return filtered.slice(0, limit);
}

export async function getFeaturedFootballMatches(limit = 4): Promise<IntelligenceMatch[]> {
  const matches = await sportsDataService.getFeaturedMatches('football', limit * 4);
  return applyQualityFilters(
    matches
      .map(mapToIntelligenceMatch)
      .filter((match) => match.status !== 'FINALIZADO'),
    limit,
    true,
  );
}

export async function getTodayFootballMatches(limit = 8): Promise<IntelligenceMatch[]> {
  if (apiFootballProvider.isConfigured()) {
    const apiMatches = footballAdapter
      .adaptApiFootballFeaturedMatches(await apiFootballProvider.getFixturesByDate(new Date()), limit * 4)
      .map(mapToIntelligenceMatch);

    if (apiMatches.length > 0) {
      return applyQualityFilters(apiMatches, limit);
    }
  }

  const matches = await sportsDataService.getTodayMatches('football', limit);
  return applyQualityFilters(
    matches.map(mapToIntelligenceMatch),
    limit,
  );
}

export async function getAnalysisFootballMatches(limit = 50): Promise<IntelligenceMatch[]> {
  const [todayMatches, upcomingMatches] = await Promise.all([
    getTodayFootballMatches(limit),
    getUpcomingFootballMatches(limit, 2),
  ]);

  return Array.from(new Map(
    [...todayMatches, ...upcomingMatches]
      .filter((match) => match.status === 'PROXIMO' && match.sourceTier !== 'mock')
      .map((match) => [match.slug, match]),
  ).values())
    .sort((left, right) => (left.dateTimeUtc ?? '').localeCompare(right.dateTimeUtc ?? ''))
    .slice(0, limit);
}

export async function getUpcomingFootballMatches(limit = 50, daysAhead = 7): Promise<IntelligenceMatch[]> {
  const priorityFixtures = (await Promise.all(
    priorityFootballLeagueIds.map((leagueId) => apiFootballProvider.getFixturesByLeague(leagueId, Math.ceil(limit / priorityFootballLeagueIds.length))),
  )).flat();
  const fixtures = priorityFixtures.length > 0 ? priorityFixtures : await apiFootballProvider.getNextFixtures(limit);
  const matches = footballAdapter
    .adaptApiFootballFeaturedMatches(fixtures, limit)
    .map(mapToIntelligenceMatch)
    .filter((match) => {
      if (match.status !== 'PROXIMO' || !match.dateTimeUtc) return false;
      const kickoff = new Date(match.dateTimeUtc).getTime();
      const now = Date.now();
      return Number.isFinite(kickoff) && kickoff >= now - 15 * 60 * 1000 && kickoff <= now + daysAhead * 24 * 60 * 60 * 1000;
    });

  return applyQualityFilters(matches, limit);
}

export async function getTodayFootballMatchesCount(): Promise<number> {
  return sportsDataService.getTodayMatchesCount('football');
}

export async function getPublishedAnalysisCount(): Promise<number> {
  return (await getAnalysisFootballMatches(50)).length;
}

export async function getTodayBasketballMatchesCount(): Promise<number> {
  return sportsDataService.getTodayMatchesCount('basketball');
}
