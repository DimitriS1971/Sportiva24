import { createEditorialEngine } from '@/lib/intelligence-s24/editorial';
import type { S24EvaluationRecord } from '@/lib/intelligence-s24/history/learningTypes';
import type { SportProfile } from '@/lib/intelligence-s24/sports';
import type { IntelligenceCenterData, TeamStrengthItem } from '@/lib/intelligence-s24/intelligence-center';
import type {
  BuildLeagueIntelligenceOptions,
  LeagueIdentity,
  LeagueInsight,
  LeagueIntelligenceData,
  LeagueIntelligenceHubData,
  LeagueMethodologicalAlert,
  LeagueTeamHighlight,
} from '@/lib/intelligence-s24/league-intelligence/types';

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function slugifyCompetition(value: string): string {
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

function trendBucket(value: number): 'positive' | 'stable' | 'negative' {
  if (value >= 0.4) return 'positive';
  if (value <= -0.4) return 'negative';
  return 'stable';
}

function toLeagueIdentity(competition: string, records: S24EvaluationRecord[]): LeagueIdentity {
  return {
    slug: slugifyCompetition(competition),
    competition,
    matches: records.length,
  };
}

function pickCompetition(
  centerData: IntelligenceCenterData,
  grouped: Map<string, S24EvaluationRecord[]>,
  leagueSlug?: string,
): string {
  if (!leagueSlug) {
    return centerData.competiciones.rankingsPorLiga[0]?.competition ?? Array.from(grouped.keys())[0] ?? 'Liga sin datos';
  }

  const byCenter = centerData.competiciones.rankingsPorLiga.find((item) => slugifyCompetition(item.competition) === leagueSlug);
  if (byCenter) return byCenter.competition;

  const byGrouped = Array.from(grouped.keys()).find((competition) => slugifyCompetition(competition) === leagueSlug);
  if (byGrouped) return byGrouped;

  return titleCaseFromSlug(leagueSlug);
}

function buildLeagueTeamMap(records: S24EvaluationRecord[]): LeagueTeamHighlight[] {
  const bucket = new Map<string, {
    indexTotal: number;
    trendTotal: number;
    confidenceTotal: number;
    riskTotal: number;
    appearances: number;
    consistencySeed: number[];
  }>();

  for (const record of records) {
    for (const teamName of [record.match.homeTeam, record.match.awayTeam]) {
      const current = bucket.get(teamName) ?? {
        indexTotal: 0,
        trendTotal: 0,
        confidenceTotal: 0,
        riskTotal: 0,
        appearances: 0,
        consistencySeed: [],
      };

      current.indexTotal += record.metrics.s24Index;
      current.appearances += 1;
      current.trendTotal += record.metrics.trend.toLowerCase().includes('muy positiva')
        ? 2
        : record.metrics.trend.toLowerCase().includes('positiva')
          ? 1
          : record.metrics.trend.toLowerCase().includes('muy negativa')
            ? -2
            : record.metrics.trend.toLowerCase().includes('negativa')
              ? -1
              : 0;

      const confidenceRate = record.metrics.confidence.toLowerCase().includes('muy alta')
        ? 1
        : record.metrics.confidence.toLowerCase().includes('alta')
          ? 0.88
          : record.metrics.confidence.toLowerCase().includes('media')
            ? 0.62
            : record.metrics.confidence.toLowerCase().includes('baja')
              ? 0.35
              : 0.2;

      const riskRate = record.metrics.risk.toLowerCase().includes('alto')
        ? 1
        : record.metrics.risk.toLowerCase().includes('medio')
          ? 0.55
          : 0.2;

      current.confidenceTotal += confidenceRate;
      current.riskTotal += riskRate;
      current.consistencySeed.push(record.metrics.s24Index);

      bucket.set(teamName, current);
    }
  }

  return Array.from(bucket.entries()).map(([teamName, item]) => {
    const avgIndex = item.appearances > 0 ? item.indexTotal / item.appearances : 0;
    const mean = avgIndex;
    const variance = item.consistencySeed.length > 1
      ? item.consistencySeed.reduce((acc, value) => acc + ((value - mean) ** 2), 0) / item.consistencySeed.length
      : 0;
    const stdev = Math.sqrt(variance);
    const consistencyScore = round2(Math.max(0, 100 - stdev));

    return {
      teamName,
      avgIndex: round2(avgIndex),
      trendBalance: round2(item.trendTotal / Math.max(1, item.appearances)),
      consistencyScore,
      confidenceRate: round2(item.confidenceTotal / Math.max(1, item.appearances)),
      riskRate: round2(item.riskTotal / Math.max(1, item.appearances)),
    };
  });
}

function deriveCompetitiveLevel(avgIndex: number): string {
  if (avgIndex >= 86) return 'Elite';
  if (avgIndex >= 77) return 'Alto';
  if (avgIndex >= 67) return 'Medio';
  return 'Inestable';
}

function buildSeasonComparison(records: S24EvaluationRecord[]): LeagueIntelligenceData['seasonComparison'] {
  const sorted = [...records].sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
  const split = Math.max(1, Math.floor(sorted.length / 2));
  const previous = sorted.slice(0, split);
  const current = sorted.slice(split);

  const metrics = (items: S24EvaluationRecord[]) => {
    const avgIndex = items.length > 0
      ? items.reduce((acc, item) => acc + item.metrics.s24Index, 0) / items.length
      : 0;
    const intensity = items.length > 0
      ? items.reduce((acc, item) => acc + (item.metrics.risk.toLowerCase().includes('alto') ? 1 : item.metrics.risk.toLowerCase().includes('medio') ? 0.55 : 0.2), 0) / items.length
      : 0;
    const confidenceValues = items.map((item) => item.metrics.confidence.toLowerCase().includes('alta') ? 0.9 : item.metrics.confidence.toLowerCase().includes('media') ? 0.6 : 0.3);
    const confidenceAvg = confidenceValues.length > 0
      ? confidenceValues.reduce((acc, value) => acc + value, 0) / confidenceValues.length
      : 0;
    const volatility = round2((1 - confidenceAvg) * 100);

    return {
      averageIndex: round2(avgIndex),
      intensity: round2(intensity * 100),
      volatility,
      sampleSize: items.length,
    };
  };

  const currentWindow = metrics(current);
  const previousWindow = metrics(previous);

  const delta = {
    averageIndex: round2(currentWindow.averageIndex - previousWindow.averageIndex),
    intensity: round2(currentWindow.intensity - previousWindow.intensity),
    volatility: round2(currentWindow.volatility - previousWindow.volatility),
  };

  const summary = delta.averageIndex >= 0
    ? 'La ventana actual muestra mejora competitiva respecto al tramo previo.'
    : 'La ventana actual refleja retroceso competitivo respecto al tramo previo.';

  return {
    currentWindow,
    previousWindow,
    delta,
    summary,
  };
}

function buildLeagueInsights(
  competition: string,
  teamTable: LeagueTeamHighlight[],
  state: LeagueIntelligenceData['competitiveState'],
): LeagueInsight[] {
  const top = teamTable[0];
  const growth = [...teamTable].sort((a, b) => b.trendBalance - a.trendBalance)[0];
  const decline = [...teamTable].sort((a, b) => a.trendBalance - b.trendBalance)[0];

  const insights: LeagueInsight[] = [
    {
      title: 'Estado competitivo global',
      summary: `${competition} opera en nivel ${state.competitiveLevel.toLowerCase()} con equilibrio ${state.competitiveBalance}.`,
      evidence: [
        `competitiveLevel=${state.competitiveLevel}`,
        `balance=${state.competitiveBalance}`,
        `volatility=${state.volatility}`,
      ],
    },
  ];

  if (top) {
    insights.push({
      title: 'Equipo destacado de la ventana',
      summary: `${top.teamName} lidera el ranking con S24 promedio ${top.avgIndex}.`,
      evidence: [
        `team=${top.teamName}`,
        `avgIndex=${top.avgIndex}`,
        `consistency=${top.consistencyScore}`,
      ],
    });
  }

  if (growth) {
    insights.push({
      title: 'Mayor crecimiento',
      summary: `${growth.teamName} presenta el mejor balance de tendencia (${growth.trendBalance}).`,
      evidence: [
        `team=${growth.teamName}`,
        `trend=${growth.trendBalance}`,
      ],
    });
  }

  if (decline) {
    insights.push({
      title: 'Mayor caida',
      summary: `${decline.teamName} concentra el tramo de tendencia mas negativo (${decline.trendBalance}).`,
      evidence: [
        `team=${decline.teamName}`,
        `trend=${decline.trendBalance}`,
      ],
    });
  }

  return insights.slice(0, 5);
}

function buildLeagueAlerts(
  competition: string,
  records: S24EvaluationRecord[],
  centerData: IntelligenceCenterData,
): LeagueMethodologicalAlert[] {
  const alerts: LeagueMethodologicalAlert[] = centerData.competiciones.alertas
    .filter((alert) => alert.description.toLowerCase().includes(competition.toLowerCase()) || alert.scope !== 'equipo')
    .map((alert) => ({
      level: alert.level,
      title: alert.title,
      description: alert.description,
      signal: alert.signal,
    }));

  const highRiskRate = records.filter((record) => record.metrics.risk.toLowerCase().includes('alto')).length / Math.max(1, records.length);
  if (highRiskRate >= 0.4) {
    alerts.push({
      level: 'alta',
      title: 'Riesgo competitivo elevado',
      description: `${competition} presenta alta proporcion de partidos con riesgo metodologico alto.`,
      signal: 'league-risk-high',
    });
  }

  const lowConfidenceRate = records.filter((record) => record.metrics.confidence.toLowerCase().includes('baja')).length / Math.max(1, records.length);
  if (lowConfidenceRate >= 0.3) {
    alerts.push({
      level: 'media',
      title: 'Confianza metodologica fragil',
      description: `${competition} concentra lecturas de confianza baja por encima del umbral recomendado.`,
      signal: 'league-confidence-low',
    });
  }

  const deduped = new Map<string, LeagueMethodologicalAlert>();
  for (const item of alerts) {
    const key = `${item.title}|${item.signal}`;
    if (!deduped.has(key)) deduped.set(key, item);
  }

  return Array.from(deduped.values()).slice(0, 8);
}

function toCenterTeamHighlight(item: TeamStrengthItem): LeagueTeamHighlight {
  return {
    teamName: item.teamName,
    avgIndex: item.avgIndex,
    trendBalance: item.trendBalance,
    consistencyScore: item.consistencyScore,
    confidenceRate: item.confidenceRate,
    riskRate: item.highRiskRate,
  };
}

export function buildLeagueIntelligenceHubData(records: S24EvaluationRecord[]): LeagueIntelligenceHubData {
  const grouped = new Map<string, S24EvaluationRecord[]>();
  for (const record of records) {
    const arr = grouped.get(record.match.competition) ?? [];
    arr.push(record);
    grouped.set(record.match.competition, arr);
  }

  const leagues = Array.from(grouped.entries())
    .map(([competition, items]) => toLeagueIdentity(competition, items))
    .sort((a, b) => b.matches - a.matches)
    .slice(0, 40);

  return {
    generatedAt: new Date().toISOString(),
    leagues,
    recommendedLeagueSlug: leagues[0]?.slug ?? null,
  };
}

export function buildLeagueIntelligenceData(
  records: S24EvaluationRecord[],
  centerData: IntelligenceCenterData,
  sportProfile: SportProfile,
  options: BuildLeagueIntelligenceOptions = {},
): LeagueIntelligenceData {
  const grouped = new Map<string, S24EvaluationRecord[]>();
  for (const record of records) {
    const arr = grouped.get(record.match.competition) ?? [];
    arr.push(record);
    grouped.set(record.match.competition, arr);
  }

  const competition = pickCompetition(centerData, grouped, options.leagueSlug);
  const leagueRecords = (grouped.get(competition) ?? [])
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  const teamTable = buildLeagueTeamMap(leagueRecords);
  const avgIndex = teamTable.length > 0
    ? teamTable.reduce((acc, item) => acc + item.avgIndex, 0) / teamTable.length
    : 0;

  const balance = teamTable.length > 1
    ? round2(100 - (Math.max(...teamTable.map((item) => item.avgIndex)) - Math.min(...teamTable.map((item) => item.avgIndex))))
    : 0;

  const volatility = teamTable.length > 0
    ? round2(teamTable.reduce((acc, item) => acc + item.riskRate, 0) / teamTable.length * 100)
    : 0;

  const intensity = leagueRecords.length > 0
    ? round2(leagueRecords.reduce((acc, item) => acc + (item.metrics.risk.toLowerCase().includes('alto') ? 1 : item.metrics.risk.toLowerCase().includes('medio') ? 0.55 : 0.2), 0) / leagueRecords.length * 100)
    : 0;

  const avgOffense = teamTable.length > 0
    ? round2(teamTable.reduce((acc, item) => acc + item.avgIndex * 0.55, 0) / teamTable.length)
    : 0;

  const avgDefense = teamTable.length > 0
    ? round2(teamTable.reduce((acc, item) => acc + item.consistencyScore * 0.65, 0) / teamTable.length)
    : 0;

  const rankingS24 = [...teamTable]
    .sort((a, b) => b.avgIndex - a.avgIndex)
    .slice(0, 12)
    .map((item, index) => ({
      position: index + 1,
      teamName: item.teamName,
      score: item.avgIndex,
      note: `Consistencia ${item.consistencyScore}`,
    }));

  const growth = [...teamTable].sort((a, b) => b.trendBalance - a.trendBalance).slice(0, 8);
  const decline = [...teamTable].sort((a, b) => a.trendBalance - b.trendBalance).slice(0, 8);
  const destacados = [...teamTable].sort((a, b) => b.avgIndex - a.avgIndex).slice(0, 8);

  const trends = {
    positives: teamTable.filter((item) => trendBucket(item.trendBalance) === 'positive').length,
    stable: teamTable.filter((item) => trendBucket(item.trendBalance) === 'stable').length,
    negatives: teamTable.filter((item) => trendBucket(item.trendBalance) === 'negative').length,
  };

  const alerts = buildLeagueAlerts(competition, leagueRecords, centerData);
  const seasonComparison = buildSeasonComparison(leagueRecords);

  const editorial = createEditorialEngine({ locale: 'es', seed: competition.length + teamTable.length + 5 });

  const narrative = {
    leagueState: `${competition} mantiene estado ${deriveCompetitiveLevel(avgIndex).toLowerCase()} con indice promedio ${round2(avgIndex)} y equilibrio ${balance}.`,
    evolution: `${editorial.pickTransition('continuity')} la evolucion reciente sugiere ${seasonComparison.delta.averageIndex >= 0 ? 'progreso competitivo' : 'ajuste competitivo'} frente al tramo previo.`,
    insights: `${editorial.pickTransition('closing')} ${destacados[0]?.teamName ?? 'La liga'} lidera la ventana con señales de referencia para el ecosistema.`,
  };

  const insights = buildLeagueInsights(competition, teamTable, {
    rankingS24,
    competitiveLevel: deriveCompetitiveLevel(avgIndex),
    competitiveBalance: balance,
    volatility,
    intensity,
    avgOffense,
    avgDefense,
  });

  const providerId = leagueRecords[0]?.provider.id ?? 'none';
  const confidenceLabel = leagueRecords[0]?.metrics.confidence ?? 'Media';

  return {
    generatedAt: new Date().toISOString(),
    competition,
    competitiveState: {
      rankingS24,
      competitiveLevel: deriveCompetitiveLevel(avgIndex),
      competitiveBalance: balance,
      volatility,
      intensity,
      avgOffense,
      avgDefense,
    },
    trends,
    highlightedTeams: {
      destacados,
      crecimiento: growth,
      caida: decline,
    },
    narrative,
    insights,
    alerts,
    seasonComparison,
    passport: {
      versionMotor: leagueRecords[0]?.model.motorVersion ?? 'Motor S24 v1',
      versionMetodologica: leagueRecords[0]?.model.methodologicalVersion ?? sportProfile.methodologyVersion,
      sportProfileVersion: sportProfile.version,
      sportMethodologyVersion: sportProfile.methodologyVersion,
      sportIdentifier: sportProfile.id,
      fechaCalculo: new Date().toLocaleString('es-ES'),
      proveedorDatos: providerId,
      coberturaAnalisis: confidenceLabel.toLowerCase().includes('alta') ? 'Alta' : confidenceLabel.toLowerCase().includes('media') ? 'Media' : 'Limitada',
      nivelConfianza: confidenceLabel,
      estadoInforme: 'Activo',
    },
  };
}

export { slugifyCompetition, toCenterTeamHighlight };
