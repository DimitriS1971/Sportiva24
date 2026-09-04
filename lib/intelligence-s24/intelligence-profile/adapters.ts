import type {
  ClubIntelligenceProfile,
  IntelligenceProfile,
  LeagueIntelligenceProfile,
  MatchIntelligenceProfile,
  PlayerIntelligenceProfile,
  SeasonIntelligenceProfile,
} from '@/lib/domain/intelligenceProfile';
import type { ConfidenceLevel, RiskLevel, TrendDirection } from '@/lib/domain/valueObjects';
import type { ClubIntelligenceData } from '@/lib/intelligence-s24/club-intelligence';
import type { S24EvaluationRecord } from '@/lib/intelligence-s24/history/learningTypes';
import type { LeagueIntelligenceData } from '@/lib/intelligence-s24/league-intelligence';
import type { PlayerIntelligenceData } from '@/lib/intelligence-s24/player-intelligence';
import type { SeasonIntelligenceData } from '@/lib/intelligence-s24/season-intelligence';

function trendSignalFromLabel(trend: string): number {
  const value = trend.toLowerCase();
  if (value.includes('muy positiva')) return 2;
  if (value.includes('positiva')) return 1;
  if (value.includes('estable')) return 0;
  if (value.includes('muy negativa')) return -2;
  if (value.includes('negativa')) return -1;
  return 0;
}

function toRiskScore(risk: string): number {
  const value = risk.toLowerCase();
  if (value.includes('bajo')) return 20;
  if (value.includes('medio')) return 55;
  return 85;
}

function toConfidenceScore(confidence: string): number {
  const value = confidence.toLowerCase();
  if (value.includes('muy alta')) return 92;
  if (value.includes('alta')) return 82;
  if (value.includes('media')) return 67;
  if (value.includes('baja')) return 45;
  return 30;
}

function toConfidenceLevel(value: string): ConfidenceLevel {
  const normalized = value.toLowerCase();
  if (normalized.includes('muy alta')) return 'Muy Alta';
  if (normalized.includes('alta')) return 'Alta';
  if (normalized.includes('media')) return 'Media';
  if (normalized.includes('baja')) return 'Baja';
  return 'Muy Baja';
}

function toRiskLevel(value: string): RiskLevel {
  const normalized = value.toLowerCase();
  if (normalized.includes('bajo')) return 'Bajo';
  if (normalized.includes('medio')) return 'Medio';
  return 'Alto';
}

function toTrendDirection(value: string): TrendDirection {
  const normalized = value.toLowerCase();
  if (normalized.includes('muy positiva')) return 'Muy Positiva';
  if (normalized.includes('positiva')) return 'Positiva';
  if (normalized.includes('estable')) return 'Estable';
  if (normalized.includes('muy negativa')) return 'Muy Negativa';
  return 'Negativa';
}

