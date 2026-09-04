import type {
  Analysis,
  Competition,
  Event,
  Match,
  Player,
  Ranking,
  Sport,
  Standing,
} from '@/lib/domain/entities';

export type LegacySport = Sport['code'];

export interface Team {
  id: string;
  name: string;
  shortName?: string;
  badgeUrl?: string;
}

export interface League {
  id: string;
  sport: LegacySport;
  name: string;
  code?: string;
  country?: string;
  logoUrl?: string;
}

export type LegacyPlayer = Player;

export interface LegacyMatch {
  id: string;
  slug: string;
  sport: LegacySport;
  competition: string;
  time: string;
  dateTimeUtc?: string;
  status: 'EN VIVO' | 'PRÓXIMO' | 'FINALIZADO';
  homeTeam: Team;
  awayTeam: Team;
  probabilityHomeWin?: number;
  confidence?: 'Alta' | 'Media' | 'Baja';
  indexScore?: number;
}

export interface LegacyStanding {
  team: Team;
  position: number;
  points: number;
  played?: number;
}

export interface LegacyRanking {
  id: string;
  sport: LegacySport;
  name: string;
  score: number;
}

export interface News {
  id: string;
  sport: LegacySport;
  category: string;
  title: string;
  excerpt: string;
  publishedAt: string;
}

export interface LegacyAnalysis {
  id: string;
  sport: LegacySport;
  category: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  teams?: Team[];
}

export interface LegacyEvent {
  id: string;
  sport: LegacySport;
  title: string;
  startsAt: string;
  note?: string;
}

export type {
  Analysis,
  Competition,
  Event,
  Match,
  Player,
  Ranking,
  Sport,
  Standing,
};
