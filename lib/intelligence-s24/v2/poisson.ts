import type { ScoreProbability } from '@/lib/intelligence-s24/v2/types';

const MAX_GOALS = 10;

function round(value: number): number {
  return Math.round(value * 10000) / 10000;
}

export function poissonProbability(goals: number, lambda: number): number {
  if (!Number.isFinite(lambda) || lambda < 0 || !Number.isInteger(goals) || goals < 0) return 0;

  let factorial = 1;
  for (let value = 2; value <= goals; value += 1) {
    factorial *= value;
  }

  return (Math.exp(-lambda) * (lambda ** goals)) / factorial;
}

export function buildScoreDistribution(homeLambda: number, awayLambda: number, maxGoals = MAX_GOALS): ScoreProbability[] {
  if (!Number.isFinite(homeLambda) || !Number.isFinite(awayLambda) || homeLambda < 0 || awayLambda < 0) {
    return [];
  }

  const distribution: ScoreProbability[] = [];
  for (let home = 0; home <= maxGoals; home += 1) {
    for (let away = 0; away <= maxGoals; away += 1) {
      distribution.push({
        home,
        away,
        probability: poissonProbability(home, homeLambda) * poissonProbability(away, awayLambda),
      });
    }
  }

  const total = distribution.reduce((sum, score) => sum + score.probability, 0);
  return distribution.map((score) => ({ ...score, probability: score.probability / total }));
}

export function summarizeDistribution(distribution: ScoreProbability[]) {
  const home = distribution.filter((score) => score.home > score.away).reduce((sum, score) => sum + score.probability, 0);
  const draw = distribution.filter((score) => score.home === score.away).reduce((sum, score) => sum + score.probability, 0);
  const away = distribution.filter((score) => score.home < score.away).reduce((sum, score) => sum + score.probability, 0);
  const totals = (threshold: number) => distribution.reduce((sum, score) => sum + (score.home + score.away > threshold ? score.probability : 0), 0);
  const bttsYes = distribution.filter((score) => score.home > 0 && score.away > 0).reduce((sum, score) => sum + score.probability, 0);

  return {
    probabilities: { home: round(home), draw: round(draw), away: round(away) },
    markets: {
      over15: round(totals(1.5)), under15: round(1 - totals(1.5)),
      over25: round(totals(2.5)), under25: round(1 - totals(2.5)),
      over35: round(totals(3.5)), under35: round(1 - totals(3.5)),
      bttsYes: round(bttsYes), bttsNo: round(1 - bttsYes),
    },
    correctScores: [...distribution]
      .sort((first, second) => second.probability - first.probability)
      .slice(0, 5)
      .map((score) => ({ ...score, probability: round(score.probability) })),
  };
}