import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

export const metadata: Metadata = {
  title: 'Redacción Sportiva24 | Criterio editorial y datos deportivos',
  description: 'Conoce a la Redacción Sportiva24: un equipo editorial y tecnológico que analiza el deporte con datos, contexto y criterio propio.',
  alternates: { canonical: '/redaccion-sportiva24' },
};

const editorialJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Redacción Sportiva24',
  url: 'https://www.sportiva24.com/redaccion-sportiva24',
  parentOrganization: {
    '@type': 'Organization',
    name: 'Sportiva24',
    url: 'https://www.sportiva24.com',
  },
  description: 'Equipo editorial y tecnológico especializado en información, análisis y contexto deportivo.',
};

export default function RedaccionSportiva24Page() {
  return (
    <main className="min-h-screen bg-black text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(editorialJsonLd) }} />
      <Navbar />

      <section className="border-b border-blue-950/40 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.18),transparent_42%),linear-gradient(180deg,#071426,#000)] px-6 pb-16 pt-32 md:px-12 md:pb-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-300">Criterio editorial</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight md:text-6xl">Redacción Sportiva24</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300 md:text-xl">
            Información deportiva explicada con datos, contexto y una mirada editorial independiente.
          </p>
        </div>
      </section>

      <section className="px-6 py-12 md:px-12 md:py-16">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <article className="rounded-3xl border border-slate-800/80 bg-slate-950/70 p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300">Quién publica</p>
            <h2 className="mt-3 text-3xl font-bold text-white">Una redacción editorial y tecnológica</h2>
            <p className="mt-5 text-base leading-8 text-slate-300">
              Redacción Sportiva24 es el equipo responsable de seleccionar, verificar y presentar la información deportiva que aparece en Sportiva24. Combinamos fuentes de datos, contexto competitivo y revisión editorial para que cada publicación sea clara, útil y responsable.
            </p>
            <p className="mt-4 text-base leading-8 text-slate-300">
              Nuestro trabajo cubre actualidad, análisis de partidos, competiciones, clubes y señales de rendimiento. Los datos ayudan a construir la lectura; el criterio editorial decide qué merece atención y cómo debe explicarse.
            </p>
          </article>

          <aside className="rounded-3xl border border-slate-800/80 bg-slate-950/70 p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Principios editoriales</p>
            <ul className="mt-5 space-y-4 text-sm leading-7 text-slate-300">
              <li><strong className="text-white">Contexto antes que ruido.</strong> Priorizamos historias y partidos relevantes.</li>
              <li><strong className="text-white">Transparencia.</strong> Distinguimos datos, interpretación y opinión.</li>
              <li><strong className="text-white">Actualización continua.</strong> Revisamos horarios, resultados y estados cuando cambia la jornada.</li>
              <li><strong className="text-white">Corrección.</strong> Ajustamos la información cuando una fuente se actualiza o detectamos un error.</li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="border-y border-slate-900 bg-slate-950/40 px-6 py-12 md:px-12 md:py-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Metodología</p>
          <h2 className="mt-3 text-3xl font-bold text-white">Cómo trabajamos la información</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              ['01', 'Reunimos', 'Datos deportivos en tiempo real, calendarios, resultados y señales de rendimiento.'],
              ['02', 'Contrastamos', 'Revisamos competición, equipos, horario y estado antes de publicar.'],
              ['03', 'Explicamos', 'Convertimos la información en una lectura comprensible para aficionados y analistas.'],
            ].map(([number, title, description]) => (
              <div key={number} className="rounded-2xl border border-slate-800 bg-black/30 p-5">
                <span className="text-sm font-bold text-sky-300">{number}</span>
                <h3 className="mt-4 text-xl font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-400">{description}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm leading-7 text-slate-400">
            Las fuentes de datos pueden variar según la competición y la disponibilidad. La información técnica se presenta como soporte del trabajo editorial, no como sustituto del criterio periodístico.
          </p>
          <Link href="/noticias" className="mt-6 inline-flex rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(14,165,233,0.25)] transition hover:from-sky-400 hover:to-blue-500">
            Leer noticias de Sportiva24
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
