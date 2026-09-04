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
  'real-madrid-barcelona': {
    slug: 'real-madrid-barcelona',
    competition: 'UEFA CHAMPIONS LEAGUE',
    homeTeam: 'Real Madrid',
    awayTeam: 'Barcelona',
    time: 'Hoy, 21:00',
    status: 'PRÓXIMO',
    s24Index: 91,
    confidence: 'Alta',
    probability: 72,
    aiSummary: `Real Madrid llega en excelente momento de forma con una tasa de conversión del 68% en los últimos 5 partidos. Barcelona mantiene solidez defensiva pero ha mostrado inconsistencia en ataque. El modelo S24 analiza 450+ variables incluyendo forma reciente, duelos directos históricos, estado de lesiones y dinámicas tácticas. La probabilidad de victoria del local (72%) se fortalece considerando el factor cancha y el ranking ELO actual.`,
    factors: [
      { icon: '📈', title: 'Forma reciente',      subtitle: 'Últimos 5 partidos',        description: 'Real Madrid: 4V-1D en últimos 5. Barcelona: 3V-2D. Ventaja claros para el local.' },
      { icon: '⚽', title: 'xG (Expected Goals)',  subtitle: 'Goles esperados',           description: 'Real Madrid: 2.8 xG promedio. Barcelona: 1.9 xG promedio. Diferencia significativa en creación.' },
      { icon: '🏥', title: 'Lesiones',             subtitle: 'Disponibilidad',            description: 'Real Madrid: Sin bajas relevantes. Barcelona: 2 laterales fuera. Impacto medio en rendimiento.' },
      { icon: '🏟️', title: 'Localía',              subtitle: 'Rendimiento en casa',       description: 'Real Madrid en casa: 78% de efectividad. Barcelona fuera: 52% de efectividad. Factor crítico.' },
      { icon: '🎯', title: 'Ranking ELO',          subtitle: 'ELO actual',                description: 'Real Madrid: 1.847. Barcelona: 1.792. Diferencia de 55 puntos a favor del visitante.' },
      { icon: '📊', title: 'Historial',            subtitle: 'Enfrentamientos directos',  description: 'Últimos 5 enfrentamientos: 3V-1E-1D Real Madrid. Dominio histórico del local.' },
      { icon: '⚡', title: 'Fatiga',               subtitle: 'Carga de partidos',         description: 'Real Madrid: 6 días de descanso. Barcelona: 4 días. Recuperación óptima para visitante.' },
      { icon: '💰', title: 'Valor de mercado',     subtitle: 'Valores de plantilla',      description: 'Real Madrid: €750M. Barcelona: €680M. Diferencia de €70M en favor del local.' },
      { icon: '📈', title: 'Tendencia ofensiva',   subtitle: 'Producción de goles',       description: 'Real Madrid: 3.1 goles promedio últimas 5 jornadas. Tendencia alcista en eficiencia de remate.' },
    ],
    conclusion: `Análisis integral: Real Madrid emerge como claro favorito con confluencia de factores positivos. La combinación de forma reciente, ventaja táctica local, ranking superior e historial favorable genera probabilidad elevada (72%). Barcelona presenta riesgos defensivos pero mantiene capacidad de sorpresa. Recomendación: Seguimiento en tiempo real de alineaciones confirmadas.`,
  },
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
  'real-madrid-manchester-city': {
    slug: 'real-madrid-manchester-city',
    competition: 'UEFA CHAMPIONS LEAGUE',
    homeTeam: 'Real Madrid',
    awayTeam: 'Manchester City',
    time: 'Hoy, 21:00',
    status: 'PRÓXIMO',
    s24Index: 94,
    confidence: 'Alta',
    probability: 67,
    aiSummary: `Cruce de máxima exigencia entre dos estructuras de élite. Real Madrid combina profundidad y golpeo en ventaja; Manchester City sostiene control territorial y ritmo de posesión alto.`,
    factors: [
      { icon: '📈', title: 'Forma reciente', subtitle: 'Últimos 5 partidos', description: 'Ambos llegan con rendimiento alto y margen mínimo entre bloques.' },
      { icon: '⚽', title: 'Producción ofensiva', subtitle: 'Volumen y calidad', description: 'El modelo detecta amenaza elevada de ambos en zonas de finalización.' },
      { icon: '🏟️', title: 'Localía', subtitle: 'Impacto contextual', description: 'El factor local mejora agresividad de presión y gestión emocional del tramo final.' },
      { icon: '🎯', title: 'Duelo táctico', subtitle: 'Estructuras de presión', description: 'La clave está en superar primera línea y controlar la segunda jugada.' },
      { icon: '⚡', title: 'Ritmo', subtitle: 'Transiciones', description: 'Escenario propenso a cambios de dinámica por pérdidas en carril central.' },
    ],
    conclusion: `Partido de margen corto. La ventaja local es relevante, pero la gestión de transiciones decidirá la probabilidad final en vivo.`,
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
  'barcelona-atletico-madrid': {
    slug: 'barcelona-atletico-madrid',
    competition: 'LALIGA',
    homeTeam: 'Barcelona',
    awayTeam: 'Atlético Madrid',
    time: 'Hoy, 19:45',
    status: 'EN VIVO',
    s24Index: 91,
    confidence: 'Alta',
    probability: 62,
    aiSummary: `Barcelona busca superioridad en circulación y pausas largas. Atlético compite desde bloque compacto y agresividad en transición.`,
    factors: [
      { icon: '📈', title: 'Control territorial', subtitle: 'Altura media', description: 'Barcelona domina campo rival durante fases sostenidas.' },
      { icon: '⚽', title: 'Transición ofensiva', subtitle: 'Ataque rápido', description: 'Atlético genera peligro cuando roba y acelera en 3 toques o menos.' },
      { icon: '🏟️', title: 'Contexto local', subtitle: 'Ritmo ambiental', description: 'El entorno local empuja volumen ofensivo y recuperaciones altas.' },
      { icon: '🎯', title: 'Duelos clave', subtitle: 'Carril interior', description: 'La ocupación del pasillo interior define la calidad de llegadas.' },
      { icon: '⚡', title: 'Gestión final', subtitle: 'Últimos 20 min', description: 'El desgaste y cambios tácticos moverán la probabilidad final.' },
    ],
    conclusion: `Escenario intenso y de mucha lectura táctica. La eficacia en áreas decide un partido de alta complejidad.`,
  },
  'inter-juventus': {
    slug: 'inter-juventus',
    competition: 'SERIE A',
    homeTeam: 'Inter',
    awayTeam: 'Juventus',
    time: 'Domingo, 20:00',
    status: 'PRÓXIMO',
    s24Index: 87,
    confidence: 'Media',
    probability: 54,
    aiSummary: `Choque de estructura y detalle: Inter intenta superioridades por fuera; Juventus prioriza control de riesgo y respuesta directa.`,
    factors: [
      { icon: '📈', title: 'Racha reciente', subtitle: 'Rendimiento', description: 'Paridad competitiva con pequeñas ventajas en volumen local.' },
      { icon: '⚽', title: 'Calidad de ocasión', subtitle: 'xG situacional', description: 'Inter genera más secuencias largas; Juventus optimiza transiciones.' },
      { icon: '🏥', title: 'Carga física', subtitle: 'Rotación', description: 'La disponibilidad de mediocampo puede condicionar ritmo de juego.' },
      { icon: '🎯', title: 'Duelo estratégico', subtitle: 'Bloque medio', description: 'La batalla por segundas jugadas será crítica para dominar contexto.' },
      { icon: '⚡', title: 'Riesgo final', subtitle: 'Último tercio', description: 'Probable cierre ajustado con impacto alto del balón parado.' },
    ],
    conclusion: `Partido de equilibrio estructural. Probabilidad abierta con ligera inclinación local por volumen y localía.`,
  },
};
