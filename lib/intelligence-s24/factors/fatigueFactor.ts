import { clampScore, createFactorEvaluation, getFactorInput, type S24FactorModule } from '@/lib/intelligence-s24/factors/base';

export class FatigueFactor implements S24FactorModule {
  readonly key = 'fatigue' as const;
  readonly label = 'Fatiga';

  evaluate(input: Parameters<S24FactorModule['evaluate']>[0]) {
    const metric = getFactorInput(input, this.key, 50);

    // Score higher when fatigue impact is controlled.
    const fatigueAdjustedScore = clampScore(metric.score);
    return createFactorEvaluation(this.key, this.label, fatigueAdjustedScore, metric.usedFallback);
  }
}

export const fatigueFactor = new FatigueFactor();
