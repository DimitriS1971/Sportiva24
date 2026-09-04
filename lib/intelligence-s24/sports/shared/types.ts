import type { S24Weights } from '@/lib/intelligence-s24/types';

export interface SportIndicatorConfiguration {
  confidence: {
    volatilityWeight: number;
    fallbackPenalty: number;
    sampleBonusMultiplier: number;
    sampleBonusCap: number;
    baseDataCoverage: number;
  };
  risk: {
    volatilityWeight: number;
    fallbackWeight: number;
    confidenceWeight: number;
    fallbackImpact: number;
  };
  trendFactorKeys: string[];
}

export interface SportNarrativeConfiguration {
  locale: 'es' | 'en';
  vocabulary: string[];
  templates: string[];
  expressions: string[];
  terminology: Record<string, string>;
}

export interface SportInterpretationConfiguration {
  factorAdvantageLabels: Record<string, string>;
  factorDisplayOrder: string[];
  factorDetails: Record<string, string>;
}

export interface SportValidationConfiguration {
  requiredCoverage: number;
  maxFallbackTolerance: number;
}

export interface SportResolutionMatchers {
  slugs: string[];
  providers: string[];
  competitions: string[];
}

export interface SportProfile {
  id: string;
  slug: string;
  name: string;
  category: string;
  supportedCompetitionTypes: string[];
  availableFactors: string[];
  factorWeights: S24Weights;
  indicatorConfiguration: SportIndicatorConfiguration;
  narrativeConfiguration: SportNarrativeConfiguration;
  interpretationConfiguration: SportInterpretationConfiguration;
  validationConfiguration: SportValidationConfiguration;
  version: string;
  methodologyVersion: string;
  resolutionMatchers: SportResolutionMatchers;
}

export interface SportResolverInput {
  sportId?: string;
  slug?: string;
  providerId?: string;
  competition?: string;
}
