import { matchesData } from '@/app/data/matches';
import Image from 'next/image';
import Link from 'next/link';

import DatosPartidoDirectos from '@/app/components/DatosPartidoDirectos';
import DerbyEditorialBrief from '@/app/components/DerbyEditorialBrief';
import Footer from '@/app/components/Footer';
import LiveMatchRefresh from '@/app/components/LiveMatchRefresh';
import LocalizedMatchDateTime from '@/app/components/LocalizedMatchDateTime';
import Navbar from '@/app/components/Navbar';
import { buildEditorialMatchPreview, editorialMatchPreviews } from '@/app/data/editorialMatchPreviews';
import { getTeamCrest } from '@/app/lib/teamCrests';
import { displayLabel } from '@/app/lib/displayLabel';
import { sportsDataService } from '@/lib/data';
import type { Match } from '@/lib/data/types/domain';
import { getRealMatchContext } from '@/lib/intelligence-s24/realMatchContext';
import { buildMatchPredictionFeatures, buildMatchPredictionV2 } from '@/lib/intelligence-s24/v2';

export const revalidate = 120;
export const dynamic = 'force-dynamic';

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

function buildHomeDemoMatch(slug: string): Match | null {
  const matches: Record<string, Match> = {
    'demo-barcelona-sevilla-finalizado': {
      id: slug,
      slug,
      sport: 'football',
      competition: 'LA LIGA',
      time: 'Finalizado',
      dateTimeUtc: '2026-09-18T16:00:00.000Z',
      status: 'FINALIZADO',
      homeTeam: { id: 'demo-barcelona', name: 'Barcelona', badgeUrl: '/teams/barcelona.svg' },
      awayTeam: { id: 'demo-sevilla', name: 'Sevilla', badgeUrl: 'https://media.api-sports.io/football/teams/536.png' },
      homeScore: 2,
      awayScore: 1,
      elapsedMinutes: 90,
    },
    'demo-arsenal-chelsea-en-vivo': {
      id: slug,
      slug,
      sport: 'football',
      competition: 'PREMIER LEAGUE',
      time: 'En juego',
      dateTimeUtc: '2026-09-18T18:00:00.000Z',
      status: 'EN VIVO',
      homeTeam: { id: 'demo-arsenal', name: 'Arsenal', badgeUrl: '/teams/arsenal.svg' },
      awayTeam: { id: 'demo-chelsea', name: 'Chelsea', badgeUrl: '/teams/chelsea.svg' },
      homeScore: 1,
      awayScore: 1,
      elapsedMinutes: 67,
    },
    'demo-atletico-madrid-real-madrid': {
      id: slug,
      slug,
      sport: 'football',
      competition: 'LA LIGA',
      time: 'Mañana, 21:00',
      dateTimeUtc: '2026-09-19T19:00:00.000Z',
      status: 'PRÓXIMO',
      homeTeam: { id: 'demo-atletico', name: 'Atlético Madrid', badgeUrl: '/teams/atletico.svg' },
      awayTeam: { id: 'demo-real-madrid', name: 'Real Madrid', badgeUrl: '/teams/real-madrid.svg' },
    },
  };

  return matches[slug] ?? null;
}

