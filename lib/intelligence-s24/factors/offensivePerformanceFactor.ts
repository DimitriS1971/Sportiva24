import { createFactorEvaluation, getFactorInput, type S24FactorModule } from '@/lib/intelligence-s24/factors/base';

export class OffensivePerformanceFactor implements S24FactorModule {
  readonly key = 'offensivePerformance' as const;
  readonly label = 'Rendimiento Ofensivo';

  evaluate(input: Parameters<S24FactorModule['evaluate']>[0]) {
    const metric = getFactorInput(input, this.key, 50);
    return createFactorEvaluation(this.key, this.label, metric.score, metric.usedFallback);
  }
}

export const offensivePerformanceFactor = new OffensivePerformanceFactor();
