import React from 'react';
import Image from 'next/image';
import { getTeamCrest } from '@/app/lib/teamCrests';

interface MatchCardProps {
  competition: string;
  competitionLogo: string;
  time: string;
  team1: string;
  team2: string;
  team1Logo: string;
  team2Logo: string;
  s24Index: number;
  confidence: number;
}

export default function MatchCard({ 
  competition, 
  competitionLogo,
  time,
  team1, 
  team2, 
  team1Logo,
  team2Logo,
  s24Index,
  confidence 
}: MatchCardProps) {
  const resolvedTeam1Logo = getTeamCrest(team1, team1Logo);
  const resolvedTeam2Logo = getTeamCrest(team2, team2Logo);
  const getConfidenceColor = (percent: number) => {
    if (percent >= 85) return 'from-green-500 to-green-600';
    if (percent >= 70) return 'from-blue-500 to-blue-600';
    if (percent >= 55) return 'from-amber-500 to-amber-600';
    return 'from-orange-500 to-orange-600';
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-black/50 p-6 md:p-8 border border-gray-700/30 hover:border-blue-500/50 transition-all duration-300 backdrop-blur-md shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-1">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10 space-y-5">
        {/* Header: Competition & Time */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-700/40">
          <div className="flex items-center space-x-2.5">
            <div className="w-5 h-5 md:w-6 md:h-6 relative flex-shrink-0">
              <Image 
                src={competitionLogo} 
                alt={competition}
                fill
                className="object-contain"
              />
            </div>
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">{competition}</span>
          </div>
          <span className="text-xs text-gray-600 font-light">{time}</span>
        </div>

        {/* Teams & Logos - Large Shields */}
        <div className="flex items-center justify-between gap-3 md:gap-4 py-2">
          {/* Team 1 */}
          <div className="flex-1 flex flex-col items-center space-y-2.5">
            <div className="relative w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-xl p-2 border border-gray-700/40">
              <Image
                src={resolvedTeam1Logo}
                alt={`Escudo de ${team1}`}
                fill
                className="object-contain p-2"
              />
            </div>
            <p className="text-xs md:text-sm font-semibold text-white text-center line-clamp-2">{team1}</p>
          </div>

          {/* VS Center with Badges */}
          <div className="flex flex-col items-center space-y-2 px-2">
            <span className="text-lg md:text-xl font-bold text-blue-400">VS</span>
            {/* Subtle S24 Index & Confidence Badges */}
            <div className="flex flex-col items-center space-y-1">
              <div className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                <span className="text-xs font-semibold text-blue-400">S24 {s24Index}</span>
              </div>
              <div className="px-2 py-0.5 rounded-full bg-gradient-to-r from-gray-700/30 to-gray-600/30 border border-gray-600/20">
                <span className="text-xs font-light text-gray-400">{confidence}% confianza</span>
              </div>
            </div>
          </div>

          {/* Team 2 */}
          <div className="flex-1 flex flex-col items-center space-y-2.5">
            <div className="relative w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-xl p-2 border border-gray-700/40">
              <Image
                src={resolvedTeam2Logo}
                alt={`Escudo de ${team2}`}
                fill
                className="object-contain p-2"
              />
            </div>
            <p className="text-xs md:text-sm font-semibold text-white text-center line-clamp-2">{team2}</p>
          </div>
        </div>

        {/* CTA Button - Clean */}
        <button className="group/btn w-full relative px-4 py-2.5 bg-gradient-to-r from-blue-500/90 to-blue-600/90 text-white font-semibold text-sm rounded-lg overflow-hidden transition-all duration-300 hover:from-blue-500 hover:to-blue-600 hover:shadow-lg hover:shadow-blue-500/30 flex items-center justify-center space-x-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 10.75H3.75v-1.5H13zm4.267-5.25h-16.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h16.5a.75.75 0 00.75-.75V6.25a.75.75 0 00-.75-.75z"/>
          </svg>
          <span className="relative z-10">Ver análisis</span>
          <span className="text-blue-300 group-hover/btn:translate-x-1 transition-transform duration-300">→</span>
        </button>
      </div>

      {/* Premium border glow on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{
        background: 'radial-gradient(circle at 20% 50%, rgba(37, 99, 235, 0.1), transparent 50%)',
        boxShadow: '0 0 40px rgba(37, 99, 235, 0.1)'
      }} />
    </div>
  );
}
