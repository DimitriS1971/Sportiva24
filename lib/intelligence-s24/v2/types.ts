export type PredictionStatus = 'ready' | 'limited-data' | 'insufficient-data';

export interface TeamGoalFeatures {
  teamId: string;
  teamName: string;
  venue: 'home' | 'away';
  matches: number;
  goalsFor: number;
  goalsAgainst: number;
  updatedAt: string;
  season?: {
    matches: number;
    goalsFor: number;
    goalsAgainst: number;
  };
}

export interface MatchPredictionFeatures {
  matchId: string;
  competition: string;
  kickoffAt: string;
  generatedAt: string;
  home: TeamGoalFeatures;
  away: TeamGoalFeatures;
  dataAvailability: {
    fixtures: boolean;
    standings: boolean;
    recentForm: boolean;
    homeAwayForm: boolean;
    headToHead: boolean;
    lineups: boolean;
    injuries: boolean;
    odds: boolean;
  };
  marketConsensus?: {
    bookmakers: number;
    home: number;
    draw: number;
    away: number;
  };
}

export interface ScoreProbability {
  home: number;
  away: number;
  probability: number;
}

export interface MatchPredictionV2 {
  status: PredictionStatus;
  modelVersion: 'S24-IE-2.0.0';
  featureVersion: 'S24-FE-2.0.0';
  generatedAt: string;
  dataQuality: {
    score: number;
    available: string[];
    unavailable: string[];
  };
  probabilities?: {
    home: number;
    draw: number;
    away: number;
  };
  expectedGoals?: {
    home: number;
    away: number;
    total: number;
  };
  markets?: {
    over15: number;
    under15: number;
    over25: number;
    under25: number;
    over35: number;
    under35: number;
    bttsYes: number;
    bttsNo: number;
  };
  correctScores?: ScoreProbability[];
  marketConsensus?: {
    bookmakers: number;
    home: number;
    draw: number;
    away: number;
  };
  modelMarketDivergence?: {
    home: number;
    draw: number;
    away: number;
  };
  drivers: string[];
  limitations: string[];
}