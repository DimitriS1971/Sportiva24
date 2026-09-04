import type { InformeS24V1 } from '@/lib/intelligence-s24/informeS24V1';

interface NarrativaEditorialS24Props {
  narrativa: InformeS24V1['narrativa'];
}

export default function NarrativaEditorialS24({ narrativa }: NarrativaEditorialS24Props) {
  return (
    <section className="space-y-4 md:space-y-5">
      <article className="premium-card-enter premium-grid-pattern rounded-3xl border border-slate-700/45 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.16),transparent_48%),linear-gradient(165deg,rgba(15,23,42,0.95),rgba(2,6,23,0.98))] p-5 md:p-8">
        <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Titulo editorial</p>
        <h2 className="font-editorial mt-3 text-3xl md:text-4xl font-semibold tracking-tight text-white leading-tight">
          {narrativa.editorialTitle}
        </h2>
        <p className="mt-4 text-sm md:text-base leading-relaxed text-slate-200">
          {narrativa.executiveSummary}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-slate-300">
          <span className="rounded-full border border-slate-500/60 bg-slate-800/60 px-2.5 py-1 uppercase tracking-[0.12em]">Nivel {narrativa.level}</span>
          <span className="rounded-full border border-slate-500/60 bg-slate-800/60 px-2.5 py-1 uppercase tracking-[0.12em]">Resumen {narrativa.stats.executiveWords} palabras</span>
          <span className="rounded-full border border-slate-500/60 bg-slate-800/60 px-2.5 py-1 uppercase tracking-[0.12em]">Analisis {narrativa.stats.fullAnalysisWords} palabras</span>
        </div>
      </article>

      <article className="rounded-3xl border border-slate-700/45 bg-slate-950/60 p-5 md:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">Analisis completo</p>
        <div className="mt-4 space-y-4">
          {narrativa.sections.map((section) => (
            <section key={section.id} className="premium-card-enter rounded-2xl border border-slate-700/40 bg-black/25 p-4 md:p-5">
              <h3 className="font-editorial text-xl md:text-2xl text-white">{section.title}</h3>
              <div className="mt-2.5 space-y-3 text-sm md:text-base leading-relaxed text-slate-200">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph.id}>{paragraph.text}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>

      <article className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-4 md:p-5">
        <p className="text-[11px] uppercase tracking-[0.15em] text-cyan-200">Resumen de factores</p>
        <p className="mt-2 text-sm md:text-base leading-relaxed text-cyan-50">{narrativa.factorsSummary}</p>
      </article>
    </section>
  );
}
