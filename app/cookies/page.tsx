import type { Metadata } from 'next';

import SimpleInfoPage from '@/app/components/SimpleInfoPage';

export const metadata: Metadata = {
  title: 'Cookies | Sportiva24',
  description: 'Política de cookies y tecnologías similares utilizadas por Sportiva24.',
  alternates: { canonical: '/cookies' },
};

export default function CookiesPage() {
  return (
    <SimpleInfoPage
      title="Cookies"
      subtitle="Explicamos qué cookies y tecnologías similares utiliza Sportiva24 y cómo puedes controlarlas."
      updatedAt="15 septiembre 2026"
      sections={[
        {
          heading: 'Qué son las cookies',
          body: 'Son pequeños archivos o identificadores que el navegador puede guardar para mantener una sesión, recordar una preferencia o medir el funcionamiento de una página. También pueden existir tecnologías similares, como almacenamiento local o solicitudes de medición.',
        },
        {
          heading: 'Qué utilizamos actualmente',
          body: 'Sportiva24 puede utilizar cookies técnicas de Supabase para funciones de sesión y Vercel Analytics para métricas de uso y rendimiento. El espacio publicitario visible en la plataforma es actualmente un marcador reservado y no carga una red de publicidad comportamental desde este sitio.',
        },
        {
          heading: 'Cómo controlarlas',
          body: 'Al entrar por primera vez puedes aceptar, rechazar o configurar las categorías opcionales desde el Centro de preferencias de cookies. Puedes cambiar tu decisión en cualquier momento desde el botón “Preferencias de cookies” del pie de página. También puedes bloquear, eliminar o limitar cookies desde la configuración de tu navegador. Si desactivas las cookies técnicas, algunas funciones administrativas o de sesión pueden dejar de funcionar. Para consultas sobre privacidad escribe a contacto@sportiva24.com.',
        },
      ]}
    />
  );
}