function TeamBadge({ team, crestUrl }: { team: string; crestUrl?: string }) {
  const isRemoteCrest = Boolean(crestUrl && !crestUrl.startsWith('/'));
  const crest = isRemoteCrest ? undefined : getTeamCrest(team, crestUrl);

  if (crest || isRemoteCrest) {
    return (
      <div className="flex flex-col items-center">
        <div className="ref-crest !h-[82px] !w-[82px] md:!h-[112px] md:!w-[112px]">
          {crest ? <Image src={crest} alt={team} width={104} height={104} className="object-contain drop-shadow-2xl" /> : <img src={crestUrl} alt={`Escudo de ${team}`} className="h-[68px] w-[68px] object-contain md:h-[96px] md:w-[96px]" />}
        </div>
        <p className="mt-2 max-w-[8rem] text-center text-sm font-semibold leading-tight text-white md:max-w-[13rem] md:text-2xl">{team}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="ref-crest !h-[82px] !w-[82px] md:!h-[112px] md:!w-[112px]">
        <span className="px-2 text-center text-xs font-semibold leading-tight text-white md:px-3 md:text-sm">{team}</span>
      </div>
      <p className="mt-2 max-w-[8rem] text-center text-sm font-semibold leading-tight text-white md:max-w-[13rem] md:text-2xl">{team}</p>
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
  const homeDemoMatch = buildHomeDemoMatch(slug);
  const serviceResult = editorialPreview || homeDemoMatch || !slug ? null : await sportsDataService.getMatchBySlugWithMeta(slug);
  const matchData = buildEditorialDemoMatch(slug) ?? homeDemoMatch ?? buildLegacyMatch(slug) ?? serviceResult?.match;
  const providerId = homeDemoMatch ? 'api-football' : serviceResult?.match ? serviceResult.providerId : 'editorial-demo';

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
  const prediction = buildMatchPredictionV2(buildMatchPredictionFeatures(matchData, realContext));
  const preview = editorialPreview ?? buildEditorialMatchPreview(matchData, providerId, realContext);
  const cleanMatch = {
    competition: sanitizeCompetitionName(matchData.competition),
    homeTeam: sanitizeTeamName(matchData.homeTeam.name, 'Equipo A'),
    awayTeam: sanitizeTeamName(matchData.awayTeam.name, 'Equipo B'),
    time: matchData.time,
  };
  const stadium = realContext?.fixture.venue ?? 'Estadio no informado por proveedor';
  const editorialDateFallback = editorialPreview
    ? 'Fecha por confirmar'
    : formatEditorialDate(matchData.dateTimeUtc ?? matchData.time);
  const isLive = ['EN VIVO', 'ENTRETIEMPO', 'PRÓRROGA', 'DESCANSO', 'PENALES'].includes(matchData.status);
  const isFinished = ['FINALIZADO', 'DESPUÉS DE PRÓRROGA', 'ADJUDICADO'].includes(matchData.status);
  const hasMatchScore = (isLive || isFinished) && matchData.homeScore !== undefined && matchData.awayScore !== undefined;
  const probabilityItems = prediction.probabilities ? [
    { label: cleanMatch.homeTeam, value: prediction.probabilities.home, tone: 'text-cyan-200' },
    { label: 'Empate', value: prediction.probabilities.draw, tone: 'text-amber-200' },
    { label: cleanMatch.awayTeam, value: prediction.probabilities.away, tone: 'text-rose-200' },
  ] : [];

  return (
    <main className="reference-match">
      <header className="ref-topbar">
        <Link href="/" className="ref-brand">SPORTIVA<span>24</span></Link>
        <small>INTELIGENCIA DEPORTIVA</small>
        <nav aria-label="Navegación principal">
          <Link href="/futbol">Fútbol</Link>
          <Link href="/analisis">Análisis</Link>
          <Link href="/centro-inteligencia-s24">Competencias</Link>
          <Link href="/noticias">Noticias</Link>
        </nav>
      </header>
      <LiveMatchRefresh enabled={isLive} />

      <div className="ref-wrap">
        <header className="ref-hero">
          <div className="ref-hero-meta">
            <b>{cleanMatch.competition}</b>
            <span className={isLive ? '!border-emerald-300/70 !text-emerald-100' : ''}>{matchData.status}</span>
          </div>
          <p><LocalizedMatchDateTime dateTimeUtc={matchData.dateTimeUtc} fallback={editorialDateFallback} /></p>
          <p>{stadium}</p>
          <div className="ref-teams">
            <TeamBadge team={cleanMatch.homeTeam} crestUrl={preview.homeCrestUrl ?? matchData.homeTeam.badgeUrl} />
            <div className="flex flex-col items-center gap-2">
              <strong className="ref-vs">{hasMatchScore ? `${matchData.homeScore}-${matchData.awayScore}` : 'VS'}</strong>
              {isLive && matchData.elapsedMinutes !== undefined ? <span className="text-sm font-bold text-emerald-200">{matchData.elapsedMinutes}&apos;</span> : null}
            </div>
            <TeamBadge team={cleanMatch.awayTeam} crestUrl={preview.awayCrestUrl ?? matchData.awayTeam.badgeUrl} />
          </div>
        </header>

        <nav className="ref-tabs" aria-label="Secciones del partido">
          <a href="#resumen">Resumen</a>
          <a href="#modelo">Modelo S24</a>
          <a href="#datos">Datos del partido</a>
        </nav>

        <section id="resumen" className="ref-grid-two mt-4">
          <article id="modelo" className="ref-model">
            <div>
              <h2>MODELO SPORTIVA24</h2>
              <p>{prediction.status === 'ready' ? 'Estimación basada en el contexto disponible del partido' : 'Cobertura limitada para este encuentro'}</p>
            </div>
            {probabilityItems.length > 0 ? (
              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                {probabilityItems.map((item) => <div key={item.label}><strong className={`block text-3xl font-black ${item.tone}`}>{Math.round(item.value * 100)}%</strong><small className="mt-2 block text-[10px] font-bold uppercase text-slate-300">{item.label}</small></div>)}
              </div>
            ) : <p className="mt-5 text-sm leading-6 text-slate-300">{prediction.limitations[0] ?? 'No hay datos suficientes para estimar probabilidades.'}</p>}
            <span className="ref-confidence">CALIDAD DE DATOS · {prediction.dataQuality.score}/100</span>
          </article>
          <article className="ref-key">
            <h2>CLAVES DEL PARTIDO</h2>
            <p>{preview.overview}</p>
            <p className="mt-3 text-xs text-slate-400">{preview.conclusion}</p>
          </article>
        </section>

        <section id="datos" className="mt-6">
          <DatosPartidoDirectos
            match={matchData}
            providerId={providerId}
            realContext={realContext}
            prediction={prediction}
            scheduleDateTimeUtc={matchData.dateTimeUtc}
            scheduleLabel={editorialDateFallback}
          />
        </section>
      </div>

      {slug === 'demo-atletico-madrid-real-madrid' ? <div className="ref-wrap"><DerbyEditorialBrief /></div> : null}

      <Footer />
    </main>
  );
}
