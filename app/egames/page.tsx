import type { Metadata } from 'next';

import IntelligenceCenterPage, { type IntelligenceCenterContent } from '@/app/components/IntelligenceCenterPage';

export const metadata: Metadata = {
  title: 'E-games | Sportiva24',
  description: 'Centro de Inteligencia de e-games en Sportiva24.',
};

const egamesContent: IntelligenceCenterContent = {
  hero: {
    badge: 'Centro de inteligencia Sportiva24',
    title: 'E-GAMES',
    subtitle: 'Toda la inteligencia competitiva de los e-games impulsada por datos, lectura táctica y scouting digital.',
    description: 'Modelos de macro, control de mapa, economía y clutch para seguir las principales escenas competitivas con una experiencia editorial premium.',
    primaryCta: { label: 'Ver análisis', href: '/analisis' },
    secondaryCta: { label: 'Últimas noticias', href: '/noticias' },
    image: { src: '/egames/hero-intelligence-egames.svg', alt: 'Visual premium de e-games, inteligencia artificial y análisis de datos', width: 1200, height: 920 },
  },
  leagues: {
    intro: 'Mapa competitivo',
    title: 'Competiciones principales',
    helper: 'Cobertura editorial sin filtros activados por ahora.',
    chipLabel: 'Circuito',
    items: [
      { name: 'League of Legends', badge: 'LOL' },
      { name: 'Valorant', badge: 'VCT' },
      { name: 'Counter-Strike 2', badge: 'CS2' },
      { name: 'Dota 2', badge: 'D2' },
      { name: 'Rocket League', badge: 'RL' },
      { name: 'FC Pro', badge: 'FCP' },
      { name: 'Overwatch', badge: 'OW' },
      { name: 'Fighting Games', badge: 'FGC' },
    ],
  },
  matches: {
    intro: 'Inteligencia de partidos',
    title: 'Partidos destacados',
    ctaLabel: 'Ver agenda completa',
    ctaHref: '/match',
    items: [
      { competition: 'LEAGUE OF LEGENDS', time: 'Hoy, 18:00', status: 'PROXIMO', team1: 'T1', team1Logo: '/icons/egames-premium.svg', team2: 'Gen.G', team2Logo: '/icons/egames-premium.svg', s24Index: 92, confidence: 'Alta', probability: 57, slug: 't1-geng' },
      { competition: 'VALORANT', time: 'Hoy, 20:00', status: 'EN VIVO', team1: 'Fnatic', team1Logo: '/icons/egames-premium.svg', team2: 'PRX', team2Logo: '/icons/egames-premium.svg', s24Index: 90, confidence: 'Media', probability: 54, slug: 'fnatic-prx' },
      { competition: 'CS2', time: 'Mañana, 19:30', status: 'PROXIMO', team1: 'Vitality', team1Logo: '/icons/egames-premium.svg', team2: 'NAVI', team2Logo: '/icons/egames-premium.svg', s24Index: 91, confidence: 'Alta', probability: 56, slug: 'vitality-navi' },
      { competition: 'DOTA 2', time: 'Viernes, 17:00', status: 'PROXIMO', team1: 'Spirit', team1Logo: '/icons/egames-premium.svg', team2: 'Falcons', team2Logo: '/icons/egames-premium.svg', s24Index: 88, confidence: 'Media', probability: 52, slug: 'spirit-falcons' },
    ],
  },
  analysis: {
    intro: 'Inteligencia editorial',
    title: 'Últimos análisis',
    description: 'Piezas construidas con datos de ejemplo para presentar la plantilla editorial del futuro centro de inteligencia de e-games.',
    items: [
      { category: 'Macro model', date: '5 julio 2026', title: 'T1 gana más cuando acelera tempo antes del tercer objetivo neutral', excerpt: 'El modelo cruza oro por minuto, control de visión y prioridad de líneas para detectar el punto de ruptura.', teams: [{ name: 'T1', logo: '/icons/egames-premium.svg' }, { name: 'Gen.G', logo: '/icons/egames-premium.svg' }] },
      { category: 'Aim analytics', date: '4 julio 2026', title: 'Fnatic sostiene mejores parciales cuando protege economía en mapa 2', excerpt: 'La pieza compara entry success, rounds bonus y éxito en retakes para medir estabilidad competitiva.', teams: [{ name: 'Fnatic', logo: '/icons/egames-premium.svg' }, { name: 'PRX', logo: '/icons/egames-premium.svg' }] },
      { category: 'CS2 lab', date: '3 julio 2026', title: 'Vitality vs NAVI: dónde se crea la diferencia real en rounds de rifle', excerpt: 'Los datos muestran cómo cambia el win rate según control temprano y daño utilitario efectivo.', teams: [{ name: 'Vitality', logo: '/icons/egames-premium.svg' }, { name: 'NAVI', logo: '/icons/egames-premium.svg' }] },
      { category: 'Clutch engine', date: '2 julio 2026', title: 'Spirit y Falcons: lectura de late game y cierres de alta presión', excerpt: 'El modelo pondera escalado, visión profunda y execution rate en escenarios de máximo estrés.', teams: [{ name: 'Spirit', logo: '/icons/egames-premium.svg' }, { name: 'Falcons', logo: '/icons/egames-premium.svg' }] },
    ],
  },
  news: {
    intro: 'Mesa en vivo',
    title: 'Noticias',
    ctaLabel: 'Abrir sala de noticias',
    ctaHref: '/noticias',
    items: [
      { category: 'LoL', date: 'Hace 1 hora', title: 'T1 afina setups de visión para asegurar heraldos sin perder tempo', excerpt: 'El ajuste busca sostener presión lateral sin conceder control central.', team: { name: 'T1', badge: 'LOL' } },
      { category: 'Valorant', date: 'Hace 2 horas', title: 'Fnatic mejora su estructura post-plant con dos cambios mínimos', excerpt: 'La coordinación en utility tardía muestra una tendencia positiva en mapas abiertos.', team: { name: 'Fnatic', badge: 'VCT' } },
      { category: 'CS2', date: 'Hoy', title: 'Vitality llega con mejor diferencial de opening duels en serie larga', excerpt: 'Los reportes previos al duelo refuerzan una lectura favorable en Mirage y Nuke.', team: { name: 'Vitality', badge: 'CS2' } },
    ],
  },
  premium: {
    intro: 'Espacio premium',
    title: 'Espacio premium integrado en el flujo editorial',
    description: 'Espacio elegante para patrocinadores de alto valor, pensado para convivir con contenido analítico sin romper el tono tecnológico de la página.',
    badge: 'Sportiva24 x Marca',
    headline: 'Integración premium inteligente',
    subheadline: 'Formato adaptable para patrocinios estratégicos',
  },
  ranking: {
    intro: 'Índice de poder S24',
    title: 'Ranking IA',
    items: [
      { name: 'T1', score: 92 },
      { name: 'Gen.G', score: 91 },
      { name: 'Vitality', score: 91 },
      { name: 'Fnatic', score: 89 },
      { name: 'NAVI', score: 88 },
      { name: 'PRX', score: 87 },
      { name: 'Team Spirit', score: 86 },
      { name: 'Falcons', score: 85 },
      { name: 'G2 Esports', score: 84 },
      { name: 'Paper Rex', score: 83 },
    ],
  },
  events: {
    intro: 'Inteligencia de calendario',
    title: 'Próximos eventos',
    calendarLabel: 'Calendario de ejemplo',
    items: [
      { day: '05', month: 'JUL', title: 'T1 vs Gen.G', time: '18:00 CET', note: 'Previo de macro y objetivos neutrales' },
      { day: '06', month: 'JUL', title: 'Fnatic vs PRX', time: '20:00 CET', note: 'Lectura de economía y post-plant' },
      { day: '07', month: 'JUL', title: 'Vitality vs NAVI', time: '19:30 CET', note: 'Modelo de control y rounds largos' },
      { day: '08', month: 'JUL', title: 'Spirit vs Falcons', time: '17:00 CET', note: 'Escenarios de late game y clutch' },
    ],
  },
  newsletter: {
    intro: 'Boletín',
    title: 'Recibe inteligencia exclusiva cada semana',
    description: 'Resumen editorial, señales del modelo y las historias que realmente importan para seguir los e-games con más contexto.',
    emailPlaceholder: 'Tu email',
    buttonLabel: 'Suscribirme',
  },
};

export default function EGamesPage() {
  return <IntelligenceCenterPage content={egamesContent} />;
}
