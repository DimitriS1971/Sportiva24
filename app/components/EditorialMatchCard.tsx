import Link from 'next/link';
import { getTeamCrest } from '@/app/lib/teamCrests';
import { displayLabel } from '@/app/lib/displayLabel';
import LocalizedMatchTime from './LocalizedMatchTime';

interface EditorialMatchCardProps {
  competition: string;
  time: string;
  status: string;
  dateTimeUtc?: string;
  homeTeam: string;
  homeCrestUrl: string;
  awayTeam: string;
  awayCrestUrl: string;
  slug: string;
  href?: string;
  sourceLabel?: string;
  homeScore?: number;
  awayScore?: number;
  elapsedMinutes?: number;
}

function Crest({ src, team }: { src: string; team: string }) {
  const resolvedSrc = getTeamCrest(team, src);

  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-slate-700 bg-slate-950/75 p-2 shadow-lg">
      <img src={resolvedSrc} alt={`Escudo de ${team}`} className="h-full w-full object-contain" />
    </div>
  );
}

export default function EditorialMatchCard({
  competition,
  time,
  status,
  dateTimeUtc,
  homeTeam,
  homeCrestUrl,
  awayTeam,
  awayCrestUrl,
  slug,
  href,
  sourceLabel,
  homeScore,
  awayScore,
  elapsedMinutes,
}: EditorialMatchCardProps) {
  const isLive = ['EN VIVO', 'ENTRETIEMPO', 'PRÓRROGA', 'DESCANSO', 'PENALES'].includes(status);
  const hasScore = !['PRÓXIMO', 'PROXIMO', 'POSTERGADO', 'RETRASADO'].includes(status) && homeScore !== undefined && awayScore !== undefined;
  const matchClock = isLive && elapsedMinutes !== undefined
    ? `${elapsedMinutes}'`
    : ['FINALIZADO', 'DESPUÉS DE PRÓRROGA', 'ADJUDICADO'].includes(status)
      ? `Final${elapsedMinutes ? ` · ${elapsedMinutes}'` : ''}`
      : null;

  return (
    <article className="group relative isolate overflow-hidden rounded-[24px] border border-sky-300/20 bg-[#020817] shadow-[0_24px_70px_rgba(0,0,0,0.45)] transition duration-300 hover:-translate-y-1 hover:border-sky-300/45">
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(2,8,23,0.18),rgba(2,8,23,0.94)),url('/hero/hero-football.png')] bg-cover bg-center opacity-75" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_20%,rgba(56,189,248,0.15),transparent_36%),linear-gradient(120deg,rgba(2,8,23,0.88),rgba(3,15,35,0.68),rgba(2,8,23,0.94))]" />
      <div className="relative p-5 md:p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="min-w-0 truncate text-sm font-black tracking-[0.14em] text-white">{displayLabel(competition)}</p>
          <span className={`shrink-0 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] ${isLive ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200' : 'border-slate-600 bg-slate-900/70 text-slate-300'}`}>{matchClock ?? status}</span>
        </div>
        <div className="mt-7 grid grid-cols-[minmax(0,1fr)_5rem_minmax(0,1fr)] items-center gap-2">
          <div className="flex min-w-0 flex-col items-center gap-3 text-center"><Crest src={homeCrestUrl} team={homeTeam} /><p className="line-clamp-2 min-h-10 text-base font-bold leading-tight text-white">{homeTeam}</p></div>
          <div className="text-center"><p className="text-3xl font-black tracking-tight text-white">{hasScore ? `${homeScore} - ${awayScore}` : 'VS'}</p><p className="mt-2 whitespace-nowrap text-[11px] text-slate-300"><LocalizedMatchTime dateTimeUtc={dateTimeUtc} fallback={time} /></p><p className="mt-1 text-[9px] uppercase tracking-[0.14em] text-slate-500">GMT-3</p></div>
          <div className="flex min-w-0 flex-col items-center gap-3 text-center"><Crest src={awayCrestUrl} team={awayTeam} /><p className="line-clamp-2 min-h-10 text-base font-bold leading-tight text-white">{awayTeam}</p></div>
        </div>
        <Link href={href ?? `/match/${slug}`} className="mt-7 flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 text-sm font-bold text-white shadow-[0_14px_35px_rgba(14,116,244,0.3)] transition hover:from-blue-600 hover:to-sky-400">{isLive ? 'Ver partido' : 'Ver análisis completo'} <span className="text-xl">→</span></Link>
      </div>
      <footer className="grid grid-cols-4 border-t border-white/10 bg-black/25 px-2 py-3 backdrop-blur-md">
        {['Estadísticas', 'Alineaciones', 'Análisis IA', 'Cuotas'].map((item, index) => <span key={item} className={`flex min-h-9 items-center justify-center px-1 text-center text-[9px] font-semibold text-slate-300 ${index > 0 ? 'border-l border-white/10' : ''}`}>{item}</span>)}
      </footer>
    </article>
  );
}
