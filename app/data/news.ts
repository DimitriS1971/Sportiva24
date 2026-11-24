export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  date: string;
  featured?: boolean;
}

export const newsData: NewsArticle[] = [
  {
    id: "1",
    slug: "real-madrid-fichajes-2026",
    title: "Real Madrid acelera sus movimientos en el mercado: Mbappé en cifras",
    excerpt: "Análisis del impacto económico y deportivo de los últimos fichajes madridistas en la temporada 2025-26.",
    content: "Real Madrid ha realizado movimientos estratégicos en el mercado de fichajes que transformarán su estructura deportiva...",
    image: "https://picsum.photos/800/400?random=1",
    category: "Fútbol",
    date: "3 de julio de 2026",
    featured: true,
  },
  {
    id: "3",
    slug: "premier-league-estadisticas-junio",
    title: "Premier League: Comparativa de desempeño de los 20 equipos",
    excerpt: "Datos de xG, tasa de posesión y eficiencia defensiva en lo que va de la temporada.",
    content: "La temporada 2025-26 de la Premier League ha presentado una competencia inusual entre los grandes clubes...",
    image: "https://picsum.photos/800/400?random=3",
    category: "Fútbol",
    date: "30 de junio de 2026",
  },
  {
    id: "4",
    slug: "champions-league-sistema-s24",
    title: "Cómo funciona el S24 Index: Modelo de análisis de Sportiva24",
    excerpt: "Explicamos los 450+ variables que alimentan nuestro modelo de predicción de Champions League.",
    content: "El S24 Index es el corazón de la plataforma Sportiva24. Combina datos históricos, métricas en tiempo real...",
    image: "https://picsum.photos/800/400?random=4",
    category: "Análisis",
    date: "28 de junio de 2026",
  },
  {
    id: "6",
    slug: "inteligencia-artificial-analisis-futbol",
    title: "Cómo la inteligencia artificial aporta contexto al análisis de fútbol",
    excerpt: "Los modelos ayudan a ordenar datos de rendimiento y a detectar patrones sin sustituir el contexto de cada partido.",
    content: "La inteligencia artificial puede comparar señales de rendimiento, forma reciente y contexto competitivo. En el análisis de fútbol, estas herramientas sirven para plantear mejores preguntas y explicar patrones; no reemplazan los datos confirmados ni garantizan resultados.",
    image: "https://picsum.photos/800/400?random=6",
    category: "Análisis",
    date: "22 de junio de 2026",
  },
  {
    id: "7",
    slug: "barcelona-recuperacion-potencial",
    title: "Barcelona 2026: Recuperación, potencial y desafíos próximos",
    excerpt: "Análisis de la situación actual del FC Barcelona y proyecciones para la próxima temporada.",
    content: "Barcelona ha pasado por una transformación importante. Nuestro análisis examina qué esperar...",
    image: "https://picsum.photos/800/400?random=7",
    category: "Fútbol",
    date: "20 de junio de 2026",
  },
  {
    id: "8",
    slug: "estadisticas-xg-futbol-moderno",
    title: "xG en el fútbol moderno: Más allá de los goles",
    excerpt: "Por qué el Expected Goals es la métrica más importante para entender el desempeño ofensivo real.",
    content: "El xG revolucionó la manera en que los analistas entienden el fútbol. Ya no es solo sobre quién marca...",
    image: "https://picsum.photos/800/400?random=8",
    category: "Análisis",
    date: "18 de junio de 2026",
  },
];
