import { buildScoreDistribution, summarizeDistribution } from '@/lib/intelligence-s24/v2/poisson';
import type { MatchPredictionFeatures, MatchPredictionV2 } from '@/lib/intelligence-s24/v2/types';

const MODEL_VERSION = 'S24-IE-2.0.0' as const;
const FEATURE_VERSION = 'S24-FE-2.0.0' as const;
const MINIMUM_VENUE_MATCHES = 3;
const READY_VENUE_MATCHES = 5;

function mean(total: number, count: number): number {
  return count > 0 ? total / count : 0;
}

function goalSample(team: MatchPredictionFeatures['home']) {
  return team.season && team.season.matches >= MINIMUM_VENUE_MATCHES
    ? team.season
    : { matches: team.matches, goalsFor: team.goalsFor, goalsAgainst: team.goalsAgainst };
}

function dataQuality(features: MatchPredictionFeatures) {
  const entries = Object.entries(features.dataAvailability);
  const available = entries.filter(([, value]) => value).map(([key]) => key);
  const unavailable = entries.filter(([, value]) => !value).map(([key]) => key);
  return { score: Math.round((available.length / entries.length) * 100), available, unavailable };
}

export function buildMatchPredictionV2(features: MatchPredictionFeatures): MatchPredictionV2 {
  const quality = dataQuality(features);
  const homeSample = goalSample(features.home);
  const awaySample = goalSample(features.away);
  const minimumSampleMissing = homeSample.matches < MINIMUM_VENUE_MATCHES || awaySample.matches < MINIMUM_VENUE_MATCHES;
  const limitations = [
    ...(!features.dataAvailability.injuries ? ['Lesiones y suspensiones no disponibles.'] : []),
    ...(!features.dataAvailability.odds ? ['Cuotas de mercado no disponibles.'] : []),
    ...(!features.dataAvailability.lineups ? ['Alineaciones confirmadas no disponibles.'] : []),
  ];

  if (minimumSampleMissing) {
    return {
      status: 'insufficient-data',
      modelVersion: MODEL_VERSION,
      featureVersion: FEATURE_VERSION,
      generatedAt: features.generatedAt,
      dataQuality: quality,
      drivers: [],
      limitations: [
        `Muestra insuficiente: ${features.home.teamName} tiene ${homeSample.matches} partidos locales y ${features.away.teamName} tiene ${awaySample.matches} partidos visitantes previos; se requieren ${MINIMUM_VENUE_MATCHES} por equipo.`,
        ...limitations,
      ],
    };
  }

  const homeAttack = mean(homeSample.goalsFor, homeSample.matches);
  const homeDefense = mean(homeSample.goalsAgainst, homeSample.matches);
  const awayAttack = mean(awaySample.goalsFor, awaySample.matches);
  const awayDefense = mean(awaySample.goalsAgainst, awaySample.matches);
  const lambdaHome = (homeAttack + awayDefense) / 2;
  const lambdaAway = (awayAttack + homeDefense) / 2;
  const distribution = buildScoreDistribution(lambdaHome, lambdaAway);
  const summary = summarizeDistribution(distribution);
  const status = homeSample.matches >= READY_VENUE_MATCHES && awaySample.matches >= READY_VENUE_MATCHES
    ? 'ready'
    : 'limited-data';
  const drivers = [
    `${features.home.teamName}: ${homeAttack.toFixed(2)} goles a favor por partido como local en ${homeSample.matches} partidos.`,
    `${features.away.teamName}: ${awayDefense.toFixed(2)} goles recibidos por partido como visitante en ${awaySample.matches} partidos.`,
    `${features.away.teamName}: ${awayAttack.toFixed(2)} goles a favor por partido como visitante en ${awaySample.matches} partidos.`,
    `${features.home.teamName}: ${homeDefense.toFixed(2)} goles recibidos por partido como local en ${homeSample.matches} partidos.`,
  ];

  return {
    status,
    modelVersion: MODEL_VERSION,
    featureVersion: FEATURE_VERSION,
    generatedAt: features.generatedAt,
    dataQuality: quality,
    probabilities: summary.probabilities,
    expectedGoals: { home: lambdaHome, away: lambdaAway, total: lambdaHome + lambdaAway },
    markets: summary.markets,
    correctScores: summary.correctScores,
    marketConsensus: features.marketConsensus,
    modelMarketDivergence: features.marketConsensus ? {
      home: summary.probabilities.home - features.marketConsensus.home,
      draw: summary.probabilities.draw - features.marketConsensus.draw,
      away: summary.probabilities.away - features.marketConsensus.away,
    } : undefined,
    drivers,
    limitations: [
      'Modelo Poisson independiente de referencia. La calibración y normalización por liga requieren histórico persistido y backtesting temporal.',
      ...limitations,
    ],
  };
}