import { editorialTitleTemplates, transitions } from '@/lib/intelligence-s24/narrativa/narrativeTemplates';
import type { S24NarrativeInput, S24NarrativeLevel, S24NarrativeTeamIndicator } from '@/lib/intelligence-s24/narrativa/narrativeTypes';
import { formatList, getTeamBySide, lowFactors, topFactors } from '@/lib/intelligence-s24/narrativa/narrativeUtils';

export interface NarrativeScenario {
  key: 'favorable' | 'balanced' | 'uncertain';
  winnerSide: 'local' | 'visitante';
  winnerTeamName: string;
  loserTeamName: string;
  indexGap: number;
  confidence: string;
  risk: string;
}

function normalize(value: string): string {
  return value.toLowerCase();
}

export function detectScenario(input: S24NarrativeInput): NarrativeScenario {
  const local = getTeamBySide(input.teams, 'local') ?? input.teams[0];
  const visitante = getTeamBySide(input.teams, 'visitante') ?? input.teams[1] ?? input.teams[0];

  const localIndex = local?.s24Index ?? 50;
  const visitanteIndex = visitante?.s24Index ?? 50;
  const winnerSide: 'local' | 'visitante' = localIndex >= visitanteIndex ? 'local' : 'visitante';
  const winnerTeam = winnerSide === 'local' ? local : visitante;
  const loserTeam = winnerSide === 'local' ? visitante : local;

  const indexGap = Math.abs(localIndex - visitanteIndex);
  const confidence = input.summary.s24Confianza;
  const risk = input.summary.s24Riesgo;

  let key: 'favorable' | 'balanced' | 'uncertain' = 'balanced';

  if (normalize(risk) === 'alto' || normalize(confidence).includes('baja')) {
    key = 'uncertain';
  } else if (indexGap >= 7 && !normalize(risk).includes('alto')) {
    key = 'favorable';
  }

  return {
    key,
    winnerSide,
    winnerTeamName: winnerTeam?.teamName ?? input.match.homeTeam,
    loserTeamName: loserTeam?.teamName ?? input.match.awayTeam,
    indexGap,
    confidence,
    risk,
  };
}

export function chooseTitle(input: S24NarrativeInput, scenario: NarrativeScenario): string {
  const pool = editorialTitleTemplates[scenario.key];
  const seed = input.match.homeTeam.length + input.match.awayTeam.length + Math.round(input.summary.s24Index);
  const template = pool[seed % pool.length];

  return template
    .replace('{team}', scenario.winnerTeamName)
    .replace('{rival}', scenario.loserTeamName)
    .replace('{side}', scenario.winnerSide === 'local' ? scenario.winnerTeamName : scenario.loserTeamName);
}

export function buildStrengthAndRiskTexts(input: S24NarrativeInput): { strengthsText: string; risksText: string } {
  const strengths = topFactors(input.factores, 2).map((factor) => factor.title.toLowerCase());
  const weaknesses = lowFactors(input.factores, 2).map((factor) => factor.title.toLowerCase());

  const strengthsText = strengths.length > 0
    ? `Las principales fortalezas emergen en ${formatList(strengths)}.`
    : 'El escenario presenta fortalezas distribuidas sin un eje dominante.';

  const risksText = weaknesses.length > 0
    ? `Las zonas de mayor sensibilidad aparecen en ${formatList(weaknesses)}.`
    : 'Los riesgos se mantienen controlados sin focos criticos evidentes.';

  return { strengthsText, risksText };
}

export function levelTargets(level: S24NarrativeLevel): { executiveMin: number; executiveMax: number; fullMin: number; fullMax: number } {
  if (level === 1) {
    return { executiveMin: 70, executiveMax: 95, fullMin: 130, fullMax: 180 };
  }

  if (level === 2) {
    return { executiveMin: 75, executiveMax: 105, fullMin: 230, fullMax: 320 };
  }

  if (level === 3) {
    return { executiveMin: 80, executiveMax: 115, fullMin: 300, fullMax: 420 };
  }

  // Nivel 4 queda preparado para futura IA premium. Se mantiene igual al nivel 3 por compatibilidad.
  return { executiveMin: 80, executiveMax: 115, fullMin: 300, fullMax: 420 };
}

export function narrativeTransitions(input: S24NarrativeInput): { opening: string; contrast: string; closing: string } {
  const seed = input.match.competition.length + input.match.status.length + input.match.time.length;

  return {
    opening: transitions.opening[seed % transitions.opening.length],
    contrast: transitions.contrast[seed % transitions.contrast.length],
    closing: transitions.closing[seed % transitions.closing.length],
  };
}

export function describeTeamDifferential(teams: S24NarrativeTeamIndicator[], winnerSide: 'local' | 'visitante'): string {
  const winner = teams.find((team) => team.side === winnerSide);
  const loser = teams.find((team) => team.side !== winnerSide);

  if (!winner || !loser) {
    return 'El diferencial competitivo se mantiene acotado dentro del marco metodologico.';
  }

  const gap = Math.abs(winner.s24Index - loser.s24Index);
  if (gap >= 10) {
    return `${winner.teamName} presenta una brecha metodologica amplia frente a ${loser.teamName}.`;
  }

  if (gap >= 5) {
    return `${winner.teamName} sostiene una ventaja moderada sobre ${loser.teamName} en el indice agregado.`;
  }

  return `La distancia entre ${winner.teamName} y ${loser.teamName} es corta, con diferencias de detalle.`;
}
