import type { Metadata } from 'next';

import IntelligenceCenterPage, { type IntelligenceCenterContent } from '@/app/components/IntelligenceCenterPage';

export const metadata: Metadata = {
  title: 'Basketball | Sportiva24',
  description: 'Centro de Inteligencia Basketball en Sportiva24.',
};

const basketballContent: IntelligenceCenterContent = {
  hero: {
    badge: 'Centro de inteligencia Sportiva24',
    title: 'Basketball',
    subtitle: 'Toda la inteligencia del basketball mundial impulsada por Inteligencia Artificial y análisis de datos.',
    description:
      'Modelos de eficiencia, contexto de posesiones y lectura de ritmo para seguir la NBA, EuroLeague y grandes torneos con una experiencia editorial premium.',
    primaryCta: { label: 'Ver análisis', href: '/analisis' },
    secondaryCta: { label: 'Últimas noticias', href: '/noticias' },
    image: {
      src: '/hero/hero-basketball.png',
      alt: 'Visual premium de basketball, inteligencia artificial y análisis de datos',
      width: 1280,
      height: 920,
    },
  },
  leagues: {
    intro: 'Mapa competitivo',
    title: 'Competiciones principales',
    helper: 'Cobertura editorial sin filtros activados por ahora.',
    chipLabel: 'Competición',
    items: [
      { name: 'NBA', logo: '/competitions/nba.svg' },
      { name: 'EuroLeague', badge: 'EUR' },
      { name: 'Liga ACB', badge: 'ACB' },
      { name: 'NCAA', badge: 'NCAA' },
      { name: 'WNBA', badge: 'WNBA' },
      { name: 'FIBA', badge: 'FIBA' },
      { name: 'Basketball Champions League', badge: 'BCL' },
      { name: 'FIBA Intercontinental Cup', badge: 'FIC' },
    ],
  },
  matches: {
    intro: 'Inteligencia de partidos',
    title: 'Partidos destacados',
    ctaLabel: 'Ver agenda completa',
    ctaHref: '/match',
    items: [
      {
        competition: 'NBA',
        time: 'Hoy, 20:30',
        status: 'EN VIVO',
        team1: 'Los Angeles Lakers',
        team1Logo: '/teams-official/lakers.png',
        team2: 'Boston Celtics',
        team2Logo: '/teams-official/celtics.png',
        s24Index: 95,
        confidence: 'Alta',
        probability: 71,
        slug: 'lakers-celtics',
      },
      {
        competition: 'NBA',
        time: 'Hoy, 22:00',
        status: 'PROXIMO',
        team1: 'Golden State Warriors',
        team1Logo: '/icons/basketball-premium.svg',
        team2: 'Phoenix Suns',
        team2Logo: '/icons/basketball-premium.svg',
        s24Index: 91,
        confidence: 'Media',
        probability: 58,
        slug: 'warriors-suns',
      },
      {
        competition: 'NBA',
        time: 'Mañana, 19:00',
        status: 'PROXIMO',
        team1: 'Milwaukee Bucks',
        team1Logo: '/icons/basketball-premium.svg',
        team2: 'New York Knicks',
        team2Logo: '/icons/basketball-premium.svg',
        s24Index: 90,
        confidence: 'Media',
        probability: 56,
        slug: 'bucks-knicks',
      },
      {
        competition: 'EUROLEAGUE',
        time: 'Jueves, 21:00',
        status: 'PROXIMO',
        team1: 'Real Madrid',
        team1Logo: '/teams-official/real-madrid.png',
        team2: 'Barcelona',
        team2Logo: '/teams-official/barcelona.png',
        s24Index: 92,
        confidence: 'Alta',
        probability: 64,
        slug: 'real-madrid-barcelona-basket',
      },
    ],
  },
  analysis: {
    intro: 'Inteligencia editorial',
    title: 'Últimos análisis',
    description:
      'Piezas construidas con datos de ejemplo para presentar la plantilla editorial del futuro centro de inteligencia basketball.',
    items: [
      {
        category: 'Modelo de eficiencia',
        date: '5 julio 2026',
        title: 'Boston optimiza su ofensiva en media cancha con lectura de spacing',
        excerpt:
          'Cruce entre pace, tiros asistidos y ventajas creadas para explicar por que la segunda unidad sostiene parciales positivos.',
        teams: [
          { name: 'Boston Celtics', logo: '/teams-official/celtics.png' },
          { name: 'Los Angeles Lakers', logo: '/teams-official/lakers.png' },
        ],
      },
      {
        category: 'Motor predictivo',
        date: '4 julio 2026',
        title: 'Oklahoma City escala su proyección cuando domina rebote defensivo',
        excerpt:
          'El modelo S24 combina porcentaje de rebote, transición temprana y pérdidas forzadas para medir impacto real por tramo.',
        teams: [
          { name: 'Oklahoma City Thunder', logo: '/icons/basketball-premium.svg' },
          { name: 'Denver Nuggets', logo: '/icons/basketball-premium.svg' },
        ],
      },
      {
        category: 'Laboratorio de quintetos',
        date: '3 julio 2026',
        title: 'Bucks vs Knicks: como cambia el rating neto con small-ball tardio',
        excerpt:
          'Análisis de posesiones de clutch para detectar cuándo conviene acelerar ritmo y cuándo proteger cada ataque en estático.',
        teams: [
          { name: 'Milwaukee Bucks', logo: '/icons/basketball-premium.svg' },
          { name: 'New York Knicks', logo: '/icons/basketball-premium.svg' },
        ],
      },
      {
        category: 'Scouting EuroLeague',
        date: '2 julio 2026',
        title: 'Real Madrid y Barcelona: dónde se rompe la defensa en segunda acción',
        excerpt:
          'Mapa de ayudas, closeouts y pases extra para entender por qué el tiro de esquina decide posesiones de alta tensión.',
        teams: [
          { name: 'Real Madrid', logo: '/teams-official/real-madrid.png' },
          { name: 'Barcelona', logo: '/teams-official/barcelona.png' },
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
        category: 'NBA',
        date: 'Hace 1 hora',
        title: 'Lakers ajustan rotación exterior para elevar su volumen de triples limpios',
        excerpt:
          'El staff analiza calidad de tiro por zona y eficiencia tras bloqueo para decidir los cierres de partido.',
        team: { name: 'Los Angeles Lakers', badge: 'LAL' },
      },
      {
        category: 'EuroLeague',
        date: 'Hace 3 horas',
        title: 'Barcelona acelera su ritmo en transición y mejora su ofensiva temprana',
        excerpt:
          'Los últimos reportes muestran más ataques en ocho segundos y mayor conversión cerca del aro.',
        team: { name: 'Barcelona', badge: 'BAR' },
      },
      {
        category: 'NCAA',
        date: 'Hoy',
        title: 'Nuevos prospectos destacan por lectura defensiva y toma de decisiones',
        excerpt:
          'El modelo de scouting pondera disciplina táctica, tasa de recuperaciones y eficiencia en pick-and-roll.',
        team: { name: 'NCAA', badge: 'NCAA' },
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
      { name: 'Boston Celtics', score: 95 },
      { name: 'Oklahoma City Thunder', score: 94 },
      { name: 'Denver Nuggets', score: 93 },
      { name: 'Milwaukee Bucks', score: 92 },
      { name: 'Los Angeles Lakers', score: 91 },
      { name: 'Golden State Warriors', score: 90 },
      { name: 'Phoenix Suns', score: 89 },
      { name: 'Real Madrid', score: 88 },
      { name: 'Barcelona', score: 87 },
      { name: 'Fenerbahçe', score: 86 },
    ],
  },
  events: {
    intro: 'Inteligencia de calendario',
    title: 'Próximos eventos',
    calendarLabel: 'Calendario de ejemplo',
    items: [
      { day: '05', month: 'JUL', title: 'Lakers vs Celtics', time: '20:30 ET', note: 'Previa de ritmo y matchups en perimetro' },
      { day: '06', month: 'JUL', title: 'Warriors vs Suns', time: '22:00 ET', note: 'Lectura de spacing y uso de bloqueos indirectos' },
      { day: '07', month: 'JUL', title: 'Bucks vs Knicks', time: '19:00 ET', note: 'Reporte de eficiencia en media cancha y rebote' },
      { day: '08', month: 'JUL', title: 'Real Madrid vs Barcelona', time: '21:00 CET', note: 'Análisis de ajustes en segunda unidad' },
    ],
  },
  newsletter: {
    intro: 'Boletín',
    title: 'Recibe inteligencia exclusiva cada semana',
    description:
      'Resumen editorial, señales del modelo y las historias que realmente importan para seguir el basketball con más contexto.',
    emailPlaceholder: 'Tu email',
    buttonLabel: 'Suscribirme',
  },
};

export default function BasketballPage() {
  return <IntelligenceCenterPage content={basketballContent} />;
}
