import type { Metadata } from 'next';

import SimpleInfoPage from '@/app/components/SimpleInfoPage';

export const metadata: Metadata = {
  title: 'Privacidad | Sportiva24',
  description: 'Política de privacidad de Sportiva24.',
};

export default function PrivacidadPage() {
  return (
    <SimpleInfoPage
      title="Privacidad"
      subtitle="Esta página resume de forma simple cómo tratamos la información dentro de Sportiva24."
      updatedAt="7 julio 2026"
      sections={[
        {
          heading: 'Datos que recopilamos',
          body: 'Podemos recopilar datos básicos de navegación y contacto para mejorar el producto, medir rendimiento y responder solicitudes de usuarios.',
        },
        {
          heading: 'Uso de la información',
          body: 'La información se utiliza para operar la plataforma, mejorar la experiencia y comunicar novedades relevantes. No vendemos datos personales a terceros.',
        },
      ]}
    />
  );
}
