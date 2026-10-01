import type { Metadata } from 'next';

import SimpleInfoPage from '@/app/components/SimpleInfoPage';

export const metadata: Metadata = {
  title: 'Términos | Sportiva24',
  description: 'Términos y condiciones de uso del contenido y los servicios editoriales de Sportiva24.',
  alternates: { canonical: '/terminos' },
};

export default function TerminosPage() {
  return (
    <SimpleInfoPage
      title="Términos"
      subtitle="Estas condiciones describen reglas básicas de uso para navegar y consumir contenido dentro de Sportiva24."
      updatedAt="15 septiembre 2026"
      sections={[
        {
          heading: 'Uso permitido',
          body: 'El contenido de Sportiva24 es para uso informativo. No está permitido copiar, redistribuir o explotar comercialmente el contenido sin autorización.',
        },
        {
          heading: 'Limitación de responsabilidad',
          body: 'Las proyecciones y análisis son de carácter editorial y no constituyen garantía de resultados deportivos. No ofrecemos productos financieros, apuestas, cuotas ni mercados de inversión desde Sportiva24.',
        },
      ]}
    />
  );
}
