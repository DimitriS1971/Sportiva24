'use client';

import Image from 'next/image';
import Link from 'next/link';

interface MatchCardNewProps {
  competition: string;
  time: string;
  status: 'EN VIVO' | 'PRÓXIMO';
  team1: string;
  team1Logo: string;
  team2: string;
  team2Logo: string;
  s24Index: number;
  confidence: 'Alta' | 'Media' | 'Baja';
  probability: number;
  slug: string;
  href?: string;
  sourceLabel?: string;
}

export default function MatchCardNew({
  competition,
  time,
  status,
  team1,
  team1Logo,
  team2,
  team2Logo,
  s24Index,
  confidence,
  probability,
  slug,
  href,
  sourceLabel,
}: MatchCardNewProps) {
  const confidenceColor = {
    'Alta': 'text-green-400',
    'Media': 'text-yellow-400',
    'Baja': 'text-red-400'
  };

  const statusColor = status === 'EN VIVO' ? 'text-green-400' : 'text-gray-400';
  const statusBg = status === 'EN VIVO' ? 'bg-green-500/15 border border-green-500/30' : 'bg-gray-800/30 border border-gray-700/60';

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-950/85 via-gray-950/90 to-black border border-gray-800/75 hover:border-blue-500/45 transition-all duration-300 backdrop-blur-md p-5 md:p-6 flex flex-col h-full shadow-lg hover:shadow-2xl hover:shadow-blue-500/15">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-blue-500/5 transition-all duration-300 opacity-0 group-hover:opacity-100" />

      <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-blue-500/10 transition-all duration-300" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-800/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 tracking-[0.08em] uppercase">
              {competition}
            </span>
            {sourceLabel ? (
              <span className="rounded-full border border-sky-500/40 bg-sky-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-sky-300">
                Fuente gratis
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-gray-600 text-xs">{time}</span>
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${statusBg} ${statusColor}`}>
              {status}
            </span>
          </div>
        </div>

        <div className="flex items-start justify-between gap-3 mb-5 min-h-[132px]">
          <div className="flex flex-col items-center flex-1">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl border border-gray-700/70 bg-gradient-to-br from-gray-900/80 to-gray-950/80 p-2 mb-3 shadow-inner shadow-blue-500/5 flex items-center justify-center">
              <Image src={team1Logo} alt={team1} width={72} height={72} className="rounded-xl object-contain" />
            </div>
            <span className="text-sm md:text-base text-white font-semibold text-center leading-tight min-h-[40px] flex items-start justify-center">
              {team1}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center pt-8">
            <span className="text-sm text-blue-300 font-bold tracking-wide">VS</span>
          </div>

          <div className="flex flex-col items-center flex-1">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl border border-gray-700/70 bg-gradient-to-br from-gray-900/80 to-gray-950/80 p-2 mb-3 shadow-inner shadow-blue-500/5 flex items-center justify-center">
              <Image src={team2Logo} alt={team2} width={72} height={72} className="rounded-xl object-contain" />
            </div>
            <span className="text-sm md:text-base text-white font-semibold text-center leading-tight min-h-[40px] flex items-start justify-center">
              {team2}
            </span>
          </div>
        </div>

        <div className="bg-gray-900/45 rounded-xl p-3.5 mb-5 border border-gray-800/50 backdrop-blur-sm">
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-500 font-medium mb-1.5">S24</span>
              <span className="text-2xl font-bold text-blue-300">{s24Index}</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-500 font-medium mb-1.5">CONFIANZA</span>
              <span className={`text-sm md:text-base font-bold ${confidenceColor[confidence]}`}>
                {confidence}
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-500 font-medium mb-1.5">PROB.</span>
              <span className="text-2xl font-bold text-emerald-400">{probability}%</span>
            </div>
          </div>
        </div>

        <Link 
          href={href ?? `/match/${slug}`}
          className="w-full block mt-auto bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-4 px-4 rounded-xl transition-all duration-300 group/btn text-center shadow-[0_12px_28px_rgba(37,99,235,0.35)]"
        >
          <span className="flex items-center justify-center gap-2">
            Ver análisis
            <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
          </span>
        </Link>
      </div>
    </div>
  );
}
