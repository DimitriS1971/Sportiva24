import type { RealMatchContext } from '@/lib/intelligence-s24/realMatchContext';

interface ContextoRealPartidoS24Props {
  context: RealMatchContext | null;
}

export default function ContextoRealPartidoS24({ context }: ContextoRealPartidoS24Props) {
  if (!context) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-emerald-400/30 bg-[linear-gradient(155deg,rgba(6,78,59,0.38),rgba(3,7,18,0.96))] p-5 md:p-7">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-emerald-400/40 bg-emerald-500/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-100">Datos verificados</span>
        <span className="text-xs text-emerald-200/80">Fuente: API-Football</span>
      </div>

      <h2 className="mt-4 font-editorial text-2xl md:text-3xl text-white">Situacion previa</h2>
      <p className="mt-3 text-sm md:text-base leading-relaxed text-slate-100">{context.summary}</p>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <article className="rounded-xl border border-emerald-300/20 bg-black/25 p-3">
          <p className="text-[10px] uppercase tracking-[0.13em] text-emerald-200/70">Competicion</p>
          <p className="mt-1 text-sm font-semibold text-white">{context.fixture.competition}</p>
          {context.fixture.round ? <p className="mt-1 text-xs text-slate-300">{context.fixture.round}</p> : null}
        </article>
        <article className="rounded-xl border border-emerald-300/20 bg-black/25 p-3">
          <p className="text-[10px] uppercase tracking-[0.13em] text-emerald-200/70">Sede</p>
          <p className="mt-1 text-sm font-semibold text-white">{context.fixture.venue ?? 'No informada por el proveedor'}</p>
        </article>
        <article className="rounded-xl border border-emerald-300/20 bg-black/25 p-3">
          <p className="text-[10px] uppercase tracking-[0.13em] text-emerald-200/70">Arbitro</p>
          <p className="mt-1 text-sm font-semibold text-white">{context.fixture.referee ?? 'No informado por el proveedor'}</p>
        </article>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-white">Enfrentamientos directos disponibles</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-slate-700/50 bg-black/25 p-3 text-center"><p className="text-2xl font-semibold text-emerald-200">{context.headToHead.homeWins}</p><p className="mt-1 text-xs text-slate-300">Victorias local actual</p></div>
          <div className="rounded-xl border border-slate-700/50 bg-black/25 p-3 text-center"><p className="text-2xl font-semibold text-slate-100">{context.headToHead.draws}</p><p className="mt-1 text-xs text-slate-300">Empates</p></div>
          <div className="rounded-xl border border-slate-700/50 bg-black/25 p-3 text-center"><p className="text-2xl font-semibold text-amber-200">{context.headToHead.awayWins}</p><p className="mt-1 text-xs text-slate-300">Victorias visitante actual</p></div>
        </div>
        {context.headToHead.matches.length > 0 ? (
          <div className="mt-3 space-y-2">
            {context.headToHead.matches.map((match) => <p key={`${match.date}-${match.homeTeam}-${match.awayTeam}`} className="rounded-lg border border-slate-700/45 bg-black/20 px-3 py-2 text-sm text-slate-200">{match.homeTeam} {match.score} {match.awayTeam} <span className="text-slate-500">{match.date}</span></p>)}
          </div>
        ) : null}
      </div>

      <p className="mt-5 text-xs leading-relaxed text-slate-400">El plan actual no entrega: {context.unavailableData.join(', ')}. Sportiva24 no sustituye esos datos por estimaciones presentadas como hechos.</p>
    </section>
  );
}
