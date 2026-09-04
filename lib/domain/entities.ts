import type {
  AuditStamp,
  Confidence,
  DateRange,
  EntityId,
  EntityRef,
  GeoLocation,
  Percentage,
  Probability,
  Rating,
  Risk,
  Score,
  Trend,
  Version,
} from '@/lib/domain/valueObjects';

export type SportCode = 'football' | 'basketball' | 'tennis' | 'formula1' | 'cycling' | 'baseball' | 'esports';

export interface DomainEntity {
  id: EntityId;
  audit?: AuditStamp;
}

export interface Sport extends DomainEntity {
  code: SportCode;
  slug: string;
  name: string;
  category?: string;
}

export interface Country extends DomainEntity {
  code: string;
  name: string;
  regionIds?: EntityId[];
}

export interface Region extends DomainEntity {
  code: string;
  name: string;
  countryId?: EntityId;
}

export interface Competition extends DomainEntity {
  sportId: EntityId;
  countryId?: EntityId;
  regionId?: EntityId;
  slug: string;
  name: string;
  shortName?: string;
  type?: string;
  logoUrl?: string;
}

export interface Season extends DomainEntity {
  competitionId: EntityId;
  name: string;
  year: number;
  range: DateRange;
  status: 'upcoming' | 'active' | 'completed';
}

export interface Stage extends DomainEntity {
  seasonId: EntityId;
  name: string;
  type: 'league' | 'group' | 'knockout' | 'playoff' | 'other';
  order: number;
}

export interface Round extends DomainEntity {
  seasonId: EntityId;
  stageId?: EntityId;
  name: string;
  order: number;
}

export interface Club extends DomainEntity {
  sportIds: EntityId[];
  countryId?: EntityId;
  regionId?: EntityId;
  slug: string;
  name: string;
  shortName?: string;
  badgeUrl?: string;
  venueId?: EntityId;
}

export interface NationalTeam extends DomainEntity {
  sportIds: EntityId[];
  countryId: EntityId;
  slug: string;
  name: string;
  shortName?: string;
  badgeUrl?: string;
}

export type TeamRef =
  | EntityRef<'club'>
  | EntityRef<'national-team'>;

export interface Coach extends DomainEntity {
  fullName: string;
  countryId?: EntityId;
  currentClubId?: EntityId;
  currentNationalTeamId?: EntityId;
  role?: string;
}

export interface Player extends DomainEntity {
  fullName: string;
  sportId: EntityId;
  countryId?: EntityId;
  birthDate?: string;
  position?: string;
  shirtNumber?: number;
  currentClubId?: EntityId;
  currentNationalTeamId?: EntityId;
}

export interface Venue extends DomainEntity {
  name: string;
  countryId?: EntityId;
  regionId?: EntityId;
  capacity?: number;
  location?: GeoLocation;
}

export interface Official extends DomainEntity {
  fullName: string;
  countryId?: EntityId;
  role: 'referee' | 'assistant-referee' | 'var' | 'umpire' | 'judge' | 'other';
}

export interface Match extends DomainEntity {
  sportId: EntityId;
  competitionId: EntityId;
  seasonId: EntityId;
  stageId?: EntityId;
  roundId?: EntityId;
  slug: string;
  status: 'scheduled' | 'live' | 'finished' | 'postponed' | 'cancelled';
  scheduledAtUtc: string;
  venueId?: EntityId;
  homeTeam: TeamRef;
  awayTeam: TeamRef;
  score?: Score;
  officialIds?: EntityId[];
}

export interface LeagueTable extends DomainEntity {
  competitionId: EntityId;
  seasonId: EntityId;
  stageId?: EntityId;
  generatedAt: string;
  standingIds: EntityId[];
}

export interface Standing extends DomainEntity {
  leagueTableId: EntityId;
  team: TeamRef;
  position: number;
  played: number;
  points: number;
  wins?: number;
  draws?: number;
  losses?: number;
  goalsFor?: number;
  goalsAgainst?: number;
}

