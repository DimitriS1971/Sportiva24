export type S24NarrativeLevel = 1 | 2 | 3 | 4;

export type S24NarrativeSectionId =
  | 'estado-competitivo'
  | 'fortalezas'
  | 'riesgos'
  | 'contexto'
  | 'factores-explicativos'
  | 'conclusion-metodologica';

export interface S24NarrativeFactor {
  key: string;
  title: string;
  contributionPoints: number;
  maxPoints: number;
  detail: string;
}

export interface S24NarrativeTeamIndicator {
  side: 'local' | 'visitante';
  teamName: string;
  s24Index: number;
  s24Rating: string;
  s24Confianza: string;
  s24Riesgo: string;
  s24Tendencia: string;
}

export interface S24NarrativeInput {
  sport: string;
  match: {
    homeTeam: string;
    awayTeam: string;
    competition: string;
    status: string;
    time: string;
  };
  summary: {
    s24Index: number;
    s24Rating: string;
    s24Confianza: string;
    s24Riesgo: string;
    s24Tendencia: string;
  };
  teams: S24NarrativeTeamIndicator[];
  factores: S24NarrativeFactor[];
  insight: {
    texto: string;
    ventajas: string[];
    riesgos: string[];
  };
  veredicto: {
    texto: string;
    ventajaCompetitiva: string;
  };
}

export interface S24NarrativeParagraph {
  id: string;
  text: string;
  evidenceRefs: string[];
}

export interface S24NarrativeSection {
  id: S24NarrativeSectionId;
  title: string;
  paragraphs: S24NarrativeParagraph[];
}

export interface S24NarrativeEvidenceLink {
  paragraphId: string;
  evidenceRefs: string[];
}

export interface S24NarrativeOutput {
  level: S24NarrativeLevel;
  mode: 'rules-template';
  aiReady: {
    provider: 'none';
    replaceable: true;
    notes: string;
  };
  editorialTitle: string;
  executiveSummary: string;
  fullAnalysis: string;
  factorsSummary: string;
  sections: S24NarrativeSection[];
  evidenceLinks: S24NarrativeEvidenceLink[];
  insightIntegratedText: string;
  verdictIntegratedText: string;
  stats: {
    executiveWords: number;
    fullAnalysisWords: number;
  };
}

export interface S24NarrativeGenerationOptions {
  level?: S24NarrativeLevel;
  locale?: 'es' | 'en';
}
