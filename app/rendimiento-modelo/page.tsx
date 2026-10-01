import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

export const metadata: Metadata = {
  title: 'Rendimiento del modelo | Sportiva24',
  description: 'Consulta la metodología y el historial de precisión de los modelos de Sportiva24 cuando exista una muestra validada de partidos.',
  alternates: { canonical: '/rendimiento-modelo' },
};

const metrics = [
  ['Acierto 1X2', 'Porcentaje de partidos en los que la selección principal coincide con el resultado final.'],
  ['Brier Score', 'Mide la calidad de las probabilidades; cuanto más bajo, mejor calibradas están las predicciones.'],
  ['Log Loss', 'Penaliza con mayor fuerza las probabilidades muy seguras cuando se equivocan.'],
  ['Calibración', 'Compara la probabilidad estimada con la frecuencia real de aciertos en cada rango.'],
  ['Accuracy', 'Proporción global de resultados correctamente clasificados sobre la muestra evaluada.'],
  ['Por competición', 'Permite conocer cómo cambia el rendimiento según liga, copa o torneo.'],
];

export default function ModelPerformancePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <section className="border-b border-blue-950/40 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.18),transparent_42%),linear-gradient(180deg,#071426,#000)] px-6 pb-14 pt-28 md:px-12 md:pb-18 md:pt-36">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-300">Transparencia del modelo</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">Rendimiento del modelo</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">La precisión debe demostrarse con resultados históricos verificables, no con una cifra aislada.</p>
        </div>
      </section>

      <section className="px-6 py-12 md:px-12 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-3xl border border-amber-400/30 bg-amber-500/10 p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-200">Historial validado en construcción</p>
            <h2 className="mt-3 text-2xl font-bold text-white md:text-3xl">Todavía no publicamos una cifra de precisión</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-amber-100/80 md:text-base">Sportiva24 ya genera probabilidades y señales de análisis, pero aún no cuenta con un registro histórico persistido que relacione cada predicción con el resultado final y permita calcular estas métricas de forma reproducible. Preferimos no presentar un porcentaje sin una muestra auditada.</p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {metrics.map(([title, description]) => (
              <article key={title} className="rounded-2xl border border-slate-800/80 bg-slate-950/70 p-5">
                <h2 className="text-lg font-semibold text-white">{title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-400">{description}</p>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">Pendiente de muestra validada</p>
              </article>
            ))}
          </div>

          <div className="mt-10 rounded-3xl border border-slate-800/80 bg-slate-950/60 p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Cómo se publicará</p>
            <h2 className="mt-3 text-2xl font-bold text-white">Un historial reproducible</h2>
            <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-400 md:text-base">Cuando exista una muestra suficiente, cada evaluación incluirá fecha de corte, número de partidos, competiciones cubiertas, resultado observado, versión del modelo y métricas separadas por competición. Las predicciones se congelarán antes del inicio de cada partido para evitar evaluar con información posterior.</p>
            <Link href="/disclaimer" className="mt-6 inline-flex text-sm font-semibold text-sky-300 hover:text-sky-200">Leer el disclaimer del modelo →</Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
