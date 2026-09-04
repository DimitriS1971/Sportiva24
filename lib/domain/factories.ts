import type {
  Analysis,
  EditorialDocument,
  Match,
  Narrative,
  Prediction,
  SportProfile,
  Validation,
} from '@/lib/domain/entities';

export interface PredictionFactory {
  create(input: {
    match: Match;
    profile: SportProfile;
  }): Prediction;
}

export interface AnalysisFactory {
  create(input: {
    match?: Match;
    prediction: Prediction;
    profile: SportProfile;
    title: string;
    summary: string;
  }): Analysis;
}

export interface NarrativeFactory {
  create(input: {
    analysis: Analysis;
    locale: 'es' | 'en';
    title: string;
    executiveSummary: string;
    fullText: string;
  }): Narrative;
}

export interface ValidationFactory {
  create(input: {
    prediction: Prediction;
    analysis?: Analysis;
    verdictAccurate?: boolean;
    notes?: string;
  }): Validation;
}

export interface EditorialDocumentFactory {
  create(input: {
    title: string;
    locale: 'es' | 'en';
    content: string;
    sportId?: string;
    competitionId?: string;
    matchId?: string;
  }): EditorialDocument;
}
