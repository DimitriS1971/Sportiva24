'use client';

import Navbar from '../components/Navbar';
import MatchCardNew from '../components/MatchCardNew';
import Footer from '../components/Footer';

export default function AnalisysPage() {
  const analysisData = [
    {
      competition: 'Uefa champions league',
      time: 'Hoy, 21:00',
      status: 'PRÓXIMO' as const,
      team1: 'Real Madrid',
      team1Logo: '/teams-official/real-madrid.png',
      team2: 'Barcelona',
      team2Logo: '/teams-official/barcelona.png',
      s24Index: 91,
      confidence: 'Alta' as const,
      probability: 72,
      slug: 'real-madrid-barcelona',
    },
    {
      competition: 'NBA',
      time: 'Hoy, 20:30',
      status: 'EN VIVO' as const,
      team1: 'Los Angeles Lakers',
      team1Logo: '/teams-official/lakers.png',
      team2: 'Boston Celtics',
      team2Logo: '/teams-official/celtics.png',
      s24Index: 84,
      confidence: 'Alta' as const,
      probability: 68,
      slug: 'lakers-celtics',
    },
    {
      competition: 'Premier league',
      time: 'Hoy, 20:00',
      status: 'PRÓXIMO' as const,
      team1: 'Manchester City',
      team1Logo: '/teams-official/manchester-city.png',
      team2: 'Arsenal',
      team2Logo: '/teams-official/arsenal.png',
      s24Index: 87,
      confidence: 'Media' as const,
      probability: 55,
      slug: 'manchester-city-arsenal',
    },
    {
      competition: 'EUROPA LEAGUE',
      time: 'Mañana, 19:00',
      status: 'PRÓXIMO' as const,
      team1: 'Barcelona',
      team1Logo: '/teams-official/barcelona.png',
      team2: 'Arsenal',
      team2Logo: '/teams-official/arsenal.png',
      s24Index: 79,
      confidence: 'Media' as const,
      probability: 61,
      slug: 'barcelona-arsenal',
    },
  ];

  const primaryFilterButtons = [
    { label: 'Fútbol', icon: '⚽' },
    { label: 'Basketball', icon: '🏀' },
    { label: 'Otros', icon: '◌' },
  ];

  const secondaryFilterButtons = [
    { label: 'Hoy', icon: '📅' },
    { label: 'Mañana', icon: '🗓️' },
    { label: 'Esta semana', icon: '📊' },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero Compacto */}
      <section className="bg-gradient-to-b from-gray-900/40 to-black px-4 md:px-12 pt-6 md:pt-8 pb-16 md:pb-20 mt-16 md:mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-[0.72fr_1.28fr] gap-10 xl:gap-8 items-start">
          <div className="mb-4 xl:pt-2">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-3">Análisis</h1>
            <p className="text-lg text-gray-400 max-w-2xl">
              Todos los análisis generados por Sportiva24.
            </p>

            <div className="mt-8 space-y-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar análisis..."
                  className="w-full px-5 py-3 md:py-4 bg-gray-900/60 border border-gray-800/80 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all duration-300"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600">
                  🔍
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap gap-3">
                  {primaryFilterButtons.map((btn, idx) => (
                    <button
                      key={idx}
                      className="px-4 md:px-5 py-2 md:py-2.5 bg-gray-900/60 border border-gray-800/80 hover:border-blue-500/40 rounded-lg text-sm text-gray-300 hover:text-white transition-all duration-200 flex items-center gap-2"
                    >
                      <span>{btn.icon}</span>
                      <span>{btn.label}</span>
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  {secondaryFilterButtons.map((btn, idx) => (
                    <button
                      key={idx}
                      className="px-4 md:px-5 py-2 md:py-2.5 bg-gray-900/60 border border-gray-800/80 hover:border-blue-500/40 rounded-lg text-sm text-gray-300 hover:text-white transition-all duration-200 flex items-center gap-2"
                    >
                      <span>{btn.icon}</span>
                      <span>{btn.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-sm text-gray-500">
                {analysisData.length} análisis disponibles
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-5">
            {analysisData.map((analysis, idx) => (
              <div key={idx}>
                <div>
                  <MatchCardNew
                    competition={analysis.competition}
                    time={analysis.time}
                    status={analysis.status}
                    team1={analysis.team1}
                    team1Logo={analysis.team1Logo}
                    team2={analysis.team2}
                    team2Logo={analysis.team2Logo}
                    s24Index={analysis.s24Index}
                    confidence={analysis.confidence}
                    probability={analysis.probability}
                    slug={analysis.slug}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
