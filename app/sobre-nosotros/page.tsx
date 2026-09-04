import type { Metadata } from 'next';

import SimpleInfoPage from '@/app/components/SimpleInfoPage';

export const metadata: Metadata = {
  title: 'Sobre nosotros | Sportiva24',
  description: 'Conoce el enfoque y la misión de Sportiva24.',
};

export default function SobreNosotrosPage() {
  return (
    <SimpleInfoPage
      title="Sobre nosotros"
      subtitle="Sportiva24 combina datos, contexto e inteligencia artificial para convertir información deportiva compleja en decisiones claras."
      updatedAt="7 julio 2026"
      sections={[
        {
          heading: 'Quiénes somos',
          body: 'Somos un proyecto editorial y tecnológico enfocado en análisis deportivo. Nuestro objetivo es ofrecer una lectura moderna del deporte basada en datos y lenguaje visual claro.',
        },
        {
          heading: 'Nuestra misión',
          body: 'Democratizar el acceso a inteligencia deportiva de calidad, con interfaces entendibles, métricas transparentes y contenido accionable para fans, analistas y marcas.',
        },
      ]}
    />
  );
}
