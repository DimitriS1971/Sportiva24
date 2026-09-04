import type { Metadata } from 'next';

import IntelligenceCenterPage, { type IntelligenceCenterContent } from '@/app/components/IntelligenceCenterPage';

export const metadata: Metadata = {
  title: 'Tenis | Sportiva24',
  description: 'Centro de Inteligencia de tenis en Sportiva24.',
};

const tennisContent: IntelligenceCenterContent = {
  hero: {
    badge: 'Centro de inteligencia Sportiva24',
    title: 'TENIS',
    subtitle: 'Toda la inteligencia del tenis mundial impulsada por datos, contexto y lectura táctica.',
    description:
      'Modelos de servicio, presión al resto y rendimiento por superficie para seguir ATP, WTA y Grand Slams con una experiencia editorial premium.',
    primaryCta: { label: 'Ver análisis', href: '/analisis' },
    secondaryCta: { label: 'Últimas noticias', href: '/noticias' },
    image: {
      src: '/tenis/hero-intelligence-tennis.svg',
      alt: 'Visual premium de tenis, inteligencia artificial y análisis de datos',
      width: 1200,
      height: 920,
    },
  },
  leagues: {
    intro: 'Mapa competitivo',
    title: 'Competiciones principales',
    helper: 'Cobertura editorial sin filtros activados por ahora.',
    chipLabel: 'Circuito',
    items: [
      { name: 'ATP Tour', badge: 'ATP' },
      { name: 'WTA Tour', badge: 'WTA' },
      { name: 'Wimbledon', badge: 'WIM' },
      { name: 'Roland Garros', badge: 'RG' },
      { name: 'US Open', badge: 'USO' },
      { name: 'Australian Open', badge: 'AO' },
      { name: 'Davis Cup', badge: 'DAV' },
      { name: 'Billie Jean King Cup', badge: 'BJK' },
    ],
  },
  matches: {
    intro: 'Inteligencia de partidos',
    title: 'Partidos destacados',
    ctaLabel: 'Ver agenda completa',
    ctaHref: '/match',
    items: [
      { competition: 'WIMBLEDON', time: 'Hoy, 14:00', status: 'PROXIMO', team1: 'Carlos Alcaraz', team1Logo: '/icons/tennis-premium.svg', team2: 'Novak Djokovic', team2Logo: '/icons/tennis-premium.svg', s24Index: 93, confidence: 'Alta', probability: 61, slug: 'alcaraz-djokovic' },
      { competition: 'ATP TOUR', time: 'Hoy, 16:30', status: 'EN VIVO', team1: 'Jannik Sinner', team1Logo: '/icons/tennis-premium.svg', team2: 'Daniil Medvedev', team2Logo: '/icons/tennis-premium.svg', s24Index: 90, confidence: 'Media', probability: 56, slug: 'sinner-medvedev' },
      { competition: 'WTA TOUR', time: 'Mañana, 13:00', status: 'PROXIMO', team1: 'Iga Swiatek', team1Logo: '/icons/tennis-premium.svg', team2: 'Aryna Sabalenka', team2Logo: '/icons/tennis-premium.svg', s24Index: 91, confidence: 'Alta', probability: 58, slug: 'swiatek-sabalenka' },
      { competition: 'ATP TOUR', time: 'Viernes, 18:00', status: 'PROXIMO', team1: 'Holger Rune', team1Logo: '/icons/tennis-premium.svg', team2: 'Alexander Zverev', team2Logo: '/icons/tennis-premium.svg', s24Index: 86, confidence: 'Media', probability: 52, slug: 'rune-zverev' },
    ],
  },
  analysis: {
    intro: 'Inteligencia editorial',
    title: 'Últimos análisis',
    description: 'Piezas construidas con datos de ejemplo para presentar la plantilla editorial del futuro centro de inteligencia de tenis.',
    items: [
      { category: 'Modelo de servicio', date: '5 julio 2026', title: 'Alcaraz gana valor cuando acorta el segundo golpe tras primer saque', excerpt: 'El modelo cruza direcciones de servicio, profundidad de devolución y agresión inicial para medir ventaja real por superficie.', teams: [{ name: 'Carlos Alcaraz', logo: '/icons/tennis-premium.svg' }, { name: 'Novak Djokovic', logo: '/icons/tennis-premium.svg' }] },
      { category: 'Presión al resto', date: '4 julio 2026', title: 'Sinner eleva su techo competitivo cuando roba tiempo en pista dura', excerpt: 'Un análisis de velocidad media de impacto, posición de retorno y conversión en break points para aislar superioridad sostenida.', teams: [{ name: 'Jannik Sinner', logo: '/icons/tennis-premium.svg' }, { name: 'Daniil Medvedev', logo: '/icons/tennis-premium.svg' }] },
      { category: 'Laboratorio WTA', date: '3 julio 2026', title: 'Swiatek vs Sabalenka: dónde se rompe la secuencia en intercambios cortos', excerpt: 'La pieza identifica qué patrón genera más errores forzados y cómo cambia la iniciativa después del segundo tiro.', teams: [{ name: 'Iga Swiatek', logo: '/icons/tennis-premium.svg' }, { name: 'Aryna Sabalenka', logo: '/icons/tennis-premium.svg' }] },
      { category: 'Clutch model', date: '2 julio 2026', title: 'Rune y Zverev: lectura de tie-breaks y gestión de puntos de alta presión', excerpt: 'El modelo pondera calidad de saque, agresión con el drive y tasa de errores no forzados en finales cerrados.', teams: [{ name: 'Holger Rune', logo: '/icons/tennis-premium.svg' }, { name: 'Alexander Zverev', logo: '/icons/tennis-premium.svg' }] },
    ],
  },
  news: {
    intro: 'Mesa en vivo',
    title: 'Noticias',
    ctaLabel: 'Abrir sala de noticias',
    ctaHref: '/noticias',
    items: [
      { category: 'ATP', date: 'Hace 1 hora', title: 'Alcaraz ajusta patrones de saque abierto antes de la gira de césped', excerpt: 'El equipo técnico prioriza primeros golpes más verticales para ganar puntos gratis y reducir desgaste.', team: { name: 'ATP', badge: 'ATP' } },
      { category: 'WTA', date: 'Hace 2 horas', title: 'Sabalenka mejora su protección en segundo servicio con cambios mínimos', excerpt: 'Los datos recientes muestran menor exposición en devoluciones agresivas del lado de iguales.', team: { name: 'WTA', badge: 'WTA' } },
      { category: 'Grand Slam', date: 'Hoy', title: 'Wimbledon refuerza el valor del saque +1 en cuadros masculinos y femeninos', excerpt: 'La tendencia de la temporada confirma que el segundo golpe está definiendo más partidos grandes.', team: { name: 'Wimbledon', badge: 'WIM' } },
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
      { name: 'Carlos Alcaraz', score: 93 },
      { name: 'Jannik Sinner', score: 92 },
      { name: 'Novak Djokovic', score: 91 },
      { name: 'Daniil Medvedev', score: 89 },
      { name: 'Alexander Zverev', score: 88 },
      { name: 'Holger Rune', score: 87 },
      { name: 'Iga Swiatek', score: 95 },
      { name: 'Aryna Sabalenka', score: 92 },
      { name: 'Coco Gauff', score: 90 },
      { name: 'Elena Rybakina', score: 89 },
    ],
  },
  events: {
    intro: 'Inteligencia de calendario',
    title: 'Próximos eventos',
    calendarLabel: 'Calendario de ejemplo',
    items: [
      { day: '05', month: 'JUL', title: 'Alcaraz vs Djokovic', time: '14:00 CET', note: 'Previo de servicio, devolución y puntos cortos' },
      { day: '06', month: 'JUL', title: 'Sinner vs Medvedev', time: '16:30 CET', note: 'Lectura de ritmo e intercambios de fondo' },
      { day: '07', month: 'JUL', title: 'Swiatek vs Sabalenka', time: '13:00 CET', note: 'Modelo de presión en resto y consistencia' },
      { day: '08', month: 'JUL', title: 'Rune vs Zverev', time: '18:00 CET', note: 'Escenarios de tie-break y clutch' },
    ],
  },
  newsletter: {
    intro: 'Boletín',
    title: 'Recibe inteligencia exclusiva cada semana',
    description: 'Resumen editorial, señales del modelo y las historias que realmente importan para seguir el tenis con más contexto.',
    emailPlaceholder: 'Tu email',
    buttonLabel: 'Suscribirme',
  },
};

export default function TenisPage() {
  return <IntelligenceCenterPage content={tennisContent} />;
}
