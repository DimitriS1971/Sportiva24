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
    id: "2",
    slug: "nba-draft-analisis-statistical",
    title: "NBA Draft 2026: Análisis estadístico de los mejores prospects",
    excerpt: "Evaluamos el S24 Index de los jugadores seleccionados en el draft bajo perspectiva de inteligencia artificial.",
    content: "El draft NBA 2026 ha traído algunos de los prospects más prometedores de los últimos años...",
    image: "https://picsum.photos/800/400?random=2",
    category: "Basketball",
    date: "2 de julio de 2026",
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
    id: "5",
    slug: "la-lakers-lesiones-impacto",
    title: "Los Angeles Lakers: Impacto de lesiones en proyecciones de temporada",
    excerpt: "Modelo predictivo sobre cómo las ausencias afectarán el rendimiento del equipo en los próximos meses.",
    content: "Las lesiones han sido un factor determinante en el desempeño histórico de los Lakers en 2026...",
    image: "https://picsum.photos/800/400?random=5",
    category: "Basketball",
    date: "25 de junio de 2026",
  },
  {
    id: "6",
    slug: "inteligencia-artificial-deportes",
    title: "IA en el deporte: Revolucionando el análisis predictivo",
    excerpt: "Cómo los modelos de machine learning están transformando la manera en que entendemos el rendimiento deportivo.",
    content: "La inteligencia artificial ya no es ciencia ficción en el análisis deportivo. Cada día genera insights más precisos...",
    image: "https://picsum.photos/800/400?random=6",
    category: "Tecnología",
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
