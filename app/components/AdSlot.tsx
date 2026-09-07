interface AdSlotProps {
  variant?: 'wide' | 'compact';
  label?: string;
}

export default function AdSlot({ variant = 'wide', label = 'Espacio publicitario' }: AdSlotProps) {
  return (
    <aside
      aria-label={label}
      className={`relative isolate mx-auto w-full overflow-hidden rounded-2xl border border-blue-500/25 bg-[linear-gradient(110deg,rgba(10,31,82,0.9),rgba(24,20,74,0.92),rgba(3,12,35,0.96))] shadow-[0_18px_45px_rgba(2,6,23,0.35)] ${variant === 'compact' ? 'max-w-5xl px-5 py-5' : 'max-w-7xl px-6 py-7 md:px-10 md:py-8'}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_25%,rgba(59,130,246,0.22),transparent_28%),linear-gradient(90deg,transparent,rgba(37,99,235,0.08),transparent)]" />
      <div className="relative flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-blue-300">{label}</p>
          <h2 className="mt-2 text-xl font-semibold text-white md:text-2xl">Publicidad destacada</h2>
          <p className="mt-1 text-sm text-slate-300">Espacio reservado para marcas y patrocinadores de Sportiva24.</p>
        </div>
        <div className="flex h-10 min-w-[150px] items-center justify-center rounded-lg border border-dashed border-blue-400/45 bg-blue-500/10 px-4 text-xs font-semibold uppercase tracking-[0.14em] text-blue-200">
          Próximamente
        </div>
      </div>
    </aside>
  );
}
