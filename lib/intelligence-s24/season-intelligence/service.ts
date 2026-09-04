import { s24HistoryEngine } from '@/lib/intelligence-s24/history/historyEngine';
import { buildSeasonIntelligenceData, buildSeasonIntelligenceHubData } from '@/lib/intelligence-s24/season-intelligence/engine';
import type { BuildSeasonIntelligenceOptions, SeasonIntelligenceData, SeasonIntelligenceHubData } from '@/lib/intelligence-s24/season-intelligence/types';
import type { SeasonIntelligenceProfile } from '@/lib/domain/intelligenceProfile';
import { getIntelligenceCenterData } from '@/lib/intelligence-s24/intelligence-center/centerService';
import { buildSeasonProfileFromData } from '@/lib/intelligence-s24/intelligence-profile';
import { sportResolver } from '@/lib/intelligence-s24/sports';

function isUsableProvider(providerId: string): boolean {
  const id = providerId.toLowerCase();
  return id !== 'mock' && id !== 'legacy-local' && id !== 'none';
}

export async function getSeasonIntelligenceHubData(): Promise<SeasonIntelligenceHubData> {
  const records = s24HistoryEngine
    .listEvaluations(800)
    .filter((record) => isUsableProvider(record.provider.id));

  return buildSeasonIntelligenceHubData(records);
}

export async function getSeasonIntelligenceData(options: BuildSeasonIntelligenceOptions = {}): Promise<SeasonIntelligenceData> {
  const records = s24HistoryEngine
    .listEvaluations(900)
    .filter((record) => isUsableProvider(record.provider.id));

  const centerData = await getIntelligenceCenterData();
  const sportId = records[0]?.match.sport ?? 'football';
  const providerId = records[0]?.provider.id;
  const competition = records[0]?.match.competition;

  const profile = sportResolver.resolve({
    sportId,
    providerId,
    competition,
    slug: options.seasonSlug,
  });

  return buildSeasonIntelligenceData(records, centerData, profile, options);
}

export async function getSeasonIntelligenceProfile(options: BuildSeasonIntelligenceOptions = {}): Promise<SeasonIntelligenceProfile> {
  const data = await getSeasonIntelligenceData(options);
  return buildSeasonProfileFromData(data);
}
