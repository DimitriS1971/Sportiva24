import type { InformeS24Pasaporte } from '@/lib/intelligence-s24/informeS24V1';

export interface PlayerIdentity {
  slug: string;
  name: string;
  club: string;
  role: string;
}

export interface PlayerIndicators {
  playerIndex: number;
  trend: string;
  consistency: number;
  influence: number;
  risk: number;
  availability: number;
  form: number;
}

export interface PlayerNarrative {
  currentStatus: string;
  evolution: string;
  strengths: string;
  weaknesses: string;
}

export interface PlayerComparisonItem {
  slug: string;
  name: string;
  club: string;
  playerIndex: number;
  similarityScore: number;
}

export interface PlayerHistoryPoint {
  createdAt: string;
  playerIndex: number;
  trend: string;
}

export interface PlayerAlert {
  level: 'alta' | 'media' | 'baja';
  title: string;
  description: string;
  signal: string;
}

export interface PlayerIntelligenceData {
  generatedAt: string;
  profile: {
    slug: string;
    name: string;
    club: string;
    role: string;
    country: string;
    competition: string;
    status: string;
  };
  indicators: PlayerIndicators;
  narrative: PlayerNarrative;
  comparison: PlayerComparisonItem[];
  history: {
    timeline: PlayerHistoryPoint[];
    appearances: number;
    avgIndex: number;
  };
  alerts: PlayerAlert[];
  passport: InformeS24Pasaporte;
}

export interface PlayerIntelligenceHubData {
  generatedAt: string;
  players: PlayerIdentity[];
  recommendedPlayerSlug: string | null;
}

export interface BuildPlayerIntelligenceOptions {
  playerSlug?: string;
}
