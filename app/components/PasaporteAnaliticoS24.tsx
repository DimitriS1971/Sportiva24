import type { InformeS24V1 } from '@/lib/intelligence-s24/informeS24V1';

interface PasaporteAnaliticoS24Props {
  pasaporte: InformeS24V1['pasaporte'];
}

function PassportRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[150px_1fr] items-start gap-3 border-b border-slate-700/45 pb-2.5 text-sm last:border-b-0 last:pb-0 md:grid-cols-[210px_1fr]">
      <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <p className="font-medium text-slate-100 break-words">{value}</p>
    </div>
  );
}

export default function PasaporteAnaliticoS24({ pasaporte }: PasaporteAnaliticoS24Props) {
  return (
    <section className="premium-card-enter rounded-3xl border border-slate-600/55 bg-[linear-gradient(165deg,rgba(30,41,59,0.75),rgba(2,6,23,0.96))] p-5 md:p-7 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-600/55 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.17em] text-slate-300">Pasaporte Analitico S24</p>
          <p className="mt-1 text-sm text-slate-400">Ficha tecnica institucional del informe generado.</p>
        </div>
        <span className="rounded-full border border-slate-500/60 bg-slate-800/70 px-3 py-1 text-[11px] uppercase tracking-[0.13em] text-slate-200">Controlado</span>
      </div>

      <div className="mt-4 space-y-3">
        <PassportRow label="Version del Motor" value={pasaporte.versionMotor} />
        <PassportRow label="Version metodologica" value={pasaporte.versionMetodologica} />
        <PassportRow label="Sport Profile Version" value={pasaporte.sportProfileVersion} />
        <PassportRow label="Sport Methodology Version" value={pasaporte.sportMethodologyVersion} />
        <PassportRow label="Sport Identifier" value={pasaporte.sportIdentifier} />
        <PassportRow label="Fecha y hora" value={pasaporte.fechaCalculo} />
        <PassportRow label="Proveedor de datos" value={pasaporte.proveedorDatos} />
        <PassportRow label="Cobertura" value={pasaporte.coberturaAnalisis} />
        <PassportRow label="Nivel de confianza" value={pasaporte.nivelConfianza} />
        <PassportRow label="Estado del informe" value={pasaporte.estadoInforme} />
      </div>
    </section>
  );
}
