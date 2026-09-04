import { NextResponse } from 'next/server';
import { sportsDataService } from '@/lib/data';
import { matchesData } from '@/app/data/matches';
import { getRealMatchContext } from '@/lib/intelligence-s24/realMatchContext';
import type { Match } from '@/lib/data/types/domain';

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

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const slug = decodeURIComponent(id);

  const serviceResult = await sportsDataService.getMatchBySlugWithMeta(slug);
  const matchData = serviceResult.match ?? buildLegacyMatch(slug);

  const providerId = serviceResult.match ? serviceResult.providerId : 'legacy-local';
  const usedFallback = serviceResult.match ? serviceResult.usedFallback : true;

  if (!matchData) {
    return NextResponse.json({ error: 'No se pudo obtener el partido' }, { status: 404 });
  }

  const realContext = await getRealMatchContext(matchData.slug, providerId);

  return NextResponse.json({
    match: {
      slug: matchData.slug,
      competition: matchData.competition,
      homeTeam: matchData.homeTeam.name,
      awayTeam: matchData.awayTeam.name,
      time: matchData.time,
      status: matchData.status,
    },
    provider: {
      id: providerId,
      usedFallback,
    },
    realContext,
  });
}