export function buildMatchProfileFromEvaluationRecord(record: S24EvaluationRecord): MatchIntelligenceProfile {
  return {
    identity: {
      id: record.id,
      slug: record.match.slug,
      type: 'match',
      name: `${record.match.homeTeam} vs ${record.match.awayTeam}`,
      sport: record.match.sport,
      competition: record.match.competition,
      season: record.createdAt.slice(0, 4),
      homeTeam: record.match.homeTeam,
      awayTeam: record.match.awayTeam,
      status: record.match.status,
      kickoff: record.match.time,
    },
    competitiveState: {
      index: { value: record.metrics.s24Index, scaleMax: 100 },
      confidence: { level: toConfidenceLevel(record.metrics.confidence), score: toConfidenceScore(record.metrics.confidence) },
      risk: { level: toRiskLevel(record.metrics.risk), score: toRiskScore(record.metrics.risk) },
      trend: { direction: toTrendDirection(record.metrics.trend), signal: trendSignalFromLabel(record.metrics.trend) },
      ratingLabel: record.metrics.s24Index >= 85 ? 'Elite' : record.metrics.s24Index >= 75 ? 'Alto' : record.metrics.s24Index >= 65 ? 'Medio' : 'Inestable',
    },
    indicators: [
      { key: 's24-index', label: 'S24 Index', value: record.metrics.s24Index },
      { key: 'confidence', label: 'Confianza', value: record.metrics.confidence },
      { key: 'risk', label: 'Riesgo', value: record.metrics.risk },
      { key: 'trend', label: 'Tendencia', value: record.metrics.trend },
    ],
    factors: record.factorsUsed.map((factor) => ({
      key: factor.key,
      label: factor.title,
      contribution: factor.contributionPoints,
      maxContribution: factor.maxPoints,
      detail: factor.detail,
    })),
    narrative: {
      title: record.narrativeUsed.title,
      executiveSummary: record.narrativeUsed.executiveSummary,
      fullText: record.narrativeUsed.factorsSummary,
    },
    insights: [
      {
        title: 'Insight del partido',
        summary: record.insightGenerated.text,
        source: 'motor-s24',
      },
    ],
    alerts: record.metrics.risk.toLowerCase().includes('alto')
      ? [{ level: 'alta', title: 'Riesgo alto', description: 'Partido con riesgo metodologico alto.', signal: 'risk=alto' }]
      : [],
    history: [{ createdAt: record.createdAt, index: record.metrics.s24Index, trend: record.metrics.trend }],
    evidence: record.factorsUsed.map((factor) => ({
      source: 'factor-engine',
      key: factor.key,
      value: `${factor.contributionPoints}/${factor.maxPoints}`,
    })),
    validation: {
      motorGlobal: 0,
      narrativeGlobal: 0,
      insightGlobal: 0,
      comparedSamples: record.comparison.status === 'available' ? 1 : 0,
    },
    analyticalPassport: {
      engineVersion: record.model.motorVersion,
      methodologyVersion: record.model.methodologicalVersion,
      sportProfileVersion: 'unknown',
      sportMethodologyVersion: record.model.methodologicalVersion,
      providerId: record.provider.id,
      confidenceLevel: record.metrics.confidence,
      reportStatus: record.provider.usedFailover ? 'Operativo con fallback controlado' : 'Operativo completo',
    },
    metadata: {
      generatedAt: record.createdAt,
      sourceModule: 'history-engine',
      tags: ['match', 's24'],
    },
    version: {
      contract: { value: 'intelligence-profile-v1' },
      profile: { value: 'match-intelligence-profile-v1' },
    },
  };
}

export function buildClubProfileFromData(data: ClubIntelligenceData): ClubIntelligenceProfile {
  return {
    identity: {
      id: data.club.name,
      slug: data.club.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      type: 'club',
      name: data.club.name,
      sport: 'football',
      competition: data.club.competition,
      season: data.club.season,
      country: data.club.country,
    },
    competitiveState: {
      index: { value: data.competitiveState.s24Index, scaleMax: 100 },
      confidence: { level: data.competitiveState.confidence as never },
      risk: { level: data.competitiveState.risk as never },
      trend: { direction: data.competitiveState.trend as never, signal: trendSignalFromLabel(data.competitiveState.trend) },
      ratingLabel: data.competitiveState.rating,
    },
    indicators: [
      { key: 's24-index', label: 'S24 Index', value: data.competitiveState.s24Index },
      { key: 'consistency', label: 'Consistencia', value: data.strengths.consistency },
      { key: 'efficiency', label: 'Eficiencia', value: data.strengths.efficiency },
    ],
    factors: [
      { key: 'attack', label: 'Ataque', contribution: data.strengths.attack, maxContribution: 100, detail: 'Fortaleza ofensiva' },
      { key: 'defense', label: 'Defensa', contribution: data.strengths.defense, maxContribution: 100, detail: 'Fortaleza defensiva' },
      { key: 'home-advantage', label: 'Localia', contribution: data.strengths.homeAdvantage, maxContribution: 100, detail: 'Ventaja de localia' },
    ],
    narrative: {
      title: 'Estado del club',
      executiveSummary: data.intelligentNarrative.executiveSummary,
      fullText: data.intelligentNarrative.competitivePerspective,
    },
    insights: data.insights.map((item) => ({ title: item.title, summary: item.summary, source: 'motor-s24' })),
    alerts: data.alerts,
    history: data.evolution.indexTimeline.map((point) => ({ createdAt: point.createdAt, index: point.s24Index })),
    evidence: data.insights.flatMap((item) => item.evidence.map((line, idx) => ({
      source: 'club-intelligence',
      key: `${item.title}-${idx}`,
      value: line,
    }))),
    validation: data.validation,
    analyticalPassport: {
      engineVersion: data.passport.versionMotor,
      methodologyVersion: data.passport.versionMetodologica,
      sportProfileVersion: data.passport.sportProfileVersion,
      sportMethodologyVersion: data.passport.sportMethodologyVersion,
      providerId: data.passport.proveedorDatos,
      confidenceLevel: data.passport.nivelConfianza,
      reportStatus: data.passport.estadoInforme,
    },
    metadata: {
      generatedAt: data.generatedAt,
      sourceModule: 'club-intelligence',
      tags: ['club', 's24'],
    },
    version: {
      contract: { value: 'intelligence-profile-v1' },
      profile: { value: 'club-intelligence-profile-v1' },
    },
    club: {
      stadium: data.club.stadium,
      coach: data.club.coach,
    },
  };
}

