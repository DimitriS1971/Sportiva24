'use client';

import { useMemo, useState } from 'react';

import type {
  CenterViewDefinition,
  CenterViewKey,
  CompetitionIntelligenceItem,
  IntelligenceCenterData,
  MethodologicalAlert,
  RankingEntry,
  TeamStrengthItem,
} from '@/lib/intelligence-s24/intelligence-center';

interface IntelligenceCenterS24PanelProps {
  data: IntelligenceCenterData;
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-slate-600/70 bg-slate-800/70 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-slate-200">
      {children}
    </span>
  );
}

function EmptyState({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="rounded-2xl border border-slate-700/60 bg-slate-900/35 p-5 text-sm text-slate-300">
      <p className="font-semibold text-white">{title}</p>
      <p className="mt-2">{subtitle}</p>
    </div>
  );
}

function TeamList({ teams, metricLabel, metricValue }: { teams: TeamStrengthItem[]; metricLabel: string; metricValue: (team: TeamStrengthItem) => string }) {
  if (teams.length === 0) {
    return <p className="text-sm text-slate-400">Sin datos suficientes.</p>;
  }

  return (
    <div className="space-y-2.5">
      {teams.map((team) => (
        <div key={team.teamName} className="rounded-xl border border-slate-700/50 bg-black/25 p-3 text-sm">
          <p className="font-semibold text-white">{team.teamName}</p>
          <p className="text-slate-300">{metricLabel}: {metricValue(team)} · Apariciones: {team.appearances}</p>
        </div>
      ))}
    </div>
  );
}

function AlertList({ alerts }: { alerts: MethodologicalAlert[] }) {
  if (alerts.length === 0) {
    return <p className="text-sm text-slate-400">Sin alertas relevantes.</p>;
  }

  return (
    <div className="space-y-2.5">
      {alerts.map((alert, idx) => (
        <div key={`${alert.title}-${idx}`} className="rounded-xl border border-slate-700/50 bg-black/25 p-3 text-sm">
          <p className="font-semibold text-white">{alert.title}</p>
          <p className="mt-1 text-slate-300">{alert.description}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-400">{alert.scope} · {alert.signal}</p>
        </div>
      ))}
    </div>
  );
}

function CompetitionList({ competitions }: { competitions: CompetitionIntelligenceItem[] }) {
  if (competitions.length === 0) {
    return <p className="text-sm text-slate-400">Sin datos de competiciones.</p>;
  }

  return (
    <div className="space-y-2.5">
      {competitions.map((competition) => (
        <div key={competition.competition} className="rounded-xl border border-slate-700/50 bg-black/25 p-3 text-sm">
          <p className="font-semibold text-white">{competition.competition}</p>
          <p className="text-slate-300">Indice promedio: {competition.avgIndex} · Nivel: {competition.competitiveLevel}</p>
          <p className="text-slate-300">Tendencia: {competition.evolution} · Alertas: {competition.alertCount}</p>
        </div>
      ))}
    </div>
  );
}

