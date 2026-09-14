export interface FootballDataTeam {
  id: number;
  name: string;
  shortName?: string;
  tla?: string;
  crest?: string;
}

export interface FootballDataCompetition {
  id: number;
  name: string;
  code?: string;
}

export interface FootballDataMatch {
  id: number;
  utcDate: string;
  status: string;
  competition: FootballDataCompetition;
  homeTeam: FootballDataTeam;
  awayTeam: FootballDataTeam;
}

export interface FootballDataMatchesResponse {
  matches?: FootballDataMatch[];
}

export interface ApiFootballFixture {
  fixture?: {
    id?: number;
    date?: string;
    referee?: string | null;
    venue?: {
      id?: number | null;
      name?: string | null;
      city?: string | null;
    };
    status?: {
      short?: string;
      elapsed?: number | null;
    };
  };
  league?: {
    id?: number;
    name?: string;
    country?: string;
    season?: number;
    round?: string;
  };
  goals?: {
    home?: number | null;
    away?: number | null;
  };
  teams?: {
    home?: {
      id?: number;
      name?: string;
      logo?: string;
    };
    away?: {
      id?: number;
      name?: string;
      logo?: string;
    };
  };
}

export interface ApiFootballFixturesResponse {
  response?: ApiFootballFixture[];
}

export interface ApiFootballStandingsEntry {
  rank?: number;
  team?: { id?: number; name?: string; logo?: string };
  points?: number;
  goalsDiff?: number;
  form?: string;
  all?: { played?: number; win?: number; draw?: number; lose?: number };
}

export interface ApiFootballStandingsResponse {
  response?: Array<{
    league?: { standings?: ApiFootballStandingsEntry[][] };
  }>;
}

export interface ApiFootballLineupPlayer {
  player?: { id?: number; name?: string; number?: number; pos?: string; grid?: string | null };
  statistics?: Array<{ games?: { position?: string; number?: number; grid?: string | null } }>;
}

export interface ApiFootballLineup {
  team?: { id?: number; name?: string; logo?: string };
  formation?: string | null;
  startXI?: ApiFootballLineupPlayer[];
  substitutes?: ApiFootballLineupPlayer[];
}

export interface ApiFootballLineupsResponse {
  response?: ApiFootballLineup[];
}

export interface ApiFootballFixtureStatistic {
  type?: string;
  value?: string | number | null;
}

export interface ApiFootballFixtureStatistics {
  team?: { id?: number; name?: string; logo?: string };
  statistics?: ApiFootballFixtureStatistic[];
}

export interface ApiFootballFixtureStatisticsResponse {
  response?: ApiFootballFixtureStatistics[];
}

export interface TheSportsDbEvent {
  idEvent?: string;
  strLeague?: string;
  strTimestamp?: string;
  strTime?: string;
  strStatus?: string;
  strHomeTeam?: string;
  strAwayTeam?: string;
}

export interface TheSportsDbEventsResponse {
  events?: TheSportsDbEvent[];
}
