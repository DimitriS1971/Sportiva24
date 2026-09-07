import Image from 'next/image';
import Link from 'next/link';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getTodayFootballMatches } from '../lib/realSportsData';
import { getTeamCrest } from '../lib/teamCrests';
import { displayLabel } from '../lib/displayLabel';
import AdSlot from '../components/AdSlot';

export const revalidate = 120;

export default async function MatchesPage() {
  const matches = await getTodayFootballMatches(12);

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="px-4 md:px-12 pt-24 pb-6 md:pt-28 md:pb-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-300">Partidos</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-white">Explorar partidos</h1>
          <p className="mt-3 text-sm md:text-base text-gray-400 max-w-3xl">
            Selecciona un encuentro para ver su análisis detallado en la ruta oficial de cada partido.
          </p>
        </div>
      </section>

      <section className="px-4 pb-8 md:px-12 md:pb-10">
        <AdSlot variant="compact" />
      </section>

      <section className="px-4 md:px-12 pb-12 md:pb-16">
        {matches.length > 0 ? (
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => {
              const statusColor = match.status === 'EN VIVO'
                ? 'text-green-300 border-green-500/35 bg-green-500/10'
                : 'text-gray-300 border-gray-700/60 bg-gray-800/40';

              return (
                <article
                  key={match.slug}
                  className="rounded-2xl border border-gray-800/75 bg-gradient-to-br from-gray-950/90 via-gray-950/80 to-black p-5 md:p-6"
                >
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2 min-w-0">
                      <p className="text-[11px] text-gray-500 truncate">{displayLabel(match.competition)}</p>
                      {match.sourceLabel ? (
                        <span className="rounded-full border border-sky-500/40 bg-sky-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-sky-300">
                          Fuente gratis
                        </span>
                      ) : null}
                    </div>
                    <span className={`px-2.5 py-1 rounded-full border text-[11px] font-semibold ${statusColor}`}>
                      {match.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 mb-5">
                    <div className="flex flex-col items-center flex-1">
                      <Image src={getTeamCrest(match.team1, match.team1Logo)} alt={`Escudo de ${match.team1}`} width={64} height={64} className="object-contain" />
                      <p className="mt-2 text-sm font-semibold text-center text-white">{match.team1}</p>
                    </div>
                    <span className="text-blue-300 font-bold text-sm">VS</span>
                    <div className="flex flex-col items-center flex-1">
                      <Image src={getTeamCrest(match.team2, match.team2Logo)} alt={`Escudo de ${match.team2}`} width={64} height={64} className="object-contain" />
                      <p className="mt-2 text-sm font-semibold text-center text-white">{match.team2}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 rounded-xl border border-gray-800/70 bg-gray-900/45 p-3 mb-5">
                    <div className="text-center">
                      <p className="text-[11px] text-gray-500">S24</p>
                      <p className="text-xl font-bold text-blue-300">{match.s24Index}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[11px] text-gray-500">Confianza</p>
                      <p className="text-sm font-semibold text-emerald-300">{match.confidence}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[11px] text-gray-500">Prob.</p>
                      <p className="text-xl font-bold text-orange-300">{match.probability}%</p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mb-4">{match.time}</p>

                  <Link
                    href={`/match/${match.slug}`}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3 text-sm font-semibold text-white transition-all hover:from-blue-500 hover:to-blue-400"
                  >
                    Ver análisis completo
                  </Link>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="max-w-7xl mx-auto rounded-2xl border border-amber-500/35 bg-amber-500/10 px-5 py-4 text-amber-200 text-sm">
            No hay partidos confiables para mostrar con el modo gratuito actual.
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
