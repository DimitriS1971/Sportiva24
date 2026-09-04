import Link from 'next/link';

import type { LeagueIntelligenceHubData } from '@/lib/intelligence-s24/league-intelligence';

interface LeagueIntelligenceHubProps {
  data: LeagueIntelligenceHubData;
}

export default function LeagueIntelligenceHub({ data }: LeagueIntelligenceHubProps) {
  return (
    <div className="px-4 md:px-12 pt-24 pb-14 max-w-7xl mx-auto space-y-8">
      <section className="rounded-3xl border border-slate-700/45 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_45%),linear-gradient(160deg,rgba(15,23,42,0.95),rgba(2,6,23,0.98))] p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.18em] text-sky-300">League Intelligence S24</p>
        <h1 className="mt-3 font-editorial text-4xl md:text-5xl leading-tight text-white">Inteligencia de Competiciones</h1>
        <p className="mt-4 max-w-3xl text-sm md:text-base leading-relaxed text-slate-300">
          Lectura competitiva integral de cada liga: nivel, equilibrio, volatilidad, intensidad, tendencias, equipos destacados
          y comparativas metodologicas entre ventanas de temporada.
        </p>
        <p className="mt-2 text-xs text-slate-400">Actualizado: {new Date(data.generatedAt).toLocaleString('es-ES')}</p>
      </section>

      <section className="rounded-2xl border border-slate-700/60 bg-slate-950/60 p-5">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="text-xl font-semibold text-white">Competiciones disponibles</h2>
          {data.recommendedLeagueSlug ? (
            <Link
              href={`/league-intelligence/${data.recommendedLeagueSlug}`}
              className="rounded-xl border border-sky-500/60 bg-sky-500/20 px-4 py-2 text-sm font-semibold text-sky-100 hover:bg-sky-500/30"
            >
              Abrir liga recomendada
            </Link>
          ) : null}
        </div>

        {data.leagues.length === 0 ? (
          <div className="rounded-xl border border-slate-700/50 bg-black/30 p-4">
            <p className="text-sm text-slate-300">Aun no hay competiciones con datos suficientes para ranking metodologico.</p>
            <p className="mt-1 text-xs text-slate-400">Prueba revisando el centro S24 o los informes de partido para generar nuevas muestras.</p>
            <Link href="/centro-inteligencia-s24" className="mt-3 inline-flex rounded-lg border border-slate-600 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-sky-500/50 hover:text-sky-200">
              Ir al Centro S24
            </Link>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.leagues.map((league) => (
              <Link
                key={league.slug}
                href={`/league-intelligence/${league.slug}`}
                className="rounded-xl border border-slate-700/50 bg-black/25 p-4 hover:border-sky-500/50 hover:bg-slate-900/40 transition-colors"
              >
                <p className="text-sm font-semibold text-white">{league.competition}</p>
                <p className="mt-1 text-xs text-slate-300">/{league.slug}</p>
                <p className="mt-1 text-xs text-slate-400">Muestras: {league.matches}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
