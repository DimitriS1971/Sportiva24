import type { InformeS24Pasaporte } from '@/lib/intelligence-s24/informeS24V1';

export interface SeasonIdentity {
  slug: string;
  competition: string;
  seasonLabel: string;
  matches: number;
}

export interface SeasonEvolutionPoint {
  createdAt: string;
  s24Index: number;
  trend: string;
  risk: string;
}

export interface SeasonCriticalMoment {
  createdAt: string;
  matchLabel: string;
  signal: string;
  impact: string;
}

export interface SeasonStreak {
  type: 'positive' | 'negative';
  length: number;
  from: string;
  to: string;
  summary: string;
}

export interface SeasonMethodologyChange {
  key: string;
  description: string;
  previous: string;
  current: string;
}

export interface SeasonInsight {
  title: string;
  summary: string;
  evidence: string[];
}

export interface SeasonNarrative {
  executiveSummary: string;
  competitiveEvolution: string;
  trendChanges: string;
  methodologicalChanges: string;
}

export interface SeasonComparison {
  current: {
    avgIndex: number;
    volatility: number;
    highRiskRate: number;
    trendPositiveRate: number;
    sampleSize: number;
  };
  previous: {
    avgIndex: number;
    volatility: number;
    highRiskRate: number;
    trendPositiveRate: number;
    sampleSize: number;
  };
  delta: {
    avgIndex: number;
    volatility: number;
    highRiskRate: number;
    trendPositiveRate: number;
  };
  summary: string;
}

export interface SeasonIntelligenceData {
  generatedAt: string;
  competition: string;
  seasonLabel: string;
  evolution: {
    s24IndexTimeline: SeasonEvolutionPoint[];
    competitiveEvolution: string;
    trendChanges: number;
  };
  criticalMoments: SeasonCriticalMoment[];
  bestStreak: SeasonStreak | null;
  worstStreak: SeasonStreak | null;
  methodologicalChanges: SeasonMethodologyChange[];
  narrative: SeasonNarrative;
  insights: SeasonInsight[];
  comparisonWithPreviousSeason: SeasonComparison;
  passport: InformeS24Pasaporte;
}

export interface SeasonIntelligenceHubData {
  generatedAt: string;
  seasons: SeasonIdentity[];
  recommendedSeasonSlug: string | null;
}

export interface BuildSeasonIntelligenceOptions {
  seasonSlug?: string;
}
