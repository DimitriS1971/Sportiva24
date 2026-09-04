import type { InformeS24V1 } from '@/lib/intelligence-s24/informeS24V1';

interface VeredictoS24Props {
  veredicto: InformeS24V1['veredicto'];
}

export default function VeredictoS24({ veredicto }: VeredictoS24Props) {
  return (
    <section className="premium-card-enter rounded-3xl border border-emerald-400/35 bg-[linear-gradient(165deg,rgba(6,78,59,0.35),rgba(2,6,23,0.96))] p-5 md:p-7 shadow-xl shadow-emerald-900/25">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.17em] text-emerald-200">Resumen Ejecutivo</p>
        <span className="rounded-full border border-emerald-300/50 bg-emerald-500/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.13em] text-emerald-100">
          Ventaja: {veredicto.ventajaCompetitiva}
        </span>
      </div>

      <p className="mt-4 text-base md:text-lg leading-relaxed text-slate-100">{veredicto.texto}</p>
    </section>
  );
}
