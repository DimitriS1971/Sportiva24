import type {
  Analysis,
  Match,
  Narrative,
  Prediction,
  SportProfile,
  Validation,
} from '@/lib/domain/entities';
import type { EntityId } from '@/lib/domain/valueObjects';

export interface DomainService {
  readonly name: string;
}

export interface PredictionDomainService extends DomainService {
  predict(match: Match, profile: SportProfile): Prediction;
}

export interface AnalysisDomainService extends DomainService {
  buildAnalysis(match: Match, prediction: Prediction, profile: SportProfile): Analysis;
}

export interface NarrativeDomainService extends DomainService {
  narrate(analysis: Analysis, locale?: 'es' | 'en'): Narrative;
}

export interface ValidationDomainService extends DomainService {
  validate(prediction: Prediction, actualOutcome: Partial<Match>): Validation;
}

export interface HistoryDomainService extends DomainService {
  recordChange(entityType: string, entityId: EntityId, changeType: string, snapshot?: Record<string, unknown>): void;
}
