import type { Metadata } from 'next';

import SimpleInfoPage from '@/app/components/SimpleInfoPage';

export const metadata: Metadata = {
  title: 'Cookies | Sportiva24',
  description: 'Política de cookies de Sportiva24.',
};

export default function CookiesPage() {
  return (
    <SimpleInfoPage
      title="Cookies"
      subtitle="Utilizamos cookies y tecnologías similares para mejorar la navegación y entender cómo se usa la plataforma."
      updatedAt="7 julio 2026"
      sections={[
        {
          heading: 'Qué son las cookies',
          body: 'Son pequeños archivos que el navegador guarda para recordar preferencias, mantener sesiones y facilitar medición de uso.',
        },
        {
          heading: 'Configuración',
          body: 'Puedes controlar y eliminar cookies desde la configuración de tu navegador. Al desactivarlas, algunas funciones pueden verse limitadas.',
        },
      ]}
    />
  );
}
