import {
  DEFAULT_INDICATOR_CONFIGURATION,
  DEFAULT_INTERPRETATION_CONFIGURATION,
  DEFAULT_NARRATIVE_CONFIGURATION,
  DEFAULT_VALIDATION_CONFIGURATION,
} from '@/lib/intelligence-s24/sports/shared/defaultValues';
import { createSportProfile } from '@/lib/intelligence-s24/sports/shared/profileFactory';
import { formula1Factors } from '@/lib/intelligence-s24/sports/formula1/factors';
import { formula1Interpretation } from '@/lib/intelligence-s24/sports/formula1/interpretation';
import { formula1Rules } from '@/lib/intelligence-s24/sports/formula1/rules';

export const formula1Profile = createSportProfile({
  id: 'formula1',
  slug: 'f1',
  name: 'Formula 1',
  category: 'motor-sport',
  supportedCompetitionTypes: [...formula1Rules.supportedCompetitionTypes],
  availableFactors: [...formula1Factors],
  factorWeights: {
    recentForm: 21,
    offensivePerformance: 17,
    defensivePerformance: 14,
    squadQuality: 16,
    squadAvailability: 10,
    fatigue: 7,
    matchContext: 10,
    headToHead: 5,
  },
  indicatorConfiguration: {
    ...DEFAULT_INDICATOR_CONFIGURATION,
    trendFactorKeys: ['recentForm', 'offensivePerformance', 'matchContext'],
  },
  narrativeConfiguration: {
    ...DEFAULT_NARRATIVE_CONFIGURATION,
    vocabulary: ['degradacion de neumatico', 'ritmo de carrera', 'ventana de pit stop'],
  },
  interpretationConfiguration: {
    ...DEFAULT_INTERPRETATION_CONFIGURATION,
    factorAdvantageLabels: formula1Interpretation.factorAdvantageLabels,
    factorDisplayOrder: [...formula1Factors],
  },
  validationConfiguration: DEFAULT_VALIDATION_CONFIGURATION,
  version: 'formula1-profile-v1',
  methodologyVersion: 'formula1-methodology-v1',
  resolutionMatchers: {
    slugs: ['f1', 'formula1', 'formula-1'],
    providers: [...formula1Rules.providers],
    competitions: [...formula1Rules.competitionMatchers],
  },
});
