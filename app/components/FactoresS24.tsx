import type { InformeS24V1 } from '@/lib/intelligence-s24/informeS24V1';

interface FactoresS24Props {
  factores: InformeS24V1['factores'];
}

interface FactorStyle {
  icon: string;
  border: string;
  bg: string;
  text: string;
}

function resolveFactorStyle(key: string): FactorStyle {
  if (key === 'recentForm') return { icon: 'RF', border: 'border-cyan-400/40', bg: 'bg-cyan-500/10', text: 'text-cyan-100' };
  if (key === 'offensivePerformance') return { icon: 'OF', border: 'border-rose-400/40', bg: 'bg-rose-500/10', text: 'text-rose-100' };
  if (key === 'defensivePerformance') return { icon: 'DF', border: 'border-indigo-400/40', bg: 'bg-indigo-500/10', text: 'text-indigo-100' };
  if (key === 'localia') return { icon: 'LC', border: 'border-sky-400/40', bg: 'bg-sky-500/10', text: 'text-sky-100' };
  if (key === 'competitiveContext') return { icon: 'CT', border: 'border-violet-400/40', bg: 'bg-violet-500/10', text: 'text-violet-100' };
  if (key === 'availability') return { icon: 'AV', border: 'border-emerald-400/40', bg: 'bg-emerald-500/10', text: 'text-emerald-100' };
  return { icon: 'CL', border: 'border-amber-400/40', bg: 'bg-amber-500/10', text: 'text-amber-100' };
}

function getImpactLabel(value: number, max: number): { label: string; width: number } {
  if (max <= 0) {
    return { label: 'Sin impacto', width: 0 };
  }

  const ratio = Math.max(0, Math.min(1, value / max));
  const width = Math.round(ratio * 100);

  if (ratio >= 0.75) return { label: 'Impacto alto', width };
  if (ratio >= 0.45) return { label: 'Impacto medio', width };
  return { label: 'Impacto bajo', width };
}

export default function FactoresS24({ factores }: FactoresS24Props) {
  return (
    <section className="rounded-3xl border border-slate-700/45 bg-slate-950/65 p-5 md:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.17em] text-slate-300">Factores S24</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {factores.map((factor) => {
          const style = resolveFactorStyle(factor.key);
          const impact = getImpactLabel(factor.contributionPoints, factor.maxPoints);

          return (
            <article key={factor.key} className={`premium-card-enter rounded-2xl border p-4 ${style.border} ${style.bg}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-black/25 text-[10px] font-semibold tracking-[0.12em] ${style.text}`}>
                    {style.icon}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{factor.title}</p>
                    <p className="text-[11px] text-slate-400">{factor.sourceIndicator}</p>
                  </div>
                </div>

                <span className={`rounded-full border border-white/15 bg-black/25 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${style.text}`}>
                  {impact.label}
                </span>
              </div>

              <p className="mt-3 text-xl font-semibold text-white">
                {factor.contributionPoints}
                <span className="ml-1 text-sm font-medium text-slate-300">/ {factor.maxPoints}</span>
              </p>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-700/45">
                <div className="premium-progress-bar h-full rounded-full bg-gradient-to-r from-white/70 to-white" style={{ width: `${impact.width}%` }} />
              </div>

              <p className="mt-3 text-xs leading-relaxed text-slate-300">{factor.detail}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
