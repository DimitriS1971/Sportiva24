export interface MatchData {
  slug: string;
  competition: string;
  homeTeam: string;
  awayTeam: string;
  time: string;
  status: 'EN VIVO' | 'PRÓXIMO';
  s24Index: number;
  confidence: 'Alta' | 'Media' | 'Baja';
  probability: number;
  aiSummary: string;
  factors: Array<{
    icon: string;
    title: string;
    subtitle: string;
    description: string;
  }>;
  conclusion: string;
}

export const matchesData: Record<string, MatchData> = {
  'lakers-celtics': {
    slug: 'lakers-celtics',
    competition: 'NBA',
    homeTeam: 'Los Angeles Lakers',
    awayTeam: 'Boston Celtics',
    time: 'Hoy, 20:30',
    status: 'EN VIVO',
    s24Index: 84,
    confidence: 'Alta',
    probability: 68,
    aiSummary: `Los Lakers muestran ritmo defensivo superior en la segunda mitad. Boston Celtics aprovecha espacios en transición pero sufre presión en el perímetro. El modelo S24 detecta variabilidad en eficiencia ofensiva de ambos equipos. Lakers mantiene ventaja psicológica local con 68% de probabilidad. Celtics debe mejorar precisión en tiros de tres puntos (31% actual).`,
    factors: [
      { icon: '📈', title: 'Forma reciente',      subtitle: 'Últimos 5 partidos',    description: 'Lakers: 3V-2D últimos 5. Celtics: 4V-1D. Superioridad slight para Boston.' },
      { icon: '⚽', title: 'Eficiencia ofensiva',  subtitle: 'Puntos por partido',    description: 'Lakers: 108.5 PPG. Celtics: 112.3 PPG. Boston lidera en scoring promedio.' },
      { icon: '🏥', title: 'Disponibilidad',       subtitle: 'Estado jugadores',      description: 'Lakers: LeBron James 100% condición. Celtics: Jaylen Brown con molestia menor.' },
      { icon: '🏟️', title: 'Ventaja de casa',      subtitle: 'Win rate local',        description: 'Lakers en casa: 56% Win Rate. Celtics fuera: 54% Win Rate. Diferencia mínima.' },
      { icon: '🎯', title: 'Rating defensivo',     subtitle: 'Puntos encajados',      description: 'Lakers: 105.8 DRtg. Celtics: 103.2 DRtg. Boston más defensivamente sólido.' },
      { icon: '📊', title: 'Duelo directo',        subtitle: 'Historial reciente',    description: 'Últimos 5 enfrentamientos: 3V-2D Celtics. Boston domina el historial reciente.' },
      { icon: '⚡', title: 'Ritmo de juego',       subtitle: 'Tempo y posesión',      description: 'Lakers: 99.2 PPP. Celtics: 101.5 PPP. Tempo similar, ambos equipos adaptables.' },
      { icon: '💰', title: 'Valor de nómina',      subtitle: 'Inversión plantilla',   description: 'Lakers: $183M total. Celtics: $171M total. Lakers con inversión mayor.' },
      { icon: '📈', title: 'Tendencia ofensiva',   subtitle: 'Producción ofensiva',   description: 'Lakers: promedio 116 pts en últimos 3 partidos. Racha anotadora superior.' },
    ],
    conclusion: `Análisis integral: Contienda cerrada con ligera ventaja para Lakers en casa (68%). Boston mantiene fortaleza defensiva y consistencia ofensiva. Celtics puede sorprender si mantiene precisión desde el perímetro. Recomendación: Seguimiento en tiempo real de dinámicas defensivas y fouls técnicos.`,
  },
  'manchester-city-arsenal': {
    slug: 'manchester-city-arsenal',
    competition: 'PREMIER LEAGUE',
    homeTeam: 'Manchester City',
    awayTeam: 'Arsenal',
    time: 'Hoy, 20:00',
    status: 'PRÓXIMO',
    s24Index: 87,
    confidence: 'Media',
    probability: 55,
    aiSummary: `Manchester City presenta variabilidad táctica reciente. Arsenal llega con solidez defensiva mejorada. Ambos equipos compiten por liderato en Premier League. El modelo S24 muestra incertidumbre por cambios en alineaciones potenciales. Probabilidad de victoria City (55%) refleja equilibrio competitivo. Arsenal puede replicar estructuras defensivas exitosas de encuentros previos.`,
    factors: [
      { icon: '📈', title: 'Forma reciente',          subtitle: 'Últimos 5 partidos',      description: 'Man City: 3V-2D últimos 5. Arsenal: 4V-1D. Arsenal en mejor racha.' },
      { icon: '⚽', title: 'Chances esperadas (xG)',  subtitle: 'Goles esperados',           description: 'Man City: 2.5 xG promedio. Arsenal: 1.8 xG promedio. City crea más oportunidades.' },
      { icon: '🏥', title: 'Lesiones',               subtitle: 'Disponibilidad',            description: 'Man City: Rodri baja confirmada. Arsenal: Tomiyasu cautela. Impactos moderados.' },
      { icon: '🏟️', title: 'Localía',                subtitle: 'Rendimiento en casa',       description: 'Man City en casa: 72% efectividad. Arsenal fuera: 58% efectividad. Ventaja City.' },
      { icon: '🎯', title: 'Posesión media',         subtitle: 'Control del balón',         description: 'Man City: 62% posesión. Arsenal: 48% posesión. Diferencia táctica clara.' },
      { icon: '📊', title: 'Historial reciente',     subtitle: 'Enfrentamientos recientes', description: 'Últimos 5 enfrentamientos: 2V-2E-1D. Equilibrio histórico entre ambos.' },
      { icon: '⚡', title: 'Precisión de pases',     subtitle: 'Pases completados',         description: 'Man City: 88% completions. Arsenal: 83% completions. City más preciso.' },
      { icon: '💰', title: 'Valor de mercado',       subtitle: 'Valores de plantilla',      description: 'Man City: €1.2B squad. Arsenal: €980M squad. City inversión superior.' },
      { icon: '📈', title: 'Tendencia ofensiva',     subtitle: 'Producción de goles',       description: 'Man City: 2.3 goles promedio últimas 5 jornadas. Incertidumbre post baja de Rodri.' },
    ],
    conclusion: `Análisis integral: Encuentro equilibrado con City favorito marginal (55%). Baja de Rodri genera incertidumbre. Arsenal aprovecha defensiva renovada. Confianza media (no alta) refleja incertidumbre táctica. Recomendación: Seguimiento de alineaciones confirmadas y ajustes tácticos pre-partido.`,
  },
  'arsenal-chelsea': {
    slug: 'arsenal-chelsea',
    competition: 'PREMIER LEAGUE',
    homeTeam: 'Arsenal',
    awayTeam: 'Chelsea',
    time: 'Mañana, 18:30',
    status: 'PRÓXIMO',
    s24Index: 88,
    confidence: 'Media',
    probability: 58,
    aiSummary: `Derbi con componente táctico fuerte: Arsenal prioriza ocupación de intervalos y Chelsea busca daño en aceleraciones tras recuperación.`,
    factors: [
      { icon: '📈', title: 'Momentum', subtitle: 'Forma de bloque', description: 'Arsenal muestra mayor estabilidad de rendimiento en fase reciente.' },
      { icon: '⚽', title: 'Eficiencia', subtitle: 'Conversión', description: 'Chelsea necesita elevar acierto en último tercio para equilibrar escenario.' },
      { icon: '🏥', title: 'Disponibilidad', subtitle: 'Rotación', description: 'La profundidad de plantilla puede alterar el partido en segunda mitad.' },
      { icon: '🎯', title: 'Balón parado', subtitle: 'Peso estratégico', description: 'Se proyecta incidencia alta en corners y faltas laterales.' },
      { icon: '⚡', title: 'Presión', subtitle: 'Recuperación alta', description: 'El equipo que sostenga mejor la presión tras pérdida tendrá ventaja.' },
    ],
    conclusion: `Ventaja ligera local con incertidumbre media. El control emocional del tramo inicial será determinante.`,
  },
};
