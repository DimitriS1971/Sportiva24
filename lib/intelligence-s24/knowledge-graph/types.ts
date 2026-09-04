import type { ClubIdentity } from '@/lib/intelligence-s24/club-intelligence';
import type { IntelligenceCenterData } from '@/lib/intelligence-s24/intelligence-center';
import type { S24EvaluationRecord } from '@/lib/intelligence-s24/history/learningTypes';
import type { PlayerIdentity } from '@/lib/intelligence-s24/player-intelligence';

export type KnowledgeGraphNodeType =
  | 'club'
  | 'player'
  | 'coach'
  | 'competition'
  | 'match'
  | 'season'
  | 'referee'
  | 'stadium'
  | 'country'
  | 'narrative'
  | 'insight'
  | 'evidence';

export interface KnowledgeGraphNode {
  id: string;
  type: KnowledgeGraphNodeType;
  label: string;
  metadata?: Record<string, unknown>;
  source: 'provider' | 'derived' | 'synthetic';
}

export type KnowledgeGraphEdgeType =
  | 'club_competes_in_competition'
  | 'club_located_in_country'
  | 'club_uses_stadium'
  | 'player_belongs_to_club'
  | 'player_nationality_country'
  | 'coach_trains_club'
  | 'coach_nationality_country'
  | 'competition_in_country'
  | 'competition_has_season'
  | 'season_includes_match'
  | 'match_in_competition'
  | 'match_in_season'
  | 'match_has_club'
  | 'match_officiated_by_referee'
  | 'match_played_at_stadium'
  | 'stadium_located_in_country'
  | 'narrative_describes_match'
  | 'narrative_describes_competition'
  | 'insight_from_narrative'
  | 'insight_references_entity'
  | 'evidence_supports_insight'
  | 'evidence_references_entity';

export interface KnowledgeGraphEdge {
  id: string;
  from: string;
  to: string;
  type: KnowledgeGraphEdgeType;
  weight?: number;
  metadata?: Record<string, unknown>;
}

export interface KnowledgeGraphStats {
  nodeCount: number;
  edgeCount: number;
  nodesByType: Record<KnowledgeGraphNodeType, number>;
}

export interface KnowledgeGraphData {
  generatedAt: string;
  version: string;
  nodes: KnowledgeGraphNode[];
  edges: KnowledgeGraphEdge[];
  stats: KnowledgeGraphStats;
}

export interface BuildKnowledgeGraphInput {
  records: S24EvaluationRecord[];
  centerData: IntelligenceCenterData;
  clubs: ClubIdentity[];
  players: PlayerIdentity[];
  maxMatches?: number;
}

export interface BuildKnowledgeGraphOptions {
  maxMatches?: number;
}
