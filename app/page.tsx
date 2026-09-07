import Link from 'next/link';

import Navbar from './components/Navbar';
import HeroNew from './components/HeroNew';
import StatCardNew from './components/StatCardNew';
import EditorialMatchCard from './components/EditorialMatchCard';
import HeroCropIcon from './components/HeroCropIcon';
import Footer from './components/Footer';
import { getTodayFootballMatches, getTodayFootballMatchesCount } from './lib/realSportsData';

const heroBySport = {
  all: '/hero/hero-portada.png',
  football: '/hero/hero-football.png',
  basketball: '/hero/hero-basketball.png',
  tennis: '/hero/hero-tenis.png',
  f1: '/hero/hero-f1.png',
  cycling: '/hero/hero-ciclismo.png',
  baseball: '/hero/hero-beisball.png',
  egames: '/hero/hero-egames.png',
  more: '/hero/hero-mas.png',
} as const;

export default async function Home() {
  const [featuredMatches, footballTodayCount] = await Promise.all([
    getTodayFootballMatches(48),
    getTodayFootballMatchesCount(),
  ]);

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <HeroNew />

      <section className="bg-black px-4 md:px-12 py-4 md:py-5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCardNew icon={<HeroCropIcon source={heroBySport.football} alt="Fútbol" className="h-11 w-11" />} value={String(footballTodayCount)} title="Partidos hoy" detail="" accent="blue" href="/match" />
          <StatCardNew icon={<HeroCropIcon source={heroBySport.all} alt="Análisis" className="h-11 w-11" />} value="1.248" title="Análisis publicados" detail="" accent="violet" href="/analisis" />
          <StatCardNew icon={<HeroCropIcon source={heroBySport.football} alt="Modelo online" className="h-11 w-11" />} value="Modelo Online" title="Última actualización: Ahora" detail="" accent="green" href="/modelo-online" />
        </div>
      </section>

      <section className="bg-black px-4 md:px-12 py-10 md:py-14">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 md:mb-10 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 tracking-tight">Partidos destacados</h2>
              <p className="text-gray-400 text-base md:text-lg">Análisis en tiempo real de los encuentros más importantes</p>
            </div>
            <button className="hidden md:inline-flex px-5 py-2.5 rounded-xl border border-blue-500/50 text-blue-300 hover:bg-blue-500/10 transition-colors text-sm font-semibold">
              Ver todos
            </button>
          </div>

          {featuredMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {featuredMatches.map((match) => (
                <EditorialMatchCard
                  key={match.slug}
                  competition={match.competition}
                  time={match.time}
                  status={match.status === 'PROXIMO' ? 'PRÓXIMO' : 'EN VIVO'}
                  homeTeam={match.team1}
                  homeCrestUrl={match.team1Logo}
                  awayTeam={match.team2}
                  awayCrestUrl={match.team2Logo}
                  slug={match.slug}
                  href={match.href}
                  sourceLabel={match.sourceLabel}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-amber-500/35 bg-amber-500/10 px-5 py-4 text-amber-200 text-sm">
              No hay partidos confiables para mostrar ahora con los filtros gratuitos activos.
            </div>
          )}

          <div className="mt-9 rounded-2xl border border-blue-900/50 bg-gradient-to-r from-gray-950 via-gray-900/80 to-gray-950 p-5 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-blue-300/80">Espacio Publicitario Premium</p>
              <p className="text-sm md:text-base text-gray-300 mt-1">Zona reservada para sponsor oficial de jornada y promociones exclusivas.</p>
            </div>
            <div className="px-4 py-2 rounded-lg border border-dashed border-blue-500/50 text-blue-300 text-sm font-medium bg-blue-500/5">
              970 x 90 Future Ad Slot
            </div>
          </div>
        </div>
      </section>

      <section className="bg-black px-4 md:px-12 pb-9">
        <div className="max-w-7xl mx-auto rounded-2xl border border-gray-800/70 bg-gradient-to-r from-gray-950 to-gray-900/80 p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          <div className="rounded-xl bg-black/35 border border-blue-900/35 p-4">
            <p className="flex items-center gap-2 text-blue-300 text-lg font-semibold"><HeroCropIcon source={heroBySport.egames} alt="Inteligencia Artificial" className="h-7 w-7" />Inteligencia Artificial</p>
            <p className="text-gray-400 text-sm mt-1">Modelos avanzados que aprenden y mejoran cada día.</p>
          </div>
          <div className="rounded-xl bg-black/35 border border-orange-900/35 p-4">
            <p className="flex items-center gap-2 text-orange-300 text-lg font-semibold"><HeroCropIcon source={heroBySport.basketball} alt="Datos en tiempo real" className="h-7 w-7" />Datos en tiempo real</p>
            <p className="text-gray-400 text-sm mt-1">Estadísticas actualizadas al instante desde múltiples fuentes.</p>
          </div>
          <div className="rounded-xl bg-black/35 border border-violet-900/35 p-4">
            <p className="flex items-center gap-2 text-violet-300 text-lg font-semibold"><HeroCropIcon source={heroBySport.football} alt="Análisis confiable" className="h-7 w-7" />Análisis confiable</p>
            <p className="text-gray-400 text-sm mt-1">Metodología transparente y resultados respaldados por datos.</p>
          </div>
          <div className="rounded-xl bg-black/35 border border-emerald-900/35 p-4">
            <p className="flex items-center gap-2 text-emerald-300 text-lg font-semibold"><HeroCropIcon source={heroBySport.all} alt="Cobertura global" className="h-7 w-7" />Cobertura global</p>
            <p className="text-gray-400 text-sm mt-1">Los principales eventos deportivos del mundo en un solo lugar.</p>
          </div>
        </div>
      </section>

      <section className="bg-black px-4 md:px-12 pb-12 md:pb-14">
        <div className="max-w-7xl mx-auto rounded-2xl border border-blue-900/45 bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 p-5 md:p-6 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <p className="text-white text-xl md:text-2xl font-semibold tracking-tight">Recibe análisis exclusivos cada día</p>
            <p className="text-gray-400 mt-1 text-sm md:text-base">Suscríbete a nuestro newsletter y mejora tus decisiones.</p>
          </div>
          <form className="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Tu email"
              className="min-w-[240px] md:min-w-[320px] px-4 py-3 rounded-xl bg-black/45 border border-gray-700 text-gray-100 placeholder:text-gray-500 focus:outline-none focus:border-blue-500"
            />
            <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold transition-all">
              Suscribirme
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}