function RankingList({ entries, title }: { entries: RankingEntry[]; title: string }) {
  return (
    <article className="rounded-2xl border border-slate-700/60 bg-slate-950/60 p-5">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <div className="mt-3 space-y-2.5">
        {entries.length === 0 ? (
          <p className="text-sm text-slate-400">Sin datos suficientes.</p>
        ) : entries.map((entry, idx) => (
          <div key={`${entry.name}-${idx}`} className="rounded-xl border border-slate-700/50 bg-black/25 p-3 text-sm">
            <p className="font-semibold text-white">{idx + 1}. {entry.name}</p>
            <p className="text-slate-300">{entry.note}: {entry.score}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

function ViewButton({
  view,
  active,
  onClick,
}: {
  view: CenterViewDefinition;
  active: boolean;
  onClick: (key: CenterViewKey) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick(view.key)}
      className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${active
        ? 'border-sky-400/70 bg-sky-400/20 text-sky-100'
        : 'border-slate-700/60 bg-slate-900/45 text-slate-300 hover:border-slate-500/70 hover:text-white'}`}
    >
      {view.label}
    </button>
  );
}

export default function IntelligenceCenterS24Panel({ data }: IntelligenceCenterS24PanelProps) {
  const [activeView, setActiveView] = useState<CenterViewKey>('panorama');

  const activeDescription = useMemo(
    () => data.views.find((view) => view.key === activeView)?.description ?? '',
    [activeView, data.views],
  );

  return (
    <div className="px-4 md:px-12 pt-24 pb-14 max-w-7xl mx-auto space-y-8">
      <section className="rounded-3xl border border-slate-700/45 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_45%),linear-gradient(160deg,rgba(15,23,42,0.95),rgba(2,6,23,0.98))] p-6 text-center md:p-8">
        <div className="mb-3 flex flex-wrap items-center justify-center gap-2">
          <Pill>Centro de Inteligencia Deportiva S24</Pill>
          <Pill>{data.sourceCount} partidos procesados</Pill>
          <Pill>{data.analyzedTeams} clubes</Pill>
          <Pill>{data.analyzedCompetitions} competiciones</Pill>
        </div>
        <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">Centro de Inteligencia Deportiva S24</h1>
        <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-slate-300 md:text-base">
          Panel global de inteligencia deportiva. Esta seccion no publica analisis completos de partidos y se enfoca en dinamicas de clubes, competiciones, tendencias, rankings y alertas metodologicas.
        </p>
        <p className="mt-2 text-xs text-slate-400">Actualizado: {new Date(data.generatedAt).toLocaleString('es-ES')}</p>
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-700/60 bg-slate-950/50 p-4 text-center md:p-5">
        <div className="flex flex-wrap justify-center gap-2">
          {data.views.map((view) => (
            <ViewButton key={view.key} view={view} active={activeView === view.key} onClick={setActiveView} />
          ))}
        </div>
        <p className="text-sm text-slate-300">{activeDescription}</p>
      </section>

      {activeView === 'panorama' && (
        <section className="space-y-4">
          <article className="rounded-2xl border border-slate-700/60 bg-slate-950/60 p-5">
            <h2 className="text-xl font-semibold text-white">Resumen del dia</h2>
            <p className="mt-3 text-slate-300">{data.panoramaGeneral.resumenDia}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Pill>Partidos: {data.panoramaGeneral.partidosAnalizados}</Pill>
              <Pill>Motor S24: {data.panoramaGeneral.validationSnapshot.motorGlobal}</Pill>
              <Pill>Narrativa: {data.panoramaGeneral.validationSnapshot.narrativeGlobal}</Pill>
              <Pill>Insights: {data.panoramaGeneral.validationSnapshot.insightGlobal}</Pill>
            </div>
          </article>

          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-slate-700/60 bg-slate-950/60 p-5">
              <h3 className="text-lg font-semibold text-white">Equipos con mayor crecimiento</h3>
              <div className="mt-3">
                <TeamList teams={data.panoramaGeneral.equiposMayorCrecimiento} metricLabel="Tendencia" metricValue={(team) => `${team.trendBalance}`} />
              </div>
            </article>
            <article className="rounded-2xl border border-slate-700/60 bg-slate-950/60 p-5">
              <h3 className="text-lg font-semibold text-white">Equipos con mayor caida</h3>
              <div className="mt-3">
                <TeamList teams={data.panoramaGeneral.equiposMayorCaida} metricLabel="Tendencia" metricValue={(team) => `${team.trendBalance}`} />
              </div>
            </article>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-slate-700/60 bg-slate-950/60 p-5">
              <h3 className="text-lg font-semibold text-white">Partidos con mayor incertidumbre</h3>
              <div className="mt-3 space-y-2.5">
                {data.panoramaGeneral.partidosMayorIncertidumbre.length === 0 ? (
                  <EmptyState title="Sin señales de incertidumbre" subtitle="No hay suficientes partidos en la ventana actual." />
                ) : data.panoramaGeneral.partidosMayorIncertidumbre.map((match, idx) => (
                  <div key={`${match.homeTeam}-${match.awayTeam}-${idx}`} className="rounded-xl border border-amber-500/35 bg-amber-500/10 p-3 text-sm">
                    <p className="font-semibold text-white">{match.homeTeam} vs {match.awayTeam}</p>
                    <p className="text-amber-100">{match.competition} · Riesgo: {match.risk} · Confianza: {match.confidence}</p>
                  </div>
                ))}
              </div>
            </article>
            <article className="rounded-2xl border border-slate-700/60 bg-slate-950/60 p-5">
              <h3 className="text-lg font-semibold text-white">Alertas metodologicas</h3>
              <div className="mt-3">
                <AlertList alerts={data.panoramaGeneral.alertasMetodologicas} />
              </div>
            </article>
          </div>
        </section>
      )}

      {activeView === 'clubes' && (
        <section className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-slate-700/60 bg-slate-950/60 p-5">
              <h2 className="text-xl font-semibold text-white">Ranking S24</h2>
              <div className="mt-3">
                <TeamList teams={data.clubes.rankingS24.slice(0, 10)} metricLabel="Indice" metricValue={(team) => `${team.avgIndex}`} />
              </div>
            </article>
            <article className="rounded-2xl border border-slate-700/60 bg-slate-950/60 p-5">
              <h2 className="text-xl font-semibold text-white">Tendencias de clubes</h2>
              <div className="mt-3 text-sm text-slate-300 space-y-1">
                <p>Trayectorias positivas: {data.clubes.tendencias.positivas}</p>
                <p>Trayectorias estables: {data.clubes.tendencias.estables}</p>
                <p>Trayectorias negativas: {data.clubes.tendencias.negativas}</p>
              </div>
            </article>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-slate-700/60 bg-slate-950/60 p-5">
              <h3 className="text-lg font-semibold text-white">Equipos mas solidos</h3>
              <div className="mt-3">
                <TeamList teams={data.clubes.equiposSolidos} metricLabel="Consistencia" metricValue={(team) => `${team.consistencyScore}`} />
              </div>
            </article>
            <article className="rounded-2xl border border-slate-700/60 bg-slate-950/60 p-5">
              <h3 className="text-lg font-semibold text-white">Equipos con mayor riesgo</h3>
              <div className="mt-3">
                <TeamList teams={data.clubes.equiposMayorRiesgo} metricLabel="Riesgo" metricValue={(team) => `${Math.round(team.highRiskRate * 100)}%`} />
              </div>
            </article>
            <article className="rounded-2xl border border-slate-700/60 bg-slate-950/60 p-5">
              <h3 className="text-lg font-semibold text-white">Equipos con mayor crecimiento</h3>
              <div className="mt-3">
                <TeamList teams={data.clubes.equiposMayorCrecimiento} metricLabel="Balance de tendencia" metricValue={(team) => `${team.trendBalance}`} />
              </div>
            </article>
          </div>
        </section>
      )}

      {activeView === 'competiciones' && (
        <section className="space-y-4">
          <article className="rounded-2xl border border-slate-700/60 bg-slate-950/60 p-5">
            <h2 className="text-xl font-semibold text-white">Rankings por liga</h2>
            <div className="mt-3">
              <CompetitionList competitions={data.competiciones.rankingsPorLiga} />
            </div>
          </article>
          <article className="rounded-2xl border border-slate-700/60 bg-slate-950/60 p-5">
            <h2 className="text-xl font-semibold text-white">Alertas por competicion</h2>
            <div className="mt-3">
              <AlertList alerts={data.competiciones.alertas} />
            </div>
          </article>
        </section>
      )}

      {activeView === 'tendencias' && (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <article className="rounded-2xl border border-slate-700/60 bg-slate-950/60 p-5">
            <h3 className="text-lg font-semibold text-white">Mejores ataques</h3>
            <div className="mt-3"><TeamList teams={data.tendencias.mejoresAtaques} metricLabel="Ataque" metricValue={(team) => `${team.offenseScore}`} /></div>
          </article>
          <article className="rounded-2xl border border-slate-700/60 bg-slate-950/60 p-5">
            <h3 className="text-lg font-semibold text-white">Mejores defensas</h3>
            <div className="mt-3"><TeamList teams={data.tendencias.mejoresDefensas} metricLabel="Defensa" metricValue={(team) => `${team.defenseScore}`} /></div>
          </article>
          <article className="rounded-2xl border border-slate-700/60 bg-slate-950/60 p-5">
            <h3 className="text-lg font-semibold text-white">Mayor consistencia</h3>
            <div className="mt-3"><TeamList teams={data.tendencias.mayorConsistencia} metricLabel="Consistencia" metricValue={(team) => `${team.consistencyScore}`} /></div>
          </article>
          <article className="rounded-2xl border border-slate-700/60 bg-slate-950/60 p-5">
            <h3 className="text-lg font-semibold text-white">Mayor volatilidad</h3>
            <div className="mt-3"><TeamList teams={data.tendencias.mayorVolatilidad} metricLabel="Volatilidad" metricValue={(team) => `${team.volatilityScore}`} /></div>
          </article>
          <article className="rounded-2xl border border-slate-700/60 bg-slate-950/60 p-5">
            <h3 className="text-lg font-semibold text-white">Mayor crecimiento</h3>
            <div className="mt-3"><TeamList teams={data.tendencias.mayorCrecimiento} metricLabel="Tendencia" metricValue={(team) => `${team.trendBalance}`} /></div>
          </article>
          <article className="rounded-2xl border border-slate-700/60 bg-slate-950/60 p-5">
            <h3 className="text-lg font-semibold text-white">Peor momento deportivo</h3>
            <div className="mt-3"><TeamList teams={data.tendencias.peorMomentoDeportivo} metricLabel="Tendencia" metricValue={(team) => `${team.trendBalance}`} /></div>
          </article>
        </section>
      )}

      {activeView === 'rankings' && (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <RankingList entries={data.rankings.topS24Index} title="Top S24 Index" />
          <RankingList entries={data.rankings.topRating} title="Top Rating" />
          <RankingList entries={data.rankings.mayorConfianza} title="Mayor Confianza" />
          <RankingList entries={data.rankings.mayorRiesgo} title="Mayor Riesgo" />
          <RankingList entries={data.rankings.mejorTendencia} title="Mejor Tendencia" />
          <RankingList entries={data.rankings.mayorConsistencia} title="Mayor Consistencia" />
        </section>
      )}

      {activeView === 'alertas' && (
        <section className="rounded-2xl border border-slate-700/60 bg-slate-950/60 p-5">
          <h2 className="text-xl font-semibold text-white">Alertas metodologicas del Motor S24</h2>
          <div className="mt-3">
            <AlertList alerts={data.alertas.items} />
          </div>
        </section>
      )}

      {activeView === 'insights' && (
        <section className="rounded-2xl border border-slate-700/60 bg-slate-950/60 p-5">
          <h2 className="text-xl font-semibold text-white">Insights Globales</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {data.insightsGlobales.items.length === 0 ? (
              <EmptyState title="Sin insights globales" subtitle="No hay base suficiente para construir conclusiones editoriales globales." />
            ) : data.insightsGlobales.items.map((insight, idx) => (
              <article key={`${insight.title}-${idx}`} className="rounded-xl border border-slate-700/50 bg-black/25 p-4 text-sm">
                <p className="font-semibold text-white">{insight.title}</p>
                <p className="mt-2 text-slate-200">{insight.summary}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.12em] text-slate-400">Origen: {insight.source}</p>
                <ul className="mt-2 list-disc pl-5 text-xs text-slate-400 space-y-1">
                  {insight.evidence.map((evidence, evidenceIdx) => (
                    <li key={`${insight.title}-ev-${evidenceIdx}`}>{evidence}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
