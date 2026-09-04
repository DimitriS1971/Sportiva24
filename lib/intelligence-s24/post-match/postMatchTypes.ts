import type { S24EvaluationRecord } from '@/lib/intelligence-s24/history/learningTypes';
import type { ValidationSample } from '@/lib/intelligence-s24/validation/validationTypes';

export interface PostMatchSection {
  key:
    | 'que-ocurrio'
    | 'aciertos-del-motor'
    | 'factores-que-cambiaron'
    | 'rendimiento-real'
    | 'comparacion-previa'
    | 'explicacion-de-diferencias';
  title: string;
  content: string;
}

export interface PostMatchReport {
  type: 'POST_PARTIDO';
  generatedAt: string;
  evaluationId: string;
  status: 'ready' | 'pending-real-outcome';
  preMatchSnapshot: {
    createdAt: string;
    matchSlug: string;
    competition: string;
    homeTeam: string;
    awayTeam: string;
    expectedWinner: string;
    expectedIndex: number;
    expectedConfidence: string;
    expectedRisk: string;
    insight: string;
    verdict: string;
    narrativeTitle: string;
  };
  realOutcome: {
    recordedAt: string | null;
    winner: string | null;
    scoreLabel: string | null;
    summary: string | null;
  };
  sections: PostMatchSection[];
  metrics: {
    verdictAccuracy: number | null;
    indexPrecision: number | null;
    insightPrecision: number | null;
    narrativePrecision: number | null;
  };
}

export interface BuildPostMatchReportOptions {
  record: S24EvaluationRecord;
  validationSample?: ValidationSample;
  generatedAt?: string;
}
