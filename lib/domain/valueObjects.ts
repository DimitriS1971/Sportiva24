export type EntityId = string;

export interface Score {
  home: number;
  away: number;
}

export interface DateRange {
  start: string;
  end: string;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  city?: string;
  countryCode?: string;
}

export interface Money {
  amount: number;
  currency: string;
}

export interface Percentage {
  value: number;
}

export interface Rating {
  value: number;
  scaleMax: number;
}

export interface Probability {
  value: number;
}

export type ConfidenceLevel = 'Muy Alta' | 'Alta' | 'Media' | 'Baja' | 'Muy Baja';

export interface Confidence {
  level: ConfidenceLevel;
  score?: number;
}

export type RiskLevel = 'Bajo' | 'Medio' | 'Alto';

export interface Risk {
  level: RiskLevel;
  score?: number;
}

export type TrendDirection = 'Muy Positiva' | 'Positiva' | 'Estable' | 'Negativa' | 'Muy Negativa';

export interface Trend {
  direction: TrendDirection;
  signal?: number;
}

export interface Version {
  value: string;
  releasedAt?: string;
}

export interface TimePoint {
  isoUtc: string;
  timezone?: string;
}

export interface AuditStamp {
  createdAt: string;
  updatedAt?: string;
  source?: string;
}

export interface EntityRef<TType extends string = string> {
  type: TType;
  id: EntityId;
}
