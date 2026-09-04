import type {
  BuildKnowledgeGraphInput,
  KnowledgeGraphData,
  KnowledgeGraphEdge,
  KnowledgeGraphEdgeType,
  KnowledgeGraphNode,
  KnowledgeGraphNodeType,
  KnowledgeGraphStats,
} from '@/lib/intelligence-s24/knowledge-graph/types';

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function detectCountryFromCompetition(competition: string): string {
  const text = competition.toLowerCase();

  if (text.includes('premier') || text.includes('england')) return 'Inglaterra';
  if (text.includes('liga') || text.includes('spain')) return 'Espana';
  if (text.includes('serie a') || text.includes('italy')) return 'Italia';
  if (text.includes('bundesliga') || text.includes('germany')) return 'Alemania';
  if (text.includes('ligue') || text.includes('france')) return 'Francia';
  if (text.includes('nba') || text.includes('mls')) return 'Estados Unidos';

  return 'Internacional';
}

function inferSeasonLabel(createdAt: string): string {
  const date = new Date(createdAt);
  if (Number.isNaN(date.valueOf())) {
    return 'Temporada Actual';
  }

  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  if (month >= 7) {
    return `${year}/${String(year + 1).slice(-2)}`;
  }

  return `${year - 1}/${String(year).slice(-2)}`;
}

