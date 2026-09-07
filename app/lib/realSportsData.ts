import type { IntelligenceMatch } from '@/lib/domain/intelligenceCenter';
import { sportsDataService } from '@/lib/data';
import { getTeamCrest } from './teamCrests';

function toUiStatus(status: 'EN VIVO' | 'PRÓXIMO' | 'FINALIZADO'): IntelligenceMatch['status'] | null {
  if (status === 'EN VIVO') {
    return 'EN VIVO';
  }

  if (status === 'PRÓXIMO') {
    return 'PROXIMO';
  }

  return null;
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

const topLeaguesOnly = envFlag(process.env.NEXT_PUBLIC_TOP_LEAGUES_ONLY, true);
const strictFreeMode = envFlag(process.env.NEXT_PUBLIC_FREE_STRICT_MODE, false);

function mapToIntelligenceMatch(match: Awaited<ReturnType<typeof sportsDataService.getTodayMatches>>[number]): IntelligenceMatch | null {
  const source = sourceFromSlug(match.slug);
  const status = toUiStatus(match.status);

  if (!status) {
    return null;
  }

  return {
    competition: match.competition,
    time: match.time,
    status,
    team1: match.homeTeam.name,
    team1Logo: getTeamCrest(match.homeTeam.name, match.homeTeam.badgeUrl),
    team2: match.awayTeam.name,
    team2Logo: getTeamCrest(match.awayTeam.name, match.awayTeam.badgeUrl),
    s24Index: match.indexScore ?? 84,
    confidence: match.confidence ?? 'Media',
    probability: match.probabilityHomeWin ?? 52,
    slug: match.slug,
    sourceLabel: source.sourceLabel,
    sourceTier: source.sourceTier,
  };
}

function applyQualityFilters(matches: IntelligenceMatch[], limit: number): IntelligenceMatch[] {
  let filtered = matches;

  if (topLeaguesOnly) {
    filtered = filtered.filter((match) => isTopCompetition(match.competition));
  }

  if (strictFreeMode) {
    filtered = filtered.filter((match) => match.sourceTier !== 'mock');
  }

  return filtered.slice(0, limit);
}

export async function getFeaturedFootballMatches(limit = 4): Promise<IntelligenceMatch[]> {
  const matches = await sportsDataService.getFeaturedMatches('football', limit);
  return applyQualityFilters(
    matches.map((match) => mapToIntelligenceMatch(match)).filter((match): match is IntelligenceMatch => match !== null),
    limit,
  );
}

export async function getTodayFootballMatches(limit = 8): Promise<IntelligenceMatch[]> {
  const matches = await sportsDataService.getTodayMatches('football', limit);
  return applyQualityFilters(
    matches.map((match) => mapToIntelligenceMatch(match)).filter((match): match is IntelligenceMatch => match !== null),
    limit,
  );
}

export async function getTodayFootballMatchesCount(): Promise<number> {
  return sportsDataService.getTodayMatchesCount('football');
}

export async function getTodayBasketballMatchesCount(): Promise<number> {
  return sportsDataService.getTodayMatchesCount('basketball');
}