export function buildLeagueProfileFromData(data: LeagueIntelligenceData): LeagueIntelligenceProfile {
  const season = data.generatedAt.slice(0, 4);
  const riskLevel = data.competitiveState.volatility >= 67
    ? 'Alto'
    : data.competitiveState.volatility >= 40
      ? 'Medio'
      : 'Bajo';

  return {
    identity: {
      id: data.competition,
      slug: data.competition.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      type: 'league',
      name: data.competition,
      sport: 'football',
      competition: data.competition,
      season,
    },
    competitiveState: {
      index: { value: data.competitiveState.avgOffense, scaleMax: 100 },
      confidence: { level: 'Media' },
      risk: { level: riskLevel },
      trend: { direction: data.trends.positives >= data.trends.negatives ? 'Positiva' : 'Negativa' },
      ratingLabel: data.competitiveState.competitiveLevel,
    },
    indicators: [
      { key: 'competitive-level', label: 'Nivel competitivo', value: data.competitiveState.competitiveLevel },
      { key: 'balance', label: 'Equilibrio', value: data.competitiveState.competitiveBalance },
      { key: 'volatility', label: 'Volatilidad', value: data.competitiveState.volatility },
      { key: 'intensity', label: 'Intensidad', value: data.competitiveState.intensity },
    ],
    factors: [],
    narrative: {
      title: 'Estado de la liga',
      executiveSummary: data.narrative.leagueState,
      fullText: data.narrative.evolution,
    },
    insights: data.insights.map((item) => ({ title: item.title, summary: item.summary, source: 'narrative-engine' })),
    alerts: data.alerts,
    history: [],
    evidence: data.insights.flatMap((item) => item.evidence.map((line, idx) => ({ source: 'league-intelligence', key: `${item.title}-${idx}`, value: line }))),
    validation: {
      motorGlobal: 0,
      narrativeGlobal: 0,
      insightGlobal: 0,
    },
    analyticalPassport: {
      engineVersion: data.passport.versionMotor,
      methodologyVersion: data.passport.versionMetodologica,
      sportProfileVersion: data.passport.sportProfileVersion,
      sportMethodologyVersion: data.passport.sportMethodologyVersion,
      providerId: data.passport.proveedorDatos,
      confidenceLevel: data.passport.nivelConfianza,
      reportStatus: data.passport.estadoInforme,
    },
    metadata: {
      generatedAt: data.generatedAt,
      sourceModule: 'league-intelligence',
      tags: ['league', 's24'],
    },
    version: {
      contract: { value: 'intelligence-profile-v1' },
      profile: { value: 'league-intelligence-profile-v1' },
    },
    league: {
      clubs: data.competitiveState.rankingS24.length,
      rankingSize: data.competitiveState.rankingS24.length,
    },
  };
}

export function buildPlayerProfileFromData(data: PlayerIntelligenceData): PlayerIntelligenceProfile {
  return {
    identity: {
      id: data.profile.slug,
      slug: data.profile.slug,
      type: 'player',
      name: data.profile.name,
      sport: 'football',
      competition: data.profile.competition,
      club: data.profile.club,
    },
    competitiveState: {
      index: { value: data.indicators.playerIndex, scaleMax: 100 },
      confidence: { level: toConfidenceLevel(data.passport.nivelConfianza) },
      risk: { level: data.indicators.risk >= 67 ? 'Alto' : data.indicators.risk >= 40 ? 'Medio' : 'Bajo' },
      trend: { direction: toTrendDirection(data.indicators.trend), signal: trendSignalFromLabel(data.indicators.trend) },
      ratingLabel: data.profile.status,
    },
    indicators: [
      { key: 'player-index', label: 'Player Index', value: data.indicators.playerIndex },
      { key: 'influence', label: 'Influencia', value: data.indicators.influence },
      { key: 'availability', label: 'Disponibilidad', value: data.indicators.availability },
      { key: 'form', label: 'Forma', value: data.indicators.form },
    ],
    factors: [],
    narrative: {
      title: 'Estado del jugador',
      executiveSummary: data.narrative.currentStatus,
      fullText: data.narrative.evolution,
    },
    insights: data.comparison.map((row) => ({ title: row.name, summary: `Similaridad ${row.similarityScore}`, source: 'motor-s24' })),
    alerts: data.alerts,
    history: data.history.timeline.map((point) => ({ createdAt: point.createdAt, index: point.playerIndex, trend: point.trend })),
    evidence: [],
    validation: {
      motorGlobal: 0,
      narrativeGlobal: 0,
      insightGlobal: 0,
    },
    analyticalPassport: {
      engineVersion: data.passport.versionMotor,
      methodologyVersion: data.passport.versionMetodologica,
      sportProfileVersion: data.passport.sportProfileVersion,
      sportMethodologyVersion: data.passport.sportMethodologyVersion,
      providerId: data.passport.proveedorDatos,
      confidenceLevel: data.passport.nivelConfianza,
      reportStatus: data.passport.estadoInforme,
    },
    metadata: {
      generatedAt: data.generatedAt,
      sourceModule: 'player-intelligence',
      tags: ['player', 's24'],
    },
    version: {
      contract: { value: 'intelligence-profile-v1' },
      profile: { value: 'player-intelligence-profile-v1' },
    },
    player: {
      position: data.profile.role,
      availability: data.indicators.availability,
    },
  };
}

