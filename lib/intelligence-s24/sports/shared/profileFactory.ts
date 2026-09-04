import {
  DEFAULT_INDICATOR_CONFIGURATION,
  DEFAULT_INTERPRETATION_CONFIGURATION,
  DEFAULT_NARRATIVE_CONFIGURATION,
  DEFAULT_SPORT_FACTORS,
  DEFAULT_SPORT_WEIGHTS,
  DEFAULT_VALIDATION_CONFIGURATION,
} from '@/lib/intelligence-s24/sports/shared/defaultValues';
import type { SportProfile } from '@/lib/intelligence-s24/sports/shared/types';

type BuildProfileInput = Pick<
  SportProfile,
  'id' | 'slug' | 'name' | 'category' | 'supportedCompetitionTypes' | 'resolutionMatchers' | 'version' | 'methodologyVersion'
> & Partial<
  Pick<
    SportProfile,
    'availableFactors' | 'factorWeights' | 'indicatorConfiguration' | 'narrativeConfiguration' | 'interpretationConfiguration' | 'validationConfiguration'
  >
>;

export function createSportProfile(input: BuildProfileInput): SportProfile {
  return {
    id: input.id,
    slug: input.slug,
    name: input.name,
    category: input.category,
    supportedCompetitionTypes: input.supportedCompetitionTypes,
    availableFactors: input.availableFactors ?? DEFAULT_SPORT_FACTORS,
    factorWeights: input.factorWeights ?? DEFAULT_SPORT_WEIGHTS,
    indicatorConfiguration: input.indicatorConfiguration ?? DEFAULT_INDICATOR_CONFIGURATION,
    narrativeConfiguration: input.narrativeConfiguration ?? DEFAULT_NARRATIVE_CONFIGURATION,
    interpretationConfiguration: input.interpretationConfiguration ?? DEFAULT_INTERPRETATION_CONFIGURATION,
    validationConfiguration: input.validationConfiguration ?? DEFAULT_VALIDATION_CONFIGURATION,
    version: input.version,
    methodologyVersion: input.methodologyVersion,
    resolutionMatchers: input.resolutionMatchers,
  };
}
