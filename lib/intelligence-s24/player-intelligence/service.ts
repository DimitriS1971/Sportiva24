import { s24HistoryEngine } from '@/lib/intelligence-s24/history/historyEngine';
import { buildPlayerIntelligenceData, buildPlayerIntelligenceHubData } from '@/lib/intelligence-s24/player-intelligence/engine';
import type { BuildPlayerIntelligenceOptions, PlayerIntelligenceData, PlayerIntelligenceHubData } from '@/lib/intelligence-s24/player-intelligence/types';
import type { PlayerIntelligenceProfile } from '@/lib/domain/intelligenceProfile';
import { getIntelligenceCenterData } from '@/lib/intelligence-s24/intelligence-center/centerService';
import { buildPlayerProfileFromData } from '@/lib/intelligence-s24/intelligence-profile';
import { sportResolver } from '@/lib/intelligence-s24/sports';
import { s24ValidationService } from '@/lib/intelligence-s24/validation';

function isUsableProvider(providerId: string): boolean {
  const id = providerId.toLowerCase();
  return id !== 'mock' && id !== 'legacy-local' && id !== 'none';
}

export async function getPlayerIntelligenceHubData(): Promise<PlayerIntelligenceHubData> {
  const centerData = await getIntelligenceCenterData();
  return buildPlayerIntelligenceHubData(centerData);
}

export async function getPlayerIntelligenceData(options: BuildPlayerIntelligenceOptions = {}): Promise<PlayerIntelligenceData> {
  const centerData = await getIntelligenceCenterData();
  const records = s24HistoryEngine
    .listEvaluations(600)
    .filter((record) => isUsableProvider(record.provider.id));

  const sportId = records[0]?.match.sport ?? 'football';
  const providerId = records[0]?.provider.id;
  const competition = records[0]?.match.competition;

  const profile = sportResolver.resolve({
    sportId,
    providerId,
    competition,
    slug: options.playerSlug,
  });

  const validationDashboard = s24ValidationService.generateDashboard(600);

  return buildPlayerIntelligenceData(records, centerData, validationDashboard, profile, options);
}

export async function getPlayerIntelligenceProfile(options: BuildPlayerIntelligenceOptions = {}): Promise<PlayerIntelligenceProfile> {
  const data = await getPlayerIntelligenceData(options);
  return buildPlayerProfileFromData(data);
}
