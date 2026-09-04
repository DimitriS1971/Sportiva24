import { createFactorEvaluation, getFactorInput, type S24FactorModule } from '@/lib/intelligence-s24/factors/base';

export class DefensivePerformanceFactor implements S24FactorModule {
  readonly key = 'defensivePerformance' as const;
  readonly label = 'Rendimiento Defensivo';

  evaluate(input: Parameters<S24FactorModule['evaluate']>[0]) {
    const metric = getFactorInput(input, this.key, 50);
    return createFactorEvaluation(this.key, this.label, metric.score, metric.usedFallback);
  }
}

export const defensivePerformanceFactor = new DefensivePerformanceFactor();
