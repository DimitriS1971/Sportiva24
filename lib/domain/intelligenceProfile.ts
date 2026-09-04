import type {
  Confidence,
  EntityRef,
  Percentage,
  Rating,
  Risk,
  Trend,
  Version,
} from '@/lib/domain/valueObjects';

export type IntelligenceSubjectType = 'match' | 'club' | 'league' | 'player' | 'season';

export interface IntelligenceIdentityBlock {
  id: string;
  slug: string;
  type: IntelligenceSubjectType;
  name: string;
  sport: string;
  competition?: string;
  season?: string;
}

export interface IntelligenceCompetitiveStateBlock {
  index: Rating;
  confidence: Confidence;
  risk: Risk;
  trend: Trend;
  ratingLabel: string;
}

export interface IntelligenceIndicatorItem {
  key: string;
  label: string;
  value: number | string;
  unit?: string;
}

export interface IntelligenceFactorItem {
  key: string;
  label: string;
  contribution: number;
  maxContribution: number;
  detail: string;
}

export interface IntelligenceNarrativeBlock {
  title: string;
  executiveSummary: string;
  fullText?: string;
}

export interface IntelligenceInsightItem {
  title: string;
  summary: string;
  source: 'motor-s24' | 'narrative-engine' | 'validation-engine' | 'history-engine';
}

export interface IntelligenceAlertItem {
  level: 'alta' | 'media' | 'baja';
  title: string;
  description: string;
  signal: string;
}

export interface IntelligenceHistoryPoint {
  createdAt: string;
  index: number;
  trend?: string;
}

export interface IntelligenceEvidenceItem {
  source: string;
  key: string;
  value: string;
  reliability?: Percentage;
  refs?: EntityRef[];
}

export interface IntelligenceValidationBlock {
  motorGlobal: number;
  narrativeGlobal: number;
  insightGlobal: number;
  comparedSamples?: number;
}

export interface IntelligenceAnalyticalPassportBlock {
  engineVersion: string;
  methodologyVersion: string;
  sportProfileVersion: string;
  sportMethodologyVersion: string;
  providerId: string;
  confidenceLevel: string;
  reportStatus: string;
}

export interface IntelligenceMetadataBlock {
  generatedAt: string;
  sourceModule: string;
  tags?: string[];
}

export interface IntelligenceVersionBlock {
  contract: Version;
  profile: Version;
}

export interface IntelligenceProfile {
  identity: IntelligenceIdentityBlock;
  competitiveState: IntelligenceCompetitiveStateBlock;
  indicators: IntelligenceIndicatorItem[];
  factors: IntelligenceFactorItem[];
  narrative: IntelligenceNarrativeBlock;
  insights: IntelligenceInsightItem[];
  alerts: IntelligenceAlertItem[];
  history: IntelligenceHistoryPoint[];
  evidence: IntelligenceEvidenceItem[];
  validation: IntelligenceValidationBlock;
  analyticalPassport: IntelligenceAnalyticalPassportBlock;
  metadata: IntelligenceMetadataBlock;
  version: IntelligenceVersionBlock;
}

export interface MatchIntelligenceProfile extends IntelligenceProfile {
  identity: IntelligenceIdentityBlock & {
    type: 'match';
    homeTeam: string;
    awayTeam: string;
    status?: string;
    kickoff?: string;
  };
}

export interface ClubIntelligenceProfile extends IntelligenceProfile {
  identity: IntelligenceIdentityBlock & {
    type: 'club';
    country?: string;
  };
  club: {
    stadium?: string;
    coach?: string;
    squadSize?: number;
  };
}

export interface LeagueIntelligenceProfile extends IntelligenceProfile {
  identity: IntelligenceIdentityBlock & {
    type: 'league';
  };
  league: {
    clubs?: number;
    rankingSize?: number;
  };
}

export interface PlayerIntelligenceProfile extends IntelligenceProfile {
  identity: IntelligenceIdentityBlock & {
    type: 'player';
    club?: string;
  };
  player: {
    position?: string;
    age?: number;
    availability?: number;
  };
}

export interface SeasonIntelligenceProfile extends IntelligenceProfile {
  identity: IntelligenceIdentityBlock & {
    type: 'season';
  };
  seasonData: {
    stages?: number;
    matches?: number;
  };
}
