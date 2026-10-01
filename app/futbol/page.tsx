import type { Metadata } from 'next';

import IntelligenceCenterPage, { type IntelligenceCenterContent } from '@/app/components/IntelligenceCenterPage';
import { getTodayFootballMatches, getUpcomingFootballMatches } from '@/app/lib/realSportsData';
import { sortMatchesByImportance } from '@/app/lib/footballMatchPriority';
import { getPublishedArticles } from '@/app/lib/publishedNews';

export const metadata: Metadata = {
  title: 'Fútbol | Sportiva24',
  description: 'Centro de Inteligencia Deportiva de fútbol en Sportiva24.',
};

export const revalidate = 30;

const baseFutbolContent: IntelligenceCenterContent = {
  hero: {
    badge: 'Datos deportivos en tiempo real',
    title: 'Fútbol',
    subtitle: 'La agenda real del fútbol mundial, interpretada con contexto y señal deportiva.',
    description:
      'Señales de rendimiento, lectura contextual y modelos predictivos para entender cada partido con una experiencia editorial premium, clara y orientada a datos.',
    primaryCta: { label: 'Ver agenda', href: '/match' },
    secondaryCta: { label: 'Noticias', href: '/noticias' },
    image: {
      src: '/hero/hero-football.png',
      alt: 'Visual premium de fútbol, inteligencia artificial y análisis de datos',
      width: 1200,
      height: 920,
    },
  },
  leagues: {
    intro: 'Mapa competitivo',
    title: 'Ligas destacadas',
    helper: 'Competiciones seleccionadas con datos deportivos en tiempo real.',
    chipLabel: 'Liga',
    items: [],
  },
  matches: {
    intro: 'Inteligencia de partidos',
    title: 'Partidos de la semana',
    ctaLabel: 'Ver agenda completa',
    ctaHref: '/match',
    items: [],
  },
  analysis: {
    intro: 'Inteligencia editorial',
    title: 'Últimos análisis',
    description:
      'Lecturas rápidas de la semana, construidas sobre la programación real del fútbol mundial y su contexto deportivo.',
    items: [],
  },
  news: {
    intro: 'Mesa en vivo',
    title: 'Noticias destacadas',
    ctaLabel: 'Abrir sala de noticias',
    ctaHref: '/noticias',
    items: [],
  },
  premium: {
    intro: 'Espacio premium',
    title: 'Espacio premium integrado en el flujo editorial',
    description:
      'Espacio elegante para patrocinadores de alto valor, pensado para convivir con contenido analítico sin romper el tono tecnológico de la página.',
    badge: 'Sportiva24 x Marca',
    headline: 'Integración premium inteligente',
    subheadline: 'Formato adaptable para patrocinios estratégicos',
  },
  ranking: {
    intro: 'Índice de poder S24',
    title: 'Ranking IA',
    items: [],
  },
  events: {
    intro: 'Inteligencia de calendario',
    title: 'Próximos eventos',
    calendarLabel: 'Calendario',
    items: [],
  },
  newsletter: {
    intro: 'Boletín',
    title: 'Recibe inteligencia exclusiva cada semana',
    description:
      'Resumen editorial, señales del modelo y las historias que realmente importan para seguir el fútbol con más contexto.',
    emailPlaceholder: 'Tu email',
    buttonLabel: 'Suscribirme',
  },
};

function getLeagueBadge(name: string): string {
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'FUT';
  return words.slice(0, 3).map((word) => word[0]).join('').toUpperCase().slice(0, 3) || 'FUT';
}

const featuredLeagueIcons: Record<string, string> = {
  'UEFA Champions League': '/competitions/uefa-champions.svg',
  'Premier League': '/competitions/premier-league.svg',
  LaLiga: '/competitions/la-liga.svg',
  'Serie A': '/competitions/serie-a.svg',
  Brasileirao: '/competitions/brasileirao.svg',
  'Primera Division': '/competitions/primera-division.svg',
  'Copa Libertadores': '/competitions/copa-libertadores.svg',
  'Copa Sudamericana': '/competitions/copa-sudamericana.svg',
};

const featuredLeaguePatterns = [
  /champions league/i,
  /^premier league(?:\s*-\s*england)?$/i,
  /^la ?liga(?:\s*-\s*spain)?$/i,
  /^serie a(?:\s*-\s*italy)?$/i,
  /brasileir[aã]o|serie a\s*-\s*brazil/i,
  /primera division.*argentina|liga profesional argentina/i,
  /libertadores/i,
  /sudamericana/i,
  /efl cup|carabao cup|fa cup|copa del rey/i,
];

const asianCountryPattern = /afghanistan|australia|bahrain|bangladesh|bhutan|china|hong kong|india|indonesia|iran|iraq|japan|jordan|kuwait|korea|lebanon|malaysia|myanmar|nepal|oman|pakistan|palestine|philippines|qatar|saudi arabia|singapore|syria|thailand|vietnam|yemen|uzbekistan/i;

