import type { InformeS24V1 } from '@/lib/intelligence-s24/informeS24V1';

interface ArbolEvidenciasS24Props {
  arbol: InformeS24V1['arbolEvidencias'];
}

const NODE_EXPLANATION: Record<string, string> = {
  Veredicto: 'Decision ejecutiva sintetizada para lectura rapida.',
  Insight: 'Narrativa interpretativa de ventajas y riesgos.',
  Indicadores: 'Metricas nucleares del modelo en contexto.',
  Factores: 'Contribuciones ponderadas por modulo metodologico.',
  Datos: 'Fuente y consistencia operacional de la evaluacion.',
};

export default function ArbolEvidenciasS24({ arbol }: ArbolEvidenciasS24Props) {
  return (
    <section className="rounded-3xl border border-slate-700/45 bg-slate-950/55 p-5 md:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.17em] text-slate-300">Arbol de Evidencias S24</p>

      <div className="mt-4 grid gap-3">
        {arbol.cadena.map((node, index) => (
          <details
            key={node}
            className="group premium-card-enter rounded-2xl border border-slate-700/50 bg-black/30 px-4 py-3 open:border-cyan-400/35 open:bg-cyan-500/10"
            open={index === 0}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-500/70 bg-slate-800/70 text-xs font-semibold text-slate-100">
                  {index + 1}
                </span>
                <p className="text-sm font-semibold text-white">{node}</p>
              </div>
              <span className="text-xs text-slate-400 transition-transform duration-300 group-open:rotate-90">&gt;</span>
            </summary>

            <p className="mt-3 border-l border-slate-600/55 pl-4 text-xs leading-relaxed text-slate-300">
              {NODE_EXPLANATION[node] ?? 'Nodo de trazabilidad del informe.'}
            </p>
          </details>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-slate-700/45 bg-slate-900/40 p-4">
        <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">Datos de soporte</p>
        <ul className="mt-2.5 space-y-1.5 text-xs text-slate-300">
          {arbol.datos.map((entry) => (
            <li key={entry} className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-300" />
              <span>{entry}</span>
            </li>
          ))}
        </ul>
      </div>

      {arbol.narrativaLinks.length > 0 ? (
        <div className="mt-4 rounded-2xl border border-slate-700/45 bg-slate-900/40 p-4">
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">Trazabilidad narrativa</p>
          <div className="mt-2 grid gap-2 md:grid-cols-2">
            {arbol.narrativaLinks.map((link) => (
              <div key={link.paragraphId} className="rounded-xl border border-slate-700/50 bg-black/25 p-3 text-xs text-slate-300">
                <p className="font-semibold text-slate-100">{link.paragraphId}</p>
                <p className="mt-1">{link.evidenceRefs.join(', ')}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
