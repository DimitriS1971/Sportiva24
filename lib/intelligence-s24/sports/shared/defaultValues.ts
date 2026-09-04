import type { SportIndicatorConfiguration, SportInterpretationConfiguration, SportNarrativeConfiguration, SportValidationConfiguration } from '@/lib/intelligence-s24/sports/shared/types';
import type { S24Weights } from '@/lib/intelligence-s24/types';

export const DEFAULT_SPORT_FACTORS = [
  'recentForm',
  'offensivePerformance',
  'defensivePerformance',
  'squadQuality',
  'squadAvailability',
  'fatigue',
  'matchContext',
  'headToHead',
];

export const DEFAULT_SPORT_WEIGHTS: S24Weights = {
  recentForm: 25,
  offensivePerformance: 15,
  defensivePerformance: 15,
  squadQuality: 10,
  squadAvailability: 10,
  fatigue: 10,
  matchContext: 10,
  headToHead: 5,
};

export const DEFAULT_INDICATOR_CONFIGURATION: SportIndicatorConfiguration = {
  confidence: {
    volatilityWeight: 0.2,
    fallbackPenalty: 8,
    sampleBonusMultiplier: 1.5,
    sampleBonusCap: 12,
    baseDataCoverage: 70,
  },
  risk: {
    volatilityWeight: 0.45,
    fallbackWeight: 0.3,
    confidenceWeight: 0.25,
    fallbackImpact: 10,
  },
  trendFactorKeys: ['recentForm', 'offensivePerformance', 'defensivePerformance'],
};

export const DEFAULT_NARRATIVE_CONFIGURATION: SportNarrativeConfiguration = {
  locale: 'es',
  vocabulary: ['rendimiento', 'consistencia', 'tendencia'],
  templates: ['editorial', 'comparativa', 'metodologica'],
  expressions: ['ventaja competitiva', 'escenario de riesgo controlado', 'equilibrio contextual'],
  terminology: {
    index: 'S24 Index',
    confidence: 'Confianza',
    risk: 'Riesgo',
    trend: 'Tendencia',
  },
};

export const DEFAULT_INTERPRETATION_CONFIGURATION: SportInterpretationConfiguration = {
  factorAdvantageLabels: {
    recentForm: 'Mejor forma',
    offensivePerformance: 'Mayor potencia ofensiva',
    defensivePerformance: 'Mejor solidez defensiva',
    squadQuality: 'Plantilla mas competitiva',
    squadAvailability: 'Mayor disponibilidad',
    fatigue: 'Menor fatiga',
    matchContext: 'Contexto mas favorable',
    headToHead: 'Mejor historial reciente',
  },
  factorDisplayOrder: [
    'recentForm',
    'offensivePerformance',
    'defensivePerformance',
    'matchContext',
    'squadAvailability',
    'fatigue',
    'squadQuality',
    'headToHead',
  ],
  factorDetails: {
    recentForm: 'Lectura de estabilidad reciente del equipo en el corto plazo.',
    offensivePerformance: 'Aporta capacidad de generar y convertir opciones de ataque.',
    defensivePerformance: 'Mide control del dano rival y estructura sin balon.',
    squadQuality: 'Representa profundidad y calidad global del bloque competitivo.',
    squadAvailability: 'Condicion del plantel utilizable para el escenario analizado.',
    fatigue: 'Impacto de carga y ritmo competitivo sobre el rendimiento esperado.',
    matchContext: 'Incluye relevancia del partido y dificultad de entorno competitivo.',
    headToHead: 'Ajuste contextual en base a enfrentamientos recientes comparables.',
  },
};

export const DEFAULT_VALIDATION_CONFIGURATION: SportValidationConfiguration = {
  requiredCoverage: 0.65,
  maxFallbackTolerance: 3,
};
