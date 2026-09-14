import Navbar from '../components/Navbar';
import MatchCardNew from '../components/MatchCardNew';
import Footer from '../components/Footer';
import AdSlot from '../components/AdSlot';
import { getTodayFootballMatches } from '@/app/lib/realSportsData';

export const revalidate = 120;

export default async function AnalysisPage() {
  const todayMatches = await getTodayFootballMatches(50);
  const analysisData = todayMatches.filter((match) => match.status === 'PROXIMO');

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <section className="bg-gradient-to-b from-gray-900/40 to-black px-4 pb-16 pt-6 md:px-12 md:pb-20 md:pt-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 mt-16 md:mt-20">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">Análisis del día</p>
            <h1 className="mt-3 text-5xl font-bold text-white md:text-6xl">Partidos de hoy</h1>
            <p className="mt-3 max-w-3xl text-lg text-gray-400">Análisis actualizados a partir de los partidos reales programados para hoy. Cada ficha abre una lectura editorial con probabilidades, contexto y factores del encuentro.</p>
            <p className="mt-5 text-sm text-gray-500">{analysisData.length} análisis disponibles · Datos actualizados cada 2 minutos</p>
          </div>

          {analysisData.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {analysisData.map((analysis) => (
                <MatchCardNew
                  key={analysis.slug}
                  competition={analysis.competition}
                  time={analysis.time}
                  dateTimeUtc={analysis.dateTimeUtc}
                  status={analysis.status === 'PROXIMO' ? 'PRÓXIMO' : analysis.status}
                  team1={analysis.team1}
                  team1Logo={analysis.team1Logo}
                  team2={analysis.team2}
                  team2Logo={analysis.team2Logo}
                  s24Index={analysis.s24Index}
                  confidence={analysis.confidence}
                  probability={analysis.probability}
                  slug={analysis.slug}
                  href={`/analisis/${analysis.slug}`}
                  sourceLabel={analysis.sourceLabel}
                  sourceTier={analysis.sourceTier}
                  homeScore={analysis.homeScore}
                  awayScore={analysis.awayScore}
                  elapsedMinutes={analysis.elapsedMinutes}
                />
              ))}
            </div>
          ) : (
            <section className="rounded-2xl border border-gray-800 bg-gray-950/70 p-8 text-center">
              <h2 className="text-2xl font-semibold text-white">No hay partidos disponibles</h2>
              <p className="mt-2 text-gray-400">El proveedor no devolvió partidos de fútbol para la fecha actual.</p>
            </section>
          )}
        </div>
      </section>
      <section className="bg-black px-4 py-5 md:px-12 md:py-7"><AdSlot /></section>
      <Footer />
    </main>
  );
}
