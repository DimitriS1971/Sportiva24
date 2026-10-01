import type { Metadata } from 'next';

import SimpleInfoPage from '@/app/components/SimpleInfoPage';

export const metadata: Metadata = {
  title: 'Privacidad | Sportiva24',
  description: 'Política de privacidad de Sportiva24: datos tratados, finalidades, proveedores, conservación y derechos de los usuarios.',
  alternates: { canonical: '/privacidad' },
};

export default function PrivacidadPage() {
  return (
    <SimpleInfoPage
      title="Privacidad"
      subtitle="Esta política explica qué información tratamos en Sportiva24, para qué la usamos, con qué proveedores trabajamos y cómo puedes ejercer tus derechos."
      updatedAt="15 septiembre 2026"
      sections={[
        {
          heading: 'Responsable y alcance',
          body: 'Sportiva24 es un proyecto editorial y tecnológico operado desde sportiva24.com. Esta política se aplica al sitio web, sus páginas editoriales, el explorador de partidos, los formularios y los servicios relacionados. Para consultas de privacidad escribe a contacto@sportiva24.com con el asunto “Privacidad”.',
        },
        {
          heading: 'Qué datos tratamos',
          body: 'Podemos tratar datos técnicos de navegación y dispositivo, como dirección IP, navegador, sistema operativo, URL de referencia, páginas visitadas, fecha y hora, además de datos que decidas enviarnos por correo o formularios. El contador de visitas registra una métrica agregada de visitas mediante una función de Supabase y no está diseñado como un perfil publicitario individual.',
        },
        {
          heading: 'Finalidades',
          body: 'Usamos la información para prestar y proteger el servicio, mostrar páginas y partidos, mantener la sesión administrativa, responder consultas, medir el uso y rendimiento del sitio, detectar errores y mejorar contenido, navegación y seguridad. No usamos los datos de contacto para enviar comunicaciones comerciales no solicitadas.',
        },
        {
          heading: 'Bases legales',
          body: 'Según el caso, el tratamiento se basa en la ejecución de la solicitud que realizas al usar el sitio, el interés legítimo en operar, asegurar y mejorar la plataforma, el cumplimiento de obligaciones aplicables y tu consentimiento cuando una tecnología no esencial lo requiera. Puedes retirar un consentimiento desde la configuración disponible o desde tu navegador cuando corresponda.',
        },
        {
          heading: 'Proveedores y terceros',
          body: 'Sportiva24 utiliza Vercel para alojamiento, despliegue y analítica de rendimiento; Supabase para determinados contenidos editoriales, autenticación técnica y contador de visitas; y proveedores deportivos como API-Football y otras fuentes especializadas para calendarios, resultados y datos de partidos. Estos proveedores pueden procesar información técnica necesaria para prestar sus servicios bajo sus propias políticas y contratos.',
        },
        {
          heading: 'Cookies y analytics',
          body: 'El sitio utiliza cookies técnicas de sesión cuando son necesarias para funciones administrativas y de Supabase. También incorpora Vercel Analytics para métricas de uso y rendimiento. El componente publicitario de Sportiva24 es actualmente un espacio reservado y no instala una red publicitaria de terceros desde este código. Consulta la Política de cookies para más detalle y controla las cookies desde tu navegador.',
        },
        {
          heading: 'Almacenamiento y conservación',
          body: 'La información se almacena en los servicios de los proveedores configurados para cada función y se conserva durante el tiempo necesario para prestar el servicio, mantener registros operativos, resolver incidencias o cumplir obligaciones legales. Los artículos publicados y sus metadatos pueden conservarse mientras formen parte del archivo editorial. No conservamos datos de contacto indefinidamente si ya no existe una finalidad legítima.',
        },
        {
          heading: 'Transferencias y seguridad',
          body: 'Algunos proveedores tecnológicos pueden procesar datos desde países distintos al tuyo. Aplicamos medidas razonables de acceso, configuración y minimización, pero ningún servicio conectado a Internet puede garantizar seguridad absoluta. No vendemos datos personales ni los cedemos para que terceros creen perfiles publicitarios propios.',
        },
        {
          heading: 'Derechos del usuario',
          body: 'Puedes solicitar acceso, rectificación, supresión, limitación u oposición al tratamiento, y pedir la portabilidad cuando sea aplicable. También puedes retirar un consentimiento y presentar una reclamación ante la autoridad de protección de datos competente.',
        },
        {
          heading: 'Cómo ejercer tus derechos',
          body: 'Envía tu solicitud a contacto@sportiva24.com indicando “Privacidad”, el derecho que deseas ejercer y la información necesaria para localizar tu solicitud. Podemos pedir datos razonables para verificar la identidad y evitar que se entregue información a otra persona. Responderemos dentro del plazo legal aplicable o te explicaremos si necesitamos más tiempo.',
        },
        {
          heading: 'Cambios a esta política',
          body: 'Podemos actualizar esta política cuando cambien la plataforma, los proveedores o las obligaciones aplicables. Publicaremos la versión vigente en esta página e indicaremos la fecha de actualización.',
        },
      ]}
    />
  );
}
