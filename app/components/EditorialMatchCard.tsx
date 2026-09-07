import Link from 'next/link';
import { getTeamCrest } from '@/app/lib/teamCrests';
import { displayLabel } from '@/app/lib/displayLabel';

interface EditorialMatchCardProps {
  competition: string;
  time: string;
  status: 'EN VIVO' | 'PRÓXIMO';
  homeTeam: string;
  homeCrestUrl: string;
  awayTeam: string;
  awayCrestUrl: string;
  slug: string;
  href?: string;
  sourceLabel?: string;
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
  homeTeam,
  homeCrestUrl,
  awayTeam,
  awayCrestUrl,
  slug,
  href,
  sourceLabel,
}: EditorialMatchCardProps) {
  const isLive = status === 'EN VIVO';

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-950 shadow-lg shadow-black/25 transition-colors hover:border-cyan-400/45">
      <div className="flex items-center justify-between gap-3 border-b border-slate-800 bg-slate-900/65 px-4 py-3">
        <p className="min-w-0 truncate text-[11px] font-semibold text-slate-300">{displayLabel(competition)}</p>
        <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] ${isLive ? 'border-emerald-400/40 bg-emerald-500/15 text-emerald-100' : 'border-slate-600 bg-slate-800 text-slate-300'}`}>{status}</span>
      </div>

      <div className="px-4 py-5">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="flex min-w-0 flex-col items-center gap-2 text-center"><Crest src={homeCrestUrl} team={homeTeam} /><p className="line-clamp-2 text-sm font-semibold leading-tight text-white">{homeTeam}</p></div>
          <div className="pt-1 text-center"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-300">vs</p><p className="mt-2 whitespace-nowrap text-xs text-slate-400">{time}</p></div>
          <div className="flex min-w-0 flex-col items-center gap-2 text-center"><Crest src={awayCrestUrl} team={awayTeam} /><p className="line-clamp-2 text-sm font-semibold leading-tight text-white">{awayTeam}</p></div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-800 pt-4">
          <span className="text-[10px] uppercase tracking-[0.11em] text-slate-500">{sourceLabel ?? 'Ficha del partido'}</span>
          <Link href={href ?? `/match/${slug}`} className="text-sm font-semibold text-cyan-200 transition-colors hover:text-white">Ver previa</Link>
        </div>
      </div>
    </article>
  );
}
