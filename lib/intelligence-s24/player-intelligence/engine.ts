import { createEditorialEngine } from '@/lib/intelligence-s24/editorial';
import type { S24EvaluationRecord } from '@/lib/intelligence-s24/history/learningTypes';
import type { SportProfile } from '@/lib/intelligence-s24/sports';
import type { ValidationDashboard } from '@/lib/intelligence-s24/validation';
import type { IntelligenceCenterData, TeamStrengthItem } from '@/lib/intelligence-s24/intelligence-center';
import type {
  BuildPlayerIntelligenceOptions,
  PlayerAlert,
  PlayerComparisonItem,
  PlayerIdentity,
  PlayerIndicators,
  PlayerIntelligenceData,
  PlayerIntelligenceHubData,
} from '@/lib/intelligence-s24/player-intelligence/types';

interface SyntheticPlayer extends PlayerIdentity {
  team: TeamStrengthItem;
  competition: string;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function hashToUnit(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = ((hash << 5) - hash) + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash % 1000) / 1000;
}

function trendLabel(value: number): string {
  if (value >= 1.2) return 'Muy Positiva';
  if (value >= 0.4) return 'Positiva';
  if (value <= -1.2) return 'Muy Negativa';
  if (value <= -0.4) return 'Negativa';
  return 'Estable';
}

function countryFromCompetition(competition: string): string {
  const normalized = competition.toLowerCase();
  if (normalized.includes('laliga')) return 'España';
  if (normalized.includes('premier')) return 'Inglaterra';
  if (normalized.includes('serie a')) return 'Italia';
  if (normalized.includes('bundesliga')) return 'Alemania';
  if (normalized.includes('ligue')) return 'Francia';
  if (normalized.includes('nba')) return 'Estados Unidos';
  return 'No informado por proveedor';
}

function estimatePlayerIndicators(player: SyntheticPlayer): PlayerIndicators {
  const salt = hashToUnit(player.slug);
  const playerIndex = round2(Math.max(0, Math.min(100, player.team.avgIndex + ((salt - 0.5) * 8))));
  const consistency = round2(Math.max(0, Math.min(100, player.team.consistencyScore + ((salt - 0.5) * 6))));
  const influence = round2(Math.max(0, Math.min(100, (playerIndex * 0.5) + (consistency * 0.3) + (player.team.confidenceRate * 20))));
  const risk = round2(Math.max(0, Math.min(100, (player.team.highRiskRate * 100) + ((0.5 - salt) * 10))));
  const availability = round2(Math.max(0, Math.min(100, 100 - risk * 0.5 + (player.team.confidenceRate * 15))));
  const form = round2(Math.max(0, Math.min(100, playerIndex + (player.team.trendBalance * 4))));

  return {
    playerIndex,
    trend: trendLabel(player.team.trendBalance),
    consistency,
    influence,
    risk,
    availability,
    form,
  };
}

function buildSyntheticPlayers(centerData: IntelligenceCenterData): SyntheticPlayer[] {
  const roles = ['Atacante', 'Mediocampista', 'Defensor'];

  return centerData.clubes.rankingS24
    .slice(0, 20)
    .flatMap((team, index) => {
      const competition = centerData.competiciones.rankingsPorLiga[index % Math.max(1, centerData.competiciones.rankingsPorLiga.length)]?.competition ?? 'Competicion no informada';

      return roles.map((role) => {
        const name = `${team.teamName} ${role} Referente`;
        return {
          slug: slugify(name),
          name,
          club: team.teamName,
          role,
          team,
          competition,
        };
      });
    });
}

function pickPlayer(players: SyntheticPlayer[], playerSlug?: string): SyntheticPlayer | null {
  if (players.length === 0) return null;
  if (!playerSlug) return players[0];
  return players.find((item) => item.slug === playerSlug) ?? null;
}

function buildComparison(players: SyntheticPlayer[], current: SyntheticPlayer, currentIndicators: PlayerIndicators): PlayerComparisonItem[] {
  return players
    .filter((candidate) => candidate.slug !== current.slug)
    .map((candidate) => {
      const candidateIndicators = estimatePlayerIndicators(candidate);
      const distance = Math.abs(candidateIndicators.playerIndex - currentIndicators.playerIndex)
        + Math.abs(candidateIndicators.consistency - currentIndicators.consistency) * 0.5
        + Math.abs(candidateIndicators.influence - currentIndicators.influence) * 0.5;
      const similarityScore = round2(Math.max(0, 100 - distance));

      return {
        slug: candidate.slug,
        name: candidate.name,
        club: candidate.club,
        playerIndex: candidateIndicators.playerIndex,
        similarityScore,
      };
    })
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, 6);
}

function buildHistory(records: S24EvaluationRecord[], player: SyntheticPlayer, indicators: PlayerIndicators): PlayerIntelligenceData['history'] {
  const teamRecords = records
    .filter((record) => record.match.homeTeam === player.club || record.match.awayTeam === player.club)
    .sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));

  const timeline = teamRecords.slice(-12).map((record, idx) => {
    const salt = hashToUnit(`${player.slug}:${record.id}:${idx}`);
    const value = round2(Math.max(0, Math.min(100, record.metrics.s24Index + ((salt - 0.5) * 6))));

    return {
      createdAt: record.createdAt,
      playerIndex: value,
      trend: record.metrics.trend,
    };
  });

  const avgIndex = timeline.length > 0
    ? round2(timeline.reduce((acc, point) => acc + point.playerIndex, 0) / timeline.length)
    : indicators.playerIndex;

  return {
    timeline,
    appearances: teamRecords.length,
    avgIndex,
  };
}

