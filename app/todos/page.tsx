import Image from 'next/image';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import SportHubCard from '@/app/components/SportHubCard';

const sports = [
  {
    title: 'Fútbol',
    category: 'Centro principal',
    description: 'Modelos predictivos, inteligencia editorial, ranking IA, calendario y visuales premium para seguir el fútbol global con contexto y datos.',
    href: '/futbol',
    badge: 'Disponible',
    accent: 'blue' as const,
    status: 'Disponible' as const,
    metrics: ['Champions', 'Ligas top', 'IA S24'] as [string, string, string],
    icon: <span className="text-2xl">⚽</span>,
  },
  {
    title: 'Basketball',
    category: 'Centro principal',
    description: 'Cobertura de NBA, EuroLeague y torneos internacionales con análisis de posesiones, eficiencia, ritmo y señales del modelo S24.',
    href: '/basketball',
    badge: 'Disponible',
    accent: 'orange' as const,
    status: 'Disponible' as const,
    metrics: ['NBA', 'EuroLeague', 'Pace IA'] as [string, string, string],
    icon: <span className="text-2xl">🏀</span>,
  },
  {
    title: 'Tenis',
    category: 'Próximo deporte',
    description: 'Próxima cobertura con cuadros, superficies, forma reciente y proyección de partidos clave del circuito internacional.',
    href: '/tenis',
    badge: 'Roadmap',
    accent: 'emerald' as const,
    status: 'Disponible' as const,
    metrics: ['ATP', 'WTA', 'Grand Slams'] as [string, string, string],
    icon: <span className="text-2xl">🎾</span>,
  },
  {
    title: 'F1',
    category: 'Próximo deporte',
    description: 'Telemetría, ritmo de carrera, degradación y escenarios de estrategia para construir el centro de inteligencia de Fórmula 1.',
    href: '/f1',
    badge: 'Roadmap',
    accent: 'rose' as const,
    status: 'Disponible' as const,
    metrics: ['Telemetría', 'Pit window', 'Race pace'] as [string, string, string],
    icon: <span className="text-2xl">🏁</span>,
  },
  {
    title: 'Ciclismo',
    category: 'Próximo deporte',
    description: 'Perfiles de etapa, potencia, desgaste acumulado y lectura táctica del pelotón para grandes vueltas y clásicas.',
    href: '/ciclismo',
    badge: 'Roadmap',
    accent: 'violet' as const,
    status: 'Disponible' as const,
    metrics: ['Etapas', 'Watts', 'GC model'] as [string, string, string],
    icon: <span className="text-2xl">🚴</span>,
  },
  {
    title: 'Béisbol',
    category: 'Próximo deporte',
    description: 'Matchups de pitchers, splits, tendencia ofensiva y simulaciones para convertir MLB en otro centro premium de datos.',
    href: '/beisbol',
    badge: 'Roadmap',
    accent: 'amber' as const,
    status: 'Disponible' as const,
    metrics: ['MLB', 'Splits', 'Simulación'] as [string, string, string],
    icon: <span className="text-2xl">⚾</span>,
  },
  {
    title: 'E-games',
    category: 'Centro principal',
    description: 'Cobertura de esports competitivos con lectura de macro, economía, clutch y control de mapa para las escenas más relevantes.',
    href: '/egames',
    badge: 'Disponible',
    accent: 'violet' as const,
    status: 'Disponible' as const,
    metrics: ['LoL', 'Valorant', 'CS2'] as [string, string, string],
    icon: <span className="text-2xl">🎮</span>,
  },
  {
    title: 'Más',
    category: 'Centro secundario',
    description: 'Un espacio para deportes menores con la misma lógica de datos, inteligencia editorial y visual premium de Sportiva24.',
    href: '/mas',
    badge: 'Disponible',
    accent: 'emerald' as const,
    status: 'Disponible' as const,
    metrics: ['Pádel', 'Rugby 7s', 'MMA'] as [string, string, string],
    icon: <span className="text-2xl">➕</span>,
  },
];

export default function TodosPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="relative overflow-hidden border-b border-slate-900/80 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_25%),radial-gradient(circle_at_85%_20%,rgba(59,130,246,0.12),transparent_24%),linear-gradient(180deg,#020617_0%,#020617_65%,#000000_100%)] px-4 pb-12 pt-24 md:px-12 md:pb-16 md:pt-28 lg:min-h-[calc(100vh-80px)]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.45)_1px,transparent_1px)] bg-[size:56px_56px] opacity-20" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-300">Mapa total Sportiva24</p>
            <h1 className="mt-5 text-[3rem] font-semibold leading-[0.95] tracking-[-0.04em] text-white sm:text-[4.2rem] md:text-[5rem]">
              Todos los deportes
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300 md:text-xl">
              Un índice central para entrar a cada deporte desde su tarjeta principal, manteniendo la misma lógica visual y editorial del ecosistema Sportiva24.
            </p>
          </div>
          <div className="relative mx-auto w-full max-w-[620px] overflow-hidden rounded-[28px] border border-sky-500/25 bg-slate-950/80 shadow-[0_28px_90px_rgba(2,6,23,0.7)]">
            <Image
              src="/hero/hero-mas.png"
              alt="Visual de inteligencia deportiva para todos los deportes"
              width={1200}
              height={920}
              className="h-auto w-full"
              style={{
                maskImage: 'linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)',
                maskComposite: 'intersect',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)',
                WebkitMaskComposite: 'source-in',
              }}
              priority
            />
          </div>
        </div>
      </section>

      <section className="px-4 py-10 md:px-12 md:py-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Directorio principal</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-4xl">Tarjetas de deportes</h2>
            </div>
            <p className="hidden text-sm text-slate-500 md:block">Los centros activos enlazan directamente. El resto queda marcado como próximo.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {sports.map((sport) => (
              <SportHubCard key={sport.title} {...sport} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}