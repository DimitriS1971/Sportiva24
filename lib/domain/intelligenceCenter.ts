export type MatchStatus = 'EN VIVO' | 'PROXIMO' | 'PRÓXIMO';

export type ConfidenceLevel = 'Alta' | 'Media' | 'Baja';

export interface IntelligenceLeague {
  name: string;
  logo?: string;
  badge?: string;
}

export interface IntelligenceMatch {
  competition: string;
  time: string;
  status: MatchStatus;
  team1: string;
  team1Logo: string;
  team2: string;
  team2Logo: string;
  s24Index: number;
  confidence: ConfidenceLevel;
  probability: number;
  slug: string;
  href?: string;
  sourceLabel?: string;
  sourceTier?: 'free' | 'paid' | 'mock';
}

export interface IntelligenceArticle {
  category: string;
  date: string;
  title: string;
  excerpt: string;
  teams: [
    { name: string; logo: string },
    { name: string; logo: string }
  ];
}

export interface IntelligenceNewsItem {
  category: string;
  date: string;
  title: string;
  excerpt: string;
  team: { name: string; badge: string };
}

export interface IntelligenceRankingItem {
  name: string;
  score: number;
}

export interface IntelligenceEvent {
  day: string;
  month: string;
  title: string;
  time: string;
  note: string;
}

export interface IntelligenceCenterContent {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    description: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
    image: { src: string; alt: string; width: number; height: number };
  };
  leagues: {
    intro: string;
    title: string;
    helper: string;
    chipLabel: string;
    items: IntelligenceLeague[];
  };
  matches: {
    intro: string;
    title: string;
    ctaLabel: string;
    ctaHref: string;
    items: IntelligenceMatch[];
  };
  analysis: {
    intro: string;
    title: string;
    description: string;
    items: IntelligenceArticle[];
  };
  news: {
    intro: string;
    title: string;
    ctaLabel: string;
    ctaHref: string;
    items: IntelligenceNewsItem[];
  };
  premium: {
    intro: string;
    title: string;
    description: string;
    badge: string;
    headline: string;
    subheadline: string;
  };
  ranking: {
    intro: string;
    title: string;
    items: IntelligenceRankingItem[];
  };
  events: {
    intro: string;
    title: string;
    calendarLabel: string;
    items: IntelligenceEvent[];
  };
  newsletter: {
    intro: string;
    title: string;
    description: string;
    emailPlaceholder: string;
    buttonLabel: string;
  };
}
