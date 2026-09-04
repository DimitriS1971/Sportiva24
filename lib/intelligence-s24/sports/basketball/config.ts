import {
  DEFAULT_INDICATOR_CONFIGURATION,
  DEFAULT_INTERPRETATION_CONFIGURATION,
  DEFAULT_NARRATIVE_CONFIGURATION,
  DEFAULT_VALIDATION_CONFIGURATION,
} from '@/lib/intelligence-s24/sports/shared/defaultValues';
import { createSportProfile } from '@/lib/intelligence-s24/sports/shared/profileFactory';
import { basketballFactors } from '@/lib/intelligence-s24/sports/basketball/factors';
import { basketballInterpretation } from '@/lib/intelligence-s24/sports/basketball/interpretation';
import { basketballRules } from '@/lib/intelligence-s24/sports/basketball/rules';

export const basketballProfile = createSportProfile({
  id: 'basketball',
  slug: 'basketball',
  name: 'Basketball',
  category: 'team-sport',
  supportedCompetitionTypes: [...basketballRules.supportedCompetitionTypes],
  availableFactors: [...basketballFactors],
  factorWeights: {
    recentForm: 22,
    offensivePerformance: 18,
    defensivePerformance: 18,
    squadQuality: 12,
    squadAvailability: 10,
    fatigue: 8,
    matchContext: 8,
    headToHead: 4,
  },
  indicatorConfiguration: {
    ...DEFAULT_INDICATOR_CONFIGURATION,
    trendFactorKeys: ['recentForm', 'offensivePerformance', 'defensivePerformance'],
  },
  narrativeConfiguration: {
    ...DEFAULT_NARRATIVE_CONFIGURATION,
    vocabulary: ['pace', 'eficiencia por posesion', 'rating neto'],
  },
  interpretationConfiguration: {
    ...DEFAULT_INTERPRETATION_CONFIGURATION,
    factorAdvantageLabels: basketballInterpretation.factorAdvantageLabels,
    factorDisplayOrder: [...basketballFactors],
  },
  validationConfiguration: DEFAULT_VALIDATION_CONFIGURATION,
  version: 'basketball-profile-v1',
  methodologyVersion: 'basketball-methodology-v1',
  resolutionMatchers: {
    slugs: ['basketball', 'baloncesto'],
    providers: [...basketballRules.providers],
    competitions: [...basketballRules.competitionMatchers],
  },
});
