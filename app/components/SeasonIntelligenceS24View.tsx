import Link from 'next/link';

import PasaporteAnaliticoS24 from '@/app/components/PasaporteAnaliticoS24';
import type { SeasonIntelligenceData } from '@/lib/intelligence-s24/season-intelligence';

interface SeasonIntelligenceS24ViewProps {
  data: SeasonIntelligenceData;
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-slate-700/50 bg-black/25 p-3">
      <p className="text-xs uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

export default function SeasonIntelligenceS24View({ data }: SeasonIntelligenceS24ViewProps) {
  return (
    <div className="px-4 md:px-12 pt-24 pb-14 max-w-7xl mx-auto space-y-8">
      <section className="rounded-3xl border border-slate-700/45 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_45%),linear-gradient(160deg,rgba(15,23,42,0.95),rgba(2,6,23,0.98))] p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Link href="/season-intelligence" className="rounded-lg border border-slate-600/70 bg-slate-800/60 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-200 hover:border-sky-400/60">
            Volver al hub
          </Link>
          <span className="rounded-lg border border-slate-600/70 bg-slate-800/60 px-3 py-1.5 text-xs uppercase tracking-[0.12em] text-slate-200">Season Intelligence S24</span>
        </div>
        <h1 className="font-editorial text-4xl md:text-5xl leading-tight text-white">{data.competition}</h1>
        <p className="mt-2 text-sm text-slate-300">Temporada {data.seasonLabel}</p>
      </section>

      <section className="rounded-2xl border border-slate-700/60 bg-slate-950/60 p-5 space-y-4">
        <h2 className="text-xl font-semibold text-white">Evolucion de temporada</h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Cambios de tendencia" value={data.evolution.trendChanges} />
          <StatCard label="Muestras" value={data.evolution.s24IndexTimeline.length} />
          <StatCard label="Racha positiva" value={data.bestStreak?.length ?? 0} />
          <StatCard label="Racha negativa" value={data.worstStreak?.length ?? 0} />
        </div>
        <p className="text-sm text-slate-300">{data.evolution.competitiveEvolution}</p>

        <div className="space-y-2.5">
          {data.evolution.s24IndexTimeline.length === 0 ? (
            <p className="text-sm text-slate-400">Sin puntos suficientes para timeline.</p>
          ) : data.evolution.s24IndexTimeline.map((point, idx) => (
            <div key={`${point.createdAt}-${idx}`} className="rounded-xl border border-slate-700/50 bg-black/25 p-3 text-sm">
              <p className="font-semibold text-white">{new Date(point.createdAt).toLocaleString('es-ES')}</p>
              <p className="text-slate-300">S24 Index {point.s24Index} · Tendencia {point.trend} · Riesgo {point.risk}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-2xl border border-slate-700/60 bg-slate-950/60 p-5">
          <h2 className="text-xl font-semibold text-white">Momentos criticos</h2>
          <div className="mt-3 space-y-2.5">
            {data.criticalMoments.length === 0 ? (
              <p className="text-sm text-slate-400">Sin momentos criticos detectados.</p>
            ) : data.criticalMoments.map((item, idx) => (
              <div key={`${item.matchLabel}-${idx}`} className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm">
                <p className="font-semibold text-white">{item.matchLabel}</p>
                <p className="text-amber-100 mt-1">{item.impact}</p>
                <p className="text-xs uppercase tracking-[0.12em] text-amber-200 mt-1">{item.signal}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-700/60 bg-slate-950/60 p-5">
          <h2 className="text-xl font-semibold text-white">Cambios metodologicos</h2>
          <div className="mt-3 space-y-2.5">
            {data.methodologicalChanges.map((item) => (
              <div key={item.key} className="rounded-xl border border-slate-700/50 bg-black/25 p-3 text-sm">
                <p className="font-semibold text-white">{item.description}</p>
                <p className="text-slate-300">Previo: {item.previous}</p>
                <p className="text-slate-300">Actual: {item.current}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-700/60 bg-slate-950/60 p-5 space-y-4">
        <h2 className="text-xl font-semibold text-white">Narrativa automatica</h2>
        <div className="space-y-3 text-sm leading-7 text-slate-200">
          <p><span className="font-semibold text-white">Resumen Ejecutivo:</span> {data.narrative.executiveSummary}</p>
          <p><span className="font-semibold text-white">Evolucion competitiva:</span> {data.narrative.competitiveEvolution}</p>
          <p><span className="font-semibold text-white">Cambios de tendencia:</span> {data.narrative.trendChanges}</p>
          <p><span className="font-semibold text-white">Cambios metodologicos:</span> {data.narrative.methodologicalChanges}</p>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-2xl border border-slate-700/60 bg-slate-950/60 p-5">
          <h2 className="text-xl font-semibold text-white">Insights</h2>
          <div className="mt-3 space-y-2.5">
            {data.insights.map((insight, idx) => (
              <div key={`${insight.title}-${idx}`} className="rounded-xl border border-slate-700/50 bg-black/25 p-3 text-sm">
                <p className="font-semibold text-white">{insight.title}</p>
                <p className="mt-1 text-slate-300">{insight.summary}</p>
                <ul className="mt-2 list-disc pl-4 text-xs text-slate-400 space-y-1">
                  {insight.evidence.map((line, lineIdx) => (
                    <li key={`${insight.title}-${lineIdx}`}>{line}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-700/60 bg-slate-950/60 p-5">
          <h2 className="text-xl font-semibold text-white">Comparacion con temporada anterior</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <StatCard label="Indice actual" value={data.comparisonWithPreviousSeason.current.avgIndex} />
            <StatCard label="Indice anterior" value={data.comparisonWithPreviousSeason.previous.avgIndex} />
            <StatCard label="Delta indice" value={data.comparisonWithPreviousSeason.delta.avgIndex} />
            <StatCard label="Delta volatilidad" value={data.comparisonWithPreviousSeason.delta.volatility} />
            <StatCard label="Delta riesgo alto" value={data.comparisonWithPreviousSeason.delta.highRiskRate} />
            <StatCard label="Delta tendencia positiva" value={data.comparisonWithPreviousSeason.delta.trendPositiveRate} />
          </div>
          <p className="mt-3 text-sm text-slate-300">{data.comparisonWithPreviousSeason.summary}</p>
        </article>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-3">Pasaporte Analitico</h2>
        <PasaporteAnaliticoS24 pasaporte={data.passport} />
      </section>
    </div>
  );
}
