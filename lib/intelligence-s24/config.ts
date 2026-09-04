import type { S24MotorConfig, S24Weights } from '@/lib/intelligence-s24/types';

export const S24_DEFAULT_WEIGHTS: S24Weights = {
  recentForm: 25,
  offensivePerformance: 15,
  defensivePerformance: 15,
  squadQuality: 10,
  squadAvailability: 10,
  fatigue: 10,
  matchContext: 10,
  headToHead: 5,
};

export const S24_DEFAULT_CONFIG: S24MotorConfig = {
  weights: S24_DEFAULT_WEIGHTS,
  fallbackScore: 50,
};

export function validateS24Weights(weights: S24Weights): void {
  const values = Object.values(weights);
  if (values.length === 0) {
    throw new Error('Invalid S24 weights: at least one factor weight is required');
  }

  const total = values.reduce((acc, weight) => acc + weight, 0);

  if (total !== 100) {
    throw new Error(`Invalid S24 weights: expected total 100 but received ${total}`);
  }
}
