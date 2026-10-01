import type { Match } from '@/lib/data/types/domain';
import type { RealMatchContext, RealRecentMatch } from '@/lib/intelligence-s24/realMatchContext';
import type { MatchPredictionFeatures, TeamGoalFeatures } from '@/lib/intelligence-s24/v2/types';

function goalTotals(matches: RealRecentMatch[]): { goalsFor: number; goalsAgainst: number } {
  return matches.reduce((totals, match) => {
    const [goalsFor, goalsAgainst] = match.score.split('-').map(Number);
    if (!Number.isFinite(goalsFor) || !Number.isFinite(goalsAgainst)) return totals;
    return { goalsFor: totals.goalsFor + goalsFor, goalsAgainst: totals.goalsAgainst + goalsAgainst };
  }, { goalsFor: 0, goalsAgainst: 0 });
}

function buildTeamGoalFeatures(
  team: Match['homeTeam'],
  venue: 'home' | 'away',
  matches: RealRecentMatch[],
  kickoffAt: string,
  generatedAt: string,
  season?: { matches?: number; goalsFor?: number; goalsAgainst?: number },
): TeamGoalFeatures {
  const cutoff = Date.parse(kickoffAt);
  const eligible = matches.filter((match) => {
    const playedAt = match.dateTimeUtc ? Date.parse(match.dateTimeUtc) : Number.NaN;
    return match.venue === venue && Number.isFinite(playedAt) && playedAt < cutoff;
  });
  const totals = goalTotals(eligible);

  return {
    teamId: team.id,
    teamName: team.name,
    venue,
    matches: eligible.length,
    goalsFor: totals.goalsFor,
    goalsAgainst: totals.goalsAgainst,
    updatedAt: generatedAt,
    season: season?.matches && season.goalsFor !== undefined && season.goalsAgainst !== undefined
      ? { matches: season.matches, goalsFor: season.goalsFor, goalsAgainst: season.goalsAgainst }
      : undefined,
  };
}

export function buildMatchPredictionFeatures(match: Match, context: RealMatchContext | null, generatedAt = new Date().toISOString()): MatchPredictionFeatures {
  const kickoffAt = match.dateTimeUtc ?? '';
  const homeMatches = context?.recentForm.home ?? [];
  const awayMatches = context?.recentForm.away ?? [];
  const homeSeason = context?.seasonStatistics.find((statistics) => statistics.teamName === match.homeTeam.name);
  const awaySeason = context?.seasonStatistics.find((statistics) => statistics.teamName === match.awayTeam.name);

  return {
    matchId: match.id,
    competition: match.competition,
    kickoffAt,
    generatedAt,
    home: buildTeamGoalFeatures(match.homeTeam, 'home', homeMatches, kickoffAt, generatedAt, {
      matches: homeSeason?.homePlayed,
      goalsFor: homeSeason?.homeGoalsFor,
      goalsAgainst: homeSeason?.homeGoalsAgainst,
    }),
    away: buildTeamGoalFeatures(match.awayTeam, 'away', awayMatches, kickoffAt, generatedAt, {
      matches: awaySeason?.awayPlayed,
      goalsFor: awaySeason?.awayGoalsFor,
      goalsAgainst: awaySeason?.awayGoalsAgainst,
    }),
    dataAvailability: {
      fixtures: Boolean(match.dateTimeUtc),
      standings: Boolean(context?.standings.length),
      recentForm: homeMatches.length > 0 && awayMatches.length > 0,
      homeAwayForm: homeMatches.some((item) => item.venue === 'home') && awayMatches.some((item) => item.venue === 'away'),
      headToHead: Boolean(context?.headToHead.matches.length),
      lineups: Boolean(context?.lineups.length),
      injuries: false,
      odds: Boolean(context?.marketConsensus),
    },
    marketConsensus: context?.marketConsensus,
  };
}