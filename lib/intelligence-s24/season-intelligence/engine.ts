import { createEditorialEngine } from '@/lib/intelligence-s24/editorial';
import type { S24EvaluationRecord } from '@/lib/intelligence-s24/history/learningTypes';
import type { SportProfile } from '@/lib/intelligence-s24/sports';
import type { IntelligenceCenterData } from '@/lib/intelligence-s24/intelligence-center';
import type {
  BuildSeasonIntelligenceOptions,
  SeasonComparison,
  SeasonCriticalMoment,
  SeasonEvolutionPoint,
  SeasonIdentity,
  SeasonInsight,
  SeasonIntelligenceData,
  SeasonIntelligenceHubData,
  SeasonMethodologyChange,
  SeasonStreak,
} from '@/lib/intelligence-s24/season-intelligence/types';

interface SeasonRecordBucket {
  slug: string;
  competition: string;
  seasonLabel: string;
  records: S24EvaluationRecord[];
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function seasonLabelFromDate(dateIso: string): string {
  const date = new Date(dateIso);
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;

  if (month >= 7) {
    return `${year}-${year + 1}`;
  }

  return `${year - 1}-${year}`;
}

function buildSeasonBuckets(records: S24EvaluationRecord[]): SeasonRecordBucket[] {
  const map = new Map<string, SeasonRecordBucket>();

  for (const record of records) {
    const seasonLabel = seasonLabelFromDate(record.createdAt);
    const base = `${record.match.competition} ${seasonLabel}`;
    const slug = slugify(base);
    const key = `${record.match.competition}|${seasonLabel}`;

    const bucket = map.get(key) ?? {
      slug,
      competition: record.match.competition,
      seasonLabel,
      records: [],
    };

    bucket.records.push(record);
    map.set(key, bucket);
  }

  return Array.from(map.values())
    .map((bucket) => ({
      ...bucket,
      records: bucket.records.sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1)),
    }))
    .sort((a, b) => b.records.length - a.records.length);
}

function trendToScore(trend: string): number {
  const normalized = trend.toLowerCase();
  if (normalized.includes('muy positiva')) return 2;
  if (normalized.includes('positiva')) return 1;
  if (normalized.includes('muy negativa')) return -2;
  if (normalized.includes('negativa')) return -1;
  return 0;
}

function buildEvolutionPoints(records: S24EvaluationRecord[]): SeasonEvolutionPoint[] {
  return records.map((record) => ({
    createdAt: record.createdAt,
    s24Index: record.metrics.s24Index,
    trend: record.metrics.trend,
    risk: record.metrics.risk,
  }));
}

function detectTrendChanges(points: SeasonEvolutionPoint[]): number {
  if (points.length <= 1) return 0;

  let changes = 0;
  let previous = trendToScore(points[0].trend);
  for (let i = 1; i < points.length; i += 1) {
    const current = trendToScore(points[i].trend);
    const previousSign = previous > 0 ? 1 : previous < 0 ? -1 : 0;
    const currentSign = current > 0 ? 1 : current < 0 ? -1 : 0;

    if (currentSign !== previousSign && currentSign !== 0 && previousSign !== 0) {
      changes += 1;
    }

    previous = current;
  }

  return changes;
}

function buildCriticalMoments(records: S24EvaluationRecord[]): SeasonCriticalMoment[] {
  return [...records]
    .sort((a, b) => {
      const aScore = (a.metrics.risk.toLowerCase().includes('alto') ? 1 : a.metrics.risk.toLowerCase().includes('medio') ? 0.6 : 0.2)
        + (a.metrics.confidence.toLowerCase().includes('baja') ? 0.6 : 0.1);
      const bScore = (b.metrics.risk.toLowerCase().includes('alto') ? 1 : b.metrics.risk.toLowerCase().includes('medio') ? 0.6 : 0.2)
        + (b.metrics.confidence.toLowerCase().includes('baja') ? 0.6 : 0.1);
      return bScore - aScore;
    })
    .slice(0, 8)
    .map((record) => ({
      createdAt: record.createdAt,
      matchLabel: `${record.match.homeTeam} vs ${record.match.awayTeam}`,
      signal: `${record.metrics.risk}/${record.metrics.confidence}`,
      impact: `Indice ${record.metrics.s24Index} en ${record.match.competition}`,
    }));
}

