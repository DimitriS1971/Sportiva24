import { buildS24MatchInterpretation } from '@/lib/intelligence-s24/interpretacionPartido';
import type { MatchIntelligenceProfile } from '@/lib/domain/intelligenceProfile';
import { s24HistoryEngine } from '@/lib/intelligence-s24/history/historyEngine';
import { classifyS24Index } from '@/lib/intelligence-s24/metodologiaOficial';
import { motorDeInteligenciaS24 } from '@/lib/intelligence-s24/motorDeInteligenciaS24';
import { generateS24NarrativeFromProfile, type S24NarrativeOutput } from '@/lib/intelligence-s24/narrativa';
import type { RealMatchContext } from '@/lib/intelligence-s24/realMatchContext';
import { sportResolver } from '@/lib/intelligence-s24/sports';
import type { SportProfile } from '@/lib/intelligence-s24/sports';
import type { S24FactorBreakdown, S24RiskLevel, S24Trend } from '@/lib/intelligence-s24/types';
import type { Match } from '@/lib/data/types/domain';

export interface InformeS24TeamIndicators {
  side: 'local' | 'visitante';
  teamName: string;
  s24Index: number;
  s24Rating: string;
  s24Confianza: string;
  s24Riesgo: S24RiskLevel;
  s24Tendencia: S24Trend;
}

export interface InformeS24IndicatorSummary {
  s24Index: number;
  s24Rating: string;
  s24Confianza: string;
  s24Riesgo: S24RiskLevel;
  s24Tendencia: S24Trend;
}

export interface InformeS24FactorContribution {
  key: string;
  title: string;
  sourceIndicator: string;
  contributionPoints: number;
  maxPoints: number;
  detail: string;
}

export interface InformeS24Pasaporte {
  versionMotor: string;
  versionMetodologica: string;
  sportProfileVersion: string;
  sportMethodologyVersion: string;
  sportIdentifier: string;
  fechaCalculo: string;
  proveedorDatos: string;
  coberturaAnalisis: string;
  nivelConfianza: string;
  estadoInforme: string;
}

export interface InformeS24V1 {
  match: {
    slug: string;
    competition: string;
    homeTeam: string;
    awayTeam: string;
    time: string;
    status: Match['status'];
  };
  indicadores: {
    resumen: InformeS24IndicatorSummary;
    equipos: InformeS24TeamIndicators[];
  };
  insight: {
    texto: string;
    ventajas: string[];
    riesgos: string[];
  };
  veredicto: {
    texto: string;
    ventajaCompetitiva: string;
  };
  narrativa: S24NarrativeOutput;
  factores: InformeS24FactorContribution[];
  arbolEvidencias: {
    cadena: string[];
    datos: string[];
    narrativaLinks: Array<{
      paragraphId: string;
      evidenceRefs: string[];
    }>;
  };
  pasaporte: InformeS24Pasaporte;
  profile: MatchIntelligenceProfile;
  realContext: RealMatchContext | null;
}

export interface BuildInformeS24Params {
  match: Match;
  providerId: string;
  usedFailover: boolean;
  generatedAtIso?: string;
  realContext?: RealMatchContext | null;
}

function clampScore(value: number): number {
  if (value < 0) return 0;
  if (value > 100) return 100;
  return value;
}

function formScore(matches: RealMatchContext['recentForm']['home']): number | undefined {
  if (matches.length === 0) return undefined;

  const points = matches.reduce((total, match) => total + (match.result === 'V' ? 3 : match.result === 'E' ? 1 : 0), 0);
  return clampScore((points / (matches.length * 3)) * 100);
}

function standingScore(context: RealMatchContext | null, side: 'local' | 'visitante'): number | undefined {
  if (!context || context.standings.length !== 2) return undefined;

  const teamName = side === 'local' ? context.standings[0].teamName : context.standings[1].teamName;
  const team = context.standings.find((standing) => standing.teamName === teamName);
  const opponent = context.standings.find((standing) => standing.teamName !== teamName);
  if (!team || !opponent) return undefined;

  return clampScore(Math.max(25, Math.min(75, 50 + (opponent.position - team.position) * 3)));
}

function headToHeadScore(context: RealMatchContext | null, side: 'local' | 'visitante'): number | undefined {
  if (!context || context.headToHead.matches.length === 0) return undefined;

  const wins = side === 'local' ? context.headToHead.homeWins : context.headToHead.awayWins;
  const points = wins * 3 + context.headToHead.draws;
  return clampScore((points / (context.headToHead.matches.length * 3)) * 100);
}

