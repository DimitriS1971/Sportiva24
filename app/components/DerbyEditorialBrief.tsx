const sourceUrl = 'https://www.sportiva24.com/noticias/atletico-real-madrid-las-variables-que-pueden-decidir-el-derbi-1789731937168';

const matchVariables = [
  {
    title: 'Localía e intensidad',
    text: 'El Atlético puede convertir el estadio en un partido de máxima presión, con bloque compacto, ritmo alto y recuperaciones cerca del área rival.',
    tone: 'border-rose-400/25 bg-rose-500/10 text-rose-100',
  },
  {
    title: 'Calidad y transiciones',
    text: 'El Real Madrid tiene recursos individuales para cambiar el encuentro, pero deberá proteger las pérdidas cuando adelante sus líneas.',
    tone: 'border-cyan-400/25 bg-cyan-500/10 text-cyan-100',
  },
  {
    title: 'Julián Álvarez',
    text: 'Su recuperación de una sobrecarga muscular convierte su disponibilidad, minutos y posible titularidad en una variable crítica del análisis.',
    tone: 'border-amber-400/25 bg-amber-500/10 text-amber-100',
  },
];

const tacticalScenarios = [
  'Si el Real Madrid domina la posesión, el Atlético deberá cerrar los pasillos interiores y evitar recepciones limpias cerca del área.',
  'Si el Atlético recupera alto, el Real Madrid tendrá que gestionar mejor las pérdidas y las transiciones defensivas.',
  'Si el marcador llega igualado al tramo final, cambios, tarjetas, cansancio y balón parado pueden inclinar el derbi.',
];

const dataBlocks = [
  'Producción ofensiva: xG, goles, tiros, tiros a puerta y grandes ocasiones.',
  'Solidez defensiva: xGA, tiros concedidos y ocasiones claras permitidas.',
  'Contexto local/visitante: Atlético en casa frente a Real Madrid fuera.',
  'Estado de las plantillas: lesiones, suspensiones y carga de minutos.',
  'Calendario: descanso, competición europea y rotaciones recientes.',
];

export default function DerbyEditorialBrief() {
  return (
    <section className="mx-auto mb-8 max-w-6xl space-y-5 px-4 md:space-y-6 md:px-12">
      <article className="overflow-hidden rounded-3xl border border-amber-300/25 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.16),transparent_38%),linear-gradient(145deg,rgba(30,20,8,0.96),rgba(2,6,23,0.98))] p-5 md:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-300">Lectura editorial Sportiva24</p>
            <h2 className="mt-2 font-editorial text-3xl text-white">Las variables que pueden decidir el derbi</h2>
          </div>
          <a href={sourceUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-amber-200 underline decoration-amber-300/40 underline-offset-4">Leer nota completa</a>
        </div>
        <p className="mt-5 max-w-5xl text-base leading-7 text-slate-200">Atlético de Madrid y Real Madrid llegan a un partido que no se explica solo por la tabla. La localía, la intensidad, las transiciones, la eficacia en las áreas y la disponibilidad de los jugadores determinantes deben leerse junto con los datos en tiempo real.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {matchVariables.map((item) => <article key={item.title} className={`rounded-2xl border p-4 ${item.tone}`}><h3 className="font-semibold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-slate-200">{item.text}</p></article>)}
        </div>
      </article>

      <div className="grid gap-5 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-700/60 bg-slate-950 p-5 md:p-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Duelo táctico</p>
          <h2 className="mt-2 font-editorial text-2xl text-white">Tres escenarios para observar</h2>
          <ol className="mt-5 space-y-3">
            {tacticalScenarios.map((scenario, index) => <li key={scenario} className="flex gap-3 text-sm leading-6 text-slate-300"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-700 text-xs font-semibold text-cyan-200">{index + 1}</span><span>{scenario}</span></li>)}
          </ol>
        </article>

        <article className="rounded-2xl border border-slate-700/60 bg-slate-950 p-5 md:p-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Panel de seguimiento</p>
          <h2 className="mt-2 font-editorial text-2xl text-white">Datos que explican el partido</h2>
          <ul className="mt-5 space-y-3">
            {dataBlocks.map((block) => <li key={block} className="border-b border-slate-800 pb-3 text-sm leading-6 text-slate-300 last:border-b-0">{block}</li>)}
          </ul>
        </article>
      </div>

      <p className="rounded-2xl border border-sky-400/20 bg-sky-500/5 px-5 py-4 text-sm leading-6 text-slate-300">Esta lectura editorial complementa, pero no reemplaza, las alineaciones confirmadas, lesiones, forma, métricas avanzadas y contexto de calendario que se actualizan desde API-Football.</p>
    </section>
  );
}