import type { Metadata } from 'next';

import SimpleInfoPage from '@/app/components/SimpleInfoPage';

export const metadata: Metadata = {
  title: 'Contacto | Sportiva24',
  description: 'Canales de contacto de Sportiva24.',
};

export default function ContactoPage() {
  return (
    <SimpleInfoPage
      title="Contacto"
      subtitle="Si quieres hablar con el equipo de Sportiva24, aquí tienes los canales principales para consultas editoriales, comerciales y técnicas."
      updatedAt="7 julio 2026"
      sections={[
        {
          heading: 'Consultas generales',
          body: 'Escríbenos a contacto@sportiva24.com para dudas generales sobre el producto y la plataforma.',
        },
        {
          heading: 'Alianzas y marcas',
          body: 'Para colaboraciones, patrocinios o acciones de marca, utiliza alianzas@sportiva24.com y te responderemos a la brevedad.',
        },
      ]}
    />
  );
}
