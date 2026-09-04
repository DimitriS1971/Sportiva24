import type { S24EvaluationRecord } from '@/lib/intelligence-s24/history/learningTypes';
import type { IntelligenceProfile } from '@/lib/domain/intelligenceProfile';
import type {
  BuildProfileValidationReportOptions,
  BuildValidationReportOptions,
  IntelligenceProfileValidationReport,
  IntelligenceProfileValidationSample,
  InsightScore,
  MotorScore,
  NarrativeScore,
  ValidationDashboard,
  ValidationReport,
  ValidationSample,
} from '@/lib/intelligence-s24/validation/validationTypes';

function clamp01(value: number): number {
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

function buildProfileSample(profile: IntelligenceProfile): IntelligenceProfileValidationSample {
  return {
    profileId: profile.identity.id,
    profileType: profile.identity.type,
    generatedAt: profile.metadata.generatedAt,
    hasNarrative: Boolean(profile.narrative.executiveSummary),
    hasInsights: profile.insights.length > 0,
    hasEvidence: profile.evidence.length > 0,
    hasHistory: profile.history.length > 0,
    confidenceLevel: profile.competitiveState.confidence.level,
    riskLevel: profile.competitiveState.risk.level,
  };
}

export function buildProfileValidationReport(options: BuildProfileValidationReportOptions): IntelligenceProfileValidationReport {
  const generatedAt = options.generatedAt ?? new Date().toISOString();
  const samples = options.profiles.map((profile) => buildProfileSample(profile));

  const byTypeMap = options.profiles.reduce<Record<string, IntelligenceProfile[]>>((acc, profile) => {
    const key = profile.identity.type;
    acc[key] = acc[key] ? [...acc[key], profile] : [profile];
    return acc;
  }, {});

  const byType = Object.entries(byTypeMap).map(([type, profiles]) => {
    const avgIndex = average(profiles.map((profile) => profile.competitiveState.index.value));
    const highRiskRate = profiles.length === 0
      ? 0
      : profiles.filter((profile) => profile.competitiveState.risk.level === 'Alto').length / profiles.length;

    return {
      type,
      profiles: profiles.length,
      avgIndex: round4(avgIndex),
      highRiskRate: round4(highRiskRate),
    };
  });

  const count = samples.length || 1;

  return {
    generatedAt,
    totalProfiles: samples.length,
    coverage: {
      narrative: round4(samples.filter((sample) => sample.hasNarrative).length / count),
      insights: round4(samples.filter((sample) => sample.hasInsights).length / count),
      evidence: round4(samples.filter((sample) => sample.hasEvidence).length / count),
      history: round4(samples.filter((sample) => sample.hasHistory).length / count),
    },
    byType,
    samples,
  };
}

function round4(value: number): number {
  return Math.round(value * 10000) / 10000;
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((acc, value) => acc + value, 0) / values.length;
}

function stdDev(values: number[]): number {
  if (values.length <= 1) return 0;
  const mean = average(values);
  const variance = average(values.map((value) => (value - mean) ** 2));
  return Math.sqrt(variance);
}

function toPrecisionFromDelta(delta: number): number {
  return clamp01(1 - (Math.abs(delta) / 100));
}

function readPrecision(input?: { accurate?: boolean; score?: number }): number | null {
  if (!input) return null;
  if (typeof input.score === 'number') return clamp01(input.score);
  if (typeof input.accurate === 'boolean') return input.accurate ? 1 : 0;
  return null;
}

function buildSample(record: S24EvaluationRecord): ValidationSample {
  const real = record.comparison.realOutcome;
  const hasRealOutcome = record.comparison.status === 'available' && Boolean(real);

  if (!hasRealOutcome || !real) {
    return {
      evaluationId: record.id,
      createdAt: record.createdAt,
      matchSlug: record.match.slug,
      sport: record.match.sport,
      providerId: record.provider.id,
      hasRealOutcome: false,
      verdictAccurate: false,
      indexPrecision: null,
      insightPrecision: null,
      narrativePrecision: null,
      confidence: record.metrics.confidence,
      risk: record.metrics.risk,
    };
  }

  const verdictAccurate = typeof real.verdictAccurate === 'boolean'
    ? real.verdictAccurate
    : record.comparison.expectedWinner === real.winner;

  const indexPrecision = typeof real.s24IndexReal === 'number'
    ? toPrecisionFromDelta(record.comparison.expectedIndex - real.s24IndexReal)
    : null;

  return {
    evaluationId: record.id,
    createdAt: record.createdAt,
    matchSlug: record.match.slug,
    sport: record.match.sport,
    providerId: record.provider.id,
    hasRealOutcome: true,
    verdictAccurate,
    indexPrecision,
    insightPrecision: readPrecision(real.insightEvaluation),
    narrativePrecision: readPrecision(real.narrativeEvaluation),
    confidence: record.metrics.confidence,
    risk: record.metrics.risk,
  };
}

function coverage(samples: ValidationSample[], selector: (sample: ValidationSample) => boolean): number {
  if (samples.length === 0) return 0;
  const count = samples.filter(selector).length;
  return count / samples.length;
}

function metricBundle(values: number[], sampleCount: number): { accuracy: number; consistency: number; stability: number } {
  const acc = average(values);
  const consistency = clamp01(1 - stdDev(values));
  const stability = sampleCount > 0
    ? clamp01(acc - (stdDev(values) * 0.5))
    : 0;

  return {
    accuracy: round4(acc),
    consistency: round4(consistency),
    stability: round4(stability),
  };
}

function buildMotorScore(samples: ValidationSample[]): MotorScore {
  const compared = samples.filter((sample) => sample.hasRealOutcome);
  const verdictValues = compared.map((sample) => (sample.verdictAccurate ? 1 : 0));
  const indexValues = compared.map((sample) => sample.indexPrecision).filter((value): value is number => typeof value === 'number');

  const bundleVerdict = metricBundle(verdictValues, compared.length);
  const bundleIndex = metricBundle(indexValues, compared.length);

  const accuracy = round4((bundleVerdict.accuracy * 0.6) + (bundleIndex.accuracy * 0.4));
  const consistency = round4((bundleVerdict.consistency * 0.5) + (bundleIndex.consistency * 0.5));
  const stability = round4((bundleVerdict.stability * 0.5) + (bundleIndex.stability * 0.5));
  const cov = round4(coverage(samples, (sample) => sample.hasRealOutcome));

  return {
    accuracy,
    consistency,
    coverage: cov,
    stability,
    global: round4((accuracy * 0.45) + (consistency * 0.2) + (cov * 0.2) + (stability * 0.15)),
  };
}

function buildNarrativeScore(samples: ValidationSample[]): NarrativeScore {
  const values = samples.map((sample) => sample.narrativePrecision).filter((value): value is number => typeof value === 'number');
  const bundle = metricBundle(values, values.length);
  const cov = round4(coverage(samples, (sample) => typeof sample.narrativePrecision === 'number'));

  return {
    accuracy: bundle.accuracy,
    consistency: bundle.consistency,
    coverage: cov,
    stability: bundle.stability,
    global: round4((bundle.accuracy * 0.45) + (bundle.consistency * 0.2) + (cov * 0.2) + (bundle.stability * 0.15)),
  };
}

function buildInsightScore(samples: ValidationSample[]): InsightScore {
  const values = samples.map((sample) => sample.insightPrecision).filter((value): value is number => typeof value === 'number');
  const bundle = metricBundle(values, values.length);
  const cov = round4(coverage(samples, (sample) => typeof sample.insightPrecision === 'number'));

  return {
    accuracy: bundle.accuracy,
    consistency: bundle.consistency,
    coverage: cov,
    stability: bundle.stability,
    global: round4((bundle.accuracy * 0.45) + (bundle.consistency * 0.2) + (cov * 0.2) + (bundle.stability * 0.15)),
  };
}

function groupBy<T>(items: T[], keyFn: (item: T) => string): Record<string, T[]> {
  return items.reduce<Record<string, T[]>>((acc, item) => {
    const key = keyFn(item);
    acc[key] = acc[key] ? [...acc[key], item] : [item];
    return acc;
  }, {});
}

export function buildValidationReport(options: BuildValidationReportOptions): ValidationReport {
  const generatedAt = options.generatedAt ?? new Date().toISOString();
  const samples = options.records.map((record) => buildSample(record));
  const comparedEvaluations = samples.filter((sample) => sample.hasRealOutcome).length;

  return {
    generatedAt,
    totalEvaluations: options.records.length,
    comparedEvaluations,
    motorScore: buildMotorScore(samples),
    narrativeScore: buildNarrativeScore(samples),
    insightScore: buildInsightScore(samples),
    samples,
  };
}

export function buildValidationDashboard(report: ValidationReport): ValidationDashboard {
  const bySportMap = groupBy(report.samples, (sample) => sample.sport);
  const byProviderMap = groupBy(report.samples, (sample) => sample.providerId);
  const timelineMap = groupBy(
    report.samples,
    (sample) => sample.createdAt.slice(0, 10),
  );

  const bySport = Object.entries(bySportMap).map(([sport, samples]) => {
    const compared = samples.filter((sample) => sample.hasRealOutcome);
    return {
      sport,
      samples: samples.length,
      motorAccuracy: round4(average(compared.map((sample) => (sample.verdictAccurate ? 1 : 0)))),
      narrativeAccuracy: round4(average(compared.map((sample) => sample.narrativePrecision ?? 0))),
      insightAccuracy: round4(average(compared.map((sample) => sample.insightPrecision ?? 0))),
    };
  });

  const byProvider = Object.entries(byProviderMap).map(([providerId, samples]) => {
    const compared = samples.filter((sample) => sample.hasRealOutcome);
    return {
      providerId,
      samples: samples.length,
      verdictAccuracy: round4(average(compared.map((sample) => (sample.verdictAccurate ? 1 : 0)))),
      indexPrecision: round4(average(compared.map((sample) => sample.indexPrecision ?? 0))),
    };
  });

  const timeline = Object.entries(timelineMap).map(([date, samples]) => {
    const compared = samples.filter((sample) => sample.hasRealOutcome);
    return {
      date,
      samples: samples.length,
      verdictAccuracy: round4(average(compared.map((sample) => (sample.verdictAccurate ? 1 : 0)))),
    };
  });

  return {
    report,
    bySport,
    byProvider,
    timeline,
  };
}