export interface Ranking extends DomainEntity {
  sportId: EntityId;
  scope: 'global' | 'competition' | 'season';
  name: string;
  generatedAt: string;
  items: Array<{
    subject: TeamRef | EntityRef<'player'> | EntityRef<'coach'>;
    position: number;
    score: Rating;
  }>;
}

export interface Statistic extends DomainEntity {
  subject: TeamRef | EntityRef<'player'> | EntityRef<'match'>;
  key: string;
  value: number;
  unit?: string;
  capturedAt: string;
}

export interface Performance extends DomainEntity {
  matchId: EntityId;
  subject: TeamRef | EntityRef<'player'>;
  rating?: Rating;
  statistics: Statistic[];
  notes?: string;
}

export interface Event extends DomainEntity {
  matchId: EntityId;
  type: string;
  minute?: number;
  team?: TeamRef;
  playerId?: EntityId;
  payload?: Record<string, unknown>;
}

export interface Formation extends DomainEntity {
  sportId: EntityId;
  code: string;
  label: string;
}

export interface Lineup extends DomainEntity {
  matchId: EntityId;
  team: TeamRef;
  formationId?: EntityId;
  starters: EntityId[];
  substitutes: EntityId[];
  coachId?: EntityId;
}

export interface Injury extends DomainEntity {
  subject: EntityRef<'player'>;
  status: 'active' | 'recovered';
  description: string;
  startedAt: string;
  expectedReturnAt?: string;
}

export interface Suspension extends DomainEntity {
  subject: EntityRef<'player'> | EntityRef<'coach'>;
  reason: string;
  startedAt: string;
  endsAt?: string;
}

export interface Prediction extends DomainEntity {
  matchId: EntityId;
  generatedAt: string;
  probabilities: {
    homeWin: Probability;
    draw?: Probability;
    awayWin: Probability;
  };
  expectedScore?: Score;
  confidence: Confidence;
  risk: Risk;
}

export interface Analysis extends DomainEntity {
  matchId?: EntityId;
  sportId: EntityId;
  title: string;
  summary: string;
  body?: string;
  generatedAt: string;
  predictionId?: EntityId;
}

export interface Narrative extends DomainEntity {
  analysisId: EntityId;
  locale: 'es' | 'en';
  title: string;
  executiveSummary: string;
  fullText: string;
  version: Version;
}

export interface Insight extends DomainEntity {
  analysisId: EntityId;
  label: string;
  text: string;
  confidence?: Confidence;
}

export interface Evidence extends DomainEntity {
  analysisId: EntityId;
  source: string;
  key: string;
  value: string;
  reliability?: Percentage;
  relatedEntityRefs?: EntityRef[];
}

export interface Validation extends DomainEntity {
  analysisId?: EntityId;
  predictionId?: EntityId;
  evaluatedAt: string;
  verdictAccurate?: boolean;
  indexPrecision?: Percentage;
  insightPrecision?: Percentage;
  narrativePrecision?: Percentage;
  notes?: string;
}

export interface HistoryRecord extends DomainEntity {
  aggregateKey: string;
  recordedAt: string;
  entityRef: EntityRef;
  changeType: 'created' | 'updated' | 'deleted' | 'evaluated';
  snapshot?: Record<string, unknown>;
}

export interface EditorialDocument extends DomainEntity {
  sportId?: EntityId;
  competitionId?: EntityId;
  matchId?: EntityId;
  locale: 'es' | 'en';
  title: string;
  subtitle?: string;
  content: string;
  tags?: string[];
  publishedAt?: string;
}

export interface SportProfile extends DomainEntity {
  sportId: EntityId;
  slug: string;
  name: string;
  methodologyVersion: Version;
  profileVersion: Version;
  availableFactors: string[];
  factorWeights: Record<string, number>;
  supportedCompetitionTypes: string[];
  matchers: {
    slugs: string[];
    providers: string[];
    competitions: string[];
  };
}
