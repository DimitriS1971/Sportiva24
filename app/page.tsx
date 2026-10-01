import Navbar from './components/Navbar';
import HeroNew from './components/HeroNew';
import StatCardNew from './components/StatCardNew';
import FeaturedMatches from './components/FeaturedMatches';
import HeroCropIcon from './components/HeroCropIcon';
import AdSlot from './components/AdSlot';
import Footer from './components/Footer';
import type { IntelligenceMatch } from '@/lib/domain/intelligenceCenter';
import { getPublishedAnalysisCount, getTodayFootballMatchesCount } from './lib/realSportsData';

export const revalidate = 30;

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

const homeMatchCards: IntelligenceMatch[] = [
  {
    competition: 'LA LIGA',
    country: 'España',
    time: 'Finalizado',
    dateTimeUtc: '2026-09-18T16:00:00.000Z',
    status: 'FINALIZADO',
    team1: 'Barcelona',
    team1Logo: '/teams/barcelona.svg',
    team2: 'Sevilla',
    team2Logo: 'https://media.api-sports.io/football/teams/536.png',
    s24Index: 82,
    confidence: 'Alta',
    probability: 0.64,
    slug: 'demo-barcelona-sevilla-finalizado',
    sourceLabel: 'Demo local',
    sourceTier: 'mock',
    homeScore: 2,
    awayScore: 1,
    elapsedMinutes: 90,
  },
  {
    competition: 'PREMIER LEAGUE',
    country: 'Inglaterra',
    time: 'En juego',
    dateTimeUtc: '2026-09-18T18:00:00.000Z',
    status: 'EN VIVO',
    team1: 'Arsenal',
    team1Logo: '/teams/arsenal.svg',
    team2: 'Chelsea',
    team2Logo: '/teams/chelsea.svg',
    s24Index: 79,
    confidence: 'Media',
    probability: 0.55,
    slug: 'demo-arsenal-chelsea-en-vivo',
    sourceLabel: 'Demo local',
    sourceTier: 'mock',
    homeScore: 1,
    awayScore: 1,
    elapsedMinutes: 67,
  },
  {
    competition: 'LA LIGA',
    country: 'España',
    time: 'Mañana, 21:00',
    dateTimeUtc: '2026-09-19T19:00:00.000Z',
    status: 'PROXIMO',
    team1: 'Atlético Madrid',
    team1Logo: '/teams/atletico.svg',
    team2: 'Real Madrid',
    team2Logo: '/teams/real-madrid.svg',
    s24Index: 86,
    confidence: 'Media',
    probability: 0.42,
    slug: 'demo-atletico-madrid-real-madrid',
    sourceLabel: 'Demo local',
    sourceTier: 'mock',
  },
];

export default async function Home() {
  const [footballTodayCount, publishedAnalysisCount] = await Promise.all([
    getTodayFootballMatchesCount(),
    getPublishedAnalysisCount(),
  ]);
  const activeMatches = homeMatchCards.filter((match) => match.status === 'EN VIVO');
  const featuredMatches = homeMatchCards.filter((match) => match.status === 'PROXIMO');
  const finishedMatches = homeMatchCards.filter((match) => match.status === 'FINALIZADO');

  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white">
      <Navbar />

      <HeroNew />

      <section className="bg-black px-4 py-5 md:px-12 md:py-7">
        <AdSlot />
      </section>

      <section className="bg-black px-4 md:px-12 py-4 md:py-5">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          <StatCardNew icon={<HeroCropIcon source={heroBySport.football} alt="Fútbol" className="h-11 w-11" />} value={String(footballTodayCount)} title="Partidos hoy" detail="" accent="blue" href="/match" />
          <StatCardNew icon={<HeroCropIcon source={heroBySport.all} alt="Análisis" className="h-11 w-11" />} value={String(publishedAnalysisCount)} title="Análisis disponibles" detail="" accent="violet" href="/analisis" />
          <StatCardNew icon={<HeroCropIcon source={heroBySport.football} alt="Modelo online" className="h-11 w-11" />} value="Modelo Online" title="Última actualización: Ahora" detail="" accent="green" href="/modelo-online" />
        </div>
      </section>

      <section className="bg-black px-4 md:px-12 py-10 md:py-14">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex flex-col items-center gap-4 text-center md:mb-10">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 tracking-tight">Partidos destacados</h2>
              <p className="text-gray-400 text-base md:text-lg">Los encuentros de mayor relevancia del día</p>
            </div>
          </div>

          <FeaturedMatches featuredMatches={featuredMatches} activeMatches={activeMatches} finishedMatches={finishedMatches} />

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
            <p className="flex items-center gap-2 text-emerald-300 text-lg font-semibold"><HeroCropIcon source={heroBySport.all} alt="Cobertura global de fútbol" className="h-7 w-7" />Cobertura global de fútbol</p>
            <p className="text-gray-400 text-sm mt-1">Los principales partidos y competiciones de fútbol en un solo lugar.</p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