function deriveTeamInput(
  match: Match,
  side: 'local' | 'visitante',
  profile: SportProfile,
  context: RealMatchContext | null,
) {
  const team = side === 'local' ? match.homeTeam : match.awayTeam;
  const recentMatches = context?.recentForm[side === 'local' ? 'home' : 'away'] ?? [];
  const computedFactorPool: Partial<Record<string, number>> = {
    recentForm: formScore(recentMatches),
    squadQuality: standingScore(context, side),
    matchContext: context ? side === 'local' ? 55 : 45 : undefined,
    headToHead: headToHeadScore(context, side),
  };

  const profileFactors = profile.availableFactors.reduce<Partial<Record<string, number>>>((acc, factorKey) => {
    const score = computedFactorPool[factorKey];
    if (score !== undefined) {
      acc[factorKey] = score;
    }
    return acc;
  }, {});

  const availableSignals = Object.values(computedFactorPool).filter((score) => score !== undefined).length;
  const dataCoverage = context ? Math.min(75, 25 + availableSignals * 15) : 20;

  return {
    sport: match.sport,
    teamId: team.id,
    teamName: team.name,
    factors: profileFactors,
    signals: {
      dataCoverage,
      volatility: recentMatches.length >= 5 ? 45 : 65,
      trendSignal: computedFactorPool.recentForm === undefined ? undefined : computedFactorPool.recentForm - 50,
    },
    metadata: {
      sampleSize: recentMatches.length,
      lastUpdatedAt: new Date().toISOString(),
    },
  };
}

function buildCoverage(confidenceScore: number, usedFailover: boolean): string {
  if (usedFailover) {
    return confidenceScore >= 75 ? 'Media-Alta' : 'Media';
  }

  if (confidenceScore >= 80) return 'Alta';
  if (confidenceScore >= 60) return 'Media';
  return 'Limitada';
}

function findByKey(breakdown: S24FactorBreakdown[], key: string): S24FactorBreakdown {
  return breakdown.find((item) => item.key === key) ?? {
    key: key as never,
    label: key,
    rawScore: 0,
    weight: 0,
    obtainedPoints: 0,
    maxPoints: 0,
    display: '0 / 0',
  };
}

function toHeadline(label: string): string {
  const cleaned = label.trim();
  return cleaned.length > 0 ? cleaned : 'Factor';
}

function buildRequiredFactorContributions(
  winnerBreakdown: S24FactorBreakdown[],
  profile: SportProfile,
): InformeS24FactorContribution[] {
  const orderedKeys = profile.interpretationConfiguration.factorDisplayOrder.length > 0
    ? profile.interpretationConfiguration.factorDisplayOrder
    : profile.availableFactors;

  return orderedKeys.map((key) => {
    const metric = findByKey(winnerBreakdown, key);
    const title = profile.interpretationConfiguration.factorAdvantageLabels[key] ?? toHeadline(metric.label);
    const detail = profile.interpretationConfiguration.factorDetails[key] ?? 'Factor evaluado dentro del perfil deportivo activo.';

    return {
      key,
      title,
      sourceIndicator: metric.label,
      contributionPoints: metric.obtainedPoints,
      maxPoints: metric.maxPoints,
      detail,
    };
  });
}

