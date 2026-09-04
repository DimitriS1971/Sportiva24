import { createFactorEvaluation, getFactorInput, type S24FactorModule } from '@/lib/intelligence-s24/factors/base';

export class HeadToHeadFactor implements S24FactorModule {
  readonly key = 'headToHead' as const;
  readonly label = 'Historial entre Equipos';

  evaluate(input: Parameters<S24FactorModule['evaluate']>[0]) {
    const metric = getFactorInput(input, this.key, 50);
    return createFactorEvaluation(this.key, this.label, metric.score, metric.usedFallback);
  }
}

export const headToHeadFactor = new HeadToHeadFactor();
