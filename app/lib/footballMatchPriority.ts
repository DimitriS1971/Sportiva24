import type { IntelligenceMatch } from '@/lib/domain/intelligenceCenter';

const competitionPriorities: Array<{ pattern: RegExp; priority: number }> = [
  { pattern: /champions league/i, priority: 1 },
  { pattern: /europa league|conference league/i, priority: 2 },
  { pattern: /premier league/i, priority: 3 },
  { pattern: /la ?liga/i, priority: 4 },
  { pattern: /serie a/i, priority: 5 },
  { pattern: /bundesliga/i, priority: 6 },
  { pattern: /ligue 1/i, priority: 7 },
  { pattern: /eredivisie|primeira liga/i, priority: 8 },
  { pattern: /libertadores|sudamericana/i, priority: 9 },
  { pattern: /brasileirao|liga profesional argentina|mls/i, priority: 10 },
];

function kickoffTimestamp(match: IntelligenceMatch): number {
  const timestamp = match.dateTimeUtc ? new Date(match.dateTimeUtc).getTime() : Number.NaN;
  return Number.isFinite(timestamp) ? timestamp : Number.MAX_SAFE_INTEGER;
}

export function getCompetitionPriority(competition: string): number {
  return competitionPriorities.find(({ pattern }) => pattern.test(competition))?.priority ?? 100;
}

export function sortMatchesByImportance(matches: IntelligenceMatch[]): IntelligenceMatch[] {
  return [...matches].sort((first, second) => {
    const priorityDifference = getCompetitionPriority(first.competition) - getCompetitionPriority(second.competition);
    return priorityDifference !== 0 ? priorityDifference : kickoffTimestamp(first) - kickoffTimestamp(second);
  });
}

export function selectHomeMatches(matches: IntelligenceMatch[]) {
  const activeMatches = sortMatchesByImportance(matches.filter((match) => match.status === 'EN VIVO')).slice(0, 3);
  const upcomingMatches = sortMatchesByImportance(matches.filter((match) => match.status === 'PROXIMO')).slice(0, 3);

  return { activeMatches, upcomingMatches };
}