function buildStreak(records: S24EvaluationRecord[], mode: 'positive' | 'negative'): SeasonStreak | null {
  if (records.length === 0) return null;

  const predicate = (record: S24EvaluationRecord) => {
    const score = trendToScore(record.metrics.trend);
    return mode === 'positive' ? score > 0 : score < 0;
  };

  let best: { start: number; end: number; length: number } | null = null;
  let currentStart = -1;

  for (let i = 0; i < records.length; i += 1) {
    if (predicate(records[i])) {
      if (currentStart === -1) currentStart = i;
    } else if (currentStart !== -1) {
      const length = i - currentStart;
      if (!best || length > best.length) {
        best = { start: currentStart, end: i - 1, length };
      }
      currentStart = -1;
    }
  }

  if (currentStart !== -1) {
    const length = records.length - currentStart;
    if (!best || length > best.length) {
      best = { start: currentStart, end: records.length - 1, length };
    }
  }

  if (!best) return null;

  const from = records[best.start].createdAt;
  const to = records[best.end].createdAt;

  return {
    type: mode,
    length: best.length,
    from,
    to,
    summary: mode === 'positive'
      ? `Racha positiva de ${best.length} evaluaciones consecutivas.`
      : `Racha negativa de ${best.length} evaluaciones consecutivas.`,
  };
}

function buildMethodologyChanges(records: S24EvaluationRecord[]): SeasonMethodologyChange[] {
  const changes: SeasonMethodologyChange[] = [];

  for (let i = 1; i < records.length; i += 1) {
    const previous = records[i - 1];
    const current = records[i];

    if (previous.model.methodologicalVersion !== current.model.methodologicalVersion) {
      changes.push({
        key: `methodology-${i}`,
        description: 'Cambio de version metodologica detectado en la temporada.',
        previous: previous.model.methodologicalVersion,
        current: current.model.methodologicalVersion,
      });
    }

    if (previous.model.motorVersion !== current.model.motorVersion) {
      changes.push({
        key: `motor-${i}`,
        description: 'Cambio de version del motor detectado en la ventana temporal.',
        previous: previous.model.motorVersion,
        current: current.model.motorVersion,
      });
    }
  }

  if (changes.length === 0 && records.length > 0) {
    changes.push({
      key: 'stable-methodology',
      description: 'No se detectaron cambios de version metodologica en la temporada analizada.',
      previous: records[0].model.methodologicalVersion,
      current: records[records.length - 1].model.methodologicalVersion,
    });
  }

  return changes.slice(0, 8);
}

function metricsFromRecords(records: S24EvaluationRecord[]): SeasonComparison['current'] {
  if (records.length === 0) {
    return {
      avgIndex: 0,
      volatility: 0,
      highRiskRate: 0,
      trendPositiveRate: 0,
      sampleSize: 0,
    };
  }

  const avgIndex = records.reduce((acc, record) => acc + record.metrics.s24Index, 0) / records.length;
  const highRiskRate = records.filter((record) => record.metrics.risk.toLowerCase().includes('alto')).length / records.length;
  const trendPositiveRate = records.filter((record) => trendToScore(record.metrics.trend) > 0).length / records.length;

  const mean = avgIndex;
  const variance = records.reduce((acc, record) => acc + ((record.metrics.s24Index - mean) ** 2), 0) / records.length;
  const volatility = Math.sqrt(variance);

  return {
    avgIndex: round2(avgIndex),
    volatility: round2(volatility),
    highRiskRate: round2(highRiskRate * 100),
    trendPositiveRate: round2(trendPositiveRate * 100),
    sampleSize: records.length,
  };
}

function buildSeasonComparison(currentRecords: S24EvaluationRecord[], previousRecords: S24EvaluationRecord[]): SeasonComparison {
  const current = metricsFromRecords(currentRecords);
  const previous = metricsFromRecords(previousRecords);

  const delta = {
    avgIndex: round2(current.avgIndex - previous.avgIndex),
    volatility: round2(current.volatility - previous.volatility),
    highRiskRate: round2(current.highRiskRate - previous.highRiskRate),
    trendPositiveRate: round2(current.trendPositiveRate - previous.trendPositiveRate),
  };

  const summary = delta.avgIndex >= 0
    ? 'La temporada actual mejora el indice medio frente a la temporada anterior.'
    : 'La temporada actual cae en indice medio frente a la temporada anterior.';

  return { current, previous, delta, summary };
}

function buildInsights(
  competition: string,
  seasonLabel: string,
  evolution: SeasonEvolutionPoint[],
  trendChanges: number,
  bestStreak: SeasonStreak | null,
  worstStreak: SeasonStreak | null,
  comparison: SeasonComparison,
): SeasonInsight[] {
  const peak = [...evolution].sort((a, b) => b.s24Index - a.s24Index)[0];
  const low = [...evolution].sort((a, b) => a.s24Index - b.s24Index)[0];

  const insights: SeasonInsight[] = [
    {
      title: 'Pulso de temporada',
      summary: `${competition} ${seasonLabel} registra ${trendChanges} cambios de tendencia en la ventana analizada.`,
      evidence: [
        `trendChanges=${trendChanges}`,
        `samples=${evolution.length}`,
      ],
    },
  ];

  if (peak) {
    insights.push({
      title: 'Pico competitivo',
      summary: `El mayor punto de S24 Index fue ${peak.s24Index}.`,
      evidence: [
        `date=${peak.createdAt}`,
        `risk=${peak.risk}`,
      ],
    });
  }

  if (low) {
    insights.push({
      title: 'Valle competitivo',
      summary: `El menor punto de S24 Index fue ${low.s24Index}.`,
      evidence: [
        `date=${low.createdAt}`,
        `trend=${low.trend}`,
      ],
    });
  }

  if (bestStreak) {
    insights.push({
      title: 'Mejor racha detectada',
      summary: bestStreak.summary,
      evidence: [`from=${bestStreak.from}`, `to=${bestStreak.to}`],
    });
  }

  if (worstStreak) {
    insights.push({
      title: 'Peor racha detectada',
      summary: worstStreak.summary,
      evidence: [`from=${worstStreak.from}`, `to=${worstStreak.to}`],
    });
  }

  insights.push({
    title: 'Comparacion intertemporada',
    summary: comparison.summary,
    evidence: [
      `deltaIndex=${comparison.delta.avgIndex}`,
      `deltaVolatility=${comparison.delta.volatility}`,
      `deltaRisk=${comparison.delta.highRiskRate}`,
    ],
  });

  return insights.slice(0, 8);
}

function buildCompetitiveEvolutionSummary(evolution: SeasonEvolutionPoint[]): string {
  if (evolution.length === 0) return 'Sin datos suficientes para evaluar evolucion competitiva.';

  const first = evolution[0].s24Index;
  const last = evolution[evolution.length - 1].s24Index;
  const delta = round2(last - first);

  if (delta >= 0) {
    return `La evolucion competitiva cierra en crecimiento de ${delta} puntos de S24 Index respecto al inicio.`;
  }

  return `La evolucion competitiva cierra en caida de ${Math.abs(delta)} puntos de S24 Index respecto al inicio.`;
}

export function buildSeasonIntelligenceHubData(records: S24EvaluationRecord[]): SeasonIntelligenceHubData {
  const buckets = buildSeasonBuckets(records);
  const seasons: SeasonIdentity[] = buckets.slice(0, 50).map((bucket) => ({
    slug: bucket.slug,
    competition: bucket.competition,
    seasonLabel: bucket.seasonLabel,
    matches: bucket.records.length,
  }));

  return {
    generatedAt: new Date().toISOString(),
    seasons,
    recommendedSeasonSlug: seasons[0]?.slug ?? null,
  };
}

