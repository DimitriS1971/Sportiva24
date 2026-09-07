import type { Metadata } from 'next';

import IntelligenceCenterPage, { type IntelligenceCenterContent } from '@/app/components/IntelligenceCenterPage';
import { getFeaturedFootballMatches } from '@/app/lib/realSportsData';

export const metadata: Metadata = {
  title: 'Fútbol | Sportiva24',
  description: 'Centro de Inteligencia Deportiva de fútbol en Sportiva24.',
};

const futbolContent: IntelligenceCenterContent = {
  hero: {
    badge: 'Centro de inteligencia Sportiva24',
    title: 'Fútbol',
    subtitle: 'Toda la inteligencia deportiva del fútbol mundial en un solo lugar.',
    description:
      'Señales de rendimiento, lectura contextual y modelos predictivos para entender el juego con una interfaz editorial, limpia y profundamente orientada a datos.',
    primaryCta: { label: 'Ver análisis', href: '/analisis' },
    secondaryCta: { label: 'Últimas noticias', href: '/noticias' },
    image: {
      src: '/hero/hero-football.png',
      alt: 'Visual premium de fútbol, inteligencia artificial y análisis de datos',
      width: 1200,
      height: 920,
    },
  },
  leagues: {
    intro: 'Mapa competitivo',
    title: 'Ligas principales',
    helper: 'Cobertura editorial sin filtros activados por ahora.',
    chipLabel: 'Liga',
    items: [
      { name: 'Champions League', logo: '/competitions/uefa-champions.svg' },
      { name: 'Premier League', logo: '/competitions/premier-league.svg' },
      { name: 'LaLiga', badge: 'LL' },
      { name: 'Serie A', badge: 'SA' },
      { name: 'Bundesliga', badge: 'BL' },
      { name: 'Ligue 1', badge: 'L1' },
      { name: 'Libertadores', badge: 'LIB' },
      { name: 'Sudamericana', badge: 'SUD' },
    ],
  },
  matches: {
    intro: 'Inteligencia de partidos',
    title: 'Partidos destacados',
    ctaLabel: 'Ver agenda completa',
    ctaHref: '/match',
    items: [
      {
        competition: 'Uefa champions league',
        time: 'Hoy, 21:00',
        status: 'PROXIMO',
        team1: 'Real Madrid',
        team1Logo: '/teams-official/real-madrid.png',
        team2: 'Manchester City',
        team2Logo: '/teams-official/manchester-city.png',
        s24Index: 94,
        confidence: 'Alta',
        probability: 67,
        slug: 'real-madrid-manchester-city',
      },
      {
        competition: 'Premier league',
        time: 'Mañana, 18:30',
        status: 'PROXIMO',
        team1: 'Arsenal',
        team1Logo: '/teams-official/arsenal.png',
        team2: 'Chelsea',
        team2Logo: '/teams/chelsea.svg',
        s24Index: 88,
        confidence: 'Media',
        probability: 58,
        slug: 'arsenal-chelsea',
      },
      {
        competition: 'LALIGA',
        time: 'Hoy, 19:45',
        status: 'EN VIVO',
        team1: 'Barcelona',
        team1Logo: '/teams-official/barcelona.png',
        team2: 'Atlético Madrid',
        team2Logo: '/teams/atletico.svg',
        s24Index: 91,
        confidence: 'Alta',
        probability: 62,
        slug: 'barcelona-atletico-madrid',
      },
      {
        competition: 'SERIE A',
        time: 'Domingo, 20:00',
        status: 'PROXIMO',
        team1: 'Inter',
        team1Logo: '/teams/inter.svg',
        team2: 'Juventus',
        team2Logo: '/teams/juventus.svg',
        s24Index: 87,
        confidence: 'Media',
        probability: 54,
        slug: 'inter-juventus',
      },
    ],
  },
  analysis: {
    intro: 'Inteligencia editorial',
    title: 'Últimos análisis',
    description:
      'Piezas construidas con datos de ejemplo para presentar la plantilla editorial del futuro centro de inteligencia deportiva.',
    items: [
      {
        category: 'Informe táctico',
        date: '5 julio 2026',
        title: 'El nuevo bloque medio del City reduce 18% las llegadas rivales',
        excerpt:
          'Cruce entre presión, altura de recuperación y pases progresivos para entender la superioridad territorial del equipo de Guardiola.',
        teams: [
          { name: 'Manchester City', logo: '/teams-official/manchester-city.png' },
          { name: 'Real Madrid', logo: '/teams-official/real-madrid.png' },
        ],
      },
      {
        category: 'Modelo de fichajes',
        date: '4 julio 2026',
        title: 'Barcelona optimiza su once con perfiles de recepción interior',
        excerpt:
          'Una lectura del modelo S24 sobre cómo cambia la amenaza ofensiva cuando el extremo ataca por dentro y el lateral fija la amplitud.',
        teams: [
          { name: 'Barcelona', logo: '/teams-official/barcelona.png' },
          { name: 'Arsenal', logo: '/teams-official/arsenal.png' },
        ],
      },
      {
        category: 'Laboratorio de rendimiento',
        date: '3 julio 2026',
        title: 'Inter y Juventus: dónde se decide el partido antes de llegar al área',
        excerpt:
          'Mapa de duelos, zonas de activación y volumen de pases verticales para detectar el punto exacto donde se rompe el equilibrio.',
        teams: [
          { name: 'Inter', logo: '/teams/inter.svg' },
          { name: 'Juventus', logo: '/teams/juventus.svg' },
        ],
      },
      {
        category: 'Motor predictivo',
        date: '2 julio 2026',
        title: 'Cómo le impacta al Atlético un partido con posesión larga del rival',
        excerpt:
          'El modelo combina secuencias sin balón, recuperaciones altas y xThreat para anticipar escenarios de partido de alta exigencia.',
        teams: [
          { name: 'Atlético Madrid', logo: '/teams/atletico.svg' },
          { name: 'Chelsea', logo: '/teams/chelsea.svg' },
        ],
      },
    ],
  },
  news: {
    intro: 'Mesa en vivo',
    title: 'Noticias',
    ctaLabel: 'Abrir sala de noticias',
    ctaHref: '/noticias',
    items: [
      {
        category: 'Mercado',
        date: 'Hace 2 horas',
        title: 'Liverpool prioriza un interior de alta presión para el cierre del mercado',
        excerpt:
          'El departamento de analítica cruza volumen de sprints, recepciones y pases de ruptura para acelerar la decisión final.',
        team: { name: 'Liverpool', badge: 'LIV' },
      },
      {
        category: 'Champions',
        date: 'Hace 4 horas',
        title: 'PSG ajusta su estructura de salida pensando en noches europeas',
        excerpt:
          'El staff trabaja una primera fase más segura para elevar la calidad de sus secuencias largas y proteger la transición defensiva.',
        team: { name: 'PSG', badge: 'PSG' },
      },
      {
        category: 'LaLiga',
        date: 'Hoy',
        title: 'Atlético recupera agresividad tras mejorar la altura media de robo',
        excerpt:
          'Los últimos seis partidos muestran una tendencia clara en intensidad, ocupación de carriles y control de segundas jugadas.',
        team: { name: 'Atlético Madrid', badge: 'ATM' },
      },
    ],
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
    items: [
      { name: 'Manchester City', score: 94 },
      { name: 'Real Madrid', score: 93 },
      { name: 'Barcelona', score: 91 },
      { name: 'PSG', score: 90 },
      { name: 'Liverpool', score: 89 },
      { name: 'Bayern', score: 89 },
      { name: 'Arsenal', score: 88 },
      { name: 'Inter', score: 87 },
      { name: 'Chelsea', score: 86 },
      { name: 'Atlético Madrid', score: 86 },
    ],
  },
  events: {
    intro: 'Inteligencia de calendario',
    title: 'Próximos eventos',
    calendarLabel: 'Calendario de ejemplo',
    items: [
      { day: '05', month: 'JUL', title: 'Sala de sorteo Champions', time: '18:00 CET', note: 'Simulación de cruces y dificultad del cuadro' },
      { day: '06', month: 'JUL', title: 'Arsenal vs Chelsea', time: '18:30 CET', note: 'Previa táctica con escenarios de presión' },
      { day: '07', month: 'JUL', title: 'Informe de datos Barcelona', time: '12:00 CET', note: 'Actualización de forma, carga y disponibilidad' },
      { day: '08', month: 'JUL', title: 'Inter vs Juventus', time: '20:00 CET', note: 'Modelo de ritmo, zonas y volumen ofensivo' },
    ],
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

export default async function FutbolPage() {
  const realMatches = await getFeaturedFootballMatches(4);

  const content: IntelligenceCenterContent = {
    ...futbolContent,
    matches: {
      ...futbolContent.matches,
      items: realMatches,
    },
  };

  return <IntelligenceCenterPage content={content} />;
}
