import type { Metadata } from 'next';

import SimpleInfoPage from '@/app/components/SimpleInfoPage';

export const metadata: Metadata = {
  title: 'Sobre nosotros | Sportiva24',
  description: 'Conoce el problema que resuelve Sportiva24, su tecnología, metodología, fuentes de datos y principios editoriales.',
  alternates: { canonical: '/sobre-nosotros' },
};

export default function SobreNosotrosPage() {
  return (
    <SimpleInfoPage
      title="Sobre nosotros"
      subtitle="Sportiva24 combina datos deportivos, contexto editorial e inteligencia artificial para convertir una jornada compleja en una lectura clara y útil."
      updatedAt="15 septiembre 2026"
      sections={[
        {
          heading: 'Quiénes somos',
          body: 'Sportiva24 es una plataforma editorial y tecnológica dedicada a la información y el análisis deportivo. Reunimos agenda, resultados, contexto competitivo y señales de rendimiento en una experiencia pensada para aficionados, analistas y marcas.',
        },
        {
          heading: 'El problema que resolvemos',
          body: 'La información deportiva está dispersa entre calendarios, resultados, estadísticas, noticias y fuentes con distintos niveles de calidad. Sportiva24 reduce ese ruido: ayuda a encontrar lo importante, entender el contexto y pasar de una lista de partidos a una lectura con criterio.',
        },
        {
          heading: 'Nuestra misión',
          body: 'Democratizar el acceso a inteligencia deportiva de calidad, con interfaces entendibles, métricas transparentes y contenido accionable para fans, analistas y marcas.',
        },
        {
          heading: 'Tecnología',
          body: 'La plataforma combina una arquitectura web moderna, servicios de datos, normalización de nombres y competiciones, reglas de calidad, sistemas de caché y modelos de inteligencia artificial. La tecnología organiza y acelera el análisis; no reemplaza la revisión editorial ni convierte una estimación en un hecho.',
        },
        {
          heading: 'Fuentes de datos',
          body: 'Utilizamos proveedores deportivos especializados, principalmente API-Football para fixtures, resultados, competiciones y señales de partidos, además de fuentes complementarias según la disponibilidad de cada deporte. La cobertura puede variar por competición y lo indicamos cuando afecta la interpretación.',
        },
        {
          heading: 'Metodología',
          body: 'Nuestro flujo reúne datos, normaliza equipos y competiciones, verifica estados y horarios, prioriza encuentros relevantes y construye una lectura contextual. Métricas como probabilidades, índice S24 y xG se presentan como señales de análisis, no como certezas ni recomendaciones financieras.',
        },
        {
          heading: 'Principios editoriales',
          body: 'Priorizamos relevancia sobre volumen, distinguimos hechos de interpretación, evitamos presentar datos incompletos como certezas, corregimos errores cuando una fuente se actualiza y explicamos las limitaciones que puedan afectar una lectura.',
        },
        {
          heading: 'Transparencia sobre inteligencia artificial',
          body: 'La IA puede ayudarnos a ordenar información, detectar patrones, resumir señales y preparar análisis. Cada resultado requiere contexto y revisión. No publicamos una salida automatizada como verdad absoluta, y señalamos cuándo una conclusión depende de datos limitados o de una estimación del modelo.',
        },
        {
          heading: 'Contacto',
          body: 'Para consultas generales sobre el producto, información editorial, correcciones o colaboraciones, escribe a contacto@sportiva24.com.',
        },
      ]}
    />
  );
}
