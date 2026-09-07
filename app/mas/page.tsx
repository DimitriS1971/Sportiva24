import type { Metadata } from 'next';

import IntelligenceCenterPage, { type IntelligenceCenterContent } from '@/app/components/IntelligenceCenterPage';

export const metadata: Metadata = {
  title: 'Más | Sportiva24',
  description: 'Centro de Inteligencia para deportes menores en Sportiva24.',
};

const moreContent: IntelligenceCenterContent = {
  hero: {
    badge: 'Centro de inteligencia Sportiva24',
    title: 'Más',
    subtitle: 'Un centro para deportes menores con inteligencia editorial, datos mock y cobertura expandida.',
    description: 'Aquí viven los deportes emergentes o de menor cobertura principal, con la misma lógica visual y de análisis del ecosistema Sportiva24.',
    primaryCta: { label: 'Ver análisis', href: '/analisis' },
    secondaryCta: { label: 'Últimas noticias', href: '/noticias' },
    image: { src: '/hero/hero-mas.png', alt: 'Visual premium de deportes menores, inteligencia artificial y análisis de datos', width: 1200, height: 920 },
  },
  leagues: {
    intro: 'Mapa competitivo',
    title: 'Cobertura secundaria',
    helper: 'Cobertura editorial sin filtros activados por ahora.',
    chipLabel: 'Deporte',
    items: [
      { name: 'Pádel', badge: 'PAD' },
      { name: 'Rugby 7s', badge: 'R7' },
      { name: 'Vóley', badge: 'VOL' },
      { name: 'Handball', badge: 'HBL' },
      { name: 'Hockey', badge: 'HOC' },
      { name: 'Atletismo', badge: 'ATL' },
      { name: 'Natación', badge: 'NAT' },
      { name: 'MMA', badge: 'MMA' },
    ],
  },
  matches: {
    intro: 'Inteligencia de eventos',
    title: 'Eventos destacados',
    ctaLabel: 'Ver agenda completa',
    ctaHref: '/match',
    items: [
      { competition: 'PÁDEL', time: 'Hoy, 17:00', status: 'PROXIMO', team1: 'Coello / Tapia', team1Logo: '/icons/more-premium.svg', team2: 'Galán / Chingotto', team2Logo: '/icons/more-premium.svg', s24Index: 89, confidence: 'Alta', probability: 55, slug: 'coello-tapia-galan-chingotto' },
      { competition: 'RUGBY 7S', time: 'Hoy, 19:00', status: 'EN VIVO', team1: 'Argentina 7s', team1Logo: '/icons/more-premium.svg', team2: 'Fiji 7s', team2Logo: '/icons/more-premium.svg', s24Index: 87, confidence: 'Media', probability: 52, slug: 'argentina7s-fiji7s' },
      { competition: 'VOLEY', time: 'Mañana, 18:30', status: 'PROXIMO', team1: 'Italia', team1Logo: '/icons/more-premium.svg', team2: 'Brasil', team2Logo: '/icons/more-premium.svg', s24Index: 88, confidence: 'Alta', probability: 54, slug: 'italia-brasil-voley' },
      { competition: 'MMA', time: 'Sábado, 22:00', status: 'PROXIMO', team1: 'Topuria', team1Logo: '/icons/more-premium.svg', team2: 'Volkanovski', team2Logo: '/icons/more-premium.svg', s24Index: 90, confidence: 'Media', probability: 51, slug: 'topuria-volkanovski' },
    ],
  },
  analysis: {
    intro: 'Inteligencia editorial',
    title: 'Últimos análisis',
    description: 'Piezas construidas con datos de ejemplo para presentar la plantilla editorial del futuro centro de deportes menores.',
    items: [
      { category: 'Pádel pro', date: '5 julio 2026', title: 'Coello y Tapia ganan valor cuando aceleran el punto en transición media', excerpt: 'El modelo detecta qué patrones elevan la presión ofensiva sin exponer la red en exceso.', teams: [{ name: 'Coello / Tapia', logo: '/icons/more-premium.svg' }, { name: 'Galán / Chingotto', logo: '/icons/more-premium.svg' }] },
      { category: 'Rugby 7s', date: '4 julio 2026', title: 'Argentina 7s mejora su proyección al elevar presión tras salida corta', excerpt: 'Los datos muestran más recuperaciones útiles y mejores secuencias de continuidad en campo rival.', teams: [{ name: 'Argentina 7s', logo: '/icons/more-premium.svg' }, { name: 'Fiji 7s', logo: '/icons/more-premium.svg' }] },
      { category: 'Vóley', date: '3 julio 2026', title: 'Italia vs Brasil: la ventaja aparece en la calidad del segundo toque', excerpt: 'El análisis explica cómo cambia la eficiencia de ataque según recepción y distribución.', teams: [{ name: 'Italia', logo: '/icons/more-premium.svg' }, { name: 'Brasil', logo: '/icons/more-premium.svg' }] },
      { category: 'MMA analytics', date: '2 julio 2026', title: 'Topuria y Volkanovski: dónde se decide la pelea antes del segundo round', excerpt: 'La pieza pondera control de distancia, defensa de derribo y volumen limpio conectado.', teams: [{ name: 'Topuria', logo: '/icons/more-premium.svg' }, { name: 'Volkanovski', logo: '/icons/more-premium.svg' }] },
    ],
  },
  news: {
    intro: 'Mesa en vivo',
    title: 'Noticias',
    ctaLabel: 'Abrir sala de noticias',
    ctaHref: '/noticias',
    items: [
      { category: 'Pádel', date: 'Hace 1 hora', title: 'La dupla número uno fortalece su lectura de globo y cierre en la red', excerpt: 'Los reportes recientes indican mayor eficiencia en puntos de intercambio medio.', team: { name: 'Pádel', badge: 'PAD' } },
      { category: 'Rugby 7s', date: 'Hace 2 horas', title: 'Argentina 7s prioriza reinicios más agresivos para recuperar posesión', excerpt: 'El ajuste busca sumar puntos de quiebre sin regalar campo.', team: { name: 'Rugby 7s', badge: 'R7' } },
      { category: 'MMA', date: 'Hoy', title: 'El campamento de Topuria apunta a recortar distancia desde el primer minuto', excerpt: 'La idea es reducir tiempo de lectura y aumentar daño limpio en combinaciones cortas.', team: { name: 'MMA', badge: 'MMA' } },
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
      { name: 'Coello / Tapia', score: 89 },
      { name: 'Argentina 7s', score: 88 },
      { name: 'Italia Vóley', score: 87 },
      { name: 'Topuria', score: 87 },
      { name: 'Galán / Chingotto', score: 86 },
      { name: 'Fiji 7s', score: 85 },
      { name: 'Brasil Vóley', score: 84 },
      { name: 'Volkanovski', score: 83 },
      { name: 'Atletismo Elite', score: 82 },
      { name: 'Natación Sprint', score: 81 },
    ],
  },
  events: {
    intro: 'Inteligencia de calendario',
    title: 'Próximos eventos',
    calendarLabel: 'Calendario de ejemplo',
    items: [
      { day: '05', month: 'JUL', title: 'Coello / Tapia vs Galán / Chingotto', time: '17:00 CET', note: 'Previo de red, bandeja y transición' },
      { day: '06', month: 'JUL', title: 'Argentina 7s vs Fiji 7s', time: '19:00 CET', note: 'Lectura de reinicios y posesión' },
      { day: '07', month: 'JUL', title: 'Italia vs Brasil', time: '18:30 CET', note: 'Modelo de recepción y side-out' },
      { day: '08', month: 'JUL', title: 'Topuria vs Volkanovski', time: '22:00 CET', note: 'Escenarios de striking y control' },
    ],
  },
  newsletter: {
    intro: 'Boletín',
    title: 'Recibe inteligencia exclusiva cada semana',
    description: 'Resumen editorial, señales del modelo y las historias que realmente importan para seguir deportes menores con más contexto.',
    emailPlaceholder: 'Tu email',
    buttonLabel: 'Suscribirme',
  },
};

export default function MasPage() {
  return <IntelligenceCenterPage content={moreContent} />;
}
