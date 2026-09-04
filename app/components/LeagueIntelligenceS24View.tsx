import Link from 'next/link';

import PasaporteAnaliticoS24 from '@/app/components/PasaporteAnaliticoS24';
import type { LeagueIntelligenceData, LeagueTeamHighlight } from '@/lib/intelligence-s24/league-intelligence';

interface LeagueIntelligenceS24ViewProps {
  data: LeagueIntelligenceData;
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-slate-700/50 bg-black/25 p-3">
      <p className="text-xs uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function TeamList({ teams, metric }: { teams: LeagueTeamHighlight[]; metric: (team: LeagueTeamHighlight) => string }) {
  return (
    <div className="space-y-2.5">
      {teams.length === 0 ? (
        <p className="text-sm text-slate-400">Sin datos suficientes.</p>
      ) : teams.map((team) => (
        <div key={team.teamName} className="rounded-xl border border-slate-700/50 bg-black/25 p-3 text-sm">
          <p className="font-semibold text-white">{team.teamName}</p>
          <p className="text-slate-300">{metric(team)}</p>
        </div>
      ))}
    </div>
  );
}

export default function LeagueIntelligenceS24View({ data }: LeagueIntelligenceS24ViewProps) {
  return (
    <div className="px-4 md:px-12 pt-24 pb-14 max-w-7xl mx-auto space-y-8">
      <section className="rounded-3xl border border-slate-700/45 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_45%),linear-gradient(160deg,rgba(15,23,42,0.95),rgba(2,6,23,0.98))] p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Link href="/league-intelligence" className="rounded-lg border border-slate-600/70 bg-slate-800/60 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-200 hover:border-sky-400/60">
            Volver al hub
          </Link>
          <span className="rounded-lg border border-slate-600/70 bg-slate-800/60 px-3 py-1.5 text-xs uppercase tracking-[0.12em] text-slate-200">League Intelligence S24</span>
        </div>

        <h1 className="font-editorial text-4xl md:text-5xl leading-tight text-white">{data.competition}</h1>
      </section>

      <section className="rounded-2xl border border-slate-700/60 bg-slate-950/60 p-5 space-y-4">
        <h2 className="text-xl font-semibold text-white">Estado competitivo de la competicion</h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Nivel competitivo" value={data.competitiveState.competitiveLevel} />
          <StatCard label="Equilibrio" value={data.competitiveState.competitiveBalance} />
          <StatCard label="Volatilidad" value={data.competitiveState.volatility} />
          <StatCard label="Intensidad" value={data.competitiveState.intensity} />
          <StatCard label="Promedio ofensivo" value={data.competitiveState.avgOffense} />
          <StatCard label="Promedio defensivo" value={data.competitiveState.avgDefense} />
          <StatCard label="Tendencias positivas" value={data.trends.positives} />
          <StatCard label="Tendencias negativas" value={data.trends.negatives} />
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-2xl border border-slate-700/60 bg-slate-950/60 p-5">
          <h2 className="text-xl font-semibold text-white">Ranking S24</h2>
          <div className="mt-3 space-y-2.5">
            {data.competitiveState.rankingS24.length === 0 ? (
              <p className="text-sm text-slate-400">Sin ranking disponible.</p>
            ) : data.competitiveState.rankingS24.map((entry) => (
              <div key={`${entry.teamName}-${entry.position}`} className="rounded-xl border border-slate-700/50 bg-black/25 p-3 text-sm">
                <p className="font-semibold text-white">{entry.position}. {entry.teamName}</p>
                <p className="text-slate-300">S24 {entry.score} · {entry.note}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-700/60 bg-slate-950/60 p-5">
          <h2 className="text-xl font-semibold text-white">Narrativa automatica</h2>
          <div className="mt-3 space-y-3 text-sm leading-7 text-slate-200">
            <p><span className="font-semibold text-white">Estado de la liga:</span> {data.narrative.leagueState}</p>
            <p><span className="font-semibold text-white">Evolucion:</span> {data.narrative.evolution}</p>
            <p><span className="font-semibold text-white">Insights:</span> {data.narrative.insights}</p>
          </div>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <article className="rounded-2xl border border-slate-700/60 bg-slate-950/60 p-5">
          <h3 className="text-lg font-semibold text-white">Equipos destacados</h3>
          <div className="mt-3">
            <TeamList teams={data.highlightedTeams.destacados} metric={(team) => `Indice ${team.avgIndex} · Consistencia ${team.consistencyScore}`} />
          </div>
        </article>

        <article className="rounded-2xl border border-slate-700/60 bg-slate-950/60 p-5">
          <h3 className="text-lg font-semibold text-white">Equipos en crecimiento</h3>
          <div className="mt-3">
            <TeamList teams={data.highlightedTeams.crecimiento} metric={(team) => `Tendencia ${team.trendBalance} · Confianza ${team.confidenceRate}`} />
          </div>
        </article>

        <article className="rounded-2xl border border-slate-700/60 bg-slate-950/60 p-5">
          <h3 className="text-lg font-semibold text-white">Equipos en caida</h3>
          <div className="mt-3">
            <TeamList teams={data.highlightedTeams.caida} metric={(team) => `Tendencia ${team.trendBalance} · Riesgo ${team.riskRate}`} />
          </div>
        </article>
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
          <h2 className="text-xl font-semibold text-white">Alertas metodologicas</h2>
          <div className="mt-3 space-y-2.5">
            {data.alerts.length === 0 ? (
              <p className="text-sm text-slate-400">Sin alertas activas.</p>
            ) : data.alerts.map((alert, idx) => (
              <div key={`${alert.title}-${idx}`} className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm">
                <p className="font-semibold text-white">{alert.title} · {alert.level}</p>
                <p className="mt-1 text-amber-100">{alert.description}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.12em] text-amber-200">{alert.signal}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-700/60 bg-slate-950/60 p-5">
        <h2 className="text-xl font-semibold text-white">Comparacion con temporadas anteriores</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Indice actual" value={data.seasonComparison.currentWindow.averageIndex} />
          <StatCard label="Indice previo" value={data.seasonComparison.previousWindow.averageIndex} />
          <StatCard label="Delta indice" value={data.seasonComparison.delta.averageIndex} />
          <StatCard label="Delta intensidad" value={data.seasonComparison.delta.intensity} />
          <StatCard label="Delta volatilidad" value={data.seasonComparison.delta.volatility} />
          <StatCard label="Muestras actuales" value={data.seasonComparison.currentWindow.sampleSize} />
          <StatCard label="Muestras previas" value={data.seasonComparison.previousWindow.sampleSize} />
        </div>
        <p className="mt-3 text-sm text-slate-300">{data.seasonComparison.summary}</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-3">Pasaporte Analitico</h2>
        <PasaporteAnaliticoS24 pasaporte={data.passport} />
      </section>
    </div>
  );
}
