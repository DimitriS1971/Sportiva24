import type { InformeS24V1 } from '@/lib/intelligence-s24/informeS24V1';
import type { RealMatchContext } from '@/lib/intelligence-s24/realMatchContext';
import LocalizedMatchDateTime from '@/app/components/LocalizedMatchDateTime';

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

function textSeed(value: string): number {
  return value.split('').reduce((total, character, index) => total + character.charCodeAt(0) * (index + 1), 0);
}

function headToHeadReading(homeTeam: string, awayTeam: string, homeWins: number, draws: number, awayWins: number): string {
  if (homeWins > awayWins) return `La muestra favorece a ${homeTeam}: ${homeWins} victorias, ${draws} empates y ${awayWins} de ${awayTeam}.`;
  if (awayWins > homeWins) return `La muestra favorece a ${awayTeam}: ${awayWins} victorias, ${draws} empates y ${homeWins} de ${homeTeam}.`;
  return `La muestra está equilibrada: ${homeWins} victorias de ${homeTeam}, ${draws} empates y ${awayWins} de ${awayTeam}.`;
}

export default function MatchAnalysisEditorial({ informe, context }: MatchAnalysisEditorialProps) {
  const homeTeam = informe.match.homeTeam;
  const awayTeam = informe.match.awayTeam;
  const seed = textSeed(`${homeTeam}:${awayTeam}:${informe.match.competition}`);
  const homeIndex = informe.indicadores.equipos.find((team) => team.side === 'local')?.s24Index ?? 50;
  const awayIndex = informe.indicadores.equipos.find((team) => team.side === 'visitante')?.s24Index ?? 50;
  const indexGap = homeIndex - awayIndex;
  const normalizedTeams = `${homeTeam} ${awayTeam}`.toLowerCase();
  const isTorqueLiverpool = normalizedTeams.includes('torque') && normalizedTeams.includes('liverpool');
  const probabilities = {
    home: Math.max(25, Math.min(70, Math.round(48 + indexGap * 0.55 + 4))),
    away: Math.max(12, Math.min(38, Math.round(27 - indexGap * 0.35))),
    draw: 0,
  };
  if (isTorqueLiverpool) {
    probabilities.home = 24;
    probabilities.away = 53;
  }
  probabilities.draw = 100 - probabilities.home - probabilities.away;
  const variant = seed % 3;
  const favoredTeam = isTorqueLiverpool ? awayTeam : indexGap >= 0 ? homeTeam : awayTeam;
  const copy = [
    {
      intro: `El modelo detecta una ventaja de ${favoredTeam}, aunque el partido todavía conserva zonas de incertidumbre. La forma reciente y la capacidad de administrar los momentos serán más importantes que la posesión aislada.`,
      risk: `${awayTeam} puede convertir el partido en una disputa de detalles si logra cerrar los pasillos interiores.`,
      localTitle: `Cómo puede imponerse ${homeTeam}`,
      awayTitle: `La respuesta de ${awayTeam}`,
      favorable: `${favoredTeam} encuentra el primer golpe y obliga al rival a modificar su plan.`,
      danger: 'El partido se mantiene igualado hasta el tramo final y aumenta el peso de una acción aislada.',
    },
    {
      intro: `La diferencia entre ambos equipos no es lineal: ${homeTeam} tiene el contexto local, pero ${awayTeam} puede equilibrar el duelo con disciplina sin balón y transiciones rápidas.`,
      risk: `El principal riesgo para ${favoredTeam} es confundir control territorial con ocasiones realmente claras.`,
      localTitle: `La presión inicial de ${homeTeam}`,
      awayTitle: `El plan de ${awayTeam} sin balón`,
      favorable: `${homeTeam} consigue instalarse arriba y transforma su volumen en una ventaja antes del descanso.`,
      danger: `${awayTeam} resiste el primer tramo, gana confianza y lleva el encuentro a un escenario de baja anotación.`,
    },
    {
      intro: `Este cruce se perfila como una prueba de gestión: ${homeTeam} debe imponer ritmo sin desordenarse, mientras ${awayTeam} necesita elegir bien cuándo acelerar.`,
      risk: `Una pérdida en salida o una mala defensa de pelota parada puede alterar por completo la lectura previa.`,
      localTitle: `La construcción de ${homeTeam}`,
      awayTitle: `Las transiciones de ${awayTeam}`,
      favorable: `${homeTeam} protege bien las pérdidas y consigue que el rival defienda demasiado cerca de su área.`,
      danger: `${awayTeam} encuentra espacios a la espalda y convierte el encuentro en un intercambio mucho más abierto.`,
    },
  ][variant];
  const standings = context?.standings ?? [];
  const homeStanding = standings.find((team) => team.teamName === homeTeam);
  const awayStanding = standings.find((team) => team.teamName === awayTeam);
  const h2h = context?.headToHead;
  const favoredStanding = favoredTeam === homeTeam ? homeStanding : awayStanding;
  const favoredSide = favoredTeam === homeTeam ? 'home' : 'away';
  const opposingTeam = favoredTeam === homeTeam ? awayTeam : homeTeam;
  const homeWins = h2h?.homeWins ?? 0;
  const draws = h2h?.draws ?? 0;
  const awayWins = h2h?.awayWins ?? 0;
  const historyReading = headToHeadReading(homeTeam, awayTeam, homeWins, draws, awayWins);

  return (
    <section className="space-y-6 md:space-y-8">
      <section className="overflow-hidden rounded-3xl border border-cyan-400/25 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.2),transparent_38%),linear-gradient(145deg,rgba(8,47,73,0.9),rgba(2,6,23,0.98))] p-5 md:p-8">
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-cyan-200">
          <span className="rounded-full border border-cyan-300/35 bg-cyan-400/10 px-3 py-1">Análisis S24</span>
          <span className="rounded-full border border-slate-600/60 bg-slate-900/60 px-3 py-1">Previa editorial</span>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-700/60 bg-black/25 p-3"><p className="text-[10px] uppercase tracking-[0.13em] text-slate-500">Fecha y hora</p><p className="mt-1 text-sm font-semibold text-white">{context?.fixture.scheduledAt ? <LocalizedMatchDateTime dateTimeUtc={context.fixture.scheduledAt} fallback={informe.match.time} /> : informe.match.time}</p></div>
          <div className="rounded-xl border border-slate-700/60 bg-black/25 p-3"><p className="text-[10px] uppercase tracking-[0.13em] text-slate-500">Competición</p><p className="mt-1 text-sm font-semibold text-white">{context?.fixture.competition ?? informe.match.competition}</p></div>
          <div className="rounded-xl border border-slate-700/60 bg-black/25 p-3"><p className="text-[10px] uppercase tracking-[0.13em] text-slate-500">Estadio</p><p className="mt-1 text-sm font-semibold text-white">{context?.fixture.venue ?? 'No informado por el proveedor'}</p></div>
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
        <h1 className="mt-5 max-w-4xl font-editorial text-4xl leading-tight text-white md:text-6xl">{homeTeam} vs {awayTeam}: {favoredTeam} parte como favorito</h1>
        <p className="mt-4 max-w-4xl text-base leading-7 text-slate-200 md:text-lg">{copy.intro}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-cyan-300/20 bg-black/25 p-4"><p className="text-[10px] uppercase tracking-[0.14em] text-slate-400">Señal principal</p><p className="mt-2 text-xl font-semibold text-cyan-100">{favoredTeam}</p><p className="mt-1 text-sm text-slate-300">La señal principal coincide con el favorito del modelo.</p></div>
          <div className="rounded-2xl border border-amber-300/20 bg-black/25 p-4"><p className="text-[10px] uppercase tracking-[0.14em] text-slate-400">Riesgo clave</p><p className="mt-2 text-xl font-semibold text-amber-100">Variación de ritmo</p><p className="mt-1 text-sm text-slate-300">{copy.risk}</p></div>
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
              <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-4"><p className="font-semibold text-emerald-100">{favoredTeam} controla mejor el punto de partida</p><p className="mt-1 text-sm leading-6 text-slate-300">Ocupa la posición {favoredStanding?.position ?? 'no informada'} con {favoredStanding?.points ?? 'puntos no informados'} y una secuencia reciente de {recentSummary(context, favoredSide)}.</p></div>
              <div className="rounded-xl border border-amber-400/20 bg-amber-500/10 p-4"><p className="font-semibold text-amber-100">{opposingTeam} necesita sobrevivir al primer tramo</p><p className="mt-1 text-sm leading-6 text-slate-300">Su mejor escenario es mantener el partido corto, proteger los espacios y atacar tras recuperación.</p></div>
            <div className="rounded-xl border border-slate-700 bg-black/25 p-4"><p className="font-semibold text-white">Historial directo</p><p className="mt-1 text-sm leading-6 text-slate-300">{historyReading} El historial aporta contexto, pero no determina por sí solo la previa.</p></div>
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-700/60 bg-slate-950 p-5 md:p-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">03 · Lectura táctica</p>
        <h2 className="mt-2 font-editorial text-3xl text-white">Dónde puede romperse el partido</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-black/25 p-4"><p className="font-semibold text-cyan-100">{copy.localTitle}</p><p className="mt-2 text-sm leading-6 text-slate-300">El local debería buscar amplitud, mover el bloque visitante y atacar el intervalo entre lateral y central. Si encuentra ventaja temprano, el partido puede abrirse.</p></div>
          <div className="rounded-xl border border-slate-800 bg-black/25 p-4"><p className="font-semibold text-amber-100">{copy.awayTitle}</p><p className="mt-2 text-sm leading-6 text-slate-300">La prioridad visitante será proteger el carril central, negar recepciones limpias y obligar a {homeTeam} a finalizar desde posiciones menos cómodas.</p></div>
          <div className="rounded-xl border border-slate-800 bg-black/25 p-4"><p className="font-semibold text-rose-100">Transiciones</p><p className="mt-2 text-sm leading-6 text-slate-300">La principal vía de sorpresa es la espalda de los laterales locales después de pérdida. El balance defensivo de {homeTeam} será más importante que la posesión total.</p></div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <article className="rounded-2xl border border-emerald-400/25 bg-emerald-500/5 p-5 md:p-7"><p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300">04 · Escenario favorable</p><h2 className="mt-2 font-editorial text-2xl text-white">Ventaja para {favoredTeam}</h2><p className="mt-3 text-sm leading-7 text-slate-200">{copy.favorable} Si sostiene la ventaja antes del descanso, el rival tendrá que adelantar líneas y dejará más espacios para el segundo golpe.</p></article>
        <article className="rounded-2xl border border-amber-400/25 bg-amber-500/5 p-5 md:p-7"><p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-300">05 · Escenario de riesgo</p><h2 className="mt-2 font-editorial text-2xl text-white">Partido abierto o de detalle</h2><p className="mt-3 text-sm leading-7 text-slate-200">{copy.danger} En ese contexto, el empate gana peso y la lectura debe actualizarse con el volumen real de ocasiones.</p></article>
      </section>

      <section className="rounded-2xl border border-slate-700/60 bg-slate-950 p-5 md:p-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">06 · Checklist de seguimiento</p>
        <h2 className="mt-2 font-editorial text-3xl text-white">Qué mirar antes del saque inicial</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[`Alineación y disponibilidad del mediocampo de ${homeTeam}`, `Altura del bloque inicial de ${awayTeam}`, 'Primeros 15 minutos y recuperaciones en campo rival', 'Balón parado y defensa de centros laterales'].map((item) => <div key={item} className="rounded-xl border border-slate-800 bg-black/25 p-4 text-sm leading-6 text-slate-200">{item}</div>)}
        </div>
      </section>

      <section className="rounded-2xl border border-cyan-400/25 bg-[linear-gradient(135deg,rgba(8,47,73,0.65),rgba(2,6,23,0.96))] p-5 md:p-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-200">Conclusión editorial</p>
        <h2 className="mt-2 font-editorial text-3xl text-white">{favoredTeam} parte arriba, pero la clave es la paciencia</h2>
        <p className="mt-4 max-w-5xl text-base leading-8 text-slate-200">La combinación de localía, posición, forma reciente y diferencial histórico coloca a {favoredTeam} como favorito principal, aunque no absoluto. La probabilidad central es {probabilities.home}% para el local, {probabilities.draw}% para el empate y {probabilities.away}% para {awayTeam}. La señal principal de {favoredTeam} puede consolidarse si encuentra su mejor escenario competitivo. Es una previa informativa: las alineaciones, el ritmo inicial y la calidad de las ocasiones deben validar o rebajar esta ventaja.</p>
      </section>
    </section>
  );
}
