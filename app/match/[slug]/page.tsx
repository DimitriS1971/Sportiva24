import { matchesData } from '@/app/data/matches';
import Image from 'next/image';

import DatosPartidoDirectos from '@/app/components/DatosPartidoDirectos';
import Footer from '@/app/components/Footer';
import Navbar from '@/app/components/Navbar';
import { buildEditorialMatchPreview, editorialMatchPreviews } from '@/app/data/editorialMatchPreviews';
import { getTeamCrest } from '@/app/lib/teamCrests';
import { displayLabel } from '@/app/lib/displayLabel';
import { sportsDataService } from '@/lib/data';
import type { Match } from '@/lib/data/types/domain';
import { getRealMatchContext } from '@/lib/intelligence-s24/realMatchContext';

interface MatchHeaderData {
  slug: string;
  competition: string;
  homeTeam: string;
  awayTeam: string;
  time: string;
  status: 'EN VIVO' | 'PROXIMO' | 'PRÓXIMO' | 'FINALIZADO' | 'PAUSADO';
}

export const revalidate = 120;

function buildLegacyMatch(slug: string): Match | null {
  const legacy = matchesData[slug];
  if (!legacy) {
    return null;
  }

  return {
    id: `legacy-${legacy.slug}`,
    slug: legacy.slug,
    sport: 'football',
    competition: legacy.competition,
    time: legacy.time,
    status: legacy.status,
    homeTeam: {
      id: `legacy-${legacy.homeTeam.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      name: legacy.homeTeam,
    },
    awayTeam: {
      id: `legacy-${legacy.awayTeam.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      name: legacy.awayTeam,
    },
    probabilityHomeWin: legacy.probability,
    confidence: legacy.confidence,
    indexScore: legacy.s24Index,
  };
}

function buildEditorialDemoMatch(slug: string): Match | null {
  const preview = editorialMatchPreviews[slug];
  if (!preview) {
    return null;
  }

  return {
    id: `editorial-demo-${preview.slug}`,
    slug: preview.slug,
    sport: 'football',
    competition: preview.competition,
    time: preview.round,
    status: 'PRÓXIMO',
    homeTeam: { id: 'demo-septemvri', name: preview.homeTeam },
    awayTeam: { id: 'demo-botev', name: preview.awayTeam },
  };
}

const BallIcon = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 2 C10 7 10 17 12 22"/><path d="M2 12 C7 10 17 10 22 12"/></svg>;
const CalendarIcon = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;

function TeamBadge({ team, crestUrl }: { team: string; crestUrl?: string }) {
  const crest = getTeamCrest(team, crestUrl?.startsWith('/') ? crestUrl : undefined);

  if (crest || crestUrl) {
    return (
      <div className="flex-shrink-0 w-[86px] h-[86px] md:w-[122px] md:h-[122px] flex items-center justify-center rounded-2xl border border-slate-600/45 bg-slate-900/45">
        {crest ? <Image src={crest} alt={team} width={104} height={104} className="object-contain drop-shadow-2xl" /> : <img src={crestUrl} alt={`Escudo de ${team}`} className="h-[78px] w-[78px] object-contain md:h-[104px] md:w-[104px]" />}
      </div>
    );
  }

  return (
    <div className="flex-shrink-0 w-[86px] h-[86px] md:w-[122px] md:h-[122px] rounded-2xl border border-slate-600/55 bg-slate-900/60 flex items-center justify-center">
      <span className="px-2 text-center text-xs font-semibold leading-tight text-white md:px-3 md:text-sm">{team}</span>
    </div>
  );
}

function formatEditorialDate(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function sanitizeCompetitionName(value: string): string {
  const normalized = value.trim();
  if (!normalized || normalized.toLowerCase() === 'liga') {
    return 'Competicion en analisis';
  }
  return displayLabel(normalized);
}

function sanitizeTeamName(value: string, fallback: string): string {
  const normalized = value.trim();
  if (!normalized) {
    return fallback;
  }

  const lower = normalized.toLowerCase();
  if (
    lower === 'equipo local'
    || lower === 'equipo visitante'
    || lower === 'local'
    || lower === 'visitante'
    || lower === 'home team'
    || lower === 'away team'
  ) {
    return fallback;
  }

  return normalized;
}

export default async function MatchAnalysisPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug ?? '');

  const editorialPreview = editorialMatchPreviews[slug];
  const serviceResult = editorialPreview || !slug ? null : await sportsDataService.getMatchBySlugWithMeta(slug);
  const matchData = buildEditorialDemoMatch(slug) ?? serviceResult?.match ?? buildLegacyMatch(slug);
  const providerId = serviceResult?.match ? serviceResult.providerId : 'editorial-demo';

  if (!matchData) {
    return (
      <main className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="px-4 md:px-12 py-20 max-w-6xl mx-auto">
          <p className="text-center text-gray-400">Partido no encontrado</p>
        </div>
        <Footer />
      </main>
    );
  }

  const realContext = await getRealMatchContext(matchData.slug, providerId);
  const preview = editorialPreview ?? buildEditorialMatchPreview(matchData, providerId, realContext);
  const cleanMatch = {
    competition: sanitizeCompetitionName(matchData.competition),
    homeTeam: sanitizeTeamName(matchData.homeTeam.name, 'Equipo A'),
    awayTeam: sanitizeTeamName(matchData.awayTeam.name, 'Equipo B'),
    time: matchData.time,
  };
  const stadium = realContext?.fixture.venue ?? 'Estadio no informado por proveedor';
  const editorialDate = editorialPreview
    ? 'Fecha por confirmar'
    : formatEditorialDate(matchData.dateTimeUtc ?? matchData.time);
  const statusStyle = matchData.status === 'EN VIVO'
    ? 'text-emerald-200 border-emerald-400/40 bg-emerald-500/15'
    : 'text-slate-200 border-slate-500/55 bg-slate-800/45';

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="px-4 md:px-12 pt-20 md:pt-24 pb-12 md:pb-16 max-w-6xl mx-auto">
        <header className="premium-grid-pattern mb-8 rounded-3xl border border-slate-700/45 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_45%),linear-gradient(165deg,rgba(15,23,42,0.95),rgba(2,6,23,0.98))] px-4 py-5 md:px-7 md:py-7">
          <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-2 md:flex md:items-center md:justify-between md:gap-5">
            <div className="flex min-w-0 items-center justify-center md:flex-1">
              <TeamBadge team={cleanMatch.homeTeam} crestUrl={preview.homeCrestUrl ?? matchData.homeTeam.badgeUrl} />
            </div>

            <div className="flex min-w-[4.8rem] flex-col items-center gap-2 px-0 md:min-w-0 md:px-3 flex-shrink-0">
              <span className="text-sm md:text-2xl font-light text-slate-400 leading-none">VS</span>
              <div className={`px-3 py-1 border rounded-full ${statusStyle}`}>
                <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.12em]">{matchData.status}</span>
              </div>
            </div>

            <div className="flex min-w-0 items-center justify-center md:flex-1">
              <TeamBadge team={cleanMatch.awayTeam} crestUrl={preview.awayCrestUrl ?? matchData.awayTeam.badgeUrl} />
            </div>
          </div>

          <div className="mt-6 grid gap-2.5 md:grid-cols-4">
            <div className="flex items-center gap-2 rounded-xl border border-slate-700/55 bg-black/30 px-3 py-2 text-xs md:text-sm text-slate-300">
              <BallIcon />
              <span>{cleanMatch.competition}</span>
            </div>

            <div className="rounded-xl border border-slate-700/55 bg-black/30 px-3 py-2 text-xs md:text-sm text-slate-300">
              <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">Estadio</p>
              <p className="mt-0.5">{stadium}</p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-slate-700/55 bg-black/30 px-3 py-2 text-xs md:text-sm text-slate-300">
              <CalendarIcon />
              <span>{editorialDate}</span>
            </div>

            <div className="rounded-xl border border-slate-700/55 bg-black/30 px-3 py-2 text-xs md:text-sm text-slate-300">
              <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">Programacion</p>
              <p className="mt-0.5">{cleanMatch.time}</p>
            </div>
          </div>

          <div className="mt-5 border-t border-slate-700/60" />
        </header>

        <DatosPartidoDirectos match={matchData} providerId={providerId} realContext={realContext} />
      </div>

      <Footer />
    </main>
  );
}