function buildAlerts(player: SyntheticPlayer, indicators: PlayerIndicators): PlayerAlert[] {
  const alerts: PlayerAlert[] = [];

  if (indicators.risk >= 65) {
    alerts.push({
      level: 'alta',
      title: 'Riesgo competitivo elevado',
      description: `${player.name} presenta exposicion de riesgo por encima del umbral metodologico recomendado.`,
      signal: 'player-risk-high',
    });
  }

  if (indicators.availability <= 55) {
    alerts.push({
      level: 'media',
      title: 'Disponibilidad limitada',
      description: `${player.name} registra disponibilidad restringida para escenarios de alta demanda.`,
      signal: 'player-availability-low',
    });
  }

  if (indicators.form <= 58) {
    alerts.push({
      level: 'media',
      title: 'Forma competitiva en retroceso',
      description: `${player.name} mantiene forma por debajo del tramo esperado para su perfil.`,
      signal: 'player-form-drop',
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      level: 'baja',
      title: 'Sin alertas criticas',
      description: `${player.name} opera en un rango metodologico estable para la ventana evaluada.`,
      signal: 'player-stable',
    });
  }

  return alerts;
}

export function buildPlayerIntelligenceHubData(centerData: IntelligenceCenterData): PlayerIntelligenceHubData {
  const players = buildSyntheticPlayers(centerData).slice(0, 40).map((item) => ({
    slug: item.slug,
    name: item.name,
    club: item.club,
    role: item.role,
  }));

  return {
    generatedAt: new Date().toISOString(),
    players,
    recommendedPlayerSlug: players[0]?.slug ?? null,
  };
}

export function buildPlayerIntelligenceData(
  records: S24EvaluationRecord[],
  centerData: IntelligenceCenterData,
  validationDashboard: ValidationDashboard,
  sportProfile: SportProfile,
  options: BuildPlayerIntelligenceOptions = {},
): PlayerIntelligenceData {
  const players = buildSyntheticPlayers(centerData);
  const selected = pickPlayer(players, options.playerSlug);

  const fallback: SyntheticPlayer = {
    slug: options.playerSlug ?? 'player-fallback',
    name: 'Jugador Referente',
    club: centerData.clubes.rankingS24[0]?.teamName ?? 'Club no informado',
    role: 'Mediocampista',
    team: centerData.clubes.rankingS24[0] ?? {
      teamName: 'Club no informado',
      avgIndex: 0,
      confidenceRate: 0,
      lowRiskRate: 0,
      highRiskRate: 0,
      trendBalance: 0,
      consistencyScore: 0,
      volatilityScore: 0,
      appearances: 0,
      offenseScore: 0,
      defenseScore: 0,
    },
    competition: centerData.competiciones.rankingsPorLiga[0]?.competition ?? 'Competicion no informada',
  };

  const player = selected ?? fallback;
  const indicators = estimatePlayerIndicators(player);
  const comparison = buildComparison(players, player, indicators);
  const history = buildHistory(records, player, indicators);
  const alerts = buildAlerts(player, indicators);

  const editorial = createEditorialEngine({ locale: 'es', seed: player.name.length + history.appearances + 7 });

  const narrative = {
    currentStatus: `${player.name} mantiene un Player Index de ${indicators.playerIndex} con influencia ${indicators.influence} y disponibilidad ${indicators.availability}.`,
    evolution: `${editorial.pickTransition('continuity')} la evolucion del jugador sugiere una trayectoria ${indicators.trend.toLowerCase()} en su ventana reciente.`,
    strengths: `Fortalezas principales: consistencia ${indicators.consistency}, influencia ${indicators.influence}, forma ${indicators.form}.`,
    weaknesses: `Debilidades observadas: riesgo ${indicators.risk} y disponibilidad ${indicators.availability < 60 ? 'limitada' : 'controlada'}.`,
  };

  const providerId = records[0]?.provider.id ?? 'none';
  const sportRow = validationDashboard.bySport.find((entry) => entry.sport === (records[0]?.match.sport ?? 'football'));
  const providerRow = validationDashboard.byProvider.find((entry) => entry.providerId === providerId);

  const confidenceLabel = indicators.availability >= 75
    ? 'Alta'
    : indicators.availability >= 55
      ? 'Media'
      : 'Baja';

  return {
    generatedAt: new Date().toISOString(),
    profile: {
      slug: player.slug,
      name: player.name,
      club: player.club,
      role: player.role,
      country: countryFromCompetition(player.competition),
      competition: player.competition,
      status: indicators.availability >= 65 ? 'Disponible' : 'Condicional',
    },
    indicators,
    narrative,
    comparison,
    history,
    alerts,
    passport: {
      versionMotor: records[0]?.model.motorVersion ?? 'Motor S24 v1',
      versionMetodologica: records[0]?.model.methodologicalVersion ?? sportProfile.methodologyVersion,
      sportProfileVersion: sportProfile.version,
      sportMethodologyVersion: sportProfile.methodologyVersion,
      sportIdentifier: sportProfile.id,
      fechaCalculo: new Date().toLocaleString('es-ES'),
      proveedorDatos: providerId,
      coberturaAnalisis: confidenceLabel === 'Alta' ? 'Alta' : confidenceLabel === 'Media' ? 'Media' : 'Limitada',
      nivelConfianza: confidenceLabel,
      estadoInforme: 'Activo',
    },
  };
}

export { slugify };
