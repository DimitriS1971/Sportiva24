import Link from 'next/link';

import PasaporteAnaliticoS24 from '@/app/components/PasaporteAnaliticoS24';
import type { PlayerIntelligenceData } from '@/lib/intelligence-s24/player-intelligence';

interface PlayerIntelligenceS24ViewProps {
  data: PlayerIntelligenceData;
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-slate-700/50 bg-black/25 p-3">
      <p className="text-xs uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

export default function PlayerIntelligenceS24View({ data }: PlayerIntelligenceS24ViewProps) {
  return (
    <div className="px-4 md:px-12 pt-24 pb-14 max-w-7xl mx-auto space-y-8">
      <section className="rounded-3xl border border-slate-700/45 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_45%),linear-gradient(160deg,rgba(15,23,42,0.95),rgba(2,6,23,0.98))] p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Link href="/player-intelligence" className="rounded-lg border border-slate-600/70 bg-slate-800/60 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-200 hover:border-sky-400/60">
            Volver al hub
          </Link>
          <span className="rounded-lg border border-slate-600/70 bg-slate-800/60 px-3 py-1.5 text-xs uppercase tracking-[0.12em] text-slate-200">Player Intelligence S24</span>
        </div>

        <h1 className="font-editorial text-4xl md:text-5xl leading-tight text-white">{data.profile.name}</h1>
        <p className="mt-2 text-sm text-slate-300">{data.profile.club} · {data.profile.role} · {data.profile.competition}</p>
      </section>

      <section className="rounded-2xl border border-slate-700/60 bg-slate-950/60 p-5 space-y-4">
        <h2 className="text-xl font-semibold text-white">Perfil del jugador</h2>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Nombre" value={data.profile.name} />
          <StatCard label="Club" value={data.profile.club} />
          <StatCard label="Rol" value={data.profile.role} />
          <StatCard label="Pais" value={data.profile.country} />
          <StatCard label="Competicion" value={data.profile.competition} />
          <StatCard label="Estado" value={data.profile.status} />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-700/60 bg-slate-950/60 p-5 space-y-4">
        <h2 className="text-xl font-semibold text-white">Indicadores metodologicos</h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Player Index" value={data.indicators.playerIndex} />
          <StatCard label="Tendencia" value={data.indicators.trend} />
          <StatCard label="Consistencia" value={data.indicators.consistency} />
          <StatCard label="Influencia" value={data.indicators.influence} />
          <StatCard label="Riesgo" value={data.indicators.risk} />
          <StatCard label="Disponibilidad" value={data.indicators.availability} />
          <StatCard label="Forma" value={data.indicators.form} />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-700/60 bg-slate-950/60 p-5 space-y-4">
        <h2 className="text-xl font-semibold text-white">Narrativa automatica</h2>
        <div className="space-y-3 text-sm leading-7 text-slate-200">
          <p><span className="font-semibold text-white">Estado actual:</span> {data.narrative.currentStatus}</p>
          <p><span className="font-semibold text-white">Evolucion:</span> {data.narrative.evolution}</p>
          <p><span className="font-semibold text-white">Fortalezas:</span> {data.narrative.strengths}</p>
          <p><span className="font-semibold text-white">Debilidades:</span> {data.narrative.weaknesses}</p>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-2xl border border-slate-700/60 bg-slate-950/60 p-5">
          <h2 className="text-xl font-semibold text-white">Comparacion con jugadores similares</h2>
          <div className="mt-3 space-y-2.5">
            {data.comparison.length === 0 ? (
              <p className="text-sm text-slate-400">Sin comparables disponibles.</p>
            ) : data.comparison.map((item) => (
              <div key={item.slug} className="rounded-xl border border-slate-700/50 bg-black/25 p-3 text-sm">
                <p className="font-semibold text-white">{item.name}</p>
                <p className="text-slate-300">{item.club} · Index {item.playerIndex}</p>
                <p className="text-slate-400">Similitud {item.similarityScore}%</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-700/60 bg-slate-950/60 p-5">
          <h2 className="text-xl font-semibold text-white">Alertas</h2>
          <div className="mt-3 space-y-2.5">
            {data.alerts.map((alert, idx) => (
              <div key={`${alert.title}-${idx}`} className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm">
                <p className="font-semibold text-white">{alert.title} · {alert.level}</p>
                <p className="mt-1 text-rose-100">{alert.description}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.12em] text-rose-200">{alert.signal}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-700/60 bg-slate-950/60 p-5">
        <h2 className="text-xl font-semibold text-white">Historial</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Apariciones" value={data.history.appearances} />
          <StatCard label="Index promedio" value={data.history.avgIndex} />
        </div>
        <div className="mt-4 space-y-2.5">
          {data.history.timeline.length === 0 ? (
            <p className="text-sm text-slate-400">Sin historial suficiente.</p>
          ) : data.history.timeline.map((point, idx) => (
            <div key={`${point.createdAt}-${idx}`} className="rounded-xl border border-slate-700/50 bg-black/25 p-3 text-sm">
              <p className="font-semibold text-white">{new Date(point.createdAt).toLocaleString('es-ES')}</p>
              <p className="text-slate-300">Player Index {point.playerIndex} · Tendencia {point.trend}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-3">Pasaporte Analitico</h2>
        <PasaporteAnaliticoS24 pasaporte={data.passport} />
      </section>
    </div>
  );
}
