import type { Metadata } from 'next';

import SimpleInfoPage from '@/app/components/SimpleInfoPage';

export const metadata: Metadata = {
  title: 'Blog | Sportiva24',
  description: 'Artículos y notas del equipo de Sportiva24.',
};

export default function BlogPage() {
  return (
    <SimpleInfoPage
      title="Blog"
      subtitle="Publicamos notas sobre producto, metodología y aprendizajes del desarrollo de inteligencia deportiva en Sportiva24."
      updatedAt="7 julio 2026"
      sections={[
        {
          heading: 'Contenido',
          body: 'Encontrarás artículos breves sobre diseño de producto, datos deportivos, visualización y decisiones editoriales detrás de cada centro de inteligencia.',
        },
        {
          heading: 'Frecuencia',
          body: 'Este espacio se actualiza de forma periódica con novedades del roadmap, mejoras de experiencia y experimentos en analítica aplicada.',
        },
      ]}
    />
  );
}
