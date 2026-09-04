import { createFactorEvaluation, getFactorInput, type S24FactorModule } from '@/lib/intelligence-s24/factors/base';

export class RecentFormFactor implements S24FactorModule {
  readonly key = 'recentForm' as const;
  readonly label = 'Forma Reciente';

  evaluate(input: Parameters<S24FactorModule['evaluate']>[0]) {
    const metric = getFactorInput(input, this.key, 50);
    return createFactorEvaluation(this.key, this.label, metric.score, metric.usedFallback);
  }
}

export const recentFormFactor = new RecentFormFactor();