function inferCompetitionByClub(records: BuildKnowledgeGraphInput['records'], clubName: string): string {
  const counter = new Map<string, number>();

  records.forEach((record) => {
    if (record.match.homeTeam !== clubName && record.match.awayTeam !== clubName) {
      return;
    }

    counter.set(record.match.competition, (counter.get(record.match.competition) ?? 0) + 1);
  });

  return [...counter.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Competicion no definida';
}

function createStats(nodes: KnowledgeGraphNode[], edges: KnowledgeGraphEdge[]): KnowledgeGraphStats {
  const allTypes: KnowledgeGraphNodeType[] = [
    'club',
    'player',
    'coach',
    'competition',
    'match',
    'season',
    'referee',
    'stadium',
    'country',
    'narrative',
    'insight',
    'evidence',
  ];

  const nodesByType = allTypes.reduce<Record<KnowledgeGraphNodeType, number>>((acc, type) => {
    acc[type] = 0;
    return acc;
  }, {} as Record<KnowledgeGraphNodeType, number>);

  nodes.forEach((node) => {
    nodesByType[node.type] += 1;
  });

  return {
    nodeCount: nodes.length,
    edgeCount: edges.length,
    nodesByType,
  };
}

export function buildKnowledgeGraphData(input: BuildKnowledgeGraphInput): KnowledgeGraphData {
  const records = input.maxMatches ? input.records.slice(0, input.maxMatches) : input.records;

  const nodes = new Map<string, KnowledgeGraphNode>();
  const edges = new Map<string, KnowledgeGraphEdge>();

  const addNode = (
    type: KnowledgeGraphNodeType,
    key: string,
    label: string,
    source: KnowledgeGraphNode['source'],
    metadata?: Record<string, unknown>,
  ): string => {
    const id = `${type}:${slugify(key)}`;
    if (!nodes.has(id)) {
      nodes.set(id, { id, type, label, source, metadata });
    }
    return id;
  };

  const addEdge = (
    from: string,
    to: string,
    type: KnowledgeGraphEdgeType,
    metadata?: Record<string, unknown>,
    weight?: number,
  ): void => {
    const id = `${from}|${type}|${to}`;
    if (!edges.has(id)) {
      edges.set(id, { id, from, to, type, metadata, weight });
    }
  };

  const competitionBySlug = new Map<string, string>();

  input.centerData.competiciones.rankingsPorLiga.forEach((row) => {
    const competitionId = addNode('competition', row.competition, row.competition, 'provider', {
      matches: row.matches,
      clubs: row.clubs,
      avgIndex: row.avgIndex,
      confidenceRate: row.confidenceRate,
      riskRate: row.riskRate,
      trendBalance: row.trendBalance,
      competitiveLevel: row.competitiveLevel,
      evolution: row.evolution,
      alertCount: row.alertCount,
    });

    const countryName = detectCountryFromCompetition(row.competition);
    const countryId = addNode('country', countryName, countryName, 'derived');
    addEdge(competitionId, countryId, 'competition_in_country');

    competitionBySlug.set(slugify(row.competition), competitionId);
  });

  input.clubs.forEach((club) => {
    const competition = inferCompetitionByClub(records, club.name);
    const competitionId = competitionBySlug.get(slugify(competition))
      ?? addNode('competition', competition, competition, 'derived');

    const countryName = detectCountryFromCompetition(competition);
    const countryId = addNode('country', countryName, countryName, 'derived');

    const clubId = addNode('club', club.slug, club.name, 'provider', {
      crestUrl: club.crestUrl,
      slug: club.slug,
    });

    addEdge(clubId, competitionId, 'club_competes_in_competition');
    addEdge(clubId, countryId, 'club_located_in_country');

    const stadiumId = addNode('stadium', `stadium-${club.slug}`, `Estadio de ${club.name}`, 'synthetic');
    const coachId = addNode('coach', `coach-${club.slug}`, `Entrenador de ${club.name}`, 'synthetic');

    addEdge(clubId, stadiumId, 'club_uses_stadium');
    addEdge(stadiumId, countryId, 'stadium_located_in_country');
    addEdge(coachId, clubId, 'coach_trains_club');
    addEdge(coachId, countryId, 'coach_nationality_country');
  });

  input.players.forEach((player) => {
    const playerId = addNode('player', player.slug, player.name, 'derived', {
      role: player.role,
      club: player.club,
    });

    const clubId = addNode('club', player.club, player.club, 'derived');
    addEdge(playerId, clubId, 'player_belongs_to_club');

    const competition = inferCompetitionByClub(records, player.club);
    const countryName = detectCountryFromCompetition(competition);
    const countryId = addNode('country', countryName, countryName, 'derived');
    addEdge(playerId, countryId, 'player_nationality_country');
  });

  records.forEach((record) => {
    const competitionId = addNode('competition', record.match.competition, record.match.competition, 'provider');

    const seasonLabel = inferSeasonLabel(record.createdAt);
    const seasonKey = `${record.match.competition}:${seasonLabel}`;
    const seasonId = addNode('season', seasonKey, seasonLabel, 'derived', {
      competition: record.match.competition,
    });

    const matchId = addNode('match', record.match.slug, `${record.match.homeTeam} vs ${record.match.awayTeam}`, 'provider', {
      competition: record.match.competition,
      status: record.match.status,
      time: record.match.time,
      s24Index: record.metrics.s24Index,
      confidence: record.metrics.confidence,
      risk: record.metrics.risk,
      trend: record.metrics.trend,
    });

    addEdge(competitionId, seasonId, 'competition_has_season');
    addEdge(seasonId, matchId, 'season_includes_match');
    addEdge(matchId, competitionId, 'match_in_competition');
    addEdge(matchId, seasonId, 'match_in_season');

    const homeClubId = addNode('club', record.match.homeTeam, record.match.homeTeam, 'provider');
    const awayClubId = addNode('club', record.match.awayTeam, record.match.awayTeam, 'provider');
    addEdge(matchId, homeClubId, 'match_has_club', { side: 'home' });
    addEdge(matchId, awayClubId, 'match_has_club', { side: 'away' });

    const refereeId = addNode('referee', `ref-${record.match.slug}`, `Arbitro ${record.match.slug}`, 'synthetic');
    addEdge(matchId, refereeId, 'match_officiated_by_referee');

    const homeCompetition = inferCompetitionByClub(records, record.match.homeTeam);
    const homeCountry = detectCountryFromCompetition(homeCompetition);
    const homeCountryId = addNode('country', homeCountry, homeCountry, 'derived');

    const stadiumId = addNode('stadium', `stadium-${slugify(record.match.homeTeam)}`, `Estadio de ${record.match.homeTeam}`, 'synthetic');
    addEdge(matchId, stadiumId, 'match_played_at_stadium');
    addEdge(stadiumId, homeCountryId, 'stadium_located_in_country');

    const narrativeId = addNode('narrative', `narrative-${record.id}`, record.narrativeUsed.title, 'provider', {
      level: record.narrativeUsed.level,
      executiveSummary: record.narrativeUsed.executiveSummary,
      factorsSummary: record.narrativeUsed.factorsSummary,
      sectionCount: record.narrativeUsed.sectionCount,
    });

    addEdge(narrativeId, matchId, 'narrative_describes_match');
    addEdge(narrativeId, competitionId, 'narrative_describes_competition');

    const insightId = addNode('insight', `insight-${record.id}`, `Insight ${record.match.slug}`, 'provider', {
      text: record.insightGenerated.text,
      source: 'motor-s24',
    });

    addEdge(insightId, narrativeId, 'insight_from_narrative');
    addEdge(insightId, matchId, 'insight_references_entity');
    addEdge(insightId, homeClubId, 'insight_references_entity');
    addEdge(insightId, awayClubId, 'insight_references_entity');

    record.factorsUsed.forEach((factor) => {
      const evidenceId = addNode('evidence', `ev-${record.id}-${factor.key}`, factor.title, 'provider', {
        key: factor.key,
        detail: factor.detail,
        contributionPoints: factor.contributionPoints,
        maxPoints: factor.maxPoints,
      });

      addEdge(evidenceId, insightId, 'evidence_supports_insight', {
        contributionPoints: factor.contributionPoints,
      });
      addEdge(evidenceId, matchId, 'evidence_references_entity', { entityType: 'match' });
    });
  });

  input.centerData.insightsGlobales.items.forEach((item, index) => {
    const narrativeId = addNode('narrative', `global-narrative-${index}`, item.title, 'derived', {
      summary: item.summary,
      source: item.source,
    });

    const insightId = addNode('insight', `global-insight-${index}`, item.title, 'provider', {
      summary: item.summary,
      source: item.source,
    });

    addEdge(insightId, narrativeId, 'insight_from_narrative');

    item.evidence.forEach((evidenceLine, evidenceIndex) => {
      const evidenceId = addNode('evidence', `global-evidence-${index}-${evidenceIndex}`, `Evidencia ${index + 1}.${evidenceIndex + 1}`, 'provider', {
        text: evidenceLine,
      });

      addEdge(evidenceId, insightId, 'evidence_supports_insight');
    });
  });

  const nodeList = [...nodes.values()];
  const edgeList = [...edges.values()];

  return {
    generatedAt: new Date().toISOString(),
    version: 'knowledge-graph-s24-v1',
    nodes: nodeList,
    edges: edgeList,
    stats: createStats(nodeList, edgeList),
  };
}
