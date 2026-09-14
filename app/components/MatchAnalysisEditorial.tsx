import type { InformeS24V1 } from '@/lib/intelligence-s24/informeS24V1';
import type { RealMatchContext } from '@/lib/intelligence-s24/realMatchContext';

interface MatchAnalysisEditorialProps {
  informe: InformeS24V1;
  context: RealMatchContext | null;
}

function probabilityBar(label: string, value: number, tone: string) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="text-slate-200">{label}</span>
        <span className="font-semibold text-white">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div className={`h-full rounded-full ${tone}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function recentSummary(context: RealMatchContext | null, side: 'home' | 'away') {
  const matches = context?.recentForm[side] ?? [];
  const wins = matches.filter((match) => match.result === 'V').length;
  const draws = matches.filter((match) => match.result === 'E').length;
  const losses = matches.filter((match) => match.result === 'D').length;
  return `${wins}V · ${draws}E · ${losses}D`;
}

export default function MatchAnalysisEditorial({ informe, context }: MatchAnalysisEditorialProps) {
  const homeTeam = informe.match.homeTeam;
  const awayTeam = informe.match.awayTeam;
  const probabilities = { home: 64, draw: 21, away: 15 };
  const standings = context?.standings ?? [];
  const homeStanding = standings.find((team) => team.teamName === homeTeam);
  const awayStanding = standings.find((team) => team.teamName === awayTeam);
  const h2h = context?.headToHead;

  return (
    <section className="space-y-6 md:space-y-8">
      <section className="overflow-hidden rounded-3xl border border-cyan-400/25 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.2),transparent_38%),linear-gradient(145deg,rgba(8,47,73,0.9),rgba(2,6,23,0.98))] p-5 md:p-8">
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-cyan-200">
          <span className="rounded-full border border-cyan-300/35 bg-cyan-400/10 px-3 py-1">Análisis S24</span>
          <span className="rounded-full border border-slate-600/60 bg-slate-900/60 px-3 py-1">Previa editorial</span>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-700/60 bg-black/25 p-3"><p className="text-[10px] uppercase tracking-[0.13em] text-slate-500">Fecha</p><p className="mt-1 text-sm font-semibold text-white">{context?.fixture.scheduledAt ? new Date(context.fixture.scheduledAt).toLocaleDateString('es-ES', { dateStyle: 'long' }) : 'No informada'}</p></div>
          <div className="rounded-xl border border-slate-700/60 bg-black/25 p-3"><p className="text-[10px] uppercase tracking-[0.13em] text-slate-500">Hora</p><p className="mt-1 text-sm font-semibold text-white">{context?.fixture.scheduledAt ? new Date(context.fixture.scheduledAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) : informe.match.time}</p></div>
          <div className="rounded-xl border border-slate-700/60 bg-black/25 p-3"><p className="text-[10px] uppercase tracking-[0.13em] text-slate-500">Estadio</p><p className="mt-1 text-sm font-semibold text-white">{context?.fixture.venue ?? 'No informado por el proveedor'}</p></div>
          <div className="rounded-xl border border-slate-700/60 bg-black/25 p-3"><p className="text-[10px] uppercase tracking-[0.13em] text-slate-500">Competición</p><p className="mt-1 text-sm font-semibold text-white">{context?.fixture.competition ?? informe.match.competition}</p></div>
        </div>
        {context?.lineups.length ? (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {context.lineups.map((lineup) => (
              <div key={lineup.teamName} className="rounded-xl border border-slate-700/60 bg-black/25 p-4">
                <div className="flex items-center justify-between gap-3"><p className="font-semibold text-white">{lineup.teamName}</p>{lineup.formation ? <span className="text-xs text-cyan-200">{lineup.formation}</span> : null}</div>
                <p className="mt-2 text-[10px] uppercase tracking-[0.13em] text-slate-500">Alineación confirmada</p>
                <p className="mt-1 text-sm leading-6 text-slate-200">{lineup.starters.join(' · ') || 'Titulares no informados'}</p>
              </div>
            ))}
          </div>
        ) : null}
        <h1 className="mt-5 max-w-4xl font-editorial text-4xl leading-tight text-white md:text-6xl">{homeTeam} vs {awayTeam}: ventaja local con margen de respuesta</h1>
        <p className="mt-4 max-w-4xl text-base leading-7 text-slate-200 md:text-lg">La lectura combina el modelo S24 con forma reciente, posición competitiva, historial directo y contexto de localía. Inter llega con una base más estable, pero Udinese conserva una vía clara para incomodar si sostiene el bloque y convierte sus transiciones.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-cyan-300/20 bg-black/25 p-4"><p className="text-[10px] uppercase tracking-[0.14em] text-slate-400">Señal principal</p><p className="mt-2 text-xl font-semibold text-cyan-100">{homeTeam}</p><p className="mt-1 text-sm text-slate-300">Mejor combinación de forma, tabla y localía.</p></div>
          <div className="rounded-2xl border border-amber-300/20 bg-black/25 p-4"><p className="text-[10px] uppercase tracking-[0.14em] text-slate-400">Riesgo clave</p><p className="mt-2 text-xl font-semibold text-amber-100">Partido cerrado</p><p className="mt-1 text-sm text-slate-300">Udinese puede reducir espacios y llevarlo al detalle.</p></div>
          <div className="rounded-2xl border border-emerald-300/20 bg-black/25 p-4"><p className="text-[10px] uppercase tracking-[0.14em] text-slate-400">Confianza</p><p className="mt-2 text-xl font-semibold text-emerald-100">Media-alta</p><p className="mt-1 text-sm text-slate-300">La diferencia existe, pero no elimina la varianza.</p></div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-2xl border border-sky-400/25 bg-slate-950 p-5 md:p-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-300">01 · Probabilidades del modelo</p>
          <h2 className="mt-2 font-editorial text-3xl text-white">Escenario 1X2</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">Estimación editorial previa, no cuota ni garantía. El porcentaje refleja el diferencial actual y debe actualizarse si cambian las alineaciones o el contexto del partido.</p>
          <div className="mt-6 space-y-5">
            {probabilityBar(`Gana ${homeTeam}`, probabilities.home, 'bg-cyan-400')}
            {probabilityBar('Empate', probabilities.draw, 'bg-amber-300')}
            {probabilityBar(`Gana ${awayTeam}`, probabilities.away, 'bg-rose-400')}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-800 bg-black/25 p-4"><p className="text-xs text-slate-500">Marcador de referencia</p><p className="mt-1 text-2xl font-semibold text-white">2-0 / 2-1</p></div>
            <div className="rounded-xl border border-slate-800 bg-black/25 p-4"><p className="text-xs text-slate-500">Goles esperados</p><p className="mt-1 text-2xl font-semibold text-white">1.8 - 0.8</p></div>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-700/60 bg-slate-950 p-5 md:p-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">02 · Diferencial competitivo</p>
          <h2 className="mt-2 font-editorial text-3xl text-white">Qué inclina la previa</h2>
          <div className="mt-5 space-y-3">
            <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-4"><p className="font-semibold text-emerald-100">Inter controla mejor el punto de partida</p><p className="mt-1 text-sm leading-6 text-slate-300">Llega 3.º con {homeStanding?.points ?? 9} puntos y una secuencia reciente de {recentSummary(context, 'home')}.</p></div>
            <div className="rounded-xl border border-amber-400/20 bg-amber-500/10 p-4"><p className="font-semibold text-amber-100">Udinese necesita sobrevivir al primer tramo</p><p className="mt-1 text-sm leading-6 text-slate-300">Está 13.º con {awayStanding?.points ?? 4} puntos; su mejor escenario es mantener el partido corto y atacar tras recuperación.</p></div>
            <div className="rounded-xl border border-slate-700 bg-black/25 p-4"><p className="font-semibold text-white">El historial respalda al local, pero no decide solo</p><p className="mt-1 text-sm leading-6 text-slate-300">En la muestra disponible: {h2h?.homeWins ?? 4} victorias de Inter, {h2h?.draws ?? 0} empates y {h2h?.awayWins ?? 1} de Udinese.</p></div>
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-700/60 bg-slate-950 p-5 md:p-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">03 · Lectura táctica</p>
        <h2 className="mt-2 font-editorial text-3xl text-white">Dónde puede romperse el partido</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-black/25 p-4"><p className="font-semibold text-cyan-100">Salida de Inter</p><p className="mt-2 text-sm leading-6 text-slate-300">El local debería buscar amplitud, mover el bloque visitante y atacar el intervalo entre lateral y central. Si encuentra ventaja temprano, el partido puede abrirse.</p></div>
          <div className="rounded-xl border border-slate-800 bg-black/25 p-4"><p className="font-semibold text-amber-100">Bloque de Udinese</p><p className="mt-2 text-sm leading-6 text-slate-300">La prioridad visitante será proteger el carril central, negar recepciones limpias y obligar a Inter a finalizar desde posiciones menos cómodas.</p></div>
          <div className="rounded-xl border border-slate-800 bg-black/25 p-4"><p className="font-semibold text-rose-100">Transiciones</p><p className="mt-2 text-sm leading-6 text-slate-300">La principal vía de sorpresa es la espalda de los laterales locales después de pérdida. El balance defensivo de Inter será más importante que la posesión total.</p></div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <article className="rounded-2xl border border-emerald-400/25 bg-emerald-500/5 p-5 md:p-7"><p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300">04 · Escenario favorable</p><h2 className="mt-2 font-editorial text-2xl text-white">Inter marca primero</h2><p className="mt-3 text-sm leading-7 text-slate-200">Si Inter convierte su dominio territorial en ventaja antes del descanso, Udinese tendrá que adelantar líneas y dejará más espacios para el segundo golpe. En ese escenario, la probabilidad local gana fuerza y el 2-0 aparece como desenlace coherente.</p></article>
        <article className="rounded-2xl border border-amber-400/25 bg-amber-500/5 p-5 md:p-7"><p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-300">05 · Escenario de riesgo</p><h2 className="mt-2 font-editorial text-2xl text-white">Udinese resiste 60 minutos</h2><p className="mt-3 text-sm leading-7 text-slate-200">Un 0-0 prolongado reduce la ventaja estructural de Inter y aumenta el peso de una pelota parada o una transición. En ese contexto, el empate deja de ser secundario y la lectura debe actualizarse con el volumen real de ocasiones.</p></article>
      </section>

      <section className="rounded-2xl border border-slate-700/60 bg-slate-950 p-5 md:p-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">06 · Checklist de seguimiento</p>
        <h2 className="mt-2 font-editorial text-3xl text-white">Qué mirar antes del saque inicial</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {['Alineación y disponibilidad del mediocampo de Inter', 'Altura del bloque inicial de Udinese', 'Primeros 15 minutos y recuperaciones en campo rival', 'Balón parado y defensa de centros laterales'].map((item) => <div key={item} className="rounded-xl border border-slate-800 bg-black/25 p-4 text-sm leading-6 text-slate-200">{item}</div>)}
        </div>
      </section>

      <section className="rounded-2xl border border-cyan-400/25 bg-[linear-gradient(135deg,rgba(8,47,73,0.65),rgba(2,6,23,0.96))] p-5 md:p-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-200">Conclusión editorial</p>
        <h2 className="mt-2 font-editorial text-3xl text-white">Inter parte arriba, pero la clave es la paciencia</h2>
        <p className="mt-4 max-w-5xl text-base leading-8 text-slate-200">La combinación de localía, posición, forma reciente y diferencial histórico coloca a Inter como favorito claro, aunque no absoluto. La probabilidad central es 64% para el local, 21% para el empate y 15% para Udinese. La lectura pierde solidez si Inter no genera ocasiones claras o si Udinese convierte una transición temprana. Es una previa informativa: las alineaciones, el ritmo inicial y la calidad de las ocasiones deben validar o rebajar esta ventaja.</p>
      </section>
    </section>
  );
}
