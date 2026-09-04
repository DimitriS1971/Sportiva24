import { S24_DEFAULT_CONFIG, validateS24Weights } from '@/lib/intelligence-s24/config';
import {
  classifyConfidence,
  classifyRisk,
  classifyS24Index,
  classifyTrend,
} from '@/lib/intelligence-s24/metodologiaOficial';
import type { MatchIntelligenceProfile } from '@/lib/domain/intelligenceProfile';
import {
  S24_FACTOR_MODULE_MAP,
  type S24FactorModule,
} from '@/lib/intelligence-s24/factors';
import { clampScore } from '@/lib/intelligence-s24/factors/base';
import { sportResolver } from '@/lib/intelligence-s24/sports';
import type { SportProfile } from '@/lib/intelligence-s24/sports';
import type {
  S24FactorBreakdown,
  S24FactorEvaluation,
  S24InputContext,
  S24MotorConfig,
  S24MotorOutput,
  S24Trend,
} from '@/lib/intelligence-s24/types';

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export interface S24CalculationOptions {
  profile?: SportProfile;
  providerId?: string;
  competition?: string;
  slug?: string;
}

export class MotorDeInteligenciaS24 {
  private readonly config: S24MotorConfig;

  constructor(config: S24MotorConfig = S24_DEFAULT_CONFIG) {
    validateS24Weights(config.weights);
    this.config = config;
  }

  private resolveProfile(input: S24InputContext, options?: S24CalculationOptions): SportProfile {
    if (options?.profile) {
      return options.profile;
    }

    return sportResolver.resolve({
      sportId: input.sport,
      slug: options?.slug,
      providerId: options?.providerId,
      competition: options?.competition,
    });
  }

  private resolveFactors(profile: SportProfile): S24FactorModule[] {
    const modules = profile.availableFactors
      .map((factorKey) => S24_FACTOR_MODULE_MAP[factorKey])
      .filter((factor): factor is S24FactorModule => Boolean(factor));

    if (modules.length === 0) {
      throw new Error(`Sport profile ${profile.id} has no registered factors in factor engine`);
    }

    return modules;
  }

  private evaluateFactors(input: S24InputContext, profile: SportProfile): S24FactorEvaluation[] {
    const factors = this.resolveFactors(profile);
    return factors.map((factor) => factor.evaluate(input));
  }

  private buildBreakdown(evaluations: S24FactorEvaluation[], profile: SportProfile): S24FactorBreakdown[] {
    return evaluations.map((evaluation) => {
      const weight = profile.factorWeights[evaluation.key] ?? this.config.weights[evaluation.key] ?? 0;
      const obtainedPoints = round2((evaluation.rawScore / 100) * weight);

      return {
        key: evaluation.key,
        label: evaluation.label,
        rawScore: evaluation.rawScore,
        weight,
        obtainedPoints,
        maxPoints: weight,
        display: `${obtainedPoints} / ${weight}`,
      };
    });
  }

  private computeConfidence(input: S24InputContext, fallbackFactorCount: number, profile: SportProfile): number {
    const confConfig = profile.indicatorConfiguration.confidence;
    const dataCoverage = clampScore(input.signals?.dataCoverage ?? confConfig.baseDataCoverage);
    const volatility = clampScore(input.signals?.volatility ?? 40);
    const sampleSize = input.metadata?.sampleSize ?? 5;

    const fallbackPenalty = fallbackFactorCount * confConfig.fallbackPenalty;
    const volatilityPenalty = volatility * confConfig.volatilityWeight;
    const sampleBonus = Math.min(confConfig.sampleBonusCap, Math.max(0, sampleSize * confConfig.sampleBonusMultiplier));

    return round2(clampScore(dataCoverage - fallbackPenalty - volatilityPenalty + sampleBonus));
  }

  private computeRisk(input: S24InputContext, confidenceScore: number, fallbackFactorCount: number, profile: SportProfile): number {
    const riskConfig = profile.indicatorConfiguration.risk;
    const volatility = clampScore(input.signals?.volatility ?? 40);
    const fallbackImpact = fallbackFactorCount * riskConfig.fallbackImpact;
    const confidenceImpact = 100 - confidenceScore;

    return round2(clampScore(
      (volatility * riskConfig.volatilityWeight)
      + (fallbackImpact * riskConfig.fallbackWeight)
      + (confidenceImpact * riskConfig.confidenceWeight),
    ));
  }

