import type { Metadata } from 'next';

import IntelligenceCenterPage, { type IntelligenceCenterContent } from '@/app/components/IntelligenceCenterPage';

export const metadata: Metadata = {
  title: 'Ciclismo | Sportiva24',
  description: 'Centro de Inteligencia de ciclismo en Sportiva24.',
};

const cyclingContent: IntelligenceCenterContent = {
  hero: {
    badge: 'Centro de inteligencia Sportiva24',
    title: 'Ciclismo',
    subtitle: 'Toda la inteligencia del ciclismo mundial impulsada por potencia, perfil de etapa y lectura táctica.',
    description: 'Modelos de fatiga, watts/kg y escenarios de ataque para seguir grandes vueltas, clásicas y contrarreloj con contexto premium.',
    primaryCta: { label: 'Ver análisis', href: '/analisis' },
    secondaryCta: { label: 'Últimas noticias', href: '/noticias' },
    image: { src: '/hero/hero-ciclismo.png', alt: 'Visual premium de ciclismo, inteligencia artificial y análisis de datos', width: 1200, height: 920 },
  },
  leagues: { intro: 'Mapa competitivo', title: 'Competiciones principales', helper: 'Cobertura editorial sin filtros activados por ahora.', chipLabel: 'Prueba', items: [
    { name: 'Tour de France', badge: 'TDF' }, { name: 'Giro d’Italia', badge: 'GIR' }, { name: 'La Vuelta', badge: 'VUE' }, { name: 'París-Roubaix', badge: 'PRX' }, { name: 'Lieja', badge: 'LIE' }, { name: 'Milán-San Remo', badge: 'MSR' }, { name: 'Dauphiné', badge: 'DAU' }, { name: 'Contrarreloj', badge: 'ITT' },
  ] },
  matches: { intro: 'Inteligencia de duelos', title: 'Duelo destacado', ctaLabel: 'Ver agenda completa', ctaHref: '/match', items: [
    { competition: 'TOUR DE FRANCE', time: 'Hoy, 13:00', status: 'PROXIMO', team1: 'Pogacar', team1Logo: '/icons/cycling-premium.svg', team2: 'Vingegaard', team2Logo: '/icons/cycling-premium.svg', s24Index: 91, confidence: 'Alta', probability: 58, slug: 'pogacar-vingegaard' },
    { competition: 'UCI WORLD TOUR', time: 'Hoy, 15:30', status: 'EN VIVO', team1: 'UAE Team Emirates', team1Logo: '/icons/cycling-premium.svg', team2: 'Visma | Lease a Bike', team2Logo: '/icons/cycling-premium.svg', s24Index: 89, confidence: 'Media', probability: 53, slug: 'uae-visma' },
    { competition: 'CLÁSICAS', time: 'Mañana, 11:00', status: 'PROXIMO', team1: 'Van der Poel', team1Logo: '/icons/cycling-premium.svg', team2: 'Wout van Aert', team2Logo: '/icons/cycling-premium.svg', s24Index: 90, confidence: 'Alta', probability: 55, slug: 'vdp-van-aert' },
    { competition: 'GRAND TOUR', time: 'Viernes, 14:15', status: 'PROXIMO', team1: 'Evenepoel', team1Logo: '/icons/cycling-premium.svg', team2: 'Roglic', team2Logo: '/icons/cycling-premium.svg', s24Index: 87, confidence: 'Media', probability: 51, slug: 'evenepoel-roglic' },
  ] },
  analysis: { intro: 'Inteligencia editorial', title: 'Últimos análisis', description: 'Piezas construidas con datos de ejemplo para presentar la plantilla editorial del futuro centro de inteligencia de ciclismo.', items: [
    { category: 'Modelo de escalada', date: '5 julio 2026', title: 'Pogacar gana más tiempo cuando acelera antes del último kilómetro duro', excerpt: 'El modelo cruza pendiente, potencia normalizada y respuesta del grupo para proyectar gaps en alta montaña.', teams: [{ name: 'Pogacar', logo: '/icons/cycling-premium.svg' }, { name: 'Vingegaard', logo: '/icons/cycling-premium.svg' }] },
    { category: 'Fatiga acumulada', date: '4 julio 2026', title: 'Visma reduce riesgo cuando distribuye esfuerzos en bloque de tres etapas', excerpt: 'La simulación muestra un beneficio claro al repartir ataques y proteger gregarios clave.', teams: [{ name: 'Visma', logo: '/icons/cycling-premium.svg' }, { name: 'UAE', logo: '/icons/cycling-premium.svg' }] },
    { category: 'Clásicas', date: '3 julio 2026', title: 'Van der Poel vs Van Aert: el pavé se define antes del último sector', excerpt: 'Los datos identifican dónde se abre la diferencia real entre potencia, tracción y posicionamiento.', teams: [{ name: 'Van der Poel', logo: '/icons/cycling-premium.svg' }, { name: 'Wout van Aert', logo: '/icons/cycling-premium.svg' }] },
    { category: 'Contrarreloj', date: '2 julio 2026', title: 'Evenepoel optimiza pacing cuando guarda pico de potencia para el cierre', excerpt: 'El modelo compara pacing lineal frente a negativo para estimar tiempo total y exposición al viento.', teams: [{ name: 'Evenepoel', logo: '/icons/cycling-premium.svg' }, { name: 'Roglic', logo: '/icons/cycling-premium.svg' }] },
  ] },
  news: { intro: 'Mesa en vivo', title: 'Noticias', ctaLabel: 'Abrir sala de noticias', ctaHref: '/noticias', items: [
    { category: 'Tour', date: 'Hace 1 hora', title: 'UAE llega con mejor lectura de etapa reina y control de ritmo en puertos', excerpt: 'La estructura de apoyo aparece mejor preparada para gestionar ataques lejanos.', team: { name: 'UAE', badge: 'UAE' } },
    { category: 'Clásicas', date: 'Hace 3 horas', title: 'Van Aert mejora su proyección cuando entra delante al último sector técnico', excerpt: 'Los datos de posicionamiento explican gran parte del diferencial final.', team: { name: 'Visma', badge: 'VIS' } },
    { category: 'ITT', date: 'Hoy', title: 'Evenepoel mantiene tendencia dominante en esfuerzos de alta precisión', excerpt: 'La telemetría comparada refuerza su techo competitivo en cronos largas.', team: { name: 'Soudal', badge: 'SOQ' } },
  ] },
  premium: { intro: 'Espacio premium', title: 'Espacio premium integrado en el flujo editorial', description: 'Espacio elegante para patrocinadores de alto valor, pensado para convivir con contenido analítico sin romper el tono tecnológico de la página.', badge: 'Sportiva24 x Marca', headline: 'Integración premium inteligente', subheadline: 'Formato adaptable para patrocinios estratégicos' },
  ranking: { intro: 'Índice de poder S24', title: 'Ranking IA', items: [
    { name: 'Pogacar', score: 91 }, { name: 'Vingegaard', score: 90 }, { name: 'Van der Poel', score: 89 }, { name: 'Wout van Aert', score: 88 }, { name: 'Evenepoel', score: 87 }, { name: 'Roglic', score: 86 }, { name: 'UAE Team Emirates', score: 85 }, { name: 'Visma | Lease a Bike', score: 84 }, { name: 'Lidl-Trek', score: 83 }, { name: 'INEOS', score: 82 },
  ] },
  events: { intro: 'Inteligencia de calendario', title: 'Próximos eventos', calendarLabel: 'Calendario de ejemplo', items: [
    { day: '05', month: 'JUL', title: 'Pogacar vs Vingegaard', time: '13:00 CET', note: 'Previo de escalada y pacing final' }, { day: '06', month: 'JUL', title: 'UAE vs Visma', time: '15:30 CET', note: 'Lectura de control de pelotón' }, { day: '07', month: 'JUL', title: 'Van der Poel vs Van Aert', time: '11:00 CET', note: 'Modelo de clásicas y sectores decisivos' }, { day: '08', month: 'JUL', title: 'Evenepoel vs Roglic', time: '14:15 CET', note: 'Simulación de crono y potencia' },
  ] },
  newsletter: { intro: 'Boletín', title: 'Recibe inteligencia exclusiva cada semana', description: 'Resumen editorial, señales del modelo y las historias que realmente importan para seguir el ciclismo con más contexto.', emailPlaceholder: 'Tu email', buttonLabel: 'Suscribirme' },
};

export default function CiclismoPage() {
  return <IntelligenceCenterPage content={cyclingContent} />;
}