function buildMatchIntelligenceProfile(params: {
  generatedAtIso: string;
  match: Match;
  winnerOutput: ReturnType<typeof motorDeInteligenciaS24.calculate>;
  summaryRating: string;
  interpretation: ReturnType<typeof buildS24MatchInterpretation>;
  factors: InformeS24FactorContribution[];
  providerId: string;
  usedFailover: boolean;
  profile: SportProfile;
  contextSummary?: string;
}): MatchIntelligenceProfile {
  return {
    identity: {
      id: params.match.slug,
      slug: params.match.slug,
      type: 'match',
      name: `${params.match.homeTeam.name} vs ${params.match.awayTeam.name}`,
      sport: params.match.sport,
      competition: params.match.competition,
      season: params.generatedAtIso.slice(0, 4),
      homeTeam: params.match.homeTeam.name,
      awayTeam: params.match.awayTeam.name,
      status: params.match.status,
      kickoff: params.match.time,
    },
    competitiveState: {
      index: { value: params.winnerOutput.s24Index, scaleMax: 100 },
      confidence: { level: params.interpretation.confidence.level, score: params.interpretation.confidence.score },
      risk: { level: params.interpretation.risk.level },
      trend: { direction: params.winnerOutput.trend },
      ratingLabel: params.summaryRating,
    },
    indicators: [
      { key: 's24-index', label: 'S24 Index', value: params.winnerOutput.s24Index },
      { key: 'confidence', label: 'Confianza', value: params.interpretation.confidence.level },
      { key: 'risk', label: 'Riesgo', value: params.interpretation.risk.level },
      { key: 'trend', label: 'Tendencia', value: params.winnerOutput.trend },
    ],
    factors: params.factors.map((factor) => ({
      key: factor.key,
      label: factor.title,
      contribution: factor.contributionPoints,
      maxContribution: factor.maxPoints,
      detail: factor.detail,
    })),
    narrative: {
      title: 'Informe S24',
      executiveSummary: params.interpretation.conclusion,
      fullText: params.interpretation.veredicto,
    },
    insights: [
      { title: 'Insight principal', summary: params.contextSummary ?? params.interpretation.conclusion, source: 'motor-s24' },
    ],
    alerts: params.interpretation.risk.level === 'Alto'
      ? [{ level: 'alta', title: 'Riesgo alto', description: 'Escenario de alta incertidumbre metodologica.', signal: 'risk=alto' }]
      : [],
    history: [{ createdAt: params.generatedAtIso, index: params.winnerOutput.s24Index, trend: params.winnerOutput.trend }],
    evidence: params.factors.map((factor) => ({
      source: 'factor-engine',
      key: factor.key,
      value: `${factor.contributionPoints}/${factor.maxPoints}`,
    })),
    validation: {
      motorGlobal: 0,
      narrativeGlobal: 0,
      insightGlobal: 0,
    },
    analyticalPassport: {
      engineVersion: 'Motor S24 v1',
      methodologyVersion: params.profile.methodologyVersion,
      sportProfileVersion: params.profile.version,
      sportMethodologyVersion: params.profile.methodologyVersion,
      providerId: params.providerId,
      confidenceLevel: params.interpretation.confidence.level,
      reportStatus: params.usedFailover ? 'Operativo con fallback controlado' : 'Operativo completo',
    },
    metadata: {
      generatedAt: params.generatedAtIso,
      sourceModule: 'informe-s24-v1',
      tags: ['match', 'informe', 's24'],
    },
    version: {
      contract: { value: 'intelligence-profile-v1', releasedAt: params.generatedAtIso },
      profile: { value: 'match-intelligence-profile-v1', releasedAt: params.generatedAtIso },
    },
  };
}

