import { s24HistoryEngine } from '@/lib/intelligence-s24/history/historyEngine';
import { buildLeagueIntelligenceData, buildLeagueIntelligenceHubData } from '@/lib/intelligence-s24/league-intelligence/engine';
import type { BuildLeagueIntelligenceOptions, LeagueIntelligenceData, LeagueIntelligenceHubData } from '@/lib/intelligence-s24/league-intelligence/types';
import type { LeagueIntelligenceProfile } from '@/lib/domain/intelligenceProfile';
import { getIntelligenceCenterData } from '@/lib/intelligence-s24/intelligence-center/centerService';
import { buildLeagueProfileFromData } from '@/lib/intelligence-s24/intelligence-profile';
import { sportResolver } from '@/lib/intelligence-s24/sports';

function isUsableProvider(providerId: string): boolean {
  const id = providerId.toLowerCase();
  return id !== 'mock' && id !== 'legacy-local' && id !== 'none';
}

export async function getLeagueIntelligenceHubData(): Promise<LeagueIntelligenceHubData> {
  const records = s24HistoryEngine
    .listEvaluations(500)
    .filter((record) => isUsableProvider(record.provider.id));

  return buildLeagueIntelligenceHubData(records);
}

export async function getLeagueIntelligenceData(options: BuildLeagueIntelligenceOptions = {}): Promise<LeagueIntelligenceData> {
  const records = s24HistoryEngine
    .listEvaluations(600)
    .filter((record) => isUsableProvider(record.provider.id));

  const centerData = await getIntelligenceCenterData();
  const sportId = records[0]?.match.sport ?? 'football';

  const topCompetition = centerData.competiciones.rankingsPorLiga[0]?.competition;
  const topProvider = records[0]?.provider.id;

  const profile = sportResolver.resolve({
    sportId,
    providerId: topProvider,
    competition: topCompetition,
    slug: options.leagueSlug,
  });

  return buildLeagueIntelligenceData(records, centerData, profile, options);
}

export async function getLeagueIntelligenceProfile(options: BuildLeagueIntelligenceOptions = {}): Promise<LeagueIntelligenceProfile> {
  const data = await getLeagueIntelligenceData(options);
  return buildLeagueProfileFromData(data);
}