function isFeaturedMatch(match: { competition: string; country?: string; team1: string; team2: string }): boolean {
  const competition = match.competition.trim();
  const matchDescription = `${competition} ${match.country ?? ''} ${match.team1} ${match.team2}`;
  const isYouthOrReserveMatch = /women|femenin|female|youth|juvenil|reserve|reserva|academy|u\s?\d{1,2}|\bii\b|\biii\b|\b2\b|\b3\b/i.test(matchDescription);
  const isAsianFixture = asianCountryPattern.test(match.country ?? '') || asianCountryPattern.test(competition);
  const isRealMadridEibar = /real madrid/i.test(match.team1) && /eibar/i.test(match.team2)
    || /eibar/i.test(match.team1) && /real madrid/i.test(match.team2);
  return !isYouthOrReserveMatch && !isAsianFixture && (isRealMadridEibar || featuredLeaguePatterns.some((pattern) => pattern.test(competition)));
}

function toDisplayDate(dateString?: string): string {
  if (!dateString) return 'Próximo';

  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) return 'Próximo';

  return parsed.toLocaleString('es-ES', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default async function FutbolPage() {
  const [todayMatches, upcomingMatches, publishedArticles] = await Promise.all([
    getTodayFootballMatches(200),
    getUpcomingFootballMatches(200),
    getPublishedArticles(),
  ]);
  const allMatches = Array.from(new Map(
    [...todayMatches, ...upcomingMatches].map((match) => [match.slug, match]),
  ).values());

  const globalLeagueOrder = [
    'UEFA Champions League',
    'Premier League',
    'LaLiga',
    'Serie A',
    'Brasileirao',
    'Primera Division',
    'Copa Libertadores',
    'Copa Sudamericana',
  ];

  const featuredMatches = sortMatchesByImportance(
    allMatches.filter((match) => match.status !== 'FINALIZADO' && isFeaturedMatch(match)),
  ).slice(0, 12);

  const uniqueLeagues = Array.from(new Set([
    ...globalLeagueOrder,
    ...allMatches
      .map((match) => match.competition)
      .filter((competition) => !['Bundesliga', 'Ligue 1'].includes(competition)),
  ]))
    .filter((leagueName) => Boolean(leagueName))
    .slice(0, 8)
    .map((leagueName) => ({
      name: leagueName ?? 'Competición',
      badge: getLeagueBadge(leagueName ?? 'Competición'),
      logo: featuredLeagueIcons[leagueName ?? ''],
    }));

  const analysisItems = featuredMatches.map((match) => ({
    category: 'Análisis de partido',
    date: match.time,
    title: `${match.team1} vs ${match.team2}`,
    excerpt: `Lectura de contexto, forma y condiciones del encuentro en ${match.competition}.`,
    href: `/match/${match.slug}`,
    teams: [
      { name: match.team1, logo: match.team1Logo },
      { name: match.team2, logo: match.team2Logo },
    ] as [
      { name: string; logo: string },
      { name: string; logo: string },
    ],
  }));

  const featuredArticle = publishedArticles.find((article) => article.featured) ?? publishedArticles[0];
  const newsItem = featuredArticle
    ? {
        category: featuredArticle.category,
        date: featuredArticle.date,
        title: featuredArticle.title,
        excerpt: featuredArticle.excerpt,
        image: featuredArticle.image,
        href: `/noticias/${featuredArticle.slug}`,
        team: {
          name: featuredArticle.category,
          badge: getLeagueBadge(featuredArticle.category),
        },
      }
    : {
        category: 'Agenda',
        date: 'Hoy',
        title: 'Agenda actualizada de fútbol',
        excerpt: 'La información se sincroniza con la misma agenda que muestra Explorar partidos.',
        team: { name: 'Fútbol', badge: 'FUT' },
      };

  const events = featuredMatches.slice(0, 4).map((match) => ({
    day: match.dateTimeUtc ? new Date(match.dateTimeUtc).toLocaleString('es-ES', { day: '2-digit' }) : 'Hoy',
    month: match.dateTimeUtc ? new Date(match.dateTimeUtc).toLocaleString('es-ES', { month: 'short' }).toUpperCase() : 'NOW',
    title: `${match.team1} vs ${match.team2}`,
    time: match.time,
    note: match.competition,
  }));

  const today = new Date();
  const calendarDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    const dateKey = date.toISOString().slice(0, 10);
    return {
      label: date.toLocaleDateString('es-ES', { weekday: 'short' }).slice(0, 1).toUpperCase(),
      day: date.toLocaleDateString('es-ES', { day: 'numeric' }),
      active: featuredMatches.some((match) => match.dateTimeUtc?.slice(0, 10) === dateKey),
    };
  });

  const content: IntelligenceCenterContent = {
    ...baseFutbolContent,
    leagues: {
      ...baseFutbolContent.leagues,
      items: uniqueLeagues.map((league) => ({
        name: league.name,
        badge: league.badge,
        logo: league.logo,
      })),
    },
    matches: {
      ...baseFutbolContent.matches,
      items: featuredMatches,
    },
    analysis: {
      ...baseFutbolContent.analysis,
      items: analysisItems,
    },
    news: {
      ...baseFutbolContent.news,
      items: [newsItem],
    },
    events: {
      ...baseFutbolContent.events,
      items: events.length > 0 ? events : [
        {
          day: 'HOY',
          month: '',
          title: 'Agenda en actualización',
          time: 'Se está validando la próxima ventana de partidos.',
          note: 'Sincronización con la misma agenda del explorador.',
        },
      ],
      calendarDays,
    },
  };

  return <IntelligenceCenterPage content={content} hideRanking />;
}
