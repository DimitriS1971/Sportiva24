import type { Metadata } from 'next';

import SimpleInfoPage from '@/app/components/SimpleInfoPage';

export const metadata: Metadata = {
  title: 'Disclaimer | Sportiva24',
  description: 'Aviso legal y descargo de responsabilidad de Sportiva24.',
};

export default function DisclaimerPage() {
  return (
    <SimpleInfoPage
      title="Disclaimer"
      subtitle="El contenido de Sportiva24 se publica con fines informativos y editoriales."
      updatedAt="7 julio 2026"
      sections={[
        {
          heading: 'Contenido editorial',
          body: 'Las métricas, rankings y proyecciones son modelos de ejemplo y análisis de contexto. No deben interpretarse como asesoría profesional.',
        },
        {
          heading: 'Cambios y disponibilidad',
          body: 'Podemos actualizar o modificar contenido, estructura y funcionalidades sin previo aviso para mejorar la plataforma.',
        },
      ]}
    />
  );
}
