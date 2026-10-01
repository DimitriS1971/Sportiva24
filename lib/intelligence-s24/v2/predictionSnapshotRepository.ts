import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import type { MatchPredictionV2 } from '@/lib/intelligence-s24/v2/types';

export async function savePredictionSnapshot(matchId: string, prediction: MatchPredictionV2): Promise<boolean> {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return false;

  const { error } = await supabase
    .from('s24_prediction_snapshots')
    .insert({
      match_id: matchId,
      generated_at: prediction.generatedAt,
      model_version: prediction.modelVersion,
      feature_version: prediction.featureVersion,
      status: prediction.status,
      data_quality_score: prediction.dataQuality.score,
      prediction,
    });

  return !error;
}