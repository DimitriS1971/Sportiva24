import { createFactorEvaluation, getFactorInput, type S24FactorModule } from '@/lib/intelligence-s24/factors/base';

export class SquadQualityFactor implements S24FactorModule {
  readonly key = 'squadQuality' as const;
  readonly label = 'Calidad de Plantilla';

  evaluate(input: Parameters<S24FactorModule['evaluate']>[0]) {
    const metric = getFactorInput(input, this.key, 50);
    return createFactorEvaluation(this.key, this.label, metric.score, metric.usedFallback);
  }
}

export const squadQualityFactor = new SquadQualityFactor();
