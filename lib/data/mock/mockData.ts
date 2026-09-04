import type { Analysis, Event, League, Match, News, Ranking, Sport } from '@/lib/data/types/domain';

export const mockFeaturedMatchesBySport: Record<Sport, Match[]> = {
  football: [
    {
      id: 'm1',
      slug: 'real-madrid-manchester-city',
      sport: 'football',
      competition: 'UEFA CHAMPIONS LEAGUE',
      time: 'Hoy, 21:00',
      status: 'PRÓXIMO',
      homeTeam: { id: 't1', name: 'Real Madrid' },
      awayTeam: { id: 't2', name: 'Manchester City' },
      indexScore: 94,
      confidence: 'Alta',
      probabilityHomeWin: 67,
    },
    {
      id: 'm2',
      slug: 'arsenal-chelsea',
      sport: 'football',
      competition: 'PREMIER LEAGUE',
      time: 'Mañana, 18:30',
      status: 'PRÓXIMO',
      homeTeam: { id: 't3', name: 'Arsenal' },
      awayTeam: { id: 't4', name: 'Chelsea' },
      indexScore: 88,
      confidence: 'Media',
      probabilityHomeWin: 58,
    },
    {
      id: 'm3',
      slug: 'barcelona-atletico-madrid',
      sport: 'football',
      competition: 'LALIGA',
      time: 'Hoy, 19:45',
      status: 'EN VIVO',
      homeTeam: { id: 't5', name: 'Barcelona' },
      awayTeam: { id: 't6', name: 'Atlético Madrid' },
      indexScore: 91,
      confidence: 'Alta',
      probabilityHomeWin: 62,
    },
    {
      id: 'm4',
      slug: 'inter-juventus',
      sport: 'football',
      competition: 'SERIE A',
      time: 'Domingo, 20:00',
      status: 'PRÓXIMO',
      homeTeam: { id: 't7', name: 'Inter' },
      awayTeam: { id: 't8', name: 'Juventus' },
      indexScore: 87,
      confidence: 'Media',
      probabilityHomeWin: 54,
    },
  ],
  basketball: [],
  tennis: [],
  formula1: [],
  cycling: [],
  baseball: [],
  esports: [],
};

export const mockLeaguesBySport: Record<Sport, League[]> = {
  football: [
    { id: '4328', sport: 'football', name: 'Champions League', code: 'UCL' },
    { id: 'PL', sport: 'football', name: 'Premier League', code: 'EPL' },
    { id: 'PD', sport: 'football', name: 'LaLiga', code: 'LL' },
  ],
  basketball: [],
  tennis: [],
  formula1: [],
  cycling: [],
  baseball: [],
  esports: [],
};

export const mockEventsBySport: Record<Sport, Event[]> = {
  football: [
    { id: 'e1', sport: 'football', title: 'Arsenal vs Chelsea', startsAt: 'Mañana, 18:30', note: 'Previa táctica' },
    { id: 'e2', sport: 'football', title: 'Inter vs Juventus', startsAt: 'Domingo, 20:00', note: 'Modelo de ritmo' },
  ],
  basketball: [],
  tennis: [],
  formula1: [],
  cycling: [],
  baseball: [],
  esports: [],
};

export const mockNewsBySport: Record<Sport, News[]> = {
  football: [
    {
      id: 'n1',
      sport: 'football',
      category: 'Mercado',
      title: 'Liverpool prioriza un interior de alta presión',
      excerpt: 'El área de analítica cruza señales de intensidad para acelerar la decisión.',
      publishedAt: 'Hace 2 horas',
    },
  ],
  basketball: [],
  tennis: [],
  formula1: [],
  cycling: [],
  baseball: [],
  esports: [],
};

export const mockAnalysisBySport: Record<Sport, Analysis[]> = {
  football: [
    {
      id: 'a1',
      sport: 'football',
      category: 'Informe táctico',
      title: 'El bloque medio del City reduce llegadas rivales',
      excerpt: 'Cruce entre presión, altura de recuperación y pases progresivos.',
      publishedAt: '5 julio 2026',
    },
  ],
  basketball: [],
  tennis: [],
  formula1: [],
  cycling: [],
  baseball: [],
  esports: [],
};

export const mockRankingsBySport: Record<Sport, Ranking[]> = {
  football: [
    { id: 'r1', sport: 'football', name: 'Manchester City', score: 94 },
    { id: 'r2', sport: 'football', name: 'Real Madrid', score: 93 },
    { id: 'r3', sport: 'football', name: 'Barcelona', score: 91 },
  ],
  basketball: [],
  tennis: [],
  formula1: [],
  cycling: [],
  baseball: [],
  esports: [],
};
