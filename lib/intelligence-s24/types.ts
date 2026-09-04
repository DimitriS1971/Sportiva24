export type S24FactorKey = string;

export type S24Trend = 'Muy Positiva' | 'Positiva' | 'Estable' | 'Negativa' | 'Muy Negativa';

export type S24RiskLevel = 'Bajo' | 'Medio' | 'Alto';

export type S24ConfidenceLevel = 'Muy Alta' | 'Alta' | 'Media' | 'Baja' | 'Muy Baja';

export interface S24InputContext {
  sport: string;
  teamId: string;
  teamName: string;
  factors: Partial<Record<S24FactorKey, number>>;
  signals?: {
    trendSignal?: number;
    dataCoverage?: number;
    volatility?: number;
  };
  metadata?: {
    sampleSize?: number;
    lastUpdatedAt?: string;
  };
}

export interface S24FactorEvaluation {
  key: S24FactorKey;
  label: string;
  rawScore: number;
  usedFallback: boolean;
  notes?: string;
}

export interface S24FactorBreakdown {
  key: S24FactorKey;
  label: string;
  rawScore: number;
  weight: number;
  obtainedPoints: number;
  maxPoints: number;
  display: string;
}

export interface S24MotorOutput {
  s24Index: number;
  confidence: S24ConfidenceLevel;
  trend: S24Trend;
  risk: S24RiskLevel;
  factorBreakdown: S24FactorBreakdown[];
  diagnostics: {
    fallbackFactorCount: number;
    confidenceScore: number;
    riskScore: number;
  };
}

export interface S24Weights {
  [factorKey: string]: number;
}

export interface S24MotorConfig {
  weights: S24Weights;
  fallbackScore: number;
}
