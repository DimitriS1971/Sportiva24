export interface BlogArticle {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  readingTime: string;
  sections: Array<{ heading: string; body: string }>;
}

export const blogArticles: BlogArticle[] = [
  {
    slug: 'como-funciona-sportiva24',
    title: 'Cómo funciona Sportiva24',
    excerpt: 'Una mirada clara al sistema que combina datos deportivos, contexto e inteligencia artificial para explicar lo que ocurre en cada competición.',
    category: 'Producto',
    publishedAt: '15 de septiembre de 2026',
    readingTime: '5 min de lectura',
    sections: [
      { heading: 'Datos antes que ruido', body: 'Sportiva24 reúne calendarios, resultados, clubes, competiciones y señales de rendimiento para construir una visión ordenada de la jornada. La plataforma prioriza lo que está ocurriendo y evita presentar una lista interminable sin contexto.' },
      { heading: 'Una capa de inteligencia', body: 'Sobre esos datos aplicamos reglas de calidad, jerarquías de competición y señales de relevancia. El resultado es una experiencia que ayuda a encontrar los partidos importantes, entender su contexto y seguirlos con una lectura más útil.' },
      { heading: 'Una experiencia editorial', body: 'La tecnología no sustituye la explicación. Cada bloque de Sportiva24 está diseñado para que la información pueda leerse rápidamente y, cuando hace falta, profundizar en análisis, metodología y contexto.' },
    ],
  },
  {
    slug: 'como-calculamos-probabilidades',
    title: 'Cómo calculamos nuestras probabilidades',
    excerpt: 'Qué hay detrás de una probabilidad deportiva y por qué nunca debe confundirse con una certeza.',
    category: 'Metodología',
    publishedAt: '15 de septiembre de 2026',
    readingTime: '6 min de lectura',
    sections: [
      { heading: 'Una estimación, no una promesa', body: 'Las probabilidades representan una estimación basada en señales disponibles antes del partido. No son una garantía del resultado y deben interpretarse junto con la competición, el momento de la temporada y la calidad de los datos.' },
      { heading: 'Las señales que observamos', body: 'El modelo puede considerar forma reciente, rendimiento ofensivo y defensivo, localía, dificultad de los rivales, disponibilidad de plantel y contexto competitivo. Cada señal tiene un peso distinto y se revisa para evitar que una sola variable domine la lectura.' },
      { heading: 'Cómo leer el resultado', body: 'Una probabilidad más alta indica una ventaja estimada, no una diferencia segura. La confianza depende de la calidad y cantidad de información disponible para ese encuentro.' },
    ],
  },
  {
    slug: 'que-significa-indice-s24',
    title: 'Qué significa el índice S24',
    excerpt: 'El índice S24 resume señales de rendimiento para facilitar la comparación entre equipos y partidos.',
    category: 'Datos',
    publishedAt: '15 de septiembre de 2026',
    readingTime: '5 min de lectura',
    sections: [
      { heading: 'Una métrica de contexto', body: 'El índice S24 es una puntuación de lectura rápida. Busca condensar rendimiento, forma y contexto en una señal comprensible, sin pretender reemplazar el análisis completo de un equipo.' },
      { heading: 'Comparar con cuidado', body: 'La puntuación es más útil cuando se compara dentro de una misma competición o frente a rivales de nivel similar. Un valor aislado no explica por sí mismo la historia completa de un partido.' },
      { heading: 'Transparencia de interpretación', body: 'Presentamos el índice junto con el partido, la competición y otras señales para que el usuario pueda entender qué está viendo y no dependa de un único número.' },
    ],
  },
  {
    slug: 'como-interpretamos-xg',
    title: 'Cómo interpretamos xG',
    excerpt: 'El expected goals ayuda a evaluar la calidad de las ocasiones, pero necesita contexto para ser realmente útil.',
    category: 'Análisis',
    publishedAt: '15 de septiembre de 2026',
    readingTime: '6 min de lectura',
    sections: [
      { heading: 'Más que contar tiros', body: 'Los goles esperados, o xG, estiman la probabilidad de que una ocasión termine en gol según su ubicación, tipo de asistencia y situación de juego, entre otros factores.' },
      { heading: 'La diferencia entre ocasiones y goles', body: 'Un equipo puede generar mucho xG y no marcar por variación o por una gran actuación del portero. También puede ganar con pocas ocasiones. Por eso xG describe la calidad de lo creado, no el marcador final.' },
      { heading: 'La lectura correcta', body: 'En Sportiva24 usamos xG como una pieza de contexto junto con volumen, eficiencia, ritmo y rival. La métrica gana valor cuando se observa durante varios partidos y no como una sentencia de un solo encuentro.' },
    ],
  },
  {
    slug: 'como-utilizamos-ia-en-analisis-deportivo',
    title: 'Cómo utilizamos IA en análisis deportivo',
    excerpt: 'La inteligencia artificial nos ayuda a ordenar señales y detectar patrones, mientras el criterio editorial mantiene el contexto.',
    category: 'Inteligencia artificial',
    publishedAt: '15 de septiembre de 2026',
    readingTime: '5 min de lectura',
    sections: [
      { heading: 'La IA como herramienta', body: 'Utilizamos inteligencia artificial para procesar grandes volúmenes de información, comparar señales y acelerar la preparación de lecturas. Su función es ayudar a descubrir patrones, no inventar hechos.' },
      { heading: 'Control humano y editorial', body: 'Las señales automatizadas necesitan revisión. El contexto de una competición, una lesión, un cambio de entrenador o un calendario exigente puede modificar la interpretación de los datos.' },
      { heading: 'Responsabilidad', body: 'Diferenciamos datos confirmados, inferencias y opiniones. Cuando la cobertura es incompleta, lo indicamos. La confianza se construye explicando qué sabemos, qué estimamos y qué todavía no podemos afirmar.' },
    ],
  },
];

export function getBlogArticle(slug: string): BlogArticle | undefined {
  return blogArticles.find((article) => article.slug === slug);
}
