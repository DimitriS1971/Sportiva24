import type { InformeS24V1 } from '@/lib/intelligence-s24/informeS24V1';

interface InsightS24Props {
  insight: InformeS24V1['insight'];
}

function InsightTag({ label, tone }: { label: string; tone: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${tone}`}>
      {label}
    </span>
  );
}

export default function InsightS24({ insight }: InsightS24Props) {
  return (
    <section className="premium-card-enter rounded-3xl border border-cyan-400/30 bg-[linear-gradient(160deg,rgba(8,47,73,0.45),rgba(3,7,18,0.95)),radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_52%)] p-5 md:p-7 shadow-xl shadow-cyan-900/30">
      <div className="flex flex-wrap items-center gap-2">
        <InsightTag label="Insight Editorial S24" tone="border-cyan-400/45 bg-cyan-500/20 text-cyan-100" />
        <InsightTag label="Lectura contextual" tone="border-slate-500/45 bg-slate-800/60 text-slate-200" />
      </div>

      <p className="mt-4 text-base md:text-lg leading-relaxed text-slate-100">{insight.texto}</p>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <article className="rounded-2xl border border-emerald-400/35 bg-emerald-500/10 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-200">Palancas de ventaja</p>
          <ul className="mt-2.5 space-y-2 text-sm text-emerald-50/95">
            {insight.ventajas.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-300" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-amber-400/35 bg-amber-500/10 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-200">Focos de riesgo</p>
          <ul className="mt-2.5 space-y-2 text-sm text-amber-50/95">
            {insight.riesgos.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-300" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
