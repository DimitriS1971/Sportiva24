import type { Metadata } from 'next';

import IntelligenceCenterPage, { type IntelligenceCenterContent } from '@/app/components/IntelligenceCenterPage';

export const metadata: Metadata = {
  title: 'Béisbol | Sportiva24',
  description: 'Centro de Inteligencia de béisbol en Sportiva24.',
};

const baseballContent: IntelligenceCenterContent = {
  hero: {
    badge: 'Centro de inteligencia Sportiva24',
    title: 'BÉISBOL',
    subtitle: 'Toda la inteligencia del béisbol mundial impulsada por métricas avanzadas y contexto de juego.',
    description: 'Modelos de OPS, pitcheo, bullpen y contacto fuerte para seguir MLB y torneos internacionales con experiencia editorial premium.',
    primaryCta: { label: 'Ver análisis', href: '/analisis' },
    secondaryCta: { label: 'Últimas noticias', href: '/noticias' },
    image: { src: '/beisbol/hero-intelligence-baseball.svg', alt: 'Visual premium de béisbol, inteligencia artificial y análisis de datos', width: 1200, height: 920 },
  },
  leagues: { intro: 'Mapa competitivo', title: 'Competiciones principales', helper: 'Cobertura editorial sin filtros activados por ahora.', chipLabel: 'Liga', items: [
    { name: 'MLB', badge: 'MLB' }, { name: 'AL East', badge: 'ALE' }, { name: 'NL West', badge: 'NLW' }, { name: 'World Series', badge: 'WS' }, { name: 'Wild Card', badge: 'WC' }, { name: 'Spring Training', badge: 'SPR' }, { name: 'Serie del Caribe', badge: 'CAR' }, { name: 'WBC', badge: 'WBC' },
  ] },
  matches: { intro: 'Inteligencia de partidos', title: 'Partidos destacados', ctaLabel: 'Ver agenda completa', ctaHref: '/match', items: [
    { competition: 'MLB', time: 'Hoy, 19:10', status: 'EN VIVO', team1: 'Yankees', team1Logo: '/icons/baseball-premium.svg', team2: 'Red Sox', team2Logo: '/icons/baseball-premium.svg', s24Index: 90, confidence: 'Alta', probability: 57, slug: 'yankees-redsox' },
    { competition: 'MLB', time: 'Hoy, 21:00', status: 'PROXIMO', team1: 'Dodgers', team1Logo: '/icons/baseball-premium.svg', team2: 'Padres', team2Logo: '/icons/baseball-premium.svg', s24Index: 91, confidence: 'Alta', probability: 59, slug: 'dodgers-padres' },
    { competition: 'MLB', time: 'Mañana, 18:30', status: 'PROXIMO', team1: 'Astros', team1Logo: '/icons/baseball-premium.svg', team2: 'Rangers', team2Logo: '/icons/baseball-premium.svg', s24Index: 88, confidence: 'Media', probability: 52, slug: 'astros-rangers' },
    { competition: 'MLB', time: 'Viernes, 20:00', status: 'PROXIMO', team1: 'Braves', team1Logo: '/icons/baseball-premium.svg', team2: 'Phillies', team2Logo: '/icons/baseball-premium.svg', s24Index: 87, confidence: 'Media', probability: 51, slug: 'braves-phillies' },
  ] },
  analysis: { intro: 'Inteligencia editorial', title: 'Últimos análisis', description: 'Piezas construidas con datos de ejemplo para presentar la plantilla editorial del futuro centro de inteligencia de béisbol.', items: [
    { category: 'Modelo ofensivo', date: '5 julio 2026', title: 'Dodgers maximizan valor cuando atacan pitcheos tempranos en cuenta', excerpt: 'El modelo cruza swing temprano, hard-hit rate y calidad de contacto para aislar ventaja ofensiva real.', teams: [{ name: 'Dodgers', logo: '/icons/baseball-premium.svg' }, { name: 'Padres', logo: '/icons/baseball-premium.svg' }] },
    { category: 'Pitcheo', date: '4 julio 2026', title: 'Yankees reducen daño cuando fuerzan más rodados en turnos largos', excerpt: 'La pieza explica cómo cambia el run prevention cuando sube la mezcla de sinker y slider.', teams: [{ name: 'Yankees', logo: '/icons/baseball-premium.svg' }, { name: 'Red Sox', logo: '/icons/baseball-premium.svg' }] },
    { category: 'Bullpen lab', date: '3 julio 2026', title: 'Astros y Rangers: el partido se inclina en el puente hacia el cerrador', excerpt: 'Los datos de leverage revelan qué brazo genera más valor real en el séptimo y octavo inning.', teams: [{ name: 'Astros', logo: '/icons/baseball-premium.svg' }, { name: 'Rangers', logo: '/icons/baseball-premium.svg' }] },
    { category: 'Power model', date: '2 julio 2026', title: 'Braves vs Phillies: dónde aparece la verdadera amenaza de extrabases', excerpt: 'El análisis combina ángulo de salida, barrel rate y disciplina para estimar producción explosiva.', teams: [{ name: 'Braves', logo: '/icons/baseball-premium.svg' }, { name: 'Phillies', logo: '/icons/baseball-premium.svg' }] },
  ] },
  news: { intro: 'Mesa en vivo', title: 'Noticias', ctaLabel: 'Abrir sala de noticias', ctaHref: '/noticias', items: [
    { category: 'MLB', date: 'Hace 1 hora', title: 'Dodgers llegan con mejor proyección ofensiva frente a bullpens medios', excerpt: 'La combinación de disciplina y contacto fuerte eleva su expectativa por entrada.', team: { name: 'Dodgers', badge: 'LAD' } },
    { category: 'AL East', date: 'Hace 2 horas', title: 'Yankees protegen mejor la zona interna y reducen ponches mirando', excerpt: 'Los ajustes recientes muestran una tendencia positiva en conteos adversos.', team: { name: 'Yankees', badge: 'NYY' } },
    { category: 'NL East', date: 'Hoy', title: 'Phillies ganan valor cuando su bullpen entra con ventaja corta', excerpt: 'El leverage reciente refuerza un cierre más estable que el promedio de liga.', team: { name: 'Phillies', badge: 'PHI' } },
  ] },
  premium: { intro: 'Espacio premium', title: 'Espacio premium integrado en el flujo editorial', description: 'Espacio elegante para patrocinadores de alto valor, pensado para convivir con contenido analítico sin romper el tono tecnológico de la página.', badge: 'Sportiva24 x Marca', headline: 'Integración premium inteligente', subheadline: 'Formato adaptable para patrocinios estratégicos' },
  ranking: { intro: 'Índice de poder S24', title: 'Ranking IA', items: [
    { name: 'Dodgers', score: 90 }, { name: 'Yankees', score: 89 }, { name: 'Braves', score: 88 }, { name: 'Phillies', score: 87 }, { name: 'Astros', score: 86 }, { name: 'Rangers', score: 85 }, { name: 'Padres', score: 84 }, { name: 'Orioles', score: 83 }, { name: 'Mariners', score: 82 }, { name: 'Red Sox', score: 81 },
  ] },
  events: { intro: 'Inteligencia de calendario', title: 'Próximos eventos', calendarLabel: 'Calendario de ejemplo', items: [
    { day: '05', month: 'JUL', title: 'Yankees vs Red Sox', time: '19:10 ET', note: 'Previo de abridores y leverage bullpen' }, { day: '06', month: 'JUL', title: 'Dodgers vs Padres', time: '21:00 ET', note: 'Modelo de poder ofensivo y matchups' }, { day: '07', month: 'JUL', title: 'Astros vs Rangers', time: '18:30 ET', note: 'Lectura de disciplina y contacto' }, { day: '08', month: 'JUL', title: 'Braves vs Phillies', time: '20:00 ET', note: 'Escenarios de run creation y cierre' },
  ] },
  newsletter: { intro: 'Boletín', title: 'Recibe inteligencia exclusiva cada semana', description: 'Resumen editorial, señales del modelo y las historias que realmente importan para seguir el béisbol con más contexto.', emailPlaceholder: 'Tu email', buttonLabel: 'Suscribirme' },
};

export default function BeisbolPage() {
  return <IntelligenceCenterPage content={baseballContent} />;
}
