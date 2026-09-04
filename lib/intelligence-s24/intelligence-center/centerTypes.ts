export type CenterViewKey =
  | 'panorama'
  | 'clubes'
  | 'competiciones'
  | 'tendencias'
  | 'rankings'
  | 'alertas'
  | 'insights';

export interface CenterViewDefinition {
  key: CenterViewKey;
  label: string;
  description: string;
}

export interface TeamStrengthItem {
  teamName: string;
  avgIndex: number;
  confidenceRate: number;
  lowRiskRate: number;
  highRiskRate: number;
  trendBalance: number;
  consistencyScore: number;
  volatilityScore: number;
  appearances: number;
  offenseScore: number;
  defenseScore: number;
}

export interface CompetitionIntelligenceItem {
  competition: string;
  matches: number;
  clubs: number;
  avgIndex: number;
  confidenceRate: number;
  riskRate: number;
  trendBalance: number;
  competitiveLevel: string;
  evolution: string;
  alertCount: number;
}

export interface MethodologicalAlert {
  level: 'alta' | 'media' | 'baja';
  title: string;
  description: string;
  signal: string;
  scope: 'equipo' | 'competicion' | 'ecosistema';
}

export interface HighUncertaintyMatch {
  competition: string;
  homeTeam: string;
  awayTeam: string;
  s24Index: number;
  confidence: string;
  risk: string;
  trend: string;
}

export interface RankingEntry {
  name: string;
  score: number;
  note: string;
}

export interface GlobalInsightItem {
  title: string;
  summary: string;
  evidence: string[];
  source: 'motor-s24' | 'narrative-engine';
}

export interface IntelligenceCenterData {
  generatedAt: string;
  sourceCount: number;
  analyzedTeams: number;
  analyzedCompetitions: number;
  views: CenterViewDefinition[];
  panoramaGeneral: {
    resumenDia: string;
    partidosAnalizados: number;
    equiposMayorCrecimiento: TeamStrengthItem[];
    equiposMayorCaida: TeamStrengthItem[];
    partidosMayorIncertidumbre: HighUncertaintyMatch[];
    alertasMetodologicas: MethodologicalAlert[];
    validationSnapshot: {
      motorGlobal: number;
      narrativeGlobal: number;
      insightGlobal: number;
      comparedSamples: number;
    };
  };
  clubes: {
    rankingS24: TeamStrengthItem[];
    evolucion: {
      crecimiento: TeamStrengthItem[];
      caida: TeamStrengthItem[];
    };
    tendencias: {
      positivas: number;
      estables: number;
      negativas: number;
    };
    equiposSolidos: TeamStrengthItem[];
    equiposMayorRiesgo: TeamStrengthItem[];
    equiposMayorCrecimiento: TeamStrengthItem[];
  };
  competiciones: {
    rankingsPorLiga: CompetitionIntelligenceItem[];
    alertas: MethodologicalAlert[];
  };
  tendencias: {
    mejoresAtaques: TeamStrengthItem[];
    mejoresDefensas: TeamStrengthItem[];
    mayorConsistencia: TeamStrengthItem[];
    mayorVolatilidad: TeamStrengthItem[];
    mayorCrecimiento: TeamStrengthItem[];
    peorMomentoDeportivo: TeamStrengthItem[];
  };
  rankings: {
    topS24Index: RankingEntry[];
    topRating: RankingEntry[];
    mayorConfianza: RankingEntry[];
    mayorRiesgo: RankingEntry[];
    mejorTendencia: RankingEntry[];
    mayorConsistencia: RankingEntry[];
  };
  alertas: {
    items: MethodologicalAlert[];
  };
  insightsGlobales: {
    items: GlobalInsightItem[];
  };
}
