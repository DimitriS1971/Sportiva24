import Link from 'next/link';

import PasaporteAnaliticoS24 from '@/app/components/PasaporteAnaliticoS24';
import type { ClubIntelligenceData } from '@/lib/intelligence-s24/club-intelligence';

interface ClubIntelligenceS24ViewProps {
  data: ClubIntelligenceData;
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-slate-700/50 bg-black/25 p-3">
      <p className="text-xs uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

export default function ClubIntelligenceS24View({ data }: ClubIntelligenceS24ViewProps) {
  return (
    <div className="px-4 md:px-12 pt-24 pb-14 max-w-7xl mx-auto space-y-8">
      <section className="rounded-3xl border border-slate-700/45 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_45%),linear-gradient(160deg,rgba(15,23,42,0.95),rgba(2,6,23,0.98))] p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Link href="/club-intelligence" className="rounded-lg border border-slate-600/70 bg-slate-800/60 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-200 hover:border-sky-400/60">
            Volver al hub
          </Link>
          <span className="rounded-lg border border-slate-600/70 bg-slate-800/60 px-3 py-1.5 text-xs uppercase tracking-[0.12em] text-slate-200">Club Intelligence S24</span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={data.club.crestUrl} alt={data.club.name} width={72} height={72} className="h-[72px] w-[72px] object-contain" />
          <div>
            <h1 className="font-editorial text-4xl md:text-5xl leading-tight text-white">{data.club.name}</h1>
            <p className="mt-2 text-sm text-slate-300">{data.club.competition} · {data.club.country} · Temporada {data.club.season}</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-700/60 bg-slate-950/60 p-5 space-y-4">
        <h2 className="text-xl font-semibold text-white">1. Perfil Institucional</h2>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Nombre" value={data.club.name} />
          <StatCard label="Pais" value={data.club.country} />
          <StatCard label="Competicion" value={data.club.competition} />
          <StatCard label="Temporada" value={data.club.season} />
          <StatCard label="Estadio" value={data.club.stadium} />
          <StatCard label="Entrenador" value={data.club.coach} />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-700/60 bg-slate-950/60 p-5 space-y-4">
        <h2 className="text-xl font-semibold text-white">2. Estado Competitivo</h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard label="S24 Index" value={data.competitiveState.s24Index} />
          <StatCard label="Rating" value={data.competitiveState.rating} />
          <StatCard label="Tendencia" value={data.competitiveState.trend} />
          <StatCard label="Riesgo" value={data.competitiveState.risk} />
          <StatCard label="Confianza" value={data.competitiveState.confidence} />
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-2xl border border-slate-700/60 bg-slate-950/60 p-5">
          <h2 className="text-xl font-semibold text-white">3. Evolucion Temporal</h2>
          <div className="mt-3 space-y-2.5">
            {data.evolution.recentMatches.length === 0 ? (
              <p className="text-sm text-slate-400">Sin partidos suficientes para evolucion temporal.</p>
            ) : data.evolution.recentMatches.map((match, idx) => (
              <div key={`${match.matchSlug}-${idx}`} className="rounded-xl border border-slate-700/50 bg-black/25 p-3 text-sm">
                <p className="font-semibold text-white">{match.competition} · vs {match.opponent}</p>
                <p className="text-slate-300">Indice {match.s24Index} · Tendencia {match.trend} · Riesgo {match.risk} · Confianza {match.confidence}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-700/60 bg-slate-950/60 p-5">
          <h2 className="text-xl font-semibold text-white">9. Historial</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <StatCard label="Apariciones" value={data.history.appearances} />
            <StatCard label="S24 Index medio" value={data.history.averageIndex} />
            <StatCard label="Ventaja por modelo" value={data.history.winsByModel} />
            <StatCard label="Sin ventaja por modelo" value={data.history.lossesByModel} />
            <StatCard label="Tendencias positivas" value={data.history.trendPositive} />
            <StatCard label="Tendencias estables" value={data.history.trendStable} />
          </div>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-2xl border border-slate-700/60 bg-slate-950/60 p-5">
          <h2 className="text-xl font-semibold text-white">4. Fortalezas</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <StatCard label="Ataque" value={data.strengths.attack} />
            <StatCard label="Defensa" value={data.strengths.defense} />
            <StatCard label="Localia" value={data.strengths.homeAdvantage} />
            <StatCard label="Consistencia" value={data.strengths.consistency} />
            <StatCard label="Eficiencia" value={data.strengths.efficiency} />
          </div>
        </article>

        <article className="rounded-2xl border border-slate-700/60 bg-slate-950/60 p-5">
          <h2 className="text-xl font-semibold text-white">5. Debilidades</h2>
          <div className="mt-3 space-y-2.5">
            {data.weaknesses.length === 0 ? (
              <p className="text-sm text-slate-400">No se detectan debilidades criticas en la ventana actual.</p>
            ) : data.weaknesses.map((item) => (
              <div key={item.key} className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm">
                <p className="font-semibold text-white">{item.title} · {item.severity}</p>
                <p className="text-amber-100 mt-1">{item.description}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-700/60 bg-slate-950/60 p-5 space-y-4">
        <h2 className="text-xl font-semibold text-white">6. Narrativa Inteligente</h2>
        <div className="space-y-3 text-sm leading-7 text-slate-200">
          <p><span className="font-semibold text-white">Resumen Ejecutivo:</span> {data.intelligentNarrative.executiveSummary}</p>
          <p><span className="font-semibold text-white">Estado del Club:</span> {data.intelligentNarrative.clubStatus}</p>
          <p><span className="font-semibold text-white">Perspectiva Competitiva:</span> {data.intelligentNarrative.competitivePerspective}</p>
          <p><span className="font-semibold text-white">Riesgos:</span> {data.intelligentNarrative.risks}</p>
          <p><span className="font-semibold text-white">Fortalezas:</span> {data.intelligentNarrative.strengths}</p>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-2xl border border-slate-700/60 bg-slate-950/60 p-5">
          <h2 className="text-xl font-semibold text-white">7. Insights</h2>
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
          <h2 className="text-xl font-semibold text-white">8. Alertas</h2>
          <div className="mt-3 space-y-2.5">
            {data.alerts.length === 0 ? (
              <p className="text-sm text-slate-400">Sin alertas activas para este club.</p>
            ) : data.alerts.map((alert, idx) => (
              <div key={`${alert.title}-${idx}`} className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm">
                <p className="font-semibold text-white">{alert.title} · {alert.level}</p>
                <p className="mt-1 text-rose-100">{alert.description}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.12em] text-rose-200">{alert.signal}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-700/60 bg-slate-950/60 p-5 space-y-4">
        <h2 className="text-xl font-semibold text-white">Validacion Reutilizada</h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard label="Motor Global" value={data.validation.motorGlobal} />
          <StatCard label="Narrativa Global" value={data.validation.narrativeGlobal} />
          <StatCard label="Insight Global" value={data.validation.insightGlobal} />
          <StatCard label="Precision deporte" value={data.validation.sportAccuracy} />
          <StatCard label="Precision proveedor" value={data.validation.providerAccuracy} />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-3">10. Pasaporte Analitico</h2>
        <PasaporteAnaliticoS24 pasaporte={data.passport} />
      </section>
    </div>
  );
}
