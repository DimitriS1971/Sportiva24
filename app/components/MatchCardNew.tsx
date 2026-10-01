'use client';

import Image from 'next/image';
import Link from 'next/link';
import { getTeamCrest } from '@/app/lib/teamCrests';
import { displayLabel } from '@/app/lib/displayLabel';
import type { MatchPredictionV2 } from '@/lib/intelligence-s24/v2';
import LocalizedMatchTime from './LocalizedMatchTime';

interface MatchCardNewProps {
  competition: string;
  time: string;
  status: string;
  dateTimeUtc?: string;
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
  sourceTier?: 'free' | 'paid' | 'mock';
  homeScore?: number;
  awayScore?: number;
  elapsedMinutes?: number;
  venue?: string;
  homeForm?: Array<'G' | 'E' | 'P'>;
  awayForm?: Array<'G' | 'E' | 'P'>;
  prediction?: MatchPredictionV2;
}

export default function MatchCardNew({
  competition,
  time,
  status,
  dateTimeUtc,
  team1,
  team1Logo,
  team2,
  team2Logo,
  slug,
  href,
  sourceLabel,
  sourceTier,
  homeScore,
  awayScore,
  elapsedMinutes,
  venue,
  homeForm = [],
  awayForm = [],
  prediction,
}: MatchCardNewProps) {
  const resolvedTeam1Logo = getTeamCrest(team1, team1Logo);
  const resolvedTeam2Logo = getTeamCrest(team2, team2Logo);

  const isLiveStatus = ['EN VIVO', 'ENTRETIEMPO', 'PRÓRROGA', 'DESCANSO', 'PENALES'].includes(status);
  const isFinishedStatus = ['FINALIZADO', 'DESPUÉS DE PRÓRROGA', 'ADJUDICADO'].includes(status);
  const statusColor = isLiveStatus ? 'text-green-400' : isFinishedStatus ? 'text-slate-300' : 'text-amber-300';
  const statusBg = isLiveStatus ? 'bg-green-500/15 border border-green-500/30' : isFinishedStatus ? 'bg-gray-800/30 border border-gray-700/60' : 'bg-amber-500/10 border border-amber-500/30';
  const hasScore = !['PRÓXIMO', 'PROXIMO', 'POSTERGADO', 'RETRASADO'].includes(status) && homeScore !== undefined && awayScore !== undefined;
  const matchClock = status === 'ENTRETIEMPO'
    ? 'ENTRETIEMPO'
    : isLiveStatus && elapsedMinutes !== undefined
    ? `${elapsedMinutes}'`
    : isFinishedStatus
      ? `Final${elapsedMinutes ? ` · ${elapsedMinutes}'` : ''}`
      : status;

  return (
    <article className="group relative isolate flex h-full min-h-[520px] flex-col overflow-hidden rounded-[24px] border border-sky-300/20 bg-[#020817] shadow-[0_24px_70px_rgba(0,0,0,0.45)] transition duration-300 hover:-translate-y-1 hover:border-sky-300/45 hover:shadow-[0_30px_90px_rgba(14,165,233,0.16)]">
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(2,8,23,0.2),rgba(2,8,23,0.94)),url('/hero/hero-football.png')] bg-cover bg-center opacity-80" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_25%,rgba(56,189,248,0.16),transparent_35%),linear-gradient(120deg,rgba(2,8,23,0.86),rgba(3,15,35,0.68),rgba(2,8,23,0.94))]" />

      <div className="relative flex flex-1 flex-col p-5 md:p-6">
        <header className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="text-sm font-black tracking-[0.14em] text-white">{displayLabel(competition)}</span>
            <span className="hidden rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-200 sm:inline-flex">
              <span className="mr-1.5 text-emerald-400">●</span>{sourceLabel ?? (sourceTier === 'paid' ? 'Datos en tiempo real' : 'Datos deportivos')}
            </span>
          </div>
          <span className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${statusBg} ${statusColor}`}>{matchClock}</span>
        </header>

        <div className="mt-7 grid flex-1 grid-cols-[minmax(0,1fr)_5.5rem_minmax(0,1fr)] items-center gap-2">
          <TeamPanel team={team1} crest={resolvedTeam1Logo} form={homeForm} />
          <div className="flex flex-col items-center text-center">
            <p className="text-sm font-semibold text-slate-200"><LocalizedMatchTime dateTimeUtc={dateTimeUtc} fallback={time} /></p>
            <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">GMT-3</p>
            <p className="mt-5 whitespace-nowrap text-3xl font-black tracking-tight text-white md:text-4xl">{hasScore ? `${homeScore} - ${awayScore}` : 'VS'}</p>
            <div className="mt-4 flex items-center gap-1.5 text-[10px] text-slate-300">
              <span className="text-sky-300">◎</span>{venue ?? 'Estadio por confirmar'}
            </div>
          </div>
          <TeamPanel team={team2} crest={resolvedTeam2Logo} form={awayForm} />
        </div>

        {prediction?.probabilities ? <div className="mt-5 grid grid-cols-3 overflow-hidden rounded-xl border border-sky-300/20 bg-black/25 text-center text-[10px]">
          <ProbabilityCell label={team1} probability={prediction.probabilities.home} />
          <ProbabilityCell label="Empate" probability={prediction.probabilities.draw} bordered />
          <ProbabilityCell label={team2} probability={prediction.probabilities.away} bordered />
        </div> : prediction ? <p className="mt-5 rounded-xl border border-amber-300/20 bg-amber-500/10 px-3 py-2 text-center text-[10px] font-semibold text-amber-100">Modelo con datos insuficientes: no se publican probabilidades.</p> : null}

        <Link href={href ?? `/match/${slug}`} className="mt-7 flex h-14 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 text-base font-bold text-white shadow-[0_14px_35px_rgba(14,116,244,0.35)] transition hover:from-blue-600 hover:to-sky-400">
          <span className="text-xl">▥</span> Ver análisis completo <span className="text-2xl leading-none">→</span>
        </Link>
      </div>

      <footer className="grid grid-cols-4 border-t border-white/10 bg-black/25 px-3 py-4 backdrop-blur-md">
        {['Estadísticas en vivo', 'Alineaciones', 'Análisis IA', 'Cuotas'].map((item, index) => (
          <span key={item} className={`flex min-h-10 flex-col items-center justify-center gap-1 px-2 text-center text-[10px] font-semibold text-slate-300 ${index > 0 ? 'border-l border-white/10' : ''}`}>
            <span className="text-base text-sky-200">{['▥', '⌗', '▤', '⌁'][index]}</span>{item}
          </span>
        ))}
      </footer>
    </article>
  );
}

function ProbabilityCell({ label, probability, bordered = false }: { label: string; probability: number; bordered?: boolean }) {
  return (
    <div className={`min-w-0 px-2 py-2.5 ${bordered ? 'border-l border-white/10' : ''}`}>
      <p className="truncate text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-black text-white">{(probability * 100).toFixed(1)}%</p>
    </div>
  );
}

function TeamPanel({ team, crest, form }: { team: string; crest: string; form: Array<'G' | 'E' | 'P'> }) {
  return (
    <div className="flex min-w-0 flex-col items-center text-center">
      <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/15 bg-slate-950/55 p-3 shadow-[0_10px_35px_rgba(0,0,0,0.35)] md:h-28 md:w-28">
        {crest.startsWith('/') ? <Image src={crest} alt={`Escudo de ${team}`} width={92} height={92} className="h-full w-full object-contain" /> : <img src={crest} alt={`Escudo de ${team}`} className="h-full w-full object-contain" />}
      </div>
      <p className="mt-4 min-h-10 text-lg font-bold leading-tight text-white">{team}</p>
      <div className="mt-3 flex min-h-6 gap-1.5" aria-label={`Últimos resultados de ${team}`}>
        {form.length > 0 ? form.slice(-5).map((result, index) => <span key={`${result}-${index}`} className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-black ${result === 'G' ? 'bg-emerald-500/90 text-emerald-950' : result === 'P' ? 'bg-rose-500/90 text-rose-950' : 'bg-slate-700 text-slate-200'}`}>{result}</span>) : <span className="text-[10px] uppercase tracking-[0.12em] text-slate-500">Forma por confirmar</span>}
      </div>
    </div>
  );
}
