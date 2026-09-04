import type { Metadata } from 'next';

import SimpleInfoPage from '@/app/components/SimpleInfoPage';

export const metadata: Metadata = {
  title: 'Modelo Online | Sportiva24',
  description: 'Estado y funcionamiento del modelo online de Sportiva24.',
};

export default function ModeloOnlinePage() {
  return (
    <SimpleInfoPage
      title="Modelo Online"
      subtitle="El motor de Sportiva24 procesa señales de rendimiento, contexto y forma deportiva para actualizar proyecciones en tiempo real."
      updatedAt="7 julio 2026"
      sections={[
        {
          heading: 'Estado actual',
          body: 'El modelo se encuentra activo y en monitoreo continuo. Las actualizaciones se aplican por ventanas para mantener consistencia de métricas y estabilidad visual.',
        },
        {
          heading: 'Cómo se usa',
          body: 'Las salidas del modelo se reflejan en índices, rankings y alertas dentro de cada centro deportivo. Sirven como apoyo analítico y no como garantía de resultados.',
        },
      ]}
    />
  );
}