export function buildSeasonProfileFromData(data: SeasonIntelligenceData): SeasonIntelligenceProfile {
  const slug = `${data.competition}-${data.seasonLabel}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const riskLevel = data.comparisonWithPreviousSeason.current.volatility >= 67
    ? 'Alto'
    : data.comparisonWithPreviousSeason.current.volatility >= 40
      ? 'Medio'
      : 'Bajo';

  return {
    identity: {
      id: slug,
      slug,
      type: 'season',
      name: `${data.competition} ${data.seasonLabel}`,
      sport: 'football',
      competition: data.competition,
      season: data.seasonLabel,
    },
    competitiveState: {
      index: { value: data.comparisonWithPreviousSeason.current.avgIndex, scaleMax: 100 },
      confidence: { level: 'Media' },
      risk: { level: riskLevel },
      trend: { direction: data.comparisonWithPreviousSeason.delta.avgIndex >= 0 ? 'Positiva' : 'Negativa' },
      ratingLabel: 'Season Intelligence',
    },
    indicators: [
      { key: 'avg-index', label: 'Indice promedio', value: data.comparisonWithPreviousSeason.current.avgIndex },
      { key: 'delta-index', label: 'Delta indice', value: data.comparisonWithPreviousSeason.delta.avgIndex },
      { key: 'delta-volatility', label: 'Delta volatilidad', value: data.comparisonWithPreviousSeason.delta.volatility },
    ],
    factors: [],
    narrative: {
      title: 'Narrativa de temporada',
      executiveSummary: data.narrative.executiveSummary,
      fullText: `${data.narrative.competitiveEvolution}\n\n${data.narrative.trendChanges}\n\n${data.narrative.methodologicalChanges}`,
    },
    insights: data.insights.map((item) => ({ title: item.title, summary: item.summary, source: 'narrative-engine' })),
    alerts: [],
    history: data.evolution.s24IndexTimeline.map((point) => ({ createdAt: point.createdAt, index: point.s24Index, trend: point.trend })),
    evidence: data.insights.flatMap((item) => item.evidence.map((line, idx) => ({ source: 'season-intelligence', key: `${item.title}-${idx}`, value: line }))),
    validation: {
      motorGlobal: 0,
      narrativeGlobal: 0,
      insightGlobal: 0,
    },
    analyticalPassport: {
      engineVersion: data.passport.versionMotor,
      methodologyVersion: data.passport.versionMetodologica,
      sportProfileVersion: data.passport.sportProfileVersion,
      sportMethodologyVersion: data.passport.sportMethodologyVersion,
      providerId: data.passport.proveedorDatos,
      confidenceLevel: data.passport.nivelConfianza,
      reportStatus: data.passport.estadoInforme,
    },
    metadata: {
      generatedAt: data.generatedAt,
      sourceModule: 'season-intelligence',
      tags: ['season', 's24'],
    },
    version: {
      contract: { value: 'intelligence-profile-v1' },
      profile: { value: 'season-intelligence-profile-v1' },
    },
    seasonData: {
      matches: data.comparisonWithPreviousSeason.current.sampleSize,
    },
  };
}

export function asIntelligenceProfile(profile: IntelligenceProfile): IntelligenceProfile {
  return profile;
}
