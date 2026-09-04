import type { S24EvaluationRecord } from '@/lib/intelligence-s24/history/learningTypes';
import type { IntelligenceProfile } from '@/lib/domain/intelligenceProfile';

export interface ValidationSample {
  evaluationId: string;
  createdAt: string;
  matchSlug: string;
  sport: string;
  providerId: string;
  hasRealOutcome: boolean;
  verdictAccurate: boolean;
  indexPrecision: number | null;
  insightPrecision: number | null;
  narrativePrecision: number | null;
  confidence: string;
  risk: string;
}

export interface MotorScore {
  accuracy: number;
  consistency: number;
  coverage: number;
  stability: number;
  global: number;
}

export interface NarrativeScore {
  accuracy: number;
  consistency: number;
  coverage: number;
  stability: number;
  global: number;
}

export interface InsightScore {
  accuracy: number;
  consistency: number;
  coverage: number;
  stability: number;
  global: number;
}

export interface ValidationReport {
  generatedAt: string;
  totalEvaluations: number;
  comparedEvaluations: number;
  motorScore: MotorScore;
  narrativeScore: NarrativeScore;
  insightScore: InsightScore;
  samples: ValidationSample[];
}

export interface ValidationDashboard {
  report: ValidationReport;
  bySport: Array<{
    sport: string;
    samples: number;
    motorAccuracy: number;
    narrativeAccuracy: number;
    insightAccuracy: number;
  }>;
  byProvider: Array<{
    providerId: string;
    samples: number;
    verdictAccuracy: number;
    indexPrecision: number;
  }>;
  timeline: Array<{
    date: string;
    samples: number;
    verdictAccuracy: number;
  }>;
}

export interface BuildValidationReportOptions {
  records: S24EvaluationRecord[];
  generatedAt?: string;
}

export interface IntelligenceProfileValidationSample {
  profileId: string;
  profileType: string;
  generatedAt: string;
  hasNarrative: boolean;
  hasInsights: boolean;
  hasEvidence: boolean;
  hasHistory: boolean;
  confidenceLevel: string;
  riskLevel: string;
}

export interface IntelligenceProfileValidationReport {
  generatedAt: string;
  totalProfiles: number;
  coverage: {
    narrative: number;
    insights: number;
    evidence: number;
    history: number;
  };
  byType: Array<{
    type: string;
    profiles: number;
    avgIndex: number;
    highRiskRate: number;
  }>;
  samples: IntelligenceProfileValidationSample[];
}

export interface BuildProfileValidationReportOptions {
  profiles: IntelligenceProfile[];
  generatedAt?: string;
}
