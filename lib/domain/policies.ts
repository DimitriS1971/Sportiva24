import type { Match, Prediction, SportProfile } from '@/lib/domain/entities';

export interface Policy<TContext = unknown> {
  readonly id: string;
  evaluate(context: TContext): boolean;
}

export type MatchEligibilityPolicy = Policy<Match>;

export type PredictionPublicationPolicy = Policy<{
  match: Match;
  prediction: Prediction;
  profile: SportProfile;
}>;

export type NarrativePublicationPolicy = Policy<{
  locale: 'es' | 'en';
  confidenceLevel: string;
}>;

export type EditorialCompliancePolicy = Policy<{
  content: string;
  locale: 'es' | 'en';
}>;
