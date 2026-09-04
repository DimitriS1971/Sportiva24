import type { Metadata } from 'next';

import SimpleInfoPage from '@/app/components/SimpleInfoPage';

export const metadata: Metadata = {
  title: 'Carreras | Sportiva24',
  description: 'Oportunidades laborales en Sportiva24.',
};

export default function CarrerasPage() {
  return (
    <SimpleInfoPage
      title="Carreras"
      subtitle="Estamos construyendo un equipo multidisciplinario para crear la próxima generación de inteligencia deportiva."
      updatedAt="7 julio 2026"
      sections={[
        {
          heading: 'Perfiles buscados',
          body: 'Nos interesan perfiles de frontend, data, producto y contenido deportivo con foco en ejecución, criterio y trabajo colaborativo.',
        },
        {
          heading: 'Cómo postular',
          body: 'Envía tu perfil y portafolio a careers@sportiva24.com. Revisamos candidaturas de forma continua.',
        },
      ]}
    />
  );
}
