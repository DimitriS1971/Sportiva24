import type { InformeS24Pasaporte } from '@/lib/intelligence-s24/informeS24V1';

export interface ClubIdentity {
  slug: string;
  name: string;
  crestUrl: string;
}

export interface ClubInstitutionalProfile {
  name: string;
  crestUrl: string;
  country: string;
  competition: string;
  stadium: string;
  coach: string;
  season: string;
}

export interface ClubCompetitiveState {
  s24Index: number;
  rating: string;
  trend: string;
  risk: string;
  confidence: string;
}

export interface ClubEvolutionMatch {
  matchSlug: string;
  createdAt: string;
  competition: string;
  opponent: string;
  wasHome: boolean;
  s24Index: number;
  trend: string;
  risk: string;
  confidence: string;
  competitiveEdge: string;
}

export interface ClubEvolutionPoint {
  createdAt: string;
  s24Index: number;
}

export interface ClubStrengths {
  attack: number;
  defense: number;
  homeAdvantage: number;
  consistency: number;
  efficiency: number;
}

export interface ClubWeakness {
  key: string;
  title: string;
  description: string;
  severity: 'alta' | 'media' | 'baja';
}

export interface ClubIntelligentNarrative {
  executiveSummary: string;
  clubStatus: string;
  competitivePerspective: string;
  risks: string;
  strengths: string;
}

export interface ClubInsightItem {
  title: string;
  summary: string;
  evidence: string[];
}

export interface ClubAlertItem {
  level: 'alta' | 'media' | 'baja';
  title: string;
  description: string;
  signal: string;
}

export interface ClubHistorySnapshot {
  appearances: number;
  winsByModel: number;
  lossesByModel: number;
  trendPositive: number;
  trendStable: number;
  trendNegative: number;
  averageIndex: number;
}

export interface ClubIntelligenceData {
  generatedAt: string;
  club: ClubInstitutionalProfile;
  competitiveState: ClubCompetitiveState;
  evolution: {
    recentMatches: ClubEvolutionMatch[];
    indexTimeline: ClubEvolutionPoint[];
  };
  strengths: ClubStrengths;
  weaknesses: ClubWeakness[];
  intelligentNarrative: ClubIntelligentNarrative;
  insights: ClubInsightItem[];
  alerts: ClubAlertItem[];
  history: ClubHistorySnapshot;
  passport: InformeS24Pasaporte;
  validation: {
    motorGlobal: number;
    narrativeGlobal: number;
    insightGlobal: number;
    sportAccuracy: number;
    providerAccuracy: number;
  };
}

export interface ClubIntelligenceHubData {
  generatedAt: string;
  clubs: ClubIdentity[];
  recommendedClubSlug: string | null;
}

export interface BuildClubIntelligenceOptions {
  clubSlug?: string;
}
