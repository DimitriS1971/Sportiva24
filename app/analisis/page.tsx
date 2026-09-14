import Navbar from '../components/Navbar';
import AnalysisMatchList from '../components/AnalysisMatchList';
import Footer from '../components/Footer';
import AdSlot from '../components/AdSlot';
import { getFeaturedFootballMatches, getTodayFootballMatches, getUpcomingFootballMatches } from '@/app/lib/realSportsData';

export const revalidate = 120;
export const dynamic = 'force-dynamic';

export default async function AnalysisPage() {
  const todayMatches = await getTodayFootballMatches(50);
  const [featuredMatches, upcomingMatches] = await Promise.all([
    getFeaturedFootballMatches(50),
    getUpcomingFootballMatches(50),
  ]);
  const allMatches = [...todayMatches, ...featuredMatches, ...upcomingMatches]
    .filter((match) => match.status === 'PROXIMO' && match.sourceTier !== 'mock');
  const uniqueMatches = new Map(allMatches.map((match) => [match.slug, match]));
  const analysisData = [...uniqueMatches.values()]
    .sort((left, right) => (left.dateTimeUtc ?? '').localeCompare(right.dateTimeUtc ?? ''))
    .slice(0, 50);

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <section className="bg-gradient-to-b from-gray-900/40 to-black px-4 pb-16 pt-6 md:px-12 md:pb-20 md:pt-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-10 mt-16 max-w-4xl text-center md:mt-20">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">Análisis del día</p>
            <h1 className="mt-3 text-5xl font-bold text-white md:text-6xl">Partidos de hoy</h1>
            <p className="mt-3 max-w-3xl text-lg text-gray-400">Análisis actualizados a partir de los partidos programados para hoy. Cada ficha abre una lectura editorial con probabilidades, contexto y factores del encuentro.</p>
            <p className="mt-5 text-sm text-gray-500">{analysisData.length} análisis disponibles · Datos actualizados cada 2 minutos</p>
          </div>

          {analysisData.length > 0 ? <AnalysisMatchList matches={analysisData} /> : (
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
