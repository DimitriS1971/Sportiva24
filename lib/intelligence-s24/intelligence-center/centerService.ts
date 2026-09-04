import { sportsDataService } from '@/lib/data';
import { buildInformeS24V1 } from '@/lib/intelligence-s24/informeS24V1';
import { s24HistoryEngine } from '@/lib/intelligence-s24/history/historyEngine';
import { buildIntelligenceCenterDataFromProfiles } from '@/lib/intelligence-s24/intelligence-center/centerEngine';
import type { IntelligenceCenterData } from '@/lib/intelligence-s24/intelligence-center/centerTypes';

function isUsableProvider(providerId: string): boolean {
  const id = providerId.toLowerCase();
  return id !== 'mock' && id !== 'legacy-local' && id !== 'none';
}

export async function getIntelligenceCenterData(): Promise<IntelligenceCenterData> {
  const initialProfiles = s24HistoryEngine
    .listProfileData(400)
    .filter((profile) => profile.identity.type === 'match')
    .filter((profile) => isUsableProvider(profile.analyticalPassport.providerId));

  if (initialProfiles.length >= 10) {
    return buildIntelligenceCenterDataFromProfiles(initialProfiles);
  }

  const featured = await sportsDataService.getFeaturedMatches('football', 16);
  const enriched = await Promise.all(
    featured.map(async (match) => {
      const detail = await sportsDataService.getMatchBySlugWithMeta(match.slug);
      if (!detail.match || !isUsableProvider(detail.providerId)) {
        return null;
      }

      buildInformeS24V1({
        match: detail.match,
        providerId: detail.providerId,
        usedFailover: detail.usedFallback,
      });

      return detail.match.slug;
    }),
  );

  const usedSlugs = new Set(enriched.filter((slug): slug is string => Boolean(slug)));
  const profiles = s24HistoryEngine
    .listProfileData(500)
    .filter((profile) => profile.identity.type === 'match')
    .filter((profile) => isUsableProvider(profile.analyticalPassport.providerId))
    .filter((profile) => usedSlugs.size === 0 || usedSlugs.has(profile.identity.slug));

  return buildIntelligenceCenterDataFromProfiles(profiles);
}
