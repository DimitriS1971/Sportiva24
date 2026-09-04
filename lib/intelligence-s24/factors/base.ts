import type { S24FactorEvaluation, S24FactorKey, S24InputContext } from '@/lib/intelligence-s24/types';

export interface S24FactorModule {
  readonly key: S24FactorKey;
  readonly label: string;
  evaluate(input: S24InputContext): S24FactorEvaluation;
}

export function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  if (value < 0) return 0;
  if (value > 100) return 100;
  return Math.round(value * 100) / 100;
}

export function getFactorInput(input: S24InputContext, key: S24FactorKey, fallbackScore: number) {
  const value = input.factors[key];
  if (typeof value !== 'number') {
    return { score: clampScore(fallbackScore), usedFallback: true };
  }

  return { score: clampScore(value), usedFallback: false };
}

export function createFactorEvaluation(
  key: S24FactorKey,
  label: string,
  score: number,
  usedFallback: boolean,
  notes?: string,
): S24FactorEvaluation {
  return {
    key,
    label,
    rawScore: clampScore(score),
    usedFallback,
    notes,
  };
}
