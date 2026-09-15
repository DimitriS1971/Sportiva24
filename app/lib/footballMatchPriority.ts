import type { IntelligenceMatch } from '@/lib/domain/intelligenceCenter';

const competitionPriorities: Array<{ pattern: RegExp; priority: number }> = [
  { pattern: /world cup|copa del mundo/i, priority: 1 },
  { pattern: /qualifiers|eliminatorias|qualification/i, priority: 2 },
  { pattern: /copa america|euro|nations league|gold cup|africa cup|asian cup/i, priority: 3 },
  { pattern: /uefa champions league/i, priority: 4 },
  { pattern: /uefa europa league|uefa conference league|uefa super cup/i, priority: 5 },
  { pattern: /libertadores/i, priority: 6 },
  { pattern: /sudamericana/i, priority: 7 },
  { pattern: /^premier league$/i, priority: 8 },
  { pattern: /^serie a$|^la ?liga$|^bundesliga$|^ligue 1$/i, priority: 8 },
  { pattern: /brasileirao|liga profesional argentina|primera division argentina|liga 1 peru|primera a colombia|primera division uruguay/i, priority: 9 },
  { pattern: /eredivisie|primeira liga|liga mx|mls/i, priority: 10 },
];

const clubProminence: Array<{ pattern: RegExp; score: number }> = [
  { pattern: /real madrid|barcelona|bayern|psg/i, score: 8 },
  { pattern: /manchester city|manchester united|liverpool|arsenal|chelsea/i, score: 7 },
  { pattern: /inter|juventus|milan|napoli|atletico madrid|dortmund/i, score: 6 },
  { pattern: /roma|newcastle|tottenham|leeds/i, score: 5 },
  { pattern: /torino|parma|como|udinese/i, score: 2 },
];

function kickoffTimestamp(match: IntelligenceMatch): number {
  const timestamp = match.dateTimeUtc ? new Date(match.dateTimeUtc).getTime() : Number.NaN;
  return Number.isFinite(timestamp) ? timestamp : Number.MAX_SAFE_INTEGER;
}

export function getCompetitionPriority(competition: string): number {
  return competitionPriorities.find(({ pattern }) => pattern.test(competition))?.priority ?? 100;
}

function getClubProminence(teamName: string): number {
  return clubProminence.find(({ pattern }) => pattern.test(teamName))?.score ?? 0;
}

function getMatchProminence(match: IntelligenceMatch): number {
  return getClubProminence(match.team1) + getClubProminence(match.team2);
}

export function sortMatchesByImportance(matches: IntelligenceMatch[]): IntelligenceMatch[] {
  return [...matches].sort((first, second) => {
    const priorityDifference = getCompetitionPriority(first.competition) - getCompetitionPriority(second.competition);
    if (priorityDifference !== 0) {
      return priorityDifference;
    }

    const prominenceDifference = getMatchProminence(second) - getMatchProminence(first);
    return prominenceDifference !== 0 ? prominenceDifference : kickoffTimestamp(first) - kickoffTimestamp(second);
  });
}

export function selectHomeMatches(matches: IntelligenceMatch[]) {
  const activeMatches = sortMatchesByImportance(matches.filter((match) => match.status === 'EN VIVO')).slice(0, 3);
  const featuredMatches = sortMatchesByImportance(matches.filter((match) => match.status === 'PROXIMO')).slice(0, 3);

  return { activeMatches, featuredMatches };
}