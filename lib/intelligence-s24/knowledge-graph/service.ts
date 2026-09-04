import { getClubIntelligenceHubData } from '@/lib/intelligence-s24/club-intelligence';
import { s24HistoryEngine } from '@/lib/intelligence-s24/history/historyEngine';
import { getIntelligenceCenterData } from '@/lib/intelligence-s24/intelligence-center';
import { buildKnowledgeGraphData } from '@/lib/intelligence-s24/knowledge-graph/engine';
import type { BuildKnowledgeGraphOptions, KnowledgeGraphData } from '@/lib/intelligence-s24/knowledge-graph/types';
import { getPlayerIntelligenceHubData } from '@/lib/intelligence-s24/player-intelligence';

function isUsableProvider(providerId: string): boolean {
  const id = providerId.toLowerCase();
  return id !== 'mock' && id !== 'legacy-local' && id !== 'none';
}

export async function getKnowledgeGraphData(options: BuildKnowledgeGraphOptions = {}): Promise<KnowledgeGraphData> {
  const [centerData, clubHub, playerHub] = await Promise.all([
    getIntelligenceCenterData(),
    getClubIntelligenceHubData(),
    getPlayerIntelligenceHubData(),
  ]);

  const records = s24HistoryEngine
    .listEvaluations(500)
    .filter((record) => isUsableProvider(record.provider.id));

  return buildKnowledgeGraphData({
    records,
    centerData,
    clubs: clubHub.clubs,
    players: playerHub.players,
    maxMatches: options.maxMatches,
  });
}
