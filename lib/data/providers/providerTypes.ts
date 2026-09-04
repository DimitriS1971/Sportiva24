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
