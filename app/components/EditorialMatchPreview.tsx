import type { EditorialMatchPreview as EditorialMatchPreviewData } from '@/app/data/editorialMatchPreviews';

interface EditorialMatchPreviewProps {
  preview: EditorialMatchPreviewData;
}

const marketTone = {
  green: 'border-emerald-400/35 bg-emerald-500/10 text-emerald-100',
  amber: 'border-amber-400/35 bg-amber-500/10 text-amber-100',
  slate: 'border-slate-500/50 bg-slate-800/60 text-slate-100',
};

function SectionHeading({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-300">{eyebrow}</p>
      <h2 className="mt-2 font-editorial text-2xl md:text-3xl text-white">{title}</h2>
      {copy ? <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">{copy}</p> : null}
    </div>
  );
}

function TeamCrest({ src, name }: { src?: string; name: string }) {
  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-slate-600/60 bg-slate-950/70 p-2 shadow-lg md:h-20 md:w-20">
      {src ? (
        <img src={src} alt={`Escudo de ${name}`} className="h-full w-full object-contain" />
      ) : (
        <span className="text-base font-semibold text-cyan-100">{name.split(' ').map((part) => part[0]).join('').slice(0, 3)}</span>
      )}
    </div>
  );
}

export default function EditorialMatchPreview({ preview }: EditorialMatchPreviewProps) {
  const standings = preview.standings ?? [];
  const recentForm = preview.recentForm ?? [];
  const headToHead = preview.headToHead;
  const markets = preview.markets ?? [];

  return (
    <section className="space-y-6 md:space-y-8">
      <article className="overflow-hidden rounded-2xl border border-cyan-400/25 bg-[linear-gradient(135deg,rgba(8,47,73,0.72),rgba(15,23,42,0.98)_48%,rgba(2,6,23,0.98))] shadow-2xl shadow-cyan-950/20">
        <div className="px-5 py-6 md:px-8 md:py-9">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200">Previa del partido</p>
          <div className="mt-4 flex items-center justify-between gap-3 md:gap-5">
            <div className="flex min-w-0 items-center gap-3 md:gap-5">
              <TeamCrest src={preview.homeCrestUrl} name={preview.homeTeam} />
              <div className="min-w-0">
                <h2 className="font-editorial text-2xl leading-tight text-white md:text-5xl">{preview.homeTeam} <span className="text-cyan-300">vs</span> {preview.awayTeam}</h2>
                <p className="mt-2 text-sm text-slate-300">{preview.competition} · {preview.round}</p>
              </div>
            </div>
            <TeamCrest src={preview.awayCrestUrl} name={preview.awayTeam} />
          </div>
          <p className="mt-5 max-w-4xl text-base leading-7 text-slate-100">{preview.overview}</p>
        </div>
      </article>

      {standings.length > 0 ? (
        <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="rounded-2xl border border-slate-700/60 bg-slate-950 p-5 md:p-6">
            <SectionHeading eyebrow="01 · Tabla" title="Situación previa" />
            <div className="mt-5 overflow-x-auto rounded-xl border border-slate-800">
              <div className="min-w-[560px]">
                <div className="grid grid-cols-[1.35fr_repeat(5,0.7fr)] gap-2 bg-slate-900 px-3 py-2.5 text-[10px] uppercase tracking-[0.1em] text-slate-400"><span>Equipo</span><span>Pos.</span><span>Pts</span><span>PJ</span><span>GF</span><span>GC</span></div>
                {standings.map((team) => <div key={team.team} className="grid grid-cols-[1.35fr_repeat(5,0.7fr)] gap-2 border-t border-slate-800 px-3 py-3 text-sm text-slate-200"><span className="font-semibold text-white">{team.team}</span><span>{team.position}</span><span>{team.points}</span><span>{team.played}</span><span>{team.goalsFor}</span><span className="text-rose-200">{team.goalsAgainst}</span></div>)}
              </div>
            </div>
          </article>
          <article className="rounded-2xl border border-amber-400/25 bg-amber-500/5 p-5 md:p-6">
            <SectionHeading eyebrow="Dato clave" title="La defensa marca la diferencia" />
            <p className="mt-5 text-base leading-7 text-amber-50">El diferencial más visible está en los goles recibidos: el equipo que concede menos llega con un punto de partida defensivo más estable.</p>
          </article>
        </section>
      ) : null}

      {recentForm.length > 0 ? (
        <section>
          <SectionHeading eyebrow="02 · Últimos cinco" title="Forma reciente" copy="Resultados y producción reciente antes de entrar en el historial directo." />
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            {recentForm.map((team) => <article key={team.team} className="rounded-2xl border border-slate-700/60 bg-slate-950 p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="text-xl font-semibold text-white">{team.team}</h3><p className="mt-1 text-sm text-cyan-200">{team.record}</p></div><div className="text-right text-xs"><p className="text-slate-400">Últimos 5</p><p className="mt-1 font-semibold text-white">{team.goalsFor} GF · {team.goalsAgainst} GC</p></div></div><ol className="mt-4 space-y-2 border-t border-slate-800 pt-4">{team.matches.map((result) => <li key={result} className="text-sm text-slate-300">{result}</li>)}</ol></article>)}
          </div>
        </section>
      ) : null}

      {headToHead ? (
        <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-2xl border border-slate-700/60 bg-slate-950 p-5 md:p-6"><SectionHeading eyebrow="03 · H2H" title="Historial directo" /><p className="mt-4 text-sm leading-7 text-slate-200">{headToHead.summary}</p></article>
          <article className="overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-950"><div className="grid grid-cols-[4.5rem_1fr_auto_1fr] gap-2 bg-slate-900 px-4 py-2.5 text-[10px] uppercase tracking-[0.1em] text-slate-400"><span>Fecha</span><span>Local</span><span>Resultado</span><span>Visitante</span></div>{headToHead.matches.length > 0 ? headToHead.matches.map((match) => <div key={`${match.date}-${match.home}`} className="grid grid-cols-[4.5rem_1fr_auto_1fr] items-center gap-2 border-t border-slate-800 px-4 py-3 text-sm"><span className="text-slate-500">{match.date}</span><span className="text-right text-slate-200">{match.home}</span><span className="rounded-md bg-slate-800 px-2 py-1 font-semibold text-white">{match.score}</span><span className="text-slate-200">{match.away}</span></div>) : <p className="px-4 py-5 text-sm text-slate-400">No hay resultados finalizados disponibles.</p>}</article>
        </section>
      ) : null}

      {preview.goalsRead ? <article className="rounded-2xl border border-slate-700/60 bg-slate-950 p-5 md:p-6"><SectionHeading eyebrow="04 · Goles" title="Tendencia de anotación" /><p className="mt-4 max-w-4xl text-base leading-7 text-slate-200">{preview.goalsRead}</p></article> : null}

      {preview.model || markets.length > 0 ? (
        <section className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          {preview.model ? <article className="rounded-2xl border border-sky-400/25 bg-sky-500/5 p-5 md:p-6"><SectionHeading eyebrow="05 · Probabilidades" title="Estimación de referencia" /><div className="mt-5 space-y-3">{[[preview.homeTeam, preview.model.homeWin], ['Empate', preview.model.draw], [preview.awayTeam, preview.model.awayWin]].map(([label, value]) => <div key={String(label)}><div className="flex justify-between gap-3 text-sm"><span className="text-slate-200">{label}</span><span className="font-semibold text-white">{value}%</span></div><div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-cyan-400" style={{ width: `${value}%` }} /></div></div>)}</div><p className="mt-5 text-sm text-slate-300">Goles esperados: <span className="font-semibold text-white">{preview.model.expectedGoals}</span></p></article> : null}
          {markets.length > 0 ? <article className="rounded-2xl border border-slate-700/60 bg-slate-950 p-5 md:p-6"><SectionHeading eyebrow="06 · Lectura" title="Mercados a vigilar" /><div className="mt-5 grid gap-3 sm:grid-cols-2">{markets.map((market) => <div key={market.label} className={`rounded-xl border p-4 ${marketTone[market.tone]}`}><p className="text-[10px] font-semibold uppercase tracking-[0.13em] opacity-75">{market.label}</p><p className="mt-1.5 text-lg font-semibold">{market.value}</p><p className="mt-2 text-xs leading-5 opacity-85">{market.note}</p></div>)}</div></article> : null}
        </section>
      ) : null}

      <article className="rounded-2xl border border-emerald-400/30 bg-[linear-gradient(135deg,rgba(6,78,59,0.4),rgba(2,6,23,0.96))] p-5 md:p-7"><p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-200">Cierre editorial</p><h2 className="mt-2 font-editorial text-2xl md:text-3xl text-white">Conclusión del partido</h2><p className="mt-4 max-w-4xl text-base leading-7 text-emerald-50">{preview.conclusion}</p></article>
    </section>
  );
}
