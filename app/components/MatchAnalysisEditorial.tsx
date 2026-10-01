import type { InformeS24V1 } from '@/lib/intelligence-s24/informeS24V1';
import type { RealMatchContext } from '@/lib/intelligence-s24/realMatchContext';
import type { MatchPredictionV2 } from '@/lib/intelligence-s24/v2';
import LocalizedMatchDateTime from '@/app/components/LocalizedMatchDateTime';

interface MatchAnalysisEditorialProps {
  informe: InformeS24V1;
  context: RealMatchContext | null;
  prediction: MatchPredictionV2;
}

function probabilityBar(label: string, probability: number, tone: string) {
  const percentage = probability * 100;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="text-slate-200">{label}</span>
        <span className="font-semibold text-white">{percentage.toFixed(1)}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div className={`h-full rounded-full ${tone}`} style={{ width: `${percentage}%` }} />
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

function headToHeadReading(homeTeam: string, awayTeam: string, homeWins: number, draws: number, awayWins: number): string {
  if (homeWins > awayWins) return `La muestra favorece a ${homeTeam}: ${homeWins} victorias, ${draws} empates y ${awayWins} de ${awayTeam}.`;
  if (awayWins > homeWins) return `La muestra favorece a ${awayTeam}: ${awayWins} victorias, ${draws} empates y ${homeWins} de ${homeTeam}.`;
  return `La muestra está equilibrada: ${homeWins} victorias de ${homeTeam}, ${draws} empates y ${awayWins} de ${awayTeam}.`;
}

export default function MatchAnalysisEditorial({ informe, context, prediction }: MatchAnalysisEditorialProps) {
  const homeTeam = informe.match.homeTeam;
  const awayTeam = informe.match.awayTeam;
  const probabilities = prediction.probabilities;
  const probabilityEntries = probabilities
    ? [
      { team: homeTeam, probability: probabilities.home },
      { team: awayTeam, probability: probabilities.away },
    ].sort((left, right) => right.probability - left.probability)
    : [];
  const favoredTeam = probabilities && probabilityEntries[0].probability - probabilityEntries[1].probability >= 0.05
    ? probabilityEntries[0].team
    : null;
  const focalTeam = favoredTeam ?? homeTeam;
  const variant = probabilities ? Math.round(probabilities.home * 100) % 3 : 0;
  const copy = [
    {
      intro: favoredTeam ? `El modelo detecta una ventaja de ${favoredTeam}, aunque el partido todavía conserva zonas de incertidumbre.` : 'La información disponible no permite sostener un favorito. La previa se mantiene abierta.',
      risk: `${awayTeam} puede convertir el partido en una disputa de detalles si logra cerrar los pasillos interiores.`,
      localTitle: `Cómo puede imponerse ${homeTeam}`,
      awayTitle: `La respuesta de ${awayTeam}`,
    },
    {
      intro: `La diferencia entre ambos equipos no es lineal: ${homeTeam} tiene el contexto local, pero ${awayTeam} puede equilibrar el duelo con disciplina sin balón y transiciones rápidas.`,
      risk: `El principal riesgo para ${focalTeam} es confundir control territorial con ocasiones realmente claras.`,
      localTitle: `La presión inicial de ${homeTeam}`,
      awayTitle: `El plan de ${awayTeam} sin balón`,
    },
    {
      intro: `Este cruce se perfila como una prueba de gestión: ${homeTeam} debe imponer ritmo sin desordenarse, mientras ${awayTeam} necesita elegir bien cuándo acelerar.`,
      risk: `Una pérdida en salida o una mala defensa de pelota parada puede alterar por completo la lectura previa.`,
      localTitle: `La construcción de ${homeTeam}`,
      awayTitle: `Las transiciones de ${awayTeam}`,
    },
  ][variant];
  const standings = context?.standings ?? [];
  const homeStanding = standings.find((team) => team.teamName === homeTeam);
  const awayStanding = standings.find((team) => team.teamName === awayTeam);
  const h2h = context?.headToHead;
  const favoredStanding = favoredTeam === homeTeam ? homeStanding : favoredTeam === awayTeam ? awayStanding : undefined;
  const favoredSide = favoredTeam === awayTeam ? 'away' : 'home';
  const homeWins = h2h?.homeWins ?? 0;
  const draws = h2h?.draws ?? 0;
  const awayWins = h2h?.awayWins ?? 0;
  const historyReading = headToHeadReading(homeTeam, awayTeam, homeWins, draws, awayWins);

  return (
    <section className="space-y-6 md:space-y-8">
      <section className="overflow-hidden rounded-3xl border border-cyan-400/25 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.2),transparent_38%),linear-gradient(145deg,rgba(8,47,73,0.9),rgba(2,6,23,0.98))] p-5 text-center md:p-8">
        <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-cyan-200">
          <span className="rounded-full border border-cyan-300/35 bg-cyan-400/10 px-3 py-1">Análisis S24</span>
          <span className="rounded-full border border-slate-600/60 bg-slate-900/60 px-3 py-1">Previa editorial</span>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-700/60 bg-black/25 p-3"><p className="text-[10px] uppercase tracking-[0.13em] text-slate-500">Fecha y hora</p><p className="mt-1 text-sm font-semibold text-white">{context?.fixture.scheduledAt ? <LocalizedMatchDateTime dateTimeUtc={context.fixture.scheduledAt} fallback={informe.match.time} /> : informe.match.time}</p></div>
          <div className="rounded-xl border border-slate-700/60 bg-black/25 p-3"><p className="text-[10px] uppercase tracking-[0.13em] text-slate-500">Competición</p><p className="mt-1 text-sm font-semibold text-white">{(context?.fixture.competition ?? informe.match.competition).toLocaleUpperCase('es-ES')}</p></div>
          <div className="rounded-xl border border-slate-700/60 bg-black/25 p-3"><p className="text-[10px] uppercase tracking-[0.13em] text-slate-500">Estadio</p><p className="mt-1 text-sm font-semibold text-white">{context?.fixture.venue ?? 'No informado por el proveedor'}</p></div>
        </div>
        <div className="mx-auto mt-4 max-w-5xl rounded-2xl border border-slate-700/60 bg-black/25 p-4 text-center md:p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-cyan-200">Alineaciones</p>
          {context?.lineups.length ? (
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {context.lineups.map((lineup) => (
                <div key={lineup.teamName} className="rounded-xl border border-slate-700/60 bg-slate-950/60 p-4">
                  <div className="flex items-center justify-center gap-3"><p className="font-semibold text-white">{lineup.teamName}</p>{lineup.formation ? <span className="text-xs text-cyan-200">{lineup.formation}</span> : null}</div>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.13em] text-slate-500">Titulares confirmados</p>
                  <p className="mt-1 text-sm leading-6 text-slate-200">{lineup.starters.join(' · ') || 'No informados'}</p>
                  {lineup.substitutes.length > 0 ? <><p className="mt-3 text-[10px] uppercase tracking-[0.13em] text-slate-500">Suplentes</p><p className="mt-1 text-sm leading-6 text-slate-300">{lineup.substitutes.join(' · ')}</p></> : null}
                </div>
              ))}
            </div>
          ) : <p className="mt-2 text-sm text-slate-400">Las alineaciones todavía no fueron confirmadas por el proveedor.</p>}
        </div>
        <h1 className="mx-auto mt-5 max-w-4xl font-editorial text-4xl leading-tight text-white md:text-6xl">{homeTeam} vs {awayTeam}: {favoredTeam ? `${favoredTeam} parte con ventaja` : 'previa abierta'}</h1>
        <p className="mx-auto mt-4 max-w-4xl text-base leading-7 text-slate-200 md:text-lg">{copy.intro}</p>
        <div className="mx-auto mt-6 grid max-w-5xl gap-3 text-center sm:grid-cols-3">
          <div className="rounded-2xl border border-cyan-300/20 bg-black/25 p-4"><p className="text-[10px] uppercase tracking-[0.14em] text-slate-400">Señal principal</p><p className="mt-2 text-xl font-semibold text-cyan-100">{favoredTeam ?? 'Sin ventaja clara'}</p><p className="mt-1 text-sm text-slate-300">La señal se publica solo cuando el modelo tiene cobertura suficiente.</p></div>
          <div className="rounded-2xl border border-amber-300/20 bg-black/25 p-4"><p className="text-[10px] uppercase tracking-[0.14em] text-slate-400">Riesgo clave</p><p className="mt-2 text-xl font-semibold text-amber-100">Variación de ritmo</p><p className="mt-1 text-sm text-slate-300">{copy.risk}</p></div>
          <div className="rounded-2xl border border-emerald-300/20 bg-black/25 p-4"><p className="text-[10px] uppercase tracking-[0.14em] text-slate-400">Confianza</p><p className="mt-2 text-xl font-semibold text-emerald-100">{informe.indicadores.resumen.s24Confianza}</p><p className="mt-1 text-sm text-slate-300">La cobertura disponible define el alcance de la lectura.</p></div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-2xl border border-sky-400/25 bg-slate-950 p-5 md:p-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-300">01 · Distribución probabilística</p>
          <h2 className="mt-2 font-editorial text-3xl text-white">Probabilidades 1X2</h2>
          {probabilities ? <>
            <p className="mt-3 text-sm leading-6 text-slate-300">Las tres probabilidades proceden de una única matriz de marcadores y suman 100% salvo redondeo visual.</p>
            <div className="mt-6 space-y-5">
              {probabilityBar(`Gana ${homeTeam}`, probabilities.home, 'bg-cyan-400')}
              {probabilityBar('Empate', probabilities.draw, 'bg-amber-300')}
              {probabilityBar(`Gana ${awayTeam}`, probabilities.away, 'bg-rose-400')}
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl border border-slate-800 bg-black/25 p-3"><p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">xG local</p><p className="mt-1 text-lg font-semibold text-white">{prediction.expectedGoals?.home.toFixed(2)}</p></div>
              <div className="rounded-xl border border-slate-800 bg-black/25 p-3"><p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">xG total</p><p className="mt-1 text-lg font-semibold text-white">{prediction.expectedGoals?.total.toFixed(2)}</p></div>
              <div className="rounded-xl border border-slate-800 bg-black/25 p-3"><p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">xG visitante</p><p className="mt-1 text-lg font-semibold text-white">{prediction.expectedGoals?.away.toFixed(2)}</p></div>
            </div>
          </> : <p className="mt-4 text-sm leading-6 text-amber-100">Predicción no disponible: {prediction.limitations[0]}</p>}
        </article>

        <article className="rounded-2xl border border-slate-700/60 bg-slate-950 p-5 md:p-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">02 · Diferencial competitivo</p>
          <h2 className="mt-2 font-editorial text-3xl text-white">Qué inclina la previa</h2>
          <div className="mt-5 space-y-3">
              <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-4"><p className="font-semibold text-emerald-100">{favoredTeam ? `${favoredTeam} controla mejor el punto de partida` : 'No hay una ventaja competitiva publicada'}</p><p className="mt-1 text-sm leading-6 text-slate-300">{favoredTeam ? `Ocupa la posición ${favoredStanding?.position ?? 'no informada'} con ${favoredStanding?.points ?? 'puntos no informados'} y una secuencia reciente de ${recentSummary(context, favoredSide)}.` : 'La información disponible requiere cautela antes de inclinarse por uno de los equipos.'}</p></div>
              <div className="rounded-xl border border-amber-400/20 bg-amber-500/10 p-4"><p className="font-semibold text-amber-100">{favoredTeam ? `${favoredTeam === homeTeam ? awayTeam : homeTeam} puede equilibrar el partido` : 'Ambos equipos conservan una vía competitiva'}</p><p className="mt-1 text-sm leading-6 text-slate-300">La previa debe contrastarse con las alineaciones y el contexto final antes del inicio.</p></div>
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

      {prediction.markets && prediction.correctScores ? <section className="grid gap-5 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-700/60 bg-slate-950 p-5 md:p-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">04 · Mercados estadísticos</p>
          <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <p className="rounded-xl border border-slate-800 bg-black/25 p-3 text-slate-200">Over 2.5 <strong className="float-right text-white">{(prediction.markets.over25 * 100).toFixed(1)}%</strong></p>
            <p className="rounded-xl border border-slate-800 bg-black/25 p-3 text-slate-200">Under 2.5 <strong className="float-right text-white">{(prediction.markets.under25 * 100).toFixed(1)}%</strong></p>
            <p className="rounded-xl border border-slate-800 bg-black/25 p-3 text-slate-200">BTTS Sí <strong className="float-right text-white">{(prediction.markets.bttsYes * 100).toFixed(1)}%</strong></p>
            <p className="rounded-xl border border-slate-800 bg-black/25 p-3 text-slate-200">BTTS No <strong className="float-right text-white">{(prediction.markets.bttsNo * 100).toFixed(1)}%</strong></p>
          </div>
        </article>
        <article className="rounded-2xl border border-slate-700/60 bg-slate-950 p-5 md:p-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">05 · Marcadores más probables</p>
          <div className="mt-5 space-y-2">
            {prediction.correctScores.map((score) => <p key={`${score.home}-${score.away}`} className="flex justify-between rounded-xl border border-slate-800 bg-black/25 px-4 py-2.5 text-sm text-slate-200"><span>{score.home} - {score.away}</span><strong className="text-white">{(score.probability * 100).toFixed(1)}%</strong></p>)}
          </div>
        </article>
      </section> : null}

      <section className="grid gap-5 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-700/60 bg-slate-950 p-5 md:p-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">06 · Calidad del modelo</p>
          <div className="mt-4 flex items-end justify-between gap-4">
            <p className="text-4xl font-semibold text-cyan-100">{prediction.dataQuality.score}/100</p>
            <p className="text-right text-xs uppercase tracking-[0.14em] text-slate-400">{prediction.status === 'ready' ? 'Modelo listo' : prediction.status === 'limited-data' ? 'Datos limitados' : 'Datos insuficientes'}</p>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-300">Cobertura disponible: {prediction.dataQuality.available.join(', ') || 'sin bloques verificados'}.</p>
          {prediction.limitations.length > 0 ? <p className="mt-3 text-sm leading-6 text-amber-100">{prediction.limitations[0]}</p> : null}
        </article>
        <article className="rounded-2xl border border-slate-700/60 bg-slate-950 p-5 md:p-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">07 · Por qué el modelo llega a esta lectura</p>
          {prediction.drivers.length > 0 ? <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-300">
            {prediction.drivers.map((driver) => <li key={driver} className="border-l-2 border-cyan-400/60 pl-3">{driver}</li>)}
          </ul> : <p className="mt-4 text-sm leading-6 text-slate-400">No se publican factores mientras la muestra por condición sea insuficiente.</p>}
        </article>
      </section>

      {prediction.marketConsensus ? <section className="rounded-2xl border border-slate-700/60 bg-slate-950 p-5 md:p-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">08 · Consenso de mercado</p>
        <p className="mt-2 text-sm leading-6 text-slate-300">Promedio sin margen de {prediction.marketConsensus.bookmakers} casas disponibles. Es una referencia externa, no una instrucción para el modelo.</p>
        <div className="mt-5 grid grid-cols-3 gap-3 text-center text-sm">
          <div className="rounded-xl border border-slate-800 bg-black/25 p-3"><p className="text-slate-400">{homeTeam}</p><p className="mt-1 font-semibold text-white">{(prediction.marketConsensus.home * 100).toFixed(1)}%</p></div>
          <div className="rounded-xl border border-slate-800 bg-black/25 p-3"><p className="text-slate-400">Empate</p><p className="mt-1 font-semibold text-white">{(prediction.marketConsensus.draw * 100).toFixed(1)}%</p></div>
          <div className="rounded-xl border border-slate-800 bg-black/25 p-3"><p className="text-slate-400">{awayTeam}</p><p className="mt-1 font-semibold text-white">{(prediction.marketConsensus.away * 100).toFixed(1)}%</p></div>
        </div>
      </section> : null}

      <section className="rounded-2xl border border-cyan-400/25 bg-[linear-gradient(135deg,rgba(8,47,73,0.65),rgba(2,6,23,0.96))] p-5 md:p-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-200">Conclusión editorial</p>
        <h2 className="mt-2 font-editorial text-3xl text-white">{favoredTeam ? `${favoredTeam} parte con ventaja, con cautela` : 'La previa no define un favorito'}</h2>
        <p className="mt-4 max-w-5xl text-base leading-8 text-slate-200">{favoredTeam ? `La combinación de las señales verificables disponibles coloca a ${favoredTeam} por delante en la lectura S24. La ventaja solo se mantiene mientras el contexto y las alineaciones no la contradigan.` : 'La información disponible no alcanza para atribuir una ventaja competitiva fiable. La ficha presenta el contexto verificado sin convertirlo en una predicción.'}</p>
      </section>
    </section>
  );
}
