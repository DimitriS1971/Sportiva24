import type { S24ConfidenceLevel, S24RiskLevel, S24Trend } from '@/lib/intelligence-s24/types';

export interface S24ScaleRange {
  min: number;
  max: number;
  label: string;
}

export const S24_INDEX_SCALE: S24ScaleRange[] = [
  { min: 95, max: 100, label: 'Nivel de elite mundial' },
  { min: 90, max: 94, label: 'Excelente momento competitivo' },
  { min: 85, max: 89, label: 'Muy buen rendimiento' },
  { min: 80, max: 84, label: 'Buen rendimiento' },
  { min: 75, max: 79, label: 'Competitivo' },
  { min: 70, max: 74, label: 'Aceptable' },
  { min: 60, max: 69, label: 'Rendimiento irregular' },
  { min: 50, max: 59, label: 'Bajo rendimiento' },
  { min: 40, max: 49, label: 'Muy bajo rendimiento' },
  { min: 0, max: 39, label: 'Estado critico' },
];

export function classifyS24Index(score: number): S24ScaleRange {
  for (const range of S24_INDEX_SCALE) {
    if (score >= range.min && score <= range.max) {
      return range;
    }
  }

  if (score > 100) {
    return S24_INDEX_SCALE[0];
  }

  return S24_INDEX_SCALE[S24_INDEX_SCALE.length - 1];
}

export function classifyTrend(signal: number): S24Trend {
  if (signal >= 40) return 'Muy Positiva';
  if (signal >= 15) return 'Positiva';
  if (signal > -15) return 'Estable';
  if (signal > -40) return 'Negativa';
  return 'Muy Negativa';
}

export function classifyRisk(score: number): S24RiskLevel {
  if (score >= 67) return 'Alto';
  if (score >= 34) return 'Medio';
  return 'Bajo';
}

export function classifyConfidence(score: number): S24ConfidenceLevel {
  if (score >= 90) return 'Muy Alta';
  if (score >= 75) return 'Alta';
  if (score >= 55) return 'Media';
  if (score >= 35) return 'Baja';
  return 'Muy Baja';
}
