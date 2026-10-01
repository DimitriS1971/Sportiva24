import Navbar from '../components/Navbar';
import AnalysisMatchList from '../components/AnalysisMatchList';
import Footer from '../components/Footer';
import AdSlot from '../components/AdSlot';
import { getAnalysisFootballMatches } from '@/app/lib/realSportsData';

export const revalidate = 120;
export const dynamic = 'force-dynamic';

export default async function AnalysisPage() {
  const analysisData = await getAnalysisFootballMatches(50);

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <section className="bg-gradient-to-b from-gray-900/40 to-black px-4 pb-16 pt-6 md:px-12 md:pb-20 md:pt-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-10 mt-16 max-w-4xl text-center md:mt-20">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">Análisis próximos</p>
            <h1 className="mt-3 text-5xl font-bold text-white md:text-6xl">Próximas 48 horas</h1>
            <p className="mt-3 max-w-3xl text-lg text-gray-400">Análisis construidos a partir de encuentros programados para las próximas 48 horas. Cada ficha abre una lectura editorial con contexto y factores verificados disponibles.</p>
            <p className="mt-5 text-sm text-gray-500">{analysisData.length} análisis disponibles · Datos actualizados cada 2 minutos</p>
          </div>

          {analysisData.length > 0 ? <AnalysisMatchList matches={analysisData} /> : (
            <section className="rounded-2xl border border-gray-800 bg-gray-950/70 p-8 text-center">
              <h2 className="text-2xl font-semibold text-white">No hay partidos disponibles</h2>
              <p className="mt-2 text-gray-400">El proveedor no devolvió próximos partidos de fútbol verificables para las próximas 48 horas.</p>
            </section>
          )}
        </div>
      </section>
      <section className="bg-black px-4 py-5 md:px-12 md:py-7"><AdSlot /></section>
      <Footer />
    </main>
  );
}
