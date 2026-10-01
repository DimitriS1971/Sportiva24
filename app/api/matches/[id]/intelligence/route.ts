import { NextResponse } from 'next/server';
import { sportsDataService } from '@/lib/data';
import { getRealMatchContext } from '@/lib/intelligence-s24/realMatchContext';
import { buildMatchPredictionFeatures, buildMatchPredictionV2 } from '@/lib/intelligence-s24/v2';
import { savePredictionSnapshot } from '@/lib/intelligence-s24/v2/predictionSnapshotRepository';

export const dynamic = 'force-dynamic';

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const slug = decodeURIComponent(id);
  const result = await sportsDataService.getMatchBySlugWithMeta(slug);

  if (!result.match) {
    return NextResponse.json({ error: 'Partido no encontrado' }, { status: 404 });
  }

  const realContext = await getRealMatchContext(result.match.slug, result.providerId);
  const features = buildMatchPredictionFeatures(result.match, realContext);
  const prediction = buildMatchPredictionV2(features);
  const snapshotPersisted = await savePredictionSnapshot(result.match.id, prediction);

  return NextResponse.json({
    match: {
      id: result.match.id,
      slug: result.match.slug,
      competition: result.match.competition,
      kickoffAt: result.match.dateTimeUtc,
      homeTeam: result.match.homeTeam.name,
      awayTeam: result.match.awayTeam.name,
    },
    provider: { id: result.providerId, usedFallback: result.usedFallback },
    prediction,
    snapshotPersisted,
  });
}