  private computeTrend(input: S24InputContext, breakdown: S24FactorBreakdown[], profile: SportProfile): S24Trend {
    const directTrend = input.signals?.trendSignal;
    if (typeof directTrend === 'number') {
      return classifyTrend(clampScore(directTrend));
    }

    const keys = profile.indicatorConfiguration.trendFactorKeys;
    const selectedScores = keys
      .map((key) => breakdown.find((item) => item.key === key)?.rawScore)
      .filter((score): score is number => typeof score === 'number');

    const average = selectedScores.length > 0
      ? selectedScores.reduce((acc, score) => acc + score, 0) / selectedScores.length
      : 50;

    const syntheticSignal = round2(average - 50);
    return classifyTrend(syntheticSignal);
  }

  calculate(input: S24InputContext, options?: S24CalculationOptions): S24MotorOutput {
    const profile = this.resolveProfile(input, options);
    validateS24Weights(profile.factorWeights);

    const evaluations = this.evaluateFactors(input, profile);
    const breakdown = this.buildBreakdown(evaluations, profile);

    const s24Index = round2(breakdown.reduce((acc, item) => acc + item.obtainedPoints, 0));
    const fallbackFactorCount = evaluations.filter((evaluation) => evaluation.usedFallback).length;

    const confidenceScore = this.computeConfidence(input, fallbackFactorCount, profile);
    const riskScore = this.computeRisk(input, confidenceScore, fallbackFactorCount, profile);

    return {
      s24Index,
      confidence: classifyConfidence(confidenceScore),
      trend: this.computeTrend(input, breakdown, profile),
      risk: classifyRisk(riskScore),
      factorBreakdown: breakdown,
      diagnostics: {
        fallbackFactorCount,
        confidenceScore,
        riskScore,
      },
    };
  }

  calculateMatchProfile(input: S24InputContext, options?: S24CalculationOptions): MatchIntelligenceProfile {
    const output = this.calculate(input, options);

    return {
      identity: {
        id: `${input.sport}-${input.teamId}`,
        slug: input.teamName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        type: 'match',
        name: input.teamName,
        sport: input.sport,
        homeTeam: input.teamName,
        awayTeam: 'Rival',
      },
      competitiveState: {
        index: { value: output.s24Index, scaleMax: 100 },
        confidence: { level: output.confidence, score: output.diagnostics.confidenceScore },
        risk: { level: output.risk, score: output.diagnostics.riskScore },
        trend: { direction: output.trend },
        ratingLabel: classifyS24Index(output.s24Index).label,
      },
      indicators: [
        { key: 's24-index', label: 'S24 Index', value: output.s24Index },
        { key: 'confidence', label: 'Confianza', value: output.confidence },
        { key: 'risk', label: 'Riesgo', value: output.risk },
        { key: 'trend', label: 'Tendencia', value: output.trend },
      ],
      factors: output.factorBreakdown.map((factor) => ({
        key: factor.key,
        label: factor.label,
        contribution: factor.obtainedPoints,
        maxContribution: factor.maxPoints,
        detail: factor.display,
      })),
      narrative: {
        title: 'Analisis S24',
        executiveSummary: `Indice ${output.s24Index} con confianza ${output.confidence} y riesgo ${output.risk}.`,
      },
      insights: [],
      alerts: output.risk === 'Alto'
        ? [{ level: 'alta', title: 'Riesgo alto', description: 'Escenario con alta incertidumbre.', signal: 'risk=alto' }]
        : [],
      history: [],
      evidence: output.factorBreakdown.map((factor) => ({
        source: 'factor-engine',
        key: factor.key,
        value: factor.display,
      })),
      validation: {
        motorGlobal: 0,
        narrativeGlobal: 0,
        insightGlobal: 0,
      },
      analyticalPassport: {
        engineVersion: 'Motor S24 v1',
        methodologyVersion: options?.profile?.methodologyVersion ?? 'unknown',
        sportProfileVersion: options?.profile?.version ?? 'unknown',
        sportMethodologyVersion: options?.profile?.methodologyVersion ?? 'unknown',
        providerId: options?.providerId ?? 'none',
        confidenceLevel: output.confidence,
        reportStatus: 'Operativo completo',
      },
      metadata: {
        generatedAt: new Date().toISOString(),
        sourceModule: 'motor-s24',
        tags: ['match', 'motor'],
      },
      version: {
        contract: { value: 'intelligence-profile-v1' },
        profile: { value: 'match-intelligence-profile-v1' },
      },
    };
  }
}

export const motorDeInteligenciaS24 = new MotorDeInteligenciaS24();