export function buildSeasonIntelligenceData(
  records: S24EvaluationRecord[],
  centerData: IntelligenceCenterData,
  sportProfile: SportProfile,
  options: BuildSeasonIntelligenceOptions = {},
): SeasonIntelligenceData {
  const buckets = buildSeasonBuckets(records);

  const selected = options.seasonSlug
    ? buckets.find((bucket) => bucket.slug === options.seasonSlug)
    : buckets[0];

  const fallbackCompetition = centerData.competiciones.rankingsPorLiga[0]?.competition ?? 'Competicion no informada';
  const fallbackSeasonLabel = new Date().getUTCFullYear().toString();
  const active = selected ?? {
    slug: options.seasonSlug ?? slugify(`${fallbackCompetition}-${fallbackSeasonLabel}`),
    competition: fallbackCompetition,
    seasonLabel: fallbackSeasonLabel,
    records: [] as S24EvaluationRecord[],
  };

  const previous = buckets.find((bucket) => bucket.competition === active.competition && bucket.seasonLabel !== active.seasonLabel)
    ?.records ?? [];

  const evolution = buildEvolutionPoints(active.records);
  const trendChanges = detectTrendChanges(evolution);
  const criticalMoments = buildCriticalMoments(active.records);
  const bestStreak = buildStreak(active.records, 'positive');
  const worstStreak = buildStreak(active.records, 'negative');
  const methodologyChanges = buildMethodologyChanges(active.records);
  const comparison = buildSeasonComparison(active.records, previous);

  const editorial = createEditorialEngine({ locale: 'es', seed: active.competition.length + active.records.length + 23 });

  const narrative = {
    executiveSummary: `${active.competition} ${active.seasonLabel} refleja una lectura metodologica con ${active.records.length} evaluaciones procesadas.`,
    competitiveEvolution: buildCompetitiveEvolutionSummary(evolution),
    trendChanges: `${editorial.pickTransition('contrast')} se registraron ${trendChanges} cambios de tendencia durante la temporada.`,
    methodologicalChanges: `${editorial.pickTransition('closing')} ${methodologyChanges[0]?.description ?? 'sin cambios metodologicos detectados'}`,
  };

  const insights = buildInsights(active.competition, active.seasonLabel, evolution, trendChanges, bestStreak, worstStreak, comparison);

  const providerId = active.records[0]?.provider.id ?? 'none';
  const confidenceLabel = active.records[0]?.metrics.confidence ?? 'Media';

  return {
    generatedAt: new Date().toISOString(),
    competition: active.competition,
    seasonLabel: active.seasonLabel,
    evolution: {
      s24IndexTimeline: evolution,
      competitiveEvolution: buildCompetitiveEvolutionSummary(evolution),
      trendChanges,
    },
    criticalMoments,
    bestStreak,
    worstStreak,
    methodologicalChanges: methodologyChanges,
    narrative,
    insights,
    comparisonWithPreviousSeason: comparison,
    passport: {
      versionMotor: active.records[0]?.model.motorVersion ?? 'Motor S24 v1',
      versionMetodologica: active.records[0]?.model.methodologicalVersion ?? sportProfile.methodologyVersion,
      sportProfileVersion: sportProfile.version,
      sportMethodologyVersion: sportProfile.methodologyVersion,
      sportIdentifier: sportProfile.id,
      fechaCalculo: new Date().toLocaleString('es-ES'),
      proveedorDatos: providerId,
      coberturaAnalisis: confidenceLabel.toLowerCase().includes('alta') ? 'Alta' : confidenceLabel.toLowerCase().includes('media') ? 'Media' : 'Limitada',
      nivelConfianza: confidenceLabel,
      estadoInforme: 'Activo',
    },
  };
}

export { slugify };
