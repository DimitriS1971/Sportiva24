import { describe, expect, it } from 'vitest';
import { buildMatchPredictionV2 } from '@/lib/intelligence-s24/v2/engine';
import { buildScoreDistribution, summarizeDistribution } from '@/lib/intelligence-s24/v2/poisson';
import type { MatchPredictionFeatures } from '@/lib/intelligence-s24/v2/types';

const features: MatchPredictionFeatures = {
  matchId: 'af-123',
  competition: 'Premier League',
  kickoffAt: '2026-09-18T18:00:00.000Z',
  generatedAt: '2026-09-17T12:00:00.000Z',
  home: { teamId: 'home', teamName: 'Local', venue: 'home', matches: 5, goalsFor: 9, goalsAgainst: 4, updatedAt: '2026-09-17T12:00:00.000Z' },
  away: { teamId: 'away', teamName: 'Visitante', venue: 'away', matches: 5, goalsFor: 6, goalsAgainst: 8, updatedAt: '2026-09-17T12:00:00.000Z' },
  dataAvailability: { fixtures: true, standings: true, recentForm: true, homeAwayForm: true, headToHead: true, lineups: false, injuries: false, odds: false },
};

describe('S24 Intelligence Engine V2', () => {
  it('normalizes the score distribution and derived market complements', () => {
    const distribution = buildScoreDistribution(1.7, 0.9);
    const summary = summarizeDistribution(distribution);

    expect(distribution.reduce((total, score) => total + score.probability, 0)).toBeCloseTo(1, 10);
    expect(summary.probabilities.home + summary.probabilities.draw + summary.probabilities.away).toBeCloseTo(1, 3);
    expect(summary.markets.over25 + summary.markets.under25).toBeCloseTo(1, 4);
    expect(summary.markets.bttsYes + summary.markets.bttsNo).toBeCloseTo(1, 4);
  });

  it('returns a reproducible prediction from the same feature snapshot', () => {
    expect(buildMatchPredictionV2(features)).toEqual(buildMatchPredictionV2(features));
    expect(buildMatchPredictionV2(features).status).toBe('ready');
  });

  it('withholds probabilities when venue-specific history is insufficient', () => {
    const prediction = buildMatchPredictionV2({ ...features, home: { ...features.home, matches: 2 } });

    expect(prediction.status).toBe('insufficient-data');
    expect(prediction.probabilities).toBeUndefined();
  });

  it('uses qualifying season venue samples and keeps market consensus separate', () => {
    const prediction = buildMatchPredictionV2({
      ...features,
      home: { ...features.home, matches: 0, season: { matches: 8, goalsFor: 16, goalsAgainst: 6 } },
      away: { ...features.away, matches: 0, season: { matches: 8, goalsFor: 8, goalsAgainst: 13 } },
      marketConsensus: { bookmakers: 3, home: 0.35, draw: 0.27, away: 0.38 },
      dataAvailability: { ...features.dataAvailability, odds: true },
    });

    expect(prediction.probabilities).toBeDefined();
    expect(prediction.expectedGoals?.home).toBeCloseTo(1.8125, 4);
    expect(prediction.marketConsensus?.bookmakers).toBe(3);
    expect(prediction.modelMarketDivergence).toBeDefined();
  });
});