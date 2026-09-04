import type { InformeS24Pasaporte } from '@/lib/intelligence-s24/informeS24V1';

export interface LeagueIdentity {
  slug: string;
  competition: string;
  matches: number;
}

export interface LeagueTeamHighlight {
  teamName: string;
  avgIndex: number;
  trendBalance: number;
  consistencyScore: number;
  confidenceRate: number;
  riskRate: number;
}

export interface LeagueCompetitiveState {
  rankingS24: Array<{
    position: number;
    teamName: string;
    score: number;
    note: string;
  }>;
  competitiveLevel: string;
  competitiveBalance: number;
  volatility: number;
  intensity: number;
  avgOffense: number;
  avgDefense: number;
}

export interface LeagueTrendSnapshot {
  positives: number;
  stable: number;
  negatives: number;
}

export interface LeagueMethodologicalAlert {
  level: 'alta' | 'media' | 'baja';
  title: string;
  description: string;
  signal: string;
}

export interface LeagueSeasonComparison {
  currentWindow: {
    averageIndex: number;
    intensity: number;
    volatility: number;
    sampleSize: number;
  };
  previousWindow: {
    averageIndex: number;
    intensity: number;
    volatility: number;
    sampleSize: number;
  };
  delta: {
    averageIndex: number;
    intensity: number;
    volatility: number;
  };
  summary: string;
}

export interface LeagueNarrative {
  leagueState: string;
  evolution: string;
  insights: string;
}

export interface LeagueInsight {
  title: string;
  summary: string;
  evidence: string[];
}

export interface LeagueIntelligenceData {
  generatedAt: string;
  competition: string;
  competitiveState: LeagueCompetitiveState;
  trends: LeagueTrendSnapshot;
  highlightedTeams: {
    destacados: LeagueTeamHighlight[];
    crecimiento: LeagueTeamHighlight[];
    caida: LeagueTeamHighlight[];
  };
  narrative: LeagueNarrative;
  insights: LeagueInsight[];
  alerts: LeagueMethodologicalAlert[];
  seasonComparison: LeagueSeasonComparison;
  passport: InformeS24Pasaporte;
}

export interface LeagueIntelligenceHubData {
  generatedAt: string;
  leagues: LeagueIdentity[];
  recommendedLeagueSlug: string | null;
}

export interface BuildLeagueIntelligenceOptions {
  leagueSlug?: string;
}
