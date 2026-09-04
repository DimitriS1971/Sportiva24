import { createEditorialEngine } from '@/lib/intelligence-s24/editorial';
import type { S24EvaluationRecord } from '@/lib/intelligence-s24/history/learningTypes';
import { classifyS24Index } from '@/lib/intelligence-s24/metodologiaOficial';
import type { SportProfile } from '@/lib/intelligence-s24/sports';
import type { ValidationDashboard } from '@/lib/intelligence-s24/validation';
import type { IntelligenceCenterData, TeamStrengthItem } from '@/lib/intelligence-s24/intelligence-center';
import type {
  BuildClubIntelligenceOptions,
  ClubAlertItem,
  ClubEvolutionMatch,
  ClubIdentity,
  ClubInsightItem,
  ClubIntelligenceData,
  ClubIntelligenceHubData,
  ClubStrengths,
  ClubWeakness,
} from '@/lib/intelligence-s24/club-intelligence/types';

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function slugifyTeamName(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function titleCaseFromSlug(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
    .join(' ');
}

function crestByTeamName(name: string): string {
  const localCrests: Record<string, string> = {
    'Real Madrid': '/teams-official/real-madrid.png',
    Barcelona: '/teams-official/barcelona.png',
    'Manchester City': '/teams-official/manchester-city.png',
    Arsenal: '/teams-official/arsenal.png',
    'Los Angeles Lakers': '/teams-official/lakers.png',
    'Boston Celtics': '/teams-official/celtics.png',
  };

  return localCrests[name] ?? '/icons/analytics-premium.svg';
}

function confidenceLabel(rate: number): string {
  if (rate >= 0.9) return 'Muy Alta';
  if (rate >= 0.75) return 'Alta';
  if (rate >= 0.55) return 'Media';
  if (rate >= 0.35) return 'Baja';
  return 'Muy Baja';
}

function riskLabel(highRiskRate: number): string {
  if (highRiskRate >= 0.67) return 'Alto';
  if (highRiskRate >= 0.38) return 'Medio';
  return 'Bajo';
}

function trendLabel(trendBalance: number): string {
  if (trendBalance >= 1.2) return 'Muy Positiva';
  if (trendBalance >= 0.4) return 'Positiva';
  if (trendBalance <= -1.2) return 'Muy Negativa';
  if (trendBalance <= -0.4) return 'Negativa';
  return 'Estable';
}

function detectCountryFromCompetition(competition: string): string {
  const normalized = competition.toLowerCase();

  if (normalized.includes('laliga') || normalized.includes('copa del rey')) return 'España';
  if (normalized.includes('premier')) return 'Inglaterra';
  if (normalized.includes('serie a')) return 'Italia';
  if (normalized.includes('bundesliga')) return 'Alemania';
  if (normalized.includes('ligue')) return 'Francia';
  if (normalized.includes('mlb')) return 'Estados Unidos';
  if (normalized.includes('nba')) return 'Estados Unidos';
  if (normalized.includes('euroleague')) return 'Europa';
  if (normalized.includes('champions')) return 'Internacional';

  return 'No informado por proveedor';
}

function mostFrequentCompetition(records: S24EvaluationRecord[]): string {
  const bucket = new Map<string, number>();
  for (const record of records) {
    bucket.set(record.match.competition, (bucket.get(record.match.competition) ?? 0) + 1);
  }

  let top = 'No informada';
  let topCount = -1;
  for (const [competition, count] of bucket.entries()) {
    if (count > topCount) {
      top = competition;
      topCount = count;
    }
  }

  return top;
}

function computeHomeAdvantage(records: S24EvaluationRecord[], clubName: string): number {
  const home = records.filter((record) => record.match.homeTeam === clubName);
  const away = records.filter((record) => record.match.awayTeam === clubName);

  const homeAvg = home.length > 0
    ? home.reduce((acc, record) => acc + record.metrics.s24Index, 0) / home.length
    : 0;
  const awayAvg = away.length > 0
    ? away.reduce((acc, record) => acc + record.metrics.s24Index, 0) / away.length
    : 0;

  return round2(Math.max(0, 50 + (homeAvg - awayAvg)));
}

function computeEfficiency(records: S24EvaluationRecord[], clubName: string): number {
  if (records.length === 0) return 0;
  const wins = records.filter((record) => record.verdict.competitiveEdge === clubName).length;
  return round2((wins / records.length) * 100);
}

function buildWeaknesses(
  strengths: ClubStrengths,
  highRiskRate: number,
  trendBalance: number,
  records: S24EvaluationRecord[],
): ClubWeakness[] {
  const items: ClubWeakness[] = [];

  if (strengths.attack < 55) {
    items.push({
      key: 'attack',
      title: 'Produccion ofensiva inestable',
      description: 'El bloque ofensivo se mantiene por debajo del umbral de rendimiento esperado por metodologia S24.',
      severity: 'media',
    });
  }

  if (strengths.defense < 55) {
    items.push({
      key: 'defense',
      title: 'Fragilidad defensiva',
      description: 'La contribucion defensiva del club refleja debilidad estructural en escenarios de presion.',
      severity: 'alta',
    });
  }

  if (highRiskRate >= 0.6) {
    items.push({
      key: 'risk',
      title: 'Exposicion de riesgo elevada',
      description: 'El historial reciente muestra una proporcion alta de evaluaciones con riesgo metodologico alto.',
      severity: 'alta',
    });
  }

  if (trendBalance <= -0.4) {
    items.push({
      key: 'trend',
      title: 'Caida de tendencia',
      description: 'El balance de tendencia permanece en zona negativa y compromete estabilidad competitiva.',
      severity: 'media',
    });
  }

  const failoverRate = records.filter((record) => record.provider.usedFailover).length / Math.max(1, records.length);
  if (failoverRate >= 0.45) {
    items.push({
      key: 'data-pipeline',
      title: 'Dependencia de failover de proveedor',
      description: 'El pipeline de datos del club activa failover con alta frecuencia y puede afectar sensibilidad analitica.',
      severity: 'baja',
    });
  }

  return items.slice(0, 5);
}

function buildClubInsights(
  clubName: string,
  strengths: ClubStrengths,
  competitiveState: { s24Index: number; rating: string; trend: string; confidence: string },
  records: S24EvaluationRecord[],
): ClubInsightItem[] {
  const recent = records.slice(0, 3);

  return [
    {
      title: 'Pulso competitivo',
      summary: `${clubName} opera con S24 Index ${competitiveState.s24Index} y rating ${competitiveState.rating}.`,
      evidence: [
        `s24Index=${competitiveState.s24Index}`,
        `rating=${competitiveState.rating}`,
        `trend=${competitiveState.trend}`,
      ],
    },
    {
      title: 'Fortaleza dominante',
      summary: `El mejor bloque del club se concentra en ${strengths.attack >= strengths.defense ? 'ataque' : 'defensa'} con valor ${Math.max(strengths.attack, strengths.defense)}.`,
      evidence: [
        `attack=${strengths.attack}`,
        `defense=${strengths.defense}`,
        `consistency=${strengths.consistency}`,
      ],
    },
    {
      title: 'Lectura de corto plazo',
      summary: `${recent.length} evaluaciones recientes sostienen confianza ${competitiveState.confidence} para la toma de decisiones deportivas.`,
      evidence: recent.map((record) => `${record.match.homeTeam} vs ${record.match.awayTeam} (${record.metrics.s24Index})`),
    },
  ];
}

function buildAlerts(clubName: string, records: S24EvaluationRecord[], centerAlerts: ClubAlertItem[]): ClubAlertItem[] {
  const alerts: ClubAlertItem[] = [...centerAlerts];

  for (const record of records) {
    if (record.metrics.risk.toLowerCase().includes('alto')) {
      alerts.push({
        level: 'alta',
        title: 'Riesgo alto en evaluacion reciente',
        description: `${clubName} registra una evaluacion de riesgo alto en ${record.match.competition}.`,
        signal: 'risk=alto',
      });
    }

    if (record.metrics.confidence.toLowerCase().includes('baja')) {
      alerts.push({
        level: 'media',
        title: 'Confianza baja detectada',
        description: `La confianza metodologica de ${clubName} cae en una de las evaluaciones recientes.`,
        signal: 'confidence=baja',
      });
    }
  }

  const deduped = new Map<string, ClubAlertItem>();
  for (const alert of alerts) {
    const key = `${alert.title}|${alert.signal}`;
    if (!deduped.has(key)) {
      deduped.set(key, alert);
    }
  }

  return Array.from(deduped.values()).slice(0, 8);
}

function toEvolutionMatch(record: S24EvaluationRecord, clubName: string): ClubEvolutionMatch {
  const wasHome = record.match.homeTeam === clubName;
  return {
    matchSlug: record.match.slug,
    createdAt: record.createdAt,
    competition: record.match.competition,
    opponent: wasHome ? record.match.awayTeam : record.match.homeTeam,
    wasHome,
    s24Index: record.metrics.s24Index,
    trend: record.metrics.trend,
    risk: record.metrics.risk,
    confidence: record.metrics.confidence,
    competitiveEdge: record.verdict.competitiveEdge,
  };
}

function toClubIdentity(team: TeamStrengthItem): ClubIdentity {
  return {
    slug: slugifyTeamName(team.teamName),
    name: team.teamName,
    crestUrl: crestByTeamName(team.teamName),
  };
}

function pickTeamBySlug(teams: TeamStrengthItem[], clubSlug?: string): TeamStrengthItem | null {
  if (teams.length === 0) return null;

  if (!clubSlug) {
    return teams[0] ?? null;
  }

  const found = teams.find((team) => slugifyTeamName(team.teamName) === clubSlug);
  return found ?? null;
}

export function buildClubIntelligenceHubData(centerData: IntelligenceCenterData): ClubIntelligenceHubData {
  const clubs = centerData.clubes.rankingS24.slice(0, 40).map((team) => toClubIdentity(team));
  return {
    generatedAt: new Date().toISOString(),
    clubs,
    recommendedClubSlug: clubs[0]?.slug ?? null,
  };
}

export function buildClubIntelligenceData(
  records: S24EvaluationRecord[],
  centerData: IntelligenceCenterData,
  validationDashboard: ValidationDashboard,
  sportProfile: SportProfile,
  options: BuildClubIntelligenceOptions = {},
): ClubIntelligenceData {
  const selectedTeam = pickTeamBySlug(centerData.clubes.rankingS24, options.clubSlug);
  const fallbackName = options.clubSlug ? titleCaseFromSlug(options.clubSlug) : 'Club sin datos';
  const clubName = selectedTeam?.teamName ?? fallbackName;

  const clubRecords = records
    .filter((record) => record.match.homeTeam === clubName || record.match.awayTeam === clubName)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  const appearances = clubRecords.length;
  const competition = mostFrequentCompetition(clubRecords);
  const season = `${new Date().getUTCFullYear()}-${new Date().getUTCFullYear() + 1}`;

  const averageIndex = appearances > 0
    ? round2(clubRecords.reduce((acc, record) => acc + record.metrics.s24Index, 0) / appearances)
    : selectedTeam?.avgIndex ?? 0;

  const confidenceRate = selectedTeam?.confidenceRate ?? 0;
  const highRiskRate = selectedTeam?.highRiskRate ?? 0;
  const trendBalance = selectedTeam?.trendBalance ?? 0;

  const competitiveState = {
    s24Index: averageIndex,
    rating: classifyS24Index(averageIndex).label,
    trend: trendLabel(trendBalance),
    risk: riskLabel(highRiskRate),
    confidence: confidenceLabel(confidenceRate),
  };

  const strengths: ClubStrengths = {
    attack: selectedTeam?.offenseScore ?? 0,
    defense: selectedTeam?.defenseScore ?? 0,
    homeAdvantage: computeHomeAdvantage(clubRecords, clubName),
    consistency: selectedTeam?.consistencyScore ?? 0,
    efficiency: computeEfficiency(clubRecords, clubName),
  };

  const centerAlerts = centerData.alertas.items
    .filter((alert) => alert.description.toLowerCase().includes(clubName.toLowerCase()))
    .map((alert) => ({
      level: alert.level,
      title: alert.title,
      description: alert.description,
      signal: alert.signal,
    }));

  const weaknesses = buildWeaknesses(strengths, highRiskRate, trendBalance, clubRecords);
  const insights = buildClubInsights(clubName, strengths, competitiveState, clubRecords);
  const alerts = buildAlerts(clubName, clubRecords, centerAlerts);

  const editorial = createEditorialEngine({ locale: 'es', seed: clubName.length + appearances + 11 });
  const narrativeSeed = clubRecords[0]?.narrativeUsed;

  const executiveSummary = narrativeSeed?.executiveSummary
    ?? `${clubName} mantiene un perfil competitivo ${competitiveState.rating.toLowerCase()} con tendencia ${competitiveState.trend.toLowerCase()}.`;

  const clubStatus = `${clubName} presenta S24 Index ${competitiveState.s24Index}, confianza ${competitiveState.confidence} y riesgo ${competitiveState.risk}.`;
  const perspective = `${editorial.pickTransition('opening')} ${clubName} compite en ${competition} con consistencia ${strengths.consistency} y eficiencia ${strengths.efficiency}.`;
  const risksNarrative = weaknesses.length > 0
    ? weaknesses.map((item) => item.title).join(', ')
    : 'No se detectan riesgos metodologicos criticos en la ventana analizada.';
  const strengthsNarrative = `Fortalezas principales: ataque ${strengths.attack}, defensa ${strengths.defense}, localia ${strengths.homeAdvantage}, consistencia ${strengths.consistency}.`;

  const positiveTrend = clubRecords.filter((record) => record.metrics.trend.toLowerCase().includes('positiva')).length;
  const stableTrend = clubRecords.filter((record) => record.metrics.trend.toLowerCase().includes('estable')).length;
  const negativeTrend = clubRecords.filter((record) => record.metrics.trend.toLowerCase().includes('negativa')).length;

  const winsByModel = clubRecords.filter((record) => record.verdict.competitiveEdge === clubName).length;
  const lossesByModel = Math.max(0, appearances - winsByModel);

  const providerId = clubRecords[0]?.provider.id ?? 'none';
  const providerRow = validationDashboard.byProvider.find((entry) => entry.providerId === providerId);
  const sportRow = validationDashboard.bySport.find((entry) => entry.sport === (clubRecords[0]?.match.sport ?? 'football'));

  const confidenceForCoverage = competitiveState.confidence === 'Muy Alta' || competitiveState.confidence === 'Alta'
    ? 'Alta'
    : competitiveState.confidence === 'Media'
      ? 'Media'
      : 'Limitada';

  return {
    generatedAt: new Date().toISOString(),
    club: {
      name: clubName,
      crestUrl: crestByTeamName(clubName),
      country: detectCountryFromCompetition(competition),
      competition,
      stadium: 'Estadio no informado por proveedor',
      coach: 'Entrenador no informado por proveedor',
      season,
    },
    competitiveState,
    evolution: {
      recentMatches: clubRecords.slice(0, 10).map((record) => toEvolutionMatch(record, clubName)),
      indexTimeline: clubRecords
        .slice(0, 12)
        .map((record) => ({ createdAt: record.createdAt, s24Index: record.metrics.s24Index }))
        .reverse(),
    },
    strengths,
    weaknesses,
    intelligentNarrative: {
      executiveSummary,
      clubStatus,
      competitivePerspective: perspective,
      risks: risksNarrative,
      strengths: strengthsNarrative,
    },
    insights,
    alerts,
    history: {
      appearances,
      winsByModel,
      lossesByModel,
      trendPositive: positiveTrend,
      trendStable: stableTrend,
      trendNegative: negativeTrend,
      averageIndex,
    },
    passport: {
      versionMotor: clubRecords[0]?.model.motorVersion ?? 'Motor S24 v1',
      versionMetodologica: clubRecords[0]?.model.methodologicalVersion ?? sportProfile.methodologyVersion,
      sportProfileVersion: sportProfile.version,
      sportMethodologyVersion: sportProfile.methodologyVersion,
      sportIdentifier: sportProfile.id,
      fechaCalculo: new Date().toLocaleString('es-ES'),
      proveedorDatos: providerId,
      coberturaAnalisis: confidenceForCoverage,
      nivelConfianza: competitiveState.confidence,
      estadoInforme: 'Activo',
    },
    validation: {
      motorGlobal: round2(validationDashboard.report.motorScore.global * 100),
      narrativeGlobal: round2(validationDashboard.report.narrativeScore.global * 100),
      insightGlobal: round2(validationDashboard.report.insightScore.global * 100),
      sportAccuracy: round2((sportRow?.motorAccuracy ?? 0) * 100),
      providerAccuracy: round2((providerRow?.verdictAccuracy ?? 0) * 100),
    },
  };
}

export { slugifyTeamName };
