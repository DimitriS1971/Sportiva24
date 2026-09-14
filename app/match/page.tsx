import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getTodayFootballMatches } from '../lib/realSportsData';
import AdSlot from '../components/AdSlot';
import MatchExplorer from '../components/MatchExplorer';

export const revalidate = 30;

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
        <MatchExplorer matches={matches} />
      </section>

      <section className="px-4 pb-12 md:px-12 md:pb-16">
        <AdSlot variant="compact" />
      </section>

      <Footer />
    </main>
  );
}
