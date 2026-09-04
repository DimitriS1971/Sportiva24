import { createFactorEvaluation, getFactorInput, type S24FactorModule } from '@/lib/intelligence-s24/factors/base';

export class SquadAvailabilityFactor implements S24FactorModule {
  readonly key = 'squadAvailability' as const;
  readonly label = 'Disponibilidad del Plantel';

  evaluate(input: Parameters<S24FactorModule['evaluate']>[0]) {
    const metric = getFactorInput(input, this.key, 50);
    return createFactorEvaluation(this.key, this.label, metric.score, metric.usedFallback);
  }
}

export const squadAvailabilityFactor = new SquadAvailabilityFactor();
