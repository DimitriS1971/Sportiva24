import type { Match } from '@/lib/data/types/domain';
import type { RealMatchContext } from '@/lib/intelligence-s24/realMatchContext';

interface DatosPartidoDirectosProps {
  match: Match;
  providerId: string;
  realContext: RealMatchContext | null;
}

function ProviderLabel({ providerId }: { providerId: string }) {
  const label = providerId === 'api-football' ? 'API-Football' : providerId;

  return (
    <span className="rounded-full border border-emerald-400/40 bg-emerald-500/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-100">
      Fuente: {label}
    </span>
  );
}

function buildDataSummary(match: Match, context: RealMatchContext | null): string {
  if (!context || context.headToHead.matches.length === 0) {
    return `El proveedor confirma ${match.homeTeam.name} vs ${match.awayTeam.name} en ${match.competition}. No hay historial directo finalizado disponible en la fuente actual.`;
  }

  const { homeWins, draws, awayWins, matches } = context.headToHead;
  const balance = homeWins === awayWins
    ? `El historial disponible está equilibrado: ${homeWins} triunfo${homeWins === 1 ? '' : 's'} por lado y ${draws} empate${draws === 1 ? '' : 's'}.`
    : homeWins > awayWins
      ? `${match.homeTeam.name} tiene una ventaja histórica en la muestra: ${homeWins} triunfo${homeWins === 1 ? '' : 's'}, ${draws} empate${draws === 1 ? '' : 's'} y ${awayWins} victoria${awayWins === 1 ? '' : 's'} de ${match.awayTeam.name}.`
      : `${match.awayTeam.name} llega con mejor registro directo en la muestra: ${awayWins} triunfo${awayWins === 1 ? '' : 's'}, ${draws} empate${draws === 1 ? '' : 's'} y ${homeWins} victoria${homeWins === 1 ? '' : 's'} de ${match.homeTeam.name}.`;

  return `${match.homeTeam.name} vs ${match.awayTeam.name}, ${context.fixture.round ?? 'jornada no informada'} de ${match.competition}. ${balance}`;
}

export default function DatosPartidoDirectos({ match, providerId, realContext }: DatosPartidoDirectosProps) {
  const dataSummary = buildDataSummary(match, realContext);
  const directFacts = [
    { label: 'Competicion', value: match.competition },
    { label: 'Estado', value: match.status },
    { label: 'Horario', value: match.time },
    { label: 'Local', value: match.homeTeam.name },
    { label: 'Visitante', value: match.awayTeam.name },
  ];

  return (
    <section className="space-y-5 md:space-y-6">
      <article className="overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-950 shadow-xl shadow-black/25">
        <div className="border-b border-slate-700/60 bg-slate-900/70 px-5 py-4 md:px-7 md:py-5">
          <div className="flex flex-wrap items-center gap-2">
            <ProviderLabel providerId={providerId} />
            <span className="text-xs text-slate-400">Información confirmada del partido</span>
          </div>
          <h2 className="mt-3 font-editorial text-2xl md:text-3xl text-white">Datos disponibles del partido</h2>
          <p className="mt-3 max-w-4xl text-sm md:text-base leading-7 text-slate-200">{dataSummary}</p>
        </div>

        <div className="px-5 py-5 md:px-7 md:py-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Ficha del partido</p>
          <dl className="mt-3 divide-y divide-slate-800 rounded-xl border border-slate-800 bg-black/20">
            {directFacts.map((fact) => (
              <div key={fact.label} className="grid grid-cols-[8rem_1fr] gap-3 px-4 py-3 text-sm md:grid-cols-[11rem_1fr]">
                <dt className="text-slate-500">{fact.label}</dt>
                <dd className="font-medium text-slate-100">{fact.value}</dd>
              </div>
            ))}
            <div className="grid grid-cols-[8rem_1fr] gap-3 px-4 py-3 text-sm md:grid-cols-[11rem_1fr]">
              <dt className="text-slate-500">Sede</dt>
              <dd className="font-medium text-slate-100">{realContext?.fixture.venue ?? 'No informada por el proveedor'}</dd>
            </div>
            <div className="grid grid-cols-[8rem_1fr] gap-3 px-4 py-3 text-sm md:grid-cols-[11rem_1fr]">
              <dt className="text-slate-500">Arbitro</dt>
              <dd className="font-medium text-slate-100">{realContext?.fixture.referee ?? 'No informado por el proveedor'}</dd>
            </div>
          </dl>
        </div>
      </article>

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
                <div key={`${history.date}-${history.homeTeam}-${history.awayTeam}`} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-slate-800 bg-black/20 px-4 py-3 last:border-b-0 text-sm">
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