export function buildInformeS24V1(params: BuildInformeS24Params): InformeS24V1 {
  const generatedAtIso = params.generatedAtIso ?? new Date().toISOString();
  const profile = sportResolver.resolve({
    sportId: params.match.sport,
    providerId: params.providerId,
    competition: params.match.competition,
    slug: params.match.slug,
  });

  const motorVersion = 'Motor S24 v1';
  const methodologicalVersion = profile.methodologyVersion;

  const localInput = deriveTeamInput(params.match, 'local', profile, params.realContext ?? null);
  const visitanteInput = deriveTeamInput(params.match, 'visitante', profile, params.realContext ?? null);

  const localOutput = motorDeInteligenciaS24.calculate(localInput, {
    profile,
    providerId: params.providerId,
    competition: params.match.competition,
    slug: params.match.slug,
  });
  const visitanteOutput = motorDeInteligenciaS24.calculate(visitanteInput, {
    profile,
    providerId: params.providerId,
    competition: params.match.competition,
    slug: params.match.slug,
  });

  const interpretation = buildS24MatchInterpretation({
    matchLabel: `${params.match.homeTeam.name} vs ${params.match.awayTeam.name}`,
    kickoffLabel: params.match.time,
    local: {
      teamName: params.match.homeTeam.name,
      output: localOutput,
    },
    visitante: {
      teamName: params.match.awayTeam.name,
      output: visitanteOutput,
    },
    interpretationConfiguration: {
      factorAdvantageLabels: profile.interpretationConfiguration.factorAdvantageLabels,
    },
  });

  const winnerSide = interpretation.s24Index.ventajaCompetitiva === params.match.awayTeam.name ? 'visitante' : 'local';
  const winnerOutput = winnerSide === 'local' ? localOutput : visitanteOutput;
  const winnerTeamName = winnerSide === 'local' ? params.match.homeTeam.name : params.match.awayTeam.name;

  const summaryIndex = winnerOutput.s24Index;
  const summaryRating = classifyS24Index(summaryIndex).label;

  const confidenceScore = interpretation.confidence.score;
  const fallbackCount = localOutput.diagnostics.fallbackFactorCount + visitanteOutput.diagnostics.fallbackFactorCount;

  const factors = buildRequiredFactorContributions(winnerOutput.factorBreakdown, profile);
  const contextualInsight = params.realContext?.summary ?? interpretation.conclusion;

  const profileContract = buildMatchIntelligenceProfile({
    generatedAtIso,
    match: params.match,
    winnerOutput,
    summaryRating,
    interpretation,
    factors,
    providerId: params.providerId,
    usedFailover: params.usedFailover,
    profile,
    contextSummary: contextualInsight,
  });

  const narrativa = generateS24NarrativeFromProfile(profileContract, {
    level: 3,
  });

  s24HistoryEngine.registerEvaluation({
    createdAt: generatedAtIso,
    match: {
      sport: params.match.sport,
      slug: params.match.slug,
      competition: params.match.competition,
      homeTeam: params.match.homeTeam.name,
      awayTeam: params.match.awayTeam.name,
      time: params.match.time,
      status: params.match.status,
    },
    model: {
      motorVersion,
      methodologicalVersion,
      weights: profile.factorWeights,
    },
    provider: {
      id: params.providerId,
      usedFailover: params.usedFailover,
    },
    factorsUsed: factors,
    narrativeUsed: {
      level: narrativa.level,
      title: narrativa.editorialTitle,
      executiveSummary: narrativa.executiveSummary,
      factorsSummary: narrativa.factorsSummary,
      sectionCount: narrativa.sections.length,
    },
    insightGenerated: {
      text: interpretation.conclusion,
      advantages: interpretation.ventajas,
      risks: interpretation.riesgos,
    },
    verdict: {
      text: interpretation.veredicto,
      competitiveEdge: interpretation.s24Index.ventajaCompetitiva,
    },
    metrics: {
      s24Index: summaryIndex,
      confidence: interpretation.confidence.level,
      risk: interpretation.risk.level,
      trend: winnerOutput.trend,
    },
    intelligenceProfile: profileContract,
  });

  return {
    match: {
      slug: params.match.slug,
      competition: params.match.competition,
      homeTeam: params.match.homeTeam.name,
      awayTeam: params.match.awayTeam.name,
      time: params.match.time,
      status: params.match.status,
    },
    indicadores: {
      resumen: {
        s24Index: summaryIndex,
        s24Rating: summaryRating,
        s24Confianza: interpretation.confidence.level,
        s24Riesgo: interpretation.risk.level,
        s24Tendencia: winnerOutput.trend,
      },
      equipos: [
        {
          side: 'local',
          teamName: params.match.homeTeam.name,
          s24Index: localOutput.s24Index,
          s24Rating: classifyS24Index(localOutput.s24Index).label,
          s24Confianza: localOutput.confidence,
          s24Riesgo: localOutput.risk,
          s24Tendencia: localOutput.trend,
        },
        {
          side: 'visitante',
          teamName: params.match.awayTeam.name,
          s24Index: visitanteOutput.s24Index,
          s24Rating: classifyS24Index(visitanteOutput.s24Index).label,
          s24Confianza: visitanteOutput.confidence,
          s24Riesgo: visitanteOutput.risk,
          s24Tendencia: visitanteOutput.trend,
        },
      ],
    },
    insight: {
      texto: contextualInsight,
      ventajas: interpretation.ventajas,
      riesgos: interpretation.riesgos,
    },
    veredicto: {
      texto: interpretation.veredicto,
      ventajaCompetitiva: interpretation.s24Index.ventajaCompetitiva,
    },
    narrativa,
    factores: factors,
    arbolEvidencias: {
      cadena: ['Veredicto', 'Insight', 'Indicadores', 'Factores', 'Datos'],
      datos: [
        `Proveedor: ${params.providerId}`,
        `Equipo con ventaja: ${winnerTeamName}`,
        `Fallback de providers: ${params.usedFailover ? 'Si' : 'No'}`,
        `Narrativa: ${narrativa.stats.executiveWords} palabras resumen / ${narrativa.stats.fullAnalysisWords} palabras analisis`,
      ],
      narrativaLinks: narrativa.evidenceLinks,
    },
    pasaporte: {
      versionMotor: motorVersion,
      versionMetodologica: methodologicalVersion,
      sportProfileVersion: profile.version,
      sportMethodologyVersion: profile.methodologyVersion,
      sportIdentifier: profile.id,
      fechaCalculo: generatedAtIso,
      proveedorDatos: params.providerId,
      coberturaAnalisis: buildCoverage(confidenceScore, params.usedFailover),
      nivelConfianza: interpretation.confidence.level,
      estadoInforme: fallbackCount > 0 || params.usedFailover ? 'Operativo con fallback controlado' : 'Operativo completo',
    },
    profile: profileContract,
    realContext: params.realContext ?? null,
  };
}
