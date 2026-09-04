import { createEditorialEngine } from '@/lib/intelligence-s24/editorial';
import type { IntelligenceProfile } from '@/lib/domain/intelligenceProfile';
import { buildMatchProfileFromEvaluationRecord } from '@/lib/intelligence-s24/intelligence-profile';
import type { S24EvaluationRecord } from '@/lib/intelligence-s24/history/learningTypes';
import { buildValidationReport } from '@/lib/intelligence-s24/validation';
import type {
  CompetitionIntelligenceItem,
  GlobalInsightItem,
  HighUncertaintyMatch,
  IntelligenceCenterData,
  MethodologicalAlert,
  RankingEntry,
  TeamStrengthItem,
} from '@/lib/intelligence-s24/intelligence-center/centerTypes';

function toRecordFromProfile(profile: IntelligenceProfile): S24EvaluationRecord | null {
  if (profile.identity.type !== 'match') {
    return null;
  }

  const homeTeam = (profile.identity as { homeTeam?: string }).homeTeam ?? profile.identity.name;
  const awayTeam = (profile.identity as { awayTeam?: string }).awayTeam ?? 'Rival';

  return {
    id: profile.identity.id,
    createdAt: profile.metadata.generatedAt,
    match: {
      sport: profile.identity.sport,
      slug: profile.identity.slug,
      competition: profile.identity.competition ?? 'Competicion',
      homeTeam,
      awayTeam,
      time: (profile.identity as { kickoff?: string }).kickoff ?? profile.metadata.generatedAt,
      status: (profile.identity as { status?: string }).status ?? 'N/A',
    },
    model: {
      motorVersion: profile.analyticalPassport.engineVersion,
      methodologicalVersion: profile.analyticalPassport.methodologyVersion,
      weights: {},
    },
    provider: {
      id: profile.analyticalPassport.providerId,
      usedFailover: profile.analyticalPassport.reportStatus.toLowerCase().includes('fallback'),
    },
    factorsUsed: profile.factors.map((factor) => ({
      key: factor.key,
      title: factor.label,
      contributionPoints: factor.contribution,
      maxPoints: factor.maxContribution,
      detail: factor.detail,
    })),
    narrativeUsed: {
      level: 3,
      title: profile.narrative.title,
      executiveSummary: profile.narrative.executiveSummary,
      factorsSummary: profile.narrative.fullText ?? profile.narrative.executiveSummary,
      sectionCount: 0,
    },
    insightGenerated: {
      text: profile.insights[0]?.summary ?? 'Sin insight',
      advantages: profile.insights.slice(0, 2).map((item) => item.title),
      risks: profile.alerts.slice(0, 2).map((item) => item.title),
    },
    verdict: {
      text: profile.narrative.executiveSummary,
      competitiveEdge: homeTeam,
    },
    metrics: {
      s24Index: profile.competitiveState.index.value,
      confidence: profile.competitiveState.confidence.level,
      risk: profile.competitiveState.risk.level,
      trend: profile.competitiveState.trend.direction,
    },
    intelligenceProfile: profile,
    comparison: {
      status: 'pending',
      expectedWinner: homeTeam,
      expectedIndex: profile.competitiveState.index.value,
      expectedConfidence: profile.competitiveState.confidence.level,
      expectedRisk: profile.competitiveState.risk.level,
    },
  };
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function trendScore(trend: string): number {
  const normalized = trend.toLowerCase();
  if (normalized.includes('muy positiva')) return 2;
  if (normalized.includes('positiva')) return 1;
  if (normalized.includes('estable')) return 0;
  if (normalized.includes('muy negativa')) return -2;
  if (normalized.includes('negativa')) return -1;
  return 0;
}

function confidenceScore(confidence: string): number {
  const normalized = confidence.toLowerCase();
  if (normalized.includes('muy alta')) return 1;
  if (normalized.includes('alta')) return 0.9;
  if (normalized.includes('media')) return 0.6;
  if (normalized.includes('baja')) return 0.3;
  return 0.2;
}

function lowRiskScore(risk: string): number {
  const normalized = risk.toLowerCase();
  if (normalized.includes('bajo')) return 1;
  if (normalized.includes('medio')) return 0.55;
  return 0.15;
}

function trendBucket(trendBalance: number): 'positiva' | 'estable' | 'negativa' {
  if (trendBalance >= 0.4) return 'positiva';
  if (trendBalance <= -0.4) return 'negativa';
  return 'estable';
}

function resolveWinnerTeam(record: S24EvaluationRecord): string | null {
  const winner = record.verdict.competitiveEdge;
  if (winner === record.match.homeTeam) return record.match.homeTeam;
  if (winner === record.match.awayTeam) return record.match.awayTeam;
  return null;
}

function classifyCompetitiveLevel(avgIndex: number): string {
  if (avgIndex >= 86) return 'Elite';
  if (avgIndex >= 76) return 'Alto';
  if (avgIndex >= 66) return 'Medio';
  return 'Inestable';
}

function classifyEvolution(trendBalance: number): string {
  if (trendBalance >= 0.9) return 'Aceleracion positiva';
  if (trendBalance >= 0.2) return 'Crecimiento sostenido';
  if (trendBalance <= -0.9) return 'Caida pronunciada';
  if (trendBalance <= -0.2) return 'Retroceso moderado';
  return 'Estabilidad competitiva';
}

function buildTeamTable(records: S24EvaluationRecord[]): TeamStrengthItem[] {
  const bucket = new Map<string, {
    indexTotal: number;
    confidenceTotal: number;
    lowRiskTotal: number;
    highRiskTotal: number;
    trendTotal: number;
    offenseTotal: number;
    defenseTotal: number;
    offenseSamples: number;
    defenseSamples: number;
    appearances: number;
  }>();

  for (const record of records) {
    const confidence = confidenceScore(record.metrics.confidence);
    const lowRisk = lowRiskScore(record.metrics.risk);
    const highRisk = round2(1 - lowRisk);
    const trend = trendScore(record.metrics.trend);

    const teams = [record.match.homeTeam, record.match.awayTeam];
    for (const team of teams) {
      const current = bucket.get(team) ?? {
        indexTotal: 0,
        confidenceTotal: 0,
        lowRiskTotal: 0,
        highRiskTotal: 0,
        trendTotal: 0,
        offenseTotal: 0,
        defenseTotal: 0,
        offenseSamples: 0,
        defenseSamples: 0,
        appearances: 0,
      };

      current.indexTotal += record.metrics.s24Index;
      current.confidenceTotal += confidence;
      current.lowRiskTotal += lowRisk;
      current.highRiskTotal += highRisk;
      current.trendTotal += trend;
      current.appearances += 1;

      bucket.set(team, current);
    }

    const winner = resolveWinnerTeam(record);
    if (winner) {
      const winnerBucket = bucket.get(winner);
      if (winnerBucket) {
        const offense = record.factorsUsed.find((factor) => factor.key === 'offensivePerformance');
        const defense = record.factorsUsed.find((factor) => factor.key === 'defensivePerformance');

        if (offense) {
          const offenseShare = offense.maxPoints > 0 ? offense.contributionPoints / offense.maxPoints : 0;
          winnerBucket.offenseTotal += offenseShare;
          winnerBucket.offenseSamples += 1;
        }

        if (defense) {
          const defenseShare = defense.maxPoints > 0 ? defense.contributionPoints / defense.maxPoints : 0;
          winnerBucket.defenseTotal += defenseShare;
          winnerBucket.defenseSamples += 1;
        }
      }
    }
  }

  return Array.from(bucket.entries())
    .map(([teamName, data]) => {
      const avgIndex = round2(data.indexTotal / data.appearances);
      const confidenceRate = round2(data.confidenceTotal / data.appearances);
      const lowRiskRate = round2(data.lowRiskTotal / data.appearances);
      const highRiskRate = round2(data.highRiskTotal / data.appearances);
      const trendBalance = round2(data.trendTotal / data.appearances);
      const consistencyScore = round2(((confidenceRate * 0.6) + (lowRiskRate * 0.4)) * 100);
      const volatilityScore = round2((((1 - confidenceRate) + highRiskRate) / 2) * 100 + (Math.max(0, -trendBalance) * 8));

      return {
        teamName,
        avgIndex,
        confidenceRate,
        lowRiskRate,
        highRiskRate,
        trendBalance,
        consistencyScore,
        volatilityScore,
        appearances: data.appearances,
        offenseScore: round2((data.offenseSamples > 0 ? data.offenseTotal / data.offenseSamples : 0) * 100),
        defenseScore: round2((data.defenseSamples > 0 ? data.defenseTotal / data.defenseSamples : 0) * 100),
      };
    })
    .filter((item) => item.appearances > 0);
}

function buildUncertaintyMatches(records: S24EvaluationRecord[]): HighUncertaintyMatch[] {
  return [...records]
    .sort((a, b) => {
      const scoreA = ((1 - confidenceScore(a.metrics.confidence)) * 0.55) + ((1 - lowRiskScore(a.metrics.risk)) * 0.45);
      const scoreB = ((1 - confidenceScore(b.metrics.confidence)) * 0.55) + ((1 - lowRiskScore(b.metrics.risk)) * 0.45);
      return scoreB - scoreA;
    })
    .slice(0, 8)
    .map((record) => ({
      competition: record.match.competition,
      homeTeam: record.match.homeTeam,
      awayTeam: record.match.awayTeam,
      s24Index: record.metrics.s24Index,
      confidence: record.metrics.confidence,
      risk: record.metrics.risk,
      trend: record.metrics.trend,
    }));
}

function buildMethodologicalAlerts(records: S24EvaluationRecord[], teams: TeamStrengthItem[]): MethodologicalAlert[] {
  const alerts: MethodologicalAlert[] = [];

  for (const record of records) {
    if (record.metrics.risk.toLowerCase().includes('alto')) {
      alerts.push({
        level: 'alta',
        title: 'Riesgo alto detectado',
        description: `${record.match.homeTeam} vs ${record.match.awayTeam} presenta incertidumbre elevada en el bloque metodologico.`,
        signal: 'risk=alto',
        scope: 'ecosistema',
      });
    }

    if (record.metrics.confidence.toLowerCase().includes('baja')) {
      alerts.push({
        level: 'media',
        title: 'Confianza limitada',
        description: `La lectura para ${record.match.competition} opera con confianza baja y requiere seguimiento transversal.`,
        signal: 'confidence=baja',
        scope: 'competicion',
      });
    }

    if (record.provider.usedFailover) {
      alerts.push({
        level: 'baja',
        title: 'Pipeline con failover',
        description: `Se detecto failover de proveedor en ${record.match.competition}; validar estabilidad de la fuente.`,
        signal: 'provider=failover',
        scope: 'ecosistema',
      });
    }
  }

  for (const team of teams) {
    if (team.avgIndex >= 80 && team.confidenceRate <= 0.55) {
      alerts.push({
        level: 'media',
        title: 'Equipo sobrevalorado',
        description: `${team.teamName} muestra indice alto con soporte metodologico fragil.`,
        signal: 'index-alto/confianza-baja',
        scope: 'equipo',
      });
    }

    if (team.avgIndex <= 72 && team.confidenceRate >= 0.82 && team.trendBalance >= 0.8) {
      alerts.push({
        level: 'baja',
        title: 'Equipo infravalorado',
        description: `${team.teamName} crece con consistencia y podria escalar en el ranking global.`,
        signal: 'index-medio/confianza-alta',
        scope: 'equipo',
      });
    }

    if (team.trendBalance <= -1) {
      alerts.push({
        level: 'alta',
        title: 'Caida de rendimiento',
        description: `${team.teamName} sostiene una tendencia negativa y requiere monitoreo inmediato.`,
        signal: 'trend-drop',
        scope: 'equipo',
      });
    }
  }

  const deduped = new Map<string, MethodologicalAlert>();
  for (const alert of alerts) {
    const key = `${alert.title}|${alert.description}|${alert.scope}`;
    if (!deduped.has(key)) {
      deduped.set(key, alert);
    }
  }

  return Array.from(deduped.values()).slice(0, 14);
}

function buildCompetitionTable(records: S24EvaluationRecord[], alerts: MethodologicalAlert[]): CompetitionIntelligenceItem[] {
  const bucket = new Map<string, {
    matches: number;
    indexTotal: number;
    confidenceTotal: number;
    lowRiskTotal: number;
    trendTotal: number;
    teams: Set<string>;
  }>();

  for (const record of records) {
    const current = bucket.get(record.match.competition) ?? {
      matches: 0,
      indexTotal: 0,
      confidenceTotal: 0,
      lowRiskTotal: 0,
      trendTotal: 0,
      teams: new Set<string>(),
    };

    current.matches += 1;
    current.indexTotal += record.metrics.s24Index;
    current.confidenceTotal += confidenceScore(record.metrics.confidence);
    current.lowRiskTotal += lowRiskScore(record.metrics.risk);
    current.trendTotal += trendScore(record.metrics.trend);
    current.teams.add(record.match.homeTeam);
    current.teams.add(record.match.awayTeam);

    bucket.set(record.match.competition, current);
  }

  return Array.from(bucket.entries())
    .map(([competition, data]) => {
      const avgIndex = round2(data.indexTotal / data.matches);
      const confidenceRate = round2(data.confidenceTotal / data.matches);
      const lowRiskRate = round2(data.lowRiskTotal / data.matches);
      const trendBalance = round2(data.trendTotal / data.matches);

      return {
        competition,
        matches: data.matches,
        clubs: data.teams.size,
        avgIndex,
        confidenceRate,
        riskRate: round2(1 - lowRiskRate),
        trendBalance,
        competitiveLevel: classifyCompetitiveLevel(avgIndex),
        evolution: classifyEvolution(trendBalance),
        alertCount: alerts.filter((alert) => alert.scope === 'competicion' || alert.scope === 'ecosistema').length,
      };
    })
    .sort((a, b) => b.avgIndex - a.avgIndex)
    .slice(0, 12);
}

function toRanking(items: TeamStrengthItem[], selector: (item: TeamStrengthItem) => number, note: string): RankingEntry[] {
  return items.map((item) => ({
    name: item.teamName,
    score: round2(selector(item)),
    note,
  }));
}

function buildGlobalInsights(
  records: S24EvaluationRecord[],
  teams: TeamStrengthItem[],
  competitions: CompetitionIntelligenceItem[],
): GlobalInsightItem[] {
  const editorial = createEditorialEngine({ locale: 'es', seed: records.length + 19 });
  const latestNarratives = records
    .map((record) => record.narrativeUsed.executiveSummary)
    .filter((text, index, arr) => arr.findIndex((candidate) => candidate === text) === index)
    .slice(0, 3);

  const bestCompetition = competitions[0];
  const positiveTeams = teams.filter((team) => trendBucket(team.trendBalance) === 'positiva').length;
  const stableTeam = [...teams].sort((a, b) => b.consistencyScore - a.consistencyScore)[0];
  const highVolatility = [...teams].sort((a, b) => b.volatilityScore - a.volatilityScore)[0];

  const insights: GlobalInsightItem[] = [];

  if (bestCompetition) {
    insights.push({
      title: 'Competicion con mayor equilibrio',
      summary: `${bestCompetition.competition} lidera el ecosistema con indice promedio ${bestCompetition.avgIndex} y nivel ${bestCompetition.competitiveLevel.toLowerCase()}.`,
      evidence: [
        `matches=${bestCompetition.matches}`,
        `avgIndex=${bestCompetition.avgIndex}`,
        `trend=${bestCompetition.trendBalance}`,
      ],
      source: 'motor-s24',
    });
  }

  insights.push({
    title: 'Pulso de crecimiento colectivo',
    summary: `${positiveTeams} equipos registran tendencia positiva en la ventana analizada. ${editorial.pickTemplate('methodConclusion')}`,
    evidence: [
      `teamsPositive=${positiveTeams}`,
      `teamsTotal=${teams.length}`,
    ],
    source: 'motor-s24',
  });

  if (stableTeam) {
    insights.push({
      title: 'Bloque de mayor consistencia',
      summary: `${stableTeam.teamName} sostiene la mejor consistencia metodologica (${stableTeam.consistencyScore}) con riesgo controlado.`,
      evidence: [
        `consistency=${stableTeam.consistencyScore}`,
        `confidence=${stableTeam.confidenceRate}`,
        `risk=${stableTeam.highRiskRate}`,
      ],
      source: 'motor-s24',
    });
  }

  if (highVolatility) {
    insights.push({
      title: 'Zona de mayor volatilidad',
      summary: `${highVolatility.teamName} concentra la mayor volatilidad competitiva (${highVolatility.volatilityScore}) y demanda seguimiento metodologico.`,
      evidence: [
        `volatility=${highVolatility.volatilityScore}`,
        `trend=${highVolatility.trendBalance}`,
      ],
      source: 'motor-s24',
    });
  }

  for (const summary of latestNarratives) {
    insights.push({
      title: 'Insight editorial global',
      summary,
      evidence: [
        editorial.pickTemplate('executiveClosing'),
      ],
      source: 'narrative-engine',
    });
  }

  return insights.slice(0, 8);
}

export function buildIntelligenceCenterData(records: S24EvaluationRecord[]): IntelligenceCenterData {
  const sorted = [...records].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  const teams = buildTeamTable(sorted);
  const alerts = buildMethodologicalAlerts(sorted, teams);
  const competitions = buildCompetitionTable(sorted, alerts);
  const uncertaintyMatches = buildUncertaintyMatches(sorted);
  const validation = buildValidationReport({ records: sorted });

  const rankingS24 = [...teams].sort((a, b) => b.avgIndex - a.avgIndex).slice(0, 12);
  const growthTeams = [...teams].sort((a, b) => b.trendBalance - a.trendBalance).slice(0, 8);
  const fallingTeams = [...teams].sort((a, b) => a.trendBalance - b.trendBalance).slice(0, 8);
  const solidTeams = [...teams].sort((a, b) => b.consistencyScore - a.consistencyScore).slice(0, 8);
  const riskTeams = [...teams].sort((a, b) => b.highRiskRate - a.highRiskRate).slice(0, 8);

  const trendCount = {
    positivas: teams.filter((team) => trendBucket(team.trendBalance) === 'positiva').length,
    estables: teams.filter((team) => trendBucket(team.trendBalance) === 'estable').length,
    negativas: teams.filter((team) => trendBucket(team.trendBalance) === 'negativa').length,
  };

  const topS24Index = toRanking([...rankingS24].slice(0, 8), (item) => item.avgIndex, 'Indice promedio');
  const topRating = toRanking([...rankingS24].slice(0, 8), (item) => item.consistencyScore, 'Rating sintetico');
  const mayorConfianza = toRanking([...teams].sort((a, b) => b.confidenceRate - a.confidenceRate).slice(0, 8), (item) => item.confidenceRate * 100, 'Confianza metodologica');
  const mayorRiesgo = toRanking([...teams].sort((a, b) => b.highRiskRate - a.highRiskRate).slice(0, 8), (item) => item.highRiskRate * 100, 'Exposicion de riesgo');
  const mejorTendencia = toRanking([...teams].sort((a, b) => b.trendBalance - a.trendBalance).slice(0, 8), (item) => item.trendBalance, 'Balance de tendencia');
  const mayorConsistencia = toRanking([...teams].sort((a, b) => b.consistencyScore - a.consistencyScore).slice(0, 8), (item) => item.consistencyScore, 'Consistencia global');

  const globalInsights = buildGlobalInsights(sorted, teams, competitions);
  const daySummary = `Se procesaron ${sorted.length} partidos en ${competitions.length} competiciones y ${teams.length} clubes con cobertura S24.`;

  return {
    generatedAt: new Date().toISOString(),
    sourceCount: sorted.length,
    analyzedTeams: teams.length,
    analyzedCompetitions: competitions.length,
    views: [
      { key: 'panorama', label: 'Panorama General', description: 'Fotografia diaria del ecosistema deportivo bajo metodologia S24' },
      { key: 'clubes', label: 'Clubes', description: 'Estado competitivo, evolucion y perfiles de riesgo por club' },
      { key: 'competiciones', label: 'Competiciones', description: 'Lectura comparada por liga con nivel competitivo y evolucion' },
      { key: 'tendencias', label: 'Tendencias', description: 'Patrones estructurales detectados automaticamente por S24' },
      { key: 'rankings', label: 'Rankings', description: 'Tablas dinamicas construidas solo con indicadores S24' },
      { key: 'alertas', label: 'Alertas', description: 'Senales metodologicas criticas para seguimiento operativo' },
      { key: 'insights', label: 'Insights Globales', description: 'Conclusiones editoriales generadas por Narrative Engine' },
    ],
    panoramaGeneral: {
      resumenDia: daySummary,
      partidosAnalizados: sorted.length,
      equiposMayorCrecimiento: growthTeams.slice(0, 6),
      equiposMayorCaida: fallingTeams.slice(0, 6),
      partidosMayorIncertidumbre: uncertaintyMatches.slice(0, 6),
      alertasMetodologicas: alerts.slice(0, 6),
      validationSnapshot: {
        motorGlobal: round2(validation.motorScore.global * 100),
        narrativeGlobal: round2(validation.narrativeScore.global * 100),
        insightGlobal: round2(validation.insightScore.global * 100),
        comparedSamples: validation.comparedEvaluations,
      },
    },
    clubes: {
      rankingS24,
      evolucion: {
        crecimiento: growthTeams.slice(0, 8),
        caida: fallingTeams.slice(0, 8),
      },
      tendencias: trendCount,
      equiposSolidos: solidTeams,
      equiposMayorRiesgo: riskTeams,
      equiposMayorCrecimiento: growthTeams.slice(0, 8),
    },
    competiciones: {
      rankingsPorLiga: competitions,
      alertas: alerts.filter((alert) => alert.scope !== 'equipo').slice(0, 8),
    },
    tendencias: {
      mejoresAtaques: [...teams].sort((a, b) => b.offenseScore - a.offenseScore).slice(0, 8),
      mejoresDefensas: [...teams].sort((a, b) => b.defenseScore - a.defenseScore).slice(0, 8),
      mayorConsistencia: [...teams].sort((a, b) => b.consistencyScore - a.consistencyScore).slice(0, 8),
      mayorVolatilidad: [...teams].sort((a, b) => b.volatilityScore - a.volatilityScore).slice(0, 8),
      mayorCrecimiento: growthTeams.slice(0, 8),
      peorMomentoDeportivo: fallingTeams.slice(0, 8),
    },
    rankings: {
      topS24Index,
      topRating,
      mayorConfianza,
      mayorRiesgo,
      mejorTendencia,
      mayorConsistencia,
    },
    alertas: {
      items: alerts,
    },
    insightsGlobales: {
      items: globalInsights,
    },
  };
}

export function buildIntelligenceCenterDataFromProfiles(profiles: IntelligenceProfile[]): IntelligenceCenterData {
  const records = profiles
    .map((profile) => toRecordFromProfile(profile))
    .filter((record): record is S24EvaluationRecord => Boolean(record));

  if (records.length === 0) {
    const fallbackRecords = profiles
      .filter((profile) => profile.identity.type === 'match')
      .map((profile) => ({
        id: profile.identity.id,
        createdAt: profile.metadata.generatedAt,
        match: {
          sport: profile.identity.sport,
          slug: profile.identity.slug,
          competition: profile.identity.competition ?? 'Competicion',
          homeTeam: profile.identity.name,
          awayTeam: 'Rival',
          time: profile.metadata.generatedAt,
          status: 'N/A',
        },
        model: {
          motorVersion: profile.analyticalPassport.engineVersion,
          methodologicalVersion: profile.analyticalPassport.methodologyVersion,
          weights: {},
        },
        provider: {
          id: profile.analyticalPassport.providerId,
          usedFailover: false,
        },
        factorsUsed: [],
        narrativeUsed: {
          level: 3,
          title: profile.narrative.title,
          executiveSummary: profile.narrative.executiveSummary,
          factorsSummary: profile.narrative.fullText ?? profile.narrative.executiveSummary,
          sectionCount: 0,
        },
        insightGenerated: {
          text: profile.insights[0]?.summary ?? 'Sin insight',
          advantages: [],
          risks: [],
        },
        verdict: {
          text: profile.narrative.executiveSummary,
          competitiveEdge: profile.identity.name,
        },
        metrics: {
          s24Index: profile.competitiveState.index.value,
          confidence: profile.competitiveState.confidence.level,
          risk: profile.competitiveState.risk.level,
          trend: profile.competitiveState.trend.direction,
        },
        intelligenceProfile: profile,
        comparison: {
          status: 'pending' as const,
          expectedWinner: profile.identity.name,
          expectedIndex: profile.competitiveState.index.value,
          expectedConfidence: profile.competitiveState.confidence.level,
          expectedRisk: profile.competitiveState.risk.level,
        },
      }));

    return buildIntelligenceCenterData(fallbackRecords);
  }

  return buildIntelligenceCenterData(records.map((record) => record.intelligenceProfile ? {
    ...record,
    intelligenceProfile: buildMatchProfileFromEvaluationRecord(record),
  } : record));
}
