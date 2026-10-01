import type { Metadata } from 'next';

import SimpleInfoPage from '@/app/components/SimpleInfoPage';

export const metadata: Metadata = {
  title: 'Disclaimer | Sportiva24',
  description: 'Aviso legal sobre estimaciones, modelos estadísticos, inteligencia artificial y contenido editorial de Sportiva24.',
  alternates: { canonical: '/disclaimer' },
};

export default function DisclaimerPage() {
  return (
    <SimpleInfoPage
      title="Disclaimer"
      subtitle="El contenido de Sportiva24 se publica con fines informativos y editoriales. Las estimaciones no garantizan resultados."
      updatedAt="15 septiembre 2026"
      sections={[
        {
          heading: 'Contenido editorial',
          body: 'Las métricas, rankings y proyecciones son estimaciones generadas mediante modelos estadísticos y/o de inteligencia artificial a partir de los datos disponibles. No constituyen una garantía del resultado de un partido, una predicción infalible ni asesoramiento profesional, financiero o de apuestas.',
        },
        {
          heading: 'Datos y actualización',
          body: 'Los horarios, resultados, estadísticas y estados de los partidos pueden cambiar, presentar retrasos o contener errores debido a la disponibilidad y actualización de las fuentes. La información en tiempo real debe entenderse como una señal operativa y no como confirmación absoluta de cada acontecimiento.',
        },
        {
          heading: 'Inteligencia artificial',
          body: 'La inteligencia artificial se utiliza para organizar información, detectar patrones y apoyar la generación de contexto. Sus resultados pueden contener errores, sesgos o limitaciones; por eso deben interpretarse junto con el contexto editorial y no sustituir el criterio profesional.',
        },
        {
          heading: 'Decisiones del usuario',
          body: 'Cada usuario es responsable de las decisiones que tome a partir del contenido de Sportiva24. No recomendamos realizar apuestas ni asumir riesgos económicos basándose únicamente en nuestras métricas, rankings, probabilidades o análisis.',
        },
        {
          heading: 'Cambios y disponibilidad',
          body: 'Podemos actualizar o modificar contenido, estructura y funcionalidades sin previo aviso para mejorar la plataforma.',
        },
      ]}
    />
  );
}
