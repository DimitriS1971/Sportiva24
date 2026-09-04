import type { S24Weights } from '@/lib/intelligence-s24/types';
import type { IntelligenceProfile } from '@/lib/domain/intelligenceProfile';

export interface S24HistoricalMatchRef {
  sport: string;
  slug: string;
  competition: string;
  homeTeam: string;
  awayTeam: string;
  time: string;
  status: string;
}

export interface S24HistoricalFactorEntry {
  key: string;
  title: string;
  contributionPoints: number;
  maxPoints: number;
  detail: string;
}

export interface S24HistoricalNarrativeSnapshot {
  level: number;
  title: string;
  executiveSummary: string;
  factorsSummary: string;
  sectionCount: number;
}

export interface S24HistoricalModelContext {
  motorVersion: string;
  methodologicalVersion: string;
  weights: S24Weights;
}

export interface S24OutcomeComparisonPlaceholder {
  status: 'pending' | 'available';
  expectedWinner: string;
  expectedIndex: number;
  expectedConfidence: string;
  expectedRisk: string;
  realOutcome?: {
    recordedAt: string;
    winner: string;
    scoreLabel?: string;
    notes?: string;
    s24IndexReal?: number;
    verdictAccurate?: boolean;
    changedFactors?: Array<{
      key: string;
      title: string;
      direction: 'up' | 'down' | 'neutral';
      note?: string;
    }>;
    realPerformance?: {
      summary?: string;
      homeScore?: number;
      awayScore?: number;
      winner?: string;
    };
    insightEvaluation?: {
      accurate?: boolean;
      score?: number;
    };
    narrativeEvaluation?: {
      accurate?: boolean;
      score?: number;
    };
  };
}

export interface S24EvaluationRecord {
  id: string;
  createdAt: string;
  match: S24HistoricalMatchRef;
  model: S24HistoricalModelContext;
  provider: {
    id: string;
    usedFailover: boolean;
  };
  factorsUsed: S24HistoricalFactorEntry[];
  narrativeUsed: S24HistoricalNarrativeSnapshot;
  insightGenerated: {
    text: string;
    advantages: string[];
    risks: string[];
  };
  verdict: {
    text: string;
    competitiveEdge: string;
  };
  metrics: {
    s24Index: number;
    confidence: string;
    risk: string;
    trend: string;
  };
  intelligenceProfile?: IntelligenceProfile;
  comparison: S24OutcomeComparisonPlaceholder;
}

export interface S24ProfileRecord {
  id: string;
  createdAt: string;
  profile: IntelligenceProfile;
  sourceEvaluationId?: string;
}

export interface BuildS24EvaluationRecordInput {
  createdAt: string;
  match: S24HistoricalMatchRef;
  model: S24HistoricalModelContext;
  provider: {
    id: string;
    usedFailover: boolean;
  };
  factorsUsed: S24HistoricalFactorEntry[];
  narrativeUsed: S24HistoricalNarrativeSnapshot;
  insightGenerated: {
    text: string;
    advantages: string[];
    risks: string[];
  };
  verdict: {
    text: string;
    competitiveEdge: string;
  };
  metrics: {
    s24Index: number;
    confidence: string;
    risk: string;
    trend: string;
  };
  intelligenceProfile?: IntelligenceProfile;
}
