import Link from 'next/link';

import type { ClubIntelligenceHubData } from '@/lib/intelligence-s24/club-intelligence';

interface ClubIntelligenceHubProps {
  data: ClubIntelligenceHubData;
}

export default function ClubIntelligenceHub({ data }: ClubIntelligenceHubProps) {
  return (
    <div className="px-4 md:px-12 pt-24 pb-14 max-w-7xl mx-auto space-y-8">
      <section className="rounded-3xl border border-slate-700/45 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_45%),linear-gradient(160deg,rgba(15,23,42,0.95),rgba(2,6,23,0.98))] p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.18em] text-sky-300">Club Intelligence S24</p>
        <h1 className="mt-3 font-editorial text-4xl md:text-5xl leading-tight text-white">Radiografia Inteligente de Clubes</h1>
        <p className="mt-4 max-w-3xl text-sm md:text-base leading-relaxed text-slate-300">
          Primer producto de inteligencia deportiva centrado en clubes. Cada perfil integra estado competitivo, evolucion temporal,
          narrativa automatica, insights y alertas metodologicas reutilizando el ecosistema S24.
        </p>
        <p className="mt-2 text-xs text-slate-400">Actualizado: {new Date(data.generatedAt).toLocaleString('es-ES')}</p>
      </section>

      <section className="rounded-2xl border border-slate-700/60 bg-slate-950/60 p-5">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="text-xl font-semibold text-white">Clubes disponibles</h2>
          {data.recommendedClubSlug ? (
            <Link
              href={`/club-intelligence/${data.recommendedClubSlug}`}
              className="rounded-xl border border-sky-500/60 bg-sky-500/20 px-4 py-2 text-sm font-semibold text-sky-100 hover:bg-sky-500/30"
            >
              Abrir club recomendado
            </Link>
          ) : null}
        </div>

        {data.clubs.length === 0 ? (
          <p className="text-sm text-slate-400">No hay clubes con datos suficientes en la ventana actual.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.clubs.map((club) => (
              <Link
                key={club.slug}
                href={`/club-intelligence/${club.slug}`}
                className="rounded-xl border border-slate-700/50 bg-black/25 p-4 hover:border-sky-500/50 hover:bg-slate-900/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={club.crestUrl} alt={club.name} width={40} height={40} className="h-10 w-10 object-contain" />
                  <div>
                    <p className="text-sm font-semibold text-white">{club.name}</p>
                    <p className="text-xs text-slate-400">/{club.slug}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
