import type { Match } from '@/lib/data/types/domain';
import type { RealMatchContext } from '@/lib/intelligence-s24/realMatchContext';
import type { MatchPredictionV2 } from '@/lib/intelligence-s24/v2';
import LocalizedMatchDateTime from '@/app/components/LocalizedMatchDateTime';
import { getTeamCrest } from '@/app/lib/teamCrests';

interface DatosPartidoDirectosProps {
  match: Match;
  providerId: string;
  realContext: RealMatchContext | null;
  prediction: MatchPredictionV2;
  scheduleDateTimeUtc?: string;
  scheduleLabel?: string;
}

function ProviderLabel({ providerId }: { providerId: string }) {
  const labels: Record<string, string> = {
    'api-football': 'API-Football',
    'football-data': 'football-data.org',
    sportsdb: 'TheSportsDB',
    mock: 'Datos locales',
  };
  const label = labels[providerId] ?? providerId;

  return (
    <span className="rounded-full border border-emerald-400/40 bg-emerald-500/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-100">
      Fuente de datos: {label}
    </span>
  );
}

function normalizeTeamName(name: string): string {
  return name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function averageGoals(matches: RealMatchContext['recentForm']['home']) {
  if (matches.length === 0) return null;

  const totals = matches.reduce((accumulator, match) => {
    const [scored, conceded] = match.score.split('-').map(Number);
    return {
      scored: accumulator.scored + (Number.isFinite(scored) ? scored : 0),
      conceded: accumulator.conceded + (Number.isFinite(conceded) ? conceded : 0),
    };
  }, { scored: 0, conceded: 0 });

  return {
    scored: totals.scored / matches.length,
    conceded: totals.conceded / matches.length,
  };
}

function TeamShield({ team, crest }: { team: string; crest?: string }) {
  const resolvedCrest = getTeamCrest(team, crest);
  return <img src={resolvedCrest} alt={`Escudo de ${team}`} className="h-12 w-12 object-contain" />;
}

export default function DatosPartidoDirectos({ match, providerId, realContext, prediction, scheduleDateTimeUtc, scheduleLabel }: DatosPartidoDirectosProps) {
  const isLive = ['EN VIVO', 'ENTRETIEMPO', 'PRÓRROGA', 'DESCANSO', 'PENALES'].includes(match.status);
  const isFinished = ['FINALIZADO', 'DESPUÉS DE PRÓRROGA', 'ADJUDICADO'].includes(match.status);
  const statisticsTitle = isLive ? 'Estadísticas en vivo' : isFinished ? 'Estadísticas finales' : 'Estadísticas anteriores';
  const statisticsSubtitle = isLive ? 'Datos del partido en juego' : isFinished ? 'Datos registrados al finalizar' : 'Contexto previo disponible';
  const homeRecent = realContext?.recentForm.home ?? [];
  const awayRecent = realContext?.recentForm.away ?? [];
  const homeAverage = averageGoals(homeRecent);
  const awayAverage = averageGoals(awayRecent);
  const homeStanding = realContext?.standings.find((standing) => normalizeTeamName(standing.teamName) === normalizeTeamName(match.homeTeam.name));
  const awayStanding = realContext?.standings.find((standing) => normalizeTeamName(standing.teamName) === normalizeTeamName(match.awayTeam.name));

  return (
    <section className="space-y-5 md:space-y-6">
      {realContext && !isLive && !isFinished ? (
        <article className="rounded-2xl border border-cyan-400/25 bg-slate-950 p-5 shadow-xl shadow-black/20 md:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-300">Contexto previo</p>
              <h2 className="mt-2 font-editorial text-2xl text-white">La situación antes del derbi</h2>
            </div>
            <ProviderLabel providerId={providerId} />
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {[{ team: match.homeTeam, crest: match.homeTeam.badgeUrl, standing: homeStanding, average: homeAverage }, { team: match.awayTeam, crest: match.awayTeam.badgeUrl, standing: awayStanding, average: awayAverage }].map((item) => (
              <div key={item.team.name} className="rounded-xl border border-slate-800 bg-black/20 p-4">
                <div className="flex items-center gap-3"><TeamShield team={item.team.name} crest={item.crest} /><div><h3 className="font-semibold text-white">{item.team.name}</h3><p className="mt-1 text-sm text-slate-400">{item.standing ? `${item.standing.position}º · ${item.standing.points ?? '-'} puntos · ${item.standing.played ?? '-'} partidos` : 'Posición no informada'}</p></div></div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-center"><div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3"><p className="text-xs text-slate-500">Promedio goles a favor</p><p className="mt-1 text-lg font-semibold text-emerald-200">{item.average ? item.average.scored.toFixed(2) : '-'}</p></div><div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3"><p className="text-xs text-slate-500">Promedio goles recibidos</p><p className="mt-1 text-lg font-semibold text-rose-200">{item.average ? item.average.conceded.toFixed(2) : '-'}</p></div></div>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-black/20 p-4">
              <h3 className="font-semibold text-white">Últimos 2 enfrentamientos directos</h3>
              <div className="mt-3 space-y-2">{realContext.headToHead.matches.slice(0, 2).map((history) => <div key={`${history.date}-${history.homeTeam}-${history.awayTeam}`} className="grid grid-cols-[5rem_1fr_auto_1fr] items-center gap-2 text-sm"><time className="text-xs text-slate-500"><LocalizedMatchDateTime dateTimeUtc={history.dateTimeUtc} fallback={history.date} /></time><span className="truncate text-right text-slate-200">{history.homeTeam}</span><span className="rounded bg-slate-800 px-2 py-1 font-semibold text-white">{history.score}</span><span className="truncate text-slate-200">{history.awayTeam}</span></div>)}</div>
              {realContext.headToHead.matches.length === 0 ? <p className="mt-3 text-sm text-slate-500">No hay enfrentamientos directos disponibles.</p> : null}
            </div>
            <div className="rounded-xl border border-slate-800 bg-black/20 p-4">
              <h3 className="font-semibold text-white">Últimos 2 contra otros rivales</h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">{[{ team: match.homeTeam.name, matches: homeRecent.slice(0, 2) }, { team: match.awayTeam.name, matches: awayRecent.slice(0, 2) }].map((team) => <div key={team.team}><p className="text-sm font-semibold text-slate-200">{team.team}</p><div className="mt-2 space-y-1">{team.matches.map((recent) => <p key={`${recent.date}-${recent.opponent}`} className="text-xs leading-5 text-slate-400"><LocalizedMatchDateTime dateTimeUtc={recent.dateTimeUtc} fallback={recent.date} /> · {recent.result} {recent.score} vs {recent.opponent}</p>)}</div></div>)}</div>
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-500">Los promedios se calculan sobre la forma reciente disponible de API-Football, no solo sobre los dos partidos destacados.</p>
        </article>
      ) : null}

      {realContext ? (
        <article className="rounded-2xl border border-emerald-400/25 bg-slate-950 p-5 shadow-xl shadow-black/20 md:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300">{statisticsTitle}</p>
              <h2 className="mt-2 font-editorial text-2xl text-white">{statisticsSubtitle}</h2>
            </div>
            <ProviderLabel providerId={providerId} />
          </div>
          {realContext.liveStatistics.length > 0 ? <div className="mt-5 overflow-hidden rounded-xl border border-slate-800">
            <div className="grid grid-cols-[1fr_5rem_5rem] border-b border-slate-800 bg-black/30 px-4 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 md:grid-cols-[1fr_8rem_8rem]">
              <span>Estadística</span>
              {realContext.liveStatistics.map((team) => <span key={team.teamName} className="truncate text-center text-slate-300">{team.teamName}</span>)}
            </div>
            {[
              { label: 'Tiros totales', value: (team: typeof realContext.liveStatistics[number]) => team.totalShots },
              { label: 'Tiros al arco', value: (team: typeof realContext.liveStatistics[number]) => team.shotsOnTarget },
              { label: 'Tiros fuera', value: (team: typeof realContext.liveStatistics[number]) => team.shotsOffTarget },
              { label: 'Tiros bloqueados', value: (team: typeof realContext.liveStatistics[number]) => team.blockedShots },
              { label: 'Tarjetas', value: (team: typeof realContext.liveStatistics[number]) => team.yellowCards !== undefined || team.redCards !== undefined ? `${team.yellowCards ?? 0} A · ${team.redCards ?? 0} R` : undefined },
              { label: 'Corners', value: (team: typeof realContext.liveStatistics[number]) => team.corners },
              { label: 'Faltas', value: (team: typeof realContext.liveStatistics[number]) => team.fouls },
              { label: 'Paradas', value: (team: typeof realContext.liveStatistics[number]) => team.goalkeeperSaves },
              { label: 'Pases', value: (team: typeof realContext.liveStatistics[number]) => team.totalPasses },
              { label: 'Pases precisos', value: (team: typeof realContext.liveStatistics[number]) => team.accuratePasses },
              { label: 'Posesión', value: (team: typeof realContext.liveStatistics[number]) => team.possession },
            ].map((statistic) => (
              <div key={statistic.label} className="grid grid-cols-[1fr_5rem_5rem] items-center border-b border-slate-800 px-4 py-3 text-sm last:border-b-0 md:grid-cols-[1fr_8rem_8rem]">
                <span className="text-slate-400">{statistic.label}</span>
                {realContext.liveStatistics.map((team) => <span key={team.teamName} className="text-center font-semibold text-white">{statistic.value(team) ?? '-'}</span>)}
              </div>
            ))}
          </div> : <p className="mt-5 rounded-xl border border-amber-400/25 bg-amber-500/10 p-4 text-sm leading-6 text-amber-100">{isLive ? 'El proveedor todavía no entrega estadísticas detalladas. El marcador y el minuto continúan actualizándose.' : isFinished ? 'El proveedor no devolvió estadísticas detalladas para este partido finalizado.' : 'Las estadísticas del partido estarán disponibles cuando comience. Mientras tanto se muestran la tabla, forma e historial previos.'}</p>}
        </article>
      ) : null}

      <article className="rounded-2xl border border-sky-400/25 bg-slate-950 p-5 shadow-xl shadow-black/20 md:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-300">Análisis IA</p><h2 className="mt-2 font-editorial text-2xl text-white">Modelo S24</h2></div>
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-sky-200">{prediction.status === 'ready' ? 'Modelo listo' : prediction.status === 'limited-data' ? 'Datos limitados' : 'Datos insuficientes'}</span>
        </div>
        {prediction.probabilities ? <div className="mt-5 grid grid-cols-3 overflow-hidden rounded-xl border border-slate-800 bg-black/25 text-center">
          <Metric label={match.homeTeam.name} value={`${(prediction.probabilities.home * 100).toFixed(1)}%`} />
          <Metric label="Empate" value={`${(prediction.probabilities.draw * 100).toFixed(1)}%`} bordered />
          <Metric label={match.awayTeam.name} value={`${(prediction.probabilities.away * 100).toFixed(1)}%`} bordered />
        </div> : <p className="mt-4 text-sm leading-6 text-amber-100">{prediction.limitations[0] ?? 'No hay cobertura suficiente para publicar una probabilidad.'}</p>}
        <p className="mt-4 text-sm text-slate-400">Calidad de datos: {prediction.dataQuality.score}/100.</p>
      </article>

      {realContext && realContext.standings.length > 0 ? (
        <article className="rounded-2xl border border-slate-700/60 bg-slate-950 p-5 shadow-xl shadow-black/20 md:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Competición</p>
              <h2 className="mt-2 font-editorial text-2xl text-white">Posición en la tabla</h2>
            </div>
            <ProviderLabel providerId={providerId} />
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {realContext.standings.map((standing) => (
              <div key={standing.teamId} className="flex items-center justify-between rounded-xl border border-slate-800 bg-black/20 px-4 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <TeamShield
                    team={standing.teamName}
                    crest={normalizeTeamName(standing.teamName) === normalizeTeamName(match.homeTeam.name) ? match.homeTeam.badgeUrl : match.awayTeam.badgeUrl}
                  />
                  <div>
                    <p className="font-semibold text-white">{standing.teamName}</p>
                  <p className="mt-1 text-xs text-slate-400">{standing.played ?? '-'} partidos · {standing.points ?? '-'} puntos</p>
                  </div>
                </div>
                <span className="text-2xl font-semibold text-cyan-200">{standing.position}º</span>
              </div>
            ))}
          </div>
        </article>
      ) : null}

      {realContext ? (
        <article className="rounded-2xl border border-slate-700/60 bg-slate-950 p-5 shadow-xl shadow-black/20 md:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Datos del encuentro</p>
              <h2 className="mt-2 font-editorial text-2xl text-white">Alineaciones</h2>
            </div>
            <ProviderLabel providerId={providerId} />
          </div>
          {realContext.lineups.length > 0 ? <div className="mt-5 grid gap-4 md:grid-cols-2">
            {realContext.lineups.map((lineup) => (
              <div key={lineup.teamName} className="rounded-xl border border-slate-800 bg-black/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-white">{lineup.teamName}</h3>
                  {lineup.formation ? <span className="text-xs text-cyan-200">{lineup.formation}</span> : null}
                </div>
                <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Titulares</p>
                <p className="mt-1 text-sm leading-6 text-slate-200">{lineup.starters.join(' · ') || 'No informados'}</p>
                {lineup.substitutes.length > 0 ? <><p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Suplentes</p><p className="mt-1 text-sm leading-6 text-slate-300">{lineup.substitutes.join(' · ')}</p></> : null}
              </div>
            ))}
          </div> : <p className="mt-5 rounded-xl border border-amber-400/25 bg-amber-500/10 p-4 text-sm leading-6 text-amber-100">Las alineaciones no están confirmadas o el proveedor no las entregó para este estado del partido.</p>}
        </article>
      ) : null}

      {realContext && realContext.seasonStatistics.length > 0 ? (
        <article className="rounded-2xl border border-slate-700/60 bg-slate-950 p-5 shadow-xl shadow-black/20 md:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Temporada actual</p>
              <h2 className="mt-2 font-editorial text-2xl text-white">Rendimiento estadístico</h2>
            </div>
            <ProviderLabel providerId={providerId} />
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {realContext.seasonStatistics.map((team) => (
              <div key={team.teamId} className="rounded-xl border border-slate-800 bg-black/20 p-4">
                <h3 className="font-semibold text-white">{team.teamName}</h3>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <SeasonMetric label="Partidos" value={`${team.homePlayed ?? '-'} casa · ${team.awayPlayed ?? '-'} fuera`} />
                  <SeasonMetric label="Goles a favor" value={`${team.homeGoalsFor ?? '-'} casa · ${team.awayGoalsFor ?? '-'} fuera`} />
                  <SeasonMetric label="Goles recibidos" value={`${team.homeGoalsAgainst ?? '-'} casa · ${team.awayGoalsAgainst ?? '-'} fuera`} />
                  <SeasonMetric label="Vallas invictas" value={`${team.homeCleanSheets ?? '-'} casa · ${team.awayCleanSheets ?? '-'} fuera`} />
                </div>
              </div>
            ))}
          </div>
        </article>
      ) : null}

      {realContext && (realContext.recentForm.home.length > 0 || realContext.recentForm.away.length > 0) ? (
        <article className="rounded-2xl border border-slate-700/60 bg-slate-950 p-5 shadow-xl shadow-black/20 md:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Rendimiento reciente</p>
              <h2 className="mt-2 font-editorial text-2xl text-white">Últimos partidos jugados</h2>
            </div>
            <ProviderLabel providerId={providerId} />
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {[
              { name: match.homeTeam.name, matches: realContext.recentForm.home },
              { name: match.awayTeam.name, matches: realContext.recentForm.away },
            ].map((team) => (
              <div key={team.name} className="rounded-xl border border-slate-800 bg-black/20 p-4">
                <h3 className="font-semibold text-white">{team.name}</h3>
                <div className="mt-3 space-y-2">
                  {team.matches.length > 0 ? team.matches.map((recent) => (
                    <div key={`${recent.date}-${recent.opponent}`} className="grid grid-cols-[5.5rem_1fr_auto] items-center gap-2 text-sm">
                      <time className="text-xs text-slate-500"><LocalizedMatchDateTime dateTimeUtc={recent.dateTimeUtc} fallback={recent.date} /></time>
                      <span className="truncate text-slate-200">vs {recent.opponent}</span>
                      <span className={`font-semibold ${recent.result === 'V' ? 'text-emerald-300' : recent.result === 'D' ? 'text-rose-300' : 'text-amber-200'}`}>
                        {recent.result} {recent.score}
                      </span>
                    </div>
                  )) : <p className="text-sm text-slate-500">El proveedor no devolvió partidos recientes para este equipo.</p>}
                </div>
              </div>
            ))}
          </div>
        </article>
      ) : null}

      {realContext ? (
        <article className="rounded-2xl border border-slate-700/60 bg-slate-950 p-5 shadow-xl shadow-black/20 md:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Historial entre equipos</p>
              <h2 className="mt-2 font-editorial text-2xl text-white">Cara a cara</h2>
            </div>
            <ProviderLabel providerId={providerId} />
          </div>

          <div className="mt-5 grid grid-cols-3 overflow-hidden rounded-xl border border-slate-800 bg-black/25">
            <div className="border-r border-slate-800 px-3 py-4 text-center"><p className="text-2xl font-semibold text-emerald-200">{realContext.headToHead.homeWins}</p><p className="mt-1 text-xs text-slate-400">Gana {match.homeTeam.name}</p></div>
            <div className="border-r border-slate-800 px-3 py-4 text-center"><p className="text-2xl font-semibold text-slate-100">{realContext.headToHead.draws}</p><p className="mt-1 text-xs text-slate-400">Empates</p></div>
            <div className="px-3 py-4 text-center"><p className="text-2xl font-semibold text-amber-200">{realContext.headToHead.awayWins}</p><p className="mt-1 text-xs text-slate-400">Gana {match.awayTeam.name}</p></div>
          </div>

          {realContext.headToHead.matches.length > 0 ? (
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-800">
              {realContext.headToHead.matches.map((history) => (
                <div key={`${history.date}-${history.homeTeam}-${history.awayTeam}`} className="grid grid-cols-[4.5rem_1fr_auto_1fr] items-center gap-2 border-b border-slate-800 bg-black/20 px-3 py-3 last:border-b-0 text-sm md:grid-cols-[6.5rem_1fr_auto_1fr] md:gap-3 md:px-4">
                  <time dateTime={history.dateTimeUtc ?? history.date} className="text-xs text-slate-500"><LocalizedMatchDateTime dateTimeUtc={history.dateTimeUtc} fallback={history.date} /></time>
                  <span className="text-right text-slate-200">{history.homeTeam}</span>
                  <span className="rounded-md bg-slate-800 px-2 py-1 font-semibold text-white">{history.score}</span>
                  <span className="text-slate-200">{history.awayTeam}</span>
                </div>
              ))}
            </div>
          ) : null}
        </article>
      ) : null}
    </section>
  );
}

function Metric({ label, value, bordered = false }: { label: string; value: string; bordered?: boolean }) {
  return <div className={`min-w-0 px-3 py-3 ${bordered ? 'border-l border-slate-800' : ''}`}><p className="truncate text-xs text-slate-400">{label}</p><p className="mt-1 text-lg font-semibold text-white">{value}</p></div>;
}

function SeasonMetric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 font-semibold text-slate-200">{value}</p></div>;
}
