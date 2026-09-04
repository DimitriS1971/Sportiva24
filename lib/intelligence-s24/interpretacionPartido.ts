import { classifyConfidence, classifyRisk } from '@/lib/intelligence-s24/metodologiaOficial';
import type { S24FactorBreakdown, S24MotorOutput, S24Trend } from '@/lib/intelligence-s24/types';

type TeamSide = 'local' | 'visitante';

export interface S24TeamSnapshot {
  teamName: string;
  output: S24MotorOutput;
}

export interface S24MatchInterpretationInput {
  matchLabel: string;
  kickoffLabel: string;
  local: S24TeamSnapshot;
  visitante: S24TeamSnapshot;
  riskNotes?: string[];
  conclusion?: string;
  interpretationConfiguration?: {
    factorAdvantageLabels?: Record<string, string>;
  };
}

export interface S24MatchInterpretation {
  matchLabel: string;
  kickoffLabel: string;
  s24Index: {
    local: number;
    visitante: number;
    ventajaCompetitiva: string;
  };
  veredicto: string;
  confidence: {
    level: ReturnType<typeof classifyConfidence>;
    score: number;
  };
  risk: {
    level: ReturnType<typeof classifyRisk>;
  };
  tendencias: Array<{
    teamName: string;
    trend: S24Trend;
  }>;
  desglose: S24FactorBreakdown[];
  ventajas: string[];
  riesgos: string[];
  conclusion: string;
}

const FACTOR_ADVANTAGE_LABELS: Record<string, string> = {
  recentForm: 'Mejor forma',
  offensivePerformance: 'Mayor potencia ofensiva',
  defensivePerformance: 'Mejor solidez defensiva',
  squadQuality: 'Plantilla mas competitiva',
  squadAvailability: 'Mayor disponibilidad',
  fatigue: 'Menor fatiga',
  matchContext: 'Contexto mas favorable',
  headToHead: 'Mejor historial reciente',
};

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function getSideName(input: S24MatchInterpretationInput, side: TeamSide): string {
  return side === 'local' ? input.local.teamName : input.visitante.teamName;
}

function getAdvantagedSide(input: S24MatchInterpretationInput): TeamSide | null {
  const localIndex = input.local.output.s24Index;
  const visitanteIndex = input.visitante.output.s24Index;

  if (localIndex === visitanteIndex) {
    return null;
  }

  return localIndex > visitanteIndex ? 'local' : 'visitante';
}

function buildAdvantages(
  input: S24MatchInterpretationInput,
  advantaged: TeamSide | null,
  factorLabels: Record<string, string>,
): string[] {
  if (!advantaged) {
    return ['Paridad competitiva'];
  }

  const winner = advantaged === 'local' ? input.local.output : input.visitante.output;
  const loser = advantaged === 'local' ? input.visitante.output : input.local.output;

  const diffs = winner.factorBreakdown
    .map((factor) => {
      const opposite = loser.factorBreakdown.find((item) => item.key === factor.key);
      const oppositePoints = opposite?.obtainedPoints ?? 0;
      return {
        key: factor.key,
        delta: round(factor.obtainedPoints - oppositePoints),
      };
    })
    .filter((item) => item.delta > 0)
    .sort((a, b) => b.delta - a.delta);

  const top = diffs.slice(0, 3).map((item) => factorLabels[item.key] ?? `Mejor ${item.key}`);

  const confidenceScore = round(
    (input.local.output.diagnostics.confidenceScore + input.visitante.output.diagnostics.confidenceScore) / 2,
  );

  if (top.length < 3 && confidenceScore >= 75) {
    top.push('Mayor estabilidad');
  }

  return top.length > 0 ? top : ['Mayor estabilidad'];
}

function buildVerdict(input: S24MatchInterpretationInput, advantaged: TeamSide | null, advantages: string[]): string {
  if (!advantaged) {
    return `Partido equilibrado: ${input.local.teamName} y ${input.visitante.teamName} llegan con indicadores muy cercanos.`;
  }

  const teamName = getSideName(input, advantaged);
  const reasonText = advantages.slice(0, 2).join(' y ').toLowerCase();
  return `${teamName} llega con ventaja competitiva gracias a ${reasonText}.`;
}

function buildRiesgos(input: S24MatchInterpretationInput): string[] {
  if (input.riskNotes && input.riskNotes.length > 0) {
    return input.riskNotes;
  }

  const riskScore = Math.max(input.local.output.diagnostics.riskScore, input.visitante.output.diagnostics.riskScore);
  const confidenceScore = Math.min(
    input.local.output.diagnostics.confidenceScore,
    input.visitante.output.diagnostics.confidenceScore,
  );

  const generated: string[] = [];

  if (riskScore >= 67) {
    generated.push('Alta incertidumbre por variabilidad reciente.');
  } else if (riskScore >= 34) {
    generated.push('Escenario con incertidumbre moderada por senales mixtas.');
  } else {
    generated.push('Riesgo controlado segun estabilidad de datos y contexto.');
  }

  if (confidenceScore < 55) {
    generated.push('Cobertura de datos limitada para una lectura robusta.');
  }

  return generated;
}

export function buildS24MatchInterpretation(input: S24MatchInterpretationInput): S24MatchInterpretation {
  const advantaged = getAdvantagedSide(input);
  const factorLabels = input.interpretationConfiguration?.factorAdvantageLabels ?? FACTOR_ADVANTAGE_LABELS;
  const advantages = buildAdvantages(input, advantaged, factorLabels);
  const verdict = buildVerdict(input, advantaged, advantages);

  const confidenceScore = round(
    (input.local.output.diagnostics.confidenceScore + input.visitante.output.diagnostics.confidenceScore) / 2,
  );
  const riskScore = round(Math.max(input.local.output.diagnostics.riskScore, input.visitante.output.diagnostics.riskScore));

  const winnerBreakdown = advantaged === 'visitante'
    ? input.visitante.output.factorBreakdown
    : input.local.output.factorBreakdown;

  return {
    matchLabel: input.matchLabel,
    kickoffLabel: input.kickoffLabel,
    s24Index: {
      local: input.local.output.s24Index,
      visitante: input.visitante.output.s24Index,
      ventajaCompetitiva: advantaged ? getSideName(input, advantaged) : 'Sin ventaja clara',
    },
    veredicto: verdict,
    confidence: {
      level: classifyConfidence(confidenceScore),
      score: confidenceScore,
    },
    risk: {
      level: classifyRisk(riskScore),
    },
    tendencias: [
      { teamName: input.local.teamName, trend: input.local.output.trend },
      { teamName: input.visitante.teamName, trend: input.visitante.output.trend },
    ],
    desglose: winnerBreakdown,
    ventajas: advantages,
    riesgos: buildRiesgos(input),
    conclusion:
      input.conclusion ?? 'La lectura final combina calidad competitiva, estabilidad y nivel de incertidumbre del escenario.',
  };
}
