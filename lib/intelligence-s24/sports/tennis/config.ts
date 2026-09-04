import {
  DEFAULT_INDICATOR_CONFIGURATION,
  DEFAULT_INTERPRETATION_CONFIGURATION,
  DEFAULT_NARRATIVE_CONFIGURATION,
  DEFAULT_VALIDATION_CONFIGURATION,
} from '@/lib/intelligence-s24/sports/shared/defaultValues';
import { createSportProfile } from '@/lib/intelligence-s24/sports/shared/profileFactory';
import { tennisFactors } from '@/lib/intelligence-s24/sports/tennis/factors';
import { tennisInterpretation } from '@/lib/intelligence-s24/sports/tennis/interpretation';
import { tennisRules } from '@/lib/intelligence-s24/sports/tennis/rules';

export const tennisProfile = createSportProfile({
  id: 'tennis',
  slug: 'tenis',
  name: 'Tennis',
  category: 'individual-sport',
  supportedCompetitionTypes: [...tennisRules.supportedCompetitionTypes],
  availableFactors: [...tennisFactors],
  factorWeights: {
    recentForm: 23,
    offensivePerformance: 18,
    defensivePerformance: 16,
    squadQuality: 12,
    squadAvailability: 11,
    fatigue: 10,
    matchContext: 7,
    headToHead: 3,
  },
  indicatorConfiguration: {
    ...DEFAULT_INDICATOR_CONFIGURATION,
    trendFactorKeys: ['recentForm', 'offensivePerformance', 'fatigue'],
  },
  narrativeConfiguration: {
    ...DEFAULT_NARRATIVE_CONFIGURATION,
    vocabulary: ['consistencia al servicio', 'presion en resto', 'resistencia fisica'],
  },
  interpretationConfiguration: {
    ...DEFAULT_INTERPRETATION_CONFIGURATION,
    factorAdvantageLabels: tennisInterpretation.factorAdvantageLabels,
    factorDisplayOrder: [...tennisFactors],
  },
  validationConfiguration: DEFAULT_VALIDATION_CONFIGURATION,
  version: 'tennis-profile-v1',
  methodologyVersion: 'tennis-methodology-v1',
  resolutionMatchers: {
    slugs: ['tenis', 'tennis'],
    providers: [...tennisRules.providers],
    competitions: [...tennisRules.competitionMatchers],
  },
});
