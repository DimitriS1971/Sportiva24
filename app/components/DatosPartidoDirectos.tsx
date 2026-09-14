import type { Match } from '@/lib/data/types/domain';
import type { RealMatchContext } from '@/lib/intelligence-s24/realMatchContext';
import LocalizedMatchDateTime from '@/app/components/LocalizedMatchDateTime';

interface DatosPartidoDirectosProps {
  match: Match;
  providerId: string;
  realContext: RealMatchContext | null;
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
      Fuente: {label}
    </span>
  );
}

export default function DatosPartidoDirectos({ match, providerId, realContext, scheduleDateTimeUtc, scheduleLabel }: DatosPartidoDirectosProps) {
  return (
    <section className="space-y-5 md:space-y-6">
      {match.status === 'EN VIVO' && realContext ? (
        <article className="rounded-2xl border border-emerald-400/25 bg-slate-950 p-5 shadow-xl shadow-black/20 md:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300">Estadísticas en vivo</p>
              <h2 className="mt-2 font-editorial text-2xl text-white">Datos del partido en juego</h2>
            </div>
            <ProviderLabel providerId={providerId} />
          </div>
          {realContext.liveStatistics.length > 0 ? <div className="mt-5 overflow-hidden rounded-xl border border-slate-800">
            <div className="grid grid-cols-[1fr_5rem_5rem] border-b border-slate-800 bg-black/30 px-4 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 md:grid-cols-[1fr_8rem_8rem]">
              <span>Estadística</span>
              {realContext.liveStatistics.map((team) => <span key={team.teamName} className="truncate text-center text-slate-300">{team.teamName}</span>)}
            </div>
            {[
              { label: 'Tiros al arco', value: (team: typeof realContext.liveStatistics[number]) => team.shotsOnTarget },
              { label: 'Tarjetas', value: (team: typeof realContext.liveStatistics[number]) => team.yellowCards !== undefined || team.redCards !== undefined ? `${team.yellowCards ?? 0} A · ${team.redCards ?? 0} R` : undefined },
              { label: 'Corners', value: (team: typeof realContext.liveStatistics[number]) => team.corners },
              { label: 'Faltas', value: (team: typeof realContext.liveStatistics[number]) => team.fouls },
              { label: 'Posesión', value: (team: typeof realContext.liveStatistics[number]) => team.possession },
            ].map((statistic) => (
              <div key={statistic.label} className="grid grid-cols-[1fr_5rem_5rem] items-center border-b border-slate-800 px-4 py-3 text-sm last:border-b-0 md:grid-cols-[1fr_8rem_8rem]">
                <span className="text-slate-400">{statistic.label}</span>
                {realContext.liveStatistics.map((team) => <span key={team.teamName} className="text-center font-semibold text-white">{statistic.value(team) ?? '-'}</span>)}
              </div>
            ))}
          </div> : <p className="mt-5 rounded-xl border border-amber-400/25 bg-amber-500/10 p-4 text-sm leading-6 text-amber-100">El partido está en juego, pero API-Football todavía no entrega estadísticas detalladas para esta competición. El marcador y el minuto continúan actualizándose.</p>}
        </article>
      ) : null}

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
                <div>
                  <p className="font-semibold text-white">{standing.teamName}</p>
                  <p className="mt-1 text-xs text-slate-400">{standing.played ?? '-'} partidos · {standing.points ?? '-'} puntos</p>
                </div>
                <span className="text-2xl font-semibold text-cyan-200">{standing.position}º</span>
              </div>
            ))}
          </div>
        </article>
      ) : null}

      {realContext && realContext.lineups.length > 0 ? (
        <article className="rounded-2xl border border-slate-700/60 bg-slate-950 p-5 shadow-xl shadow-black/20 md:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Datos del encuentro</p>
              <h2 className="mt-2 font-editorial text-2xl text-white">Alineaciones</h2>
            </div>
            <ProviderLabel providerId={providerId} />
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
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
