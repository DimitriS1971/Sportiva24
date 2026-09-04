import { s24HistoryEngine } from '@/lib/intelligence-s24/history/historyEngine';
import { buildClubIntelligenceData, buildClubIntelligenceHubData, slugifyTeamName } from '@/lib/intelligence-s24/club-intelligence/engine';
import type { BuildClubIntelligenceOptions, ClubIntelligenceData, ClubIntelligenceHubData } from '@/lib/intelligence-s24/club-intelligence/types';
import type { ClubIntelligenceProfile } from '@/lib/domain/intelligenceProfile';
import { getIntelligenceCenterData } from '@/lib/intelligence-s24/intelligence-center/centerService';
import { buildClubProfileFromData } from '@/lib/intelligence-s24/intelligence-profile';
import { sportResolver } from '@/lib/intelligence-s24/sports';
import { s24ValidationService } from '@/lib/intelligence-s24/validation';

function isUsableProvider(providerId: string): boolean {
  const id = providerId.toLowerCase();
  return id !== 'mock' && id !== 'legacy-local' && id !== 'none';
}

function inferSportFromHistory(records: ReturnType<typeof s24HistoryEngine.listEvaluations>): string {
  return records[0]?.match.sport ?? 'football';
}

export async function getClubIntelligenceHubData(): Promise<ClubIntelligenceHubData> {
  const centerData = await getIntelligenceCenterData();
  return buildClubIntelligenceHubData(centerData);
}

export async function getClubIntelligenceData(options: BuildClubIntelligenceOptions = {}): Promise<ClubIntelligenceData> {
  const centerData = await getIntelligenceCenterData();
  const records = s24HistoryEngine
    .listEvaluations(500)
    .filter((record) => isUsableProvider(record.provider.id));

  const sportId = inferSportFromHistory(records);
  const selectedTeam = centerData.clubes.rankingS24.find((team) => slugifyTeamName(team.teamName) === options.clubSlug);

  const profile = sportResolver.resolve({
    sportId,
    competition: selectedTeam ? centerData.competiciones.rankingsPorLiga[0]?.competition : undefined,
    slug: options.clubSlug,
  });

  const validationDashboard = s24ValidationService.generateDashboard(500);

  return buildClubIntelligenceData(records, centerData, validationDashboard, profile, options);
}

export async function getClubIntelligenceProfile(options: BuildClubIntelligenceOptions = {}): Promise<ClubIntelligenceProfile> {
  const data = await getClubIntelligenceData(options);
  return buildClubProfileFromData(data);
}
