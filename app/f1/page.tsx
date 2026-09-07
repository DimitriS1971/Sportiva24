import type { Metadata } from 'next';

import IntelligenceCenterPage, { type IntelligenceCenterContent } from '@/app/components/IntelligenceCenterPage';

export const metadata: Metadata = {
  title: 'F1 | Sportiva24',
  description: 'Centro de Inteligencia de Fórmula 1 en Sportiva24.',
};

const f1Content: IntelligenceCenterContent = {
  hero: {
    badge: 'Centro de inteligencia Sportiva24',
    title: 'F1',
    subtitle: 'Toda la inteligencia de la Fórmula 1 impulsada por telemetría, estrategia y modelos predictivos.',
    description: 'Lectura de ritmo, degradación, ventanas de pit y simulaciones de carrera para seguir la parrilla con contexto analítico premium.',
    primaryCta: { label: 'Ver análisis', href: '/analisis' },
    secondaryCta: { label: 'Últimas noticias', href: '/noticias' },
    image: { src: '/hero/hero-f1.png', alt: 'Visual premium de Fórmula 1, inteligencia artificial y análisis de datos', width: 1200, height: 920 },
  },
  leagues: {
    intro: 'Mapa competitivo', title: 'Competiciones principales', helper: 'Cobertura editorial sin filtros activados por ahora.', chipLabel: 'Serie', items: [
      { name: 'Fórmula 1', badge: 'F1' }, { name: 'Sprint', badge: 'SPR' }, { name: 'Constructores', badge: 'CON' }, { name: 'Pilotos', badge: 'DRV' }, { name: 'Mónaco GP', badge: 'MON' }, { name: 'Silverstone', badge: 'SIL' }, { name: 'Spa', badge: 'SPA' }, { name: 'Suzuka', badge: 'SUZ' },
    ],
  },
  matches: {
    intro: 'Inteligencia de duelos', title: 'Duelo destacado', ctaLabel: 'Ver agenda completa', ctaHref: '/match', items: [
      { competition: 'FÓRMULA 1', time: 'Hoy, 15:00', status: 'PROXIMO', team1: 'Max Verstappen', team1Logo: '/icons/f1-premium.svg', team2: 'Lando Norris', team2Logo: '/icons/f1-premium.svg', s24Index: 96, confidence: 'Alta', probability: 59, slug: 'verstappen-norris' },
      { competition: 'FÓRMULA 1', time: 'Hoy, 15:00', status: 'PROXIMO', team1: 'McLaren', team1Logo: '/icons/f1-premium.svg', team2: 'Ferrari', team2Logo: '/icons/f1-premium.svg', s24Index: 94, confidence: 'Alta', probability: 57, slug: 'mclaren-ferrari' },
      { competition: 'SPRINT', time: 'Mañana, 11:30', status: 'EN VIVO', team1: 'Oscar Piastri', team1Logo: '/icons/f1-premium.svg', team2: 'Charles Leclerc', team2Logo: '/icons/f1-premium.svg', s24Index: 90, confidence: 'Media', probability: 53, slug: 'piastri-leclerc' },
      { competition: 'FÓRMULA 1', time: 'Domingo, 14:00', status: 'PROXIMO', team1: 'Mercedes', team1Logo: '/icons/f1-premium.svg', team2: 'Red Bull', team2Logo: '/icons/f1-premium.svg', s24Index: 89, confidence: 'Media', probability: 51, slug: 'mercedes-redbull' },
    ],
  },
  analysis: {
    intro: 'Inteligencia editorial', title: 'Últimos análisis', description: 'Piezas construidas con datos de ejemplo para presentar la plantilla editorial del futuro centro de inteligencia de F1.', items: [
      { category: 'Race pace', date: '5 julio 2026', title: 'McLaren gana valor cuando alarga la primera vida del neumático medio', excerpt: 'La simulación de stint muestra que el coche sostiene ritmo competitivo con menor degradación en aire sucio.', teams: [{ name: 'McLaren', logo: '/icons/f1-premium.svg' }, { name: 'Ferrari', logo: '/icons/f1-premium.svg' }] },
      { category: 'Telemetría', date: '4 julio 2026', title: 'Verstappen vs Norris: dónde se abre la vuelta en fase de tracción', excerpt: 'El análisis cruza velocidad mínima, entrega de potencia y ángulo de volante para medir ventaja real por sector.', teams: [{ name: 'Max Verstappen', logo: '/icons/f1-premium.svg' }, { name: 'Lando Norris', logo: '/icons/f1-premium.svg' }] },
      { category: 'Pit strategy', date: '3 julio 2026', title: 'Ferrari mejora sus escenarios cuando anticipa una vuelta el undercut', excerpt: 'Los datos muestran que la ventana de parada temprana gana valor con tráfico controlado y neumático fresco.', teams: [{ name: 'Ferrari', logo: '/icons/f1-premium.svg' }, { name: 'Mercedes', logo: '/icons/f1-premium.svg' }] },
      { category: 'Sprint model', date: '2 julio 2026', title: 'Piastri y Leclerc: cuánto pesa la salida en carreras cortas', excerpt: 'El modelo pondera launch, protección de neumáticos y probabilidad de adelantamiento en los tres primeros giros.', teams: [{ name: 'Oscar Piastri', logo: '/icons/f1-premium.svg' }, { name: 'Charles Leclerc', logo: '/icons/f1-premium.svg' }] },
    ],
  },
  news: {
    intro: 'Mesa en vivo', title: 'Noticias', ctaLabel: 'Abrir sala de noticias', ctaHref: '/noticias', items: [
      { category: 'Parrilla', date: 'Hace 1 hora', title: 'McLaren llega con mejor lectura de stint largo para Silverstone', excerpt: 'Los reportes internos señalan una degradación más contenida en tanda larga y mejor gestión térmica.', team: { name: 'McLaren', badge: 'MCL' } },
      { category: 'Estrategia', date: 'Hace 2 horas', title: 'Ferrari estudia ampliar su ventana de parada según tráfico estimado', excerpt: 'El objetivo es proteger posición sin comprometer ritmo de salida con goma dura.', team: { name: 'Ferrari', badge: 'FER' } },
      { category: 'Pilotos', date: 'Hoy', title: 'Norris mejora consistencia en clasificación y reduce pérdida en curva lenta', excerpt: 'Los datos de telemetría muestran una tendencia sólida vuelta a vuelta.', team: { name: 'Norris', badge: 'NOR' } },
    ],
  },
  premium: { intro: 'Espacio premium', title: 'Espacio premium integrado en el flujo editorial', description: 'Espacio elegante para patrocinadores de alto valor, pensado para convivir con contenido analítico sin romper el tono tecnológico de la página.', badge: 'Sportiva24 x Marca', headline: 'Integración premium inteligente', subheadline: 'Formato adaptable para patrocinios estratégicos' },
  ranking: { intro: 'Índice de poder S24', title: 'Ranking IA', items: [
    { name: 'McLaren', score: 96 }, { name: 'Max Verstappen', score: 95 }, { name: 'Ferrari', score: 93 }, { name: 'Lando Norris', score: 92 }, { name: 'Oscar Piastri', score: 91 }, { name: 'Mercedes', score: 89 }, { name: 'Charles Leclerc', score: 88 }, { name: 'George Russell', score: 87 }, { name: 'Red Bull', score: 86 }, { name: 'Lewis Hamilton', score: 85 },
  ] },
  events: { intro: 'Inteligencia de calendario', title: 'Próximos eventos', calendarLabel: 'Calendario de ejemplo', items: [
    { day: '05', month: 'JUL', title: 'Verstappen vs Norris', time: '15:00 CET', note: 'Previo de ritmo y clasificación' }, { day: '06', month: 'JUL', title: 'Sprint de Silverstone', time: '11:30 CET', note: 'Modelo de salida y gestión de neumáticos' }, { day: '07', month: 'JUL', title: 'McLaren vs Ferrari', time: '14:00 CET', note: 'Simulación de stint y undercut' }, { day: '08', month: 'JUL', title: 'Mercedes vs Red Bull', time: '13:00 CET', note: 'Escenarios de carrera con safety car' },
  ] },
  newsletter: { intro: 'Boletín', title: 'Recibe inteligencia exclusiva cada semana', description: 'Resumen editorial, señales del modelo y las historias que realmente importan para seguir la F1 con más contexto.', emailPlaceholder: 'Tu email', buttonLabel: 'Suscribirme' },
};

export default function F1Page() {
  return <IntelligenceCenterPage content={f1Content} />;
}
