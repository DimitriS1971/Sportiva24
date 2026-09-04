'use client';

import Link from 'next/link';

interface SportHubCardProps {
  title: string;
  category: string;
  description: string;
  href?: string;
  badge: string;
  accent: 'blue' | 'orange' | 'emerald' | 'violet' | 'rose' | 'amber';
  status: 'Disponible' | 'Próximamente';
  metrics: [string, string, string];
  icon: React.ReactNode;
}

const accentStyles = {
  blue: {
    border: 'border-blue-500/30 hover:border-blue-400/45',
    glow: 'from-blue-500/14 via-blue-500/0 to-cyan-400/10',
    pill: 'border-blue-500/30 bg-blue-500/10 text-blue-200',
    icon: 'border-blue-500/25 bg-blue-500/12 text-blue-100',
    button: 'from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400',
  },
  orange: {
    border: 'border-orange-500/30 hover:border-orange-400/45',
    glow: 'from-orange-500/14 via-orange-500/0 to-amber-400/10',
    pill: 'border-orange-500/30 bg-orange-500/10 text-orange-200',
    icon: 'border-orange-500/25 bg-orange-500/12 text-orange-100',
    button: 'from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400',
  },
  emerald: {
    border: 'border-emerald-500/30 hover:border-emerald-400/45',
    glow: 'from-emerald-500/14 via-emerald-500/0 to-teal-400/10',
    pill: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
    icon: 'border-emerald-500/25 bg-emerald-500/12 text-emerald-100',
    button: 'from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400',
  },
  violet: {
    border: 'border-violet-500/30 hover:border-violet-400/45',
    glow: 'from-violet-500/14 via-violet-500/0 to-indigo-400/10',
    pill: 'border-violet-500/30 bg-violet-500/10 text-violet-200',
    icon: 'border-violet-500/25 bg-violet-500/12 text-violet-100',
    button: 'from-violet-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400',
  },
  rose: {
    border: 'border-rose-500/30 hover:border-rose-400/45',
    glow: 'from-rose-500/14 via-rose-500/0 to-pink-400/10',
    pill: 'border-rose-500/30 bg-rose-500/10 text-rose-200',
    icon: 'border-rose-500/25 bg-rose-500/12 text-rose-100',
    button: 'from-rose-600 to-pink-500 hover:from-rose-500 hover:to-pink-400',
  },
  amber: {
    border: 'border-amber-500/30 hover:border-amber-400/45',
    glow: 'from-amber-500/14 via-amber-500/0 to-yellow-400/10',
    pill: 'border-amber-500/30 bg-amber-500/10 text-amber-200',
    icon: 'border-amber-500/25 bg-amber-500/12 text-amber-100',
    button: 'from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400',
  },
};

export default function SportHubCard({
  title,
  category,
  description,
  href,
  badge,
  accent,
  status,
  metrics,
  icon,
}: SportHubCardProps) {
  const style = accentStyles[accent];
  const isAvailable = Boolean(href);

  return (
    <article className={`group relative overflow-hidden rounded-[28px] border bg-slate-950/75 p-6 transition-all duration-300 ${style.border} hover:-translate-y-1 hover:shadow-[0_20px_55px_rgba(2,6,23,0.45)]`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${style.glow} opacity-100`} />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(30,41,59,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(30,41,59,0.16)_1px,transparent_1px)] bg-[size:36px_36px] opacity-20" />

      <div className="relative z-10 flex h-full flex-col">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">{category}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">{title}</h2>
          </div>
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${style.icon}`}>
            {icon}
          </div>
        </div>

        <div className="mb-5 flex items-center gap-3">
          <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${style.pill}`}>
            {badge}
          </span>
          <span className={`rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.18em] ${isAvailable ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200' : 'border-slate-700 bg-slate-900/80 text-slate-300'}`}>
            {status}
          </span>
        </div>

        <p className="max-w-xl text-sm leading-7 text-slate-300">{description}</p>

        <div className="mt-6 grid grid-cols-3 gap-3 rounded-2xl border border-slate-800/80 bg-black/25 p-3">
          {metrics.map((metric) => (
            <div key={metric} className="rounded-xl border border-slate-800/80 bg-slate-950/80 px-3 py-3 text-center text-xs uppercase tracking-[0.16em] text-slate-400">
              {metric}
            </div>
          ))}
        </div>

        {isAvailable ? (
          <Link
            href={href!}
            className={`mt-6 inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r px-5 text-sm font-semibold text-white transition-all ${style.button}`}
          >
            Abrir centro
          </Link>
        ) : (
          <div className="mt-6 inline-flex h-12 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/80 px-5 text-sm font-semibold text-slate-300">
            Disponible pronto
          </div>
        )}
      </div>
    </article>
  );
}