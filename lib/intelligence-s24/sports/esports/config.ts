import {
  DEFAULT_INDICATOR_CONFIGURATION,
  DEFAULT_INTERPRETATION_CONFIGURATION,
  DEFAULT_NARRATIVE_CONFIGURATION,
  DEFAULT_VALIDATION_CONFIGURATION,
} from '@/lib/intelligence-s24/sports/shared/defaultValues';
import { createSportProfile } from '@/lib/intelligence-s24/sports/shared/profileFactory';
import { esportsFactors } from '@/lib/intelligence-s24/sports/esports/factors';
import { esportsInterpretation } from '@/lib/intelligence-s24/sports/esports/interpretation';
import { esportsRules } from '@/lib/intelligence-s24/sports/esports/rules';

export const esportsProfile = createSportProfile({
  id: 'esports',
  slug: 'egames',
  name: 'eSports',
  category: 'digital-sport',
  supportedCompetitionTypes: [...esportsRules.supportedCompetitionTypes],
  availableFactors: [...esportsFactors],
  factorWeights: {
    recentForm: 20,
    offensivePerformance: 20,
    defensivePerformance: 16,
    squadQuality: 14,
    squadAvailability: 10,
    fatigue: 8,
    matchContext: 8,
    headToHead: 4,
  },
  indicatorConfiguration: {
    ...DEFAULT_INDICATOR_CONFIGURATION,
    trendFactorKeys: ['recentForm', 'offensivePerformance', 'matchContext'],
  },
  narrativeConfiguration: {
    ...DEFAULT_NARRATIVE_CONFIGURATION,
    vocabulary: ['tempo de ejecucion', 'control de mapa', 'consistencia macro'],
  },
  interpretationConfiguration: {
    ...DEFAULT_INTERPRETATION_CONFIGURATION,
    factorAdvantageLabels: esportsInterpretation.factorAdvantageLabels,
    factorDisplayOrder: [...esportsFactors],
  },
  validationConfiguration: DEFAULT_VALIDATION_CONFIGURATION,
  version: 'esports-profile-v1',
  methodologyVersion: 'esports-methodology-v1',
  resolutionMatchers: {
    slugs: ['egames', 'esports'],
    providers: [...esportsRules.providers],
    competitions: [...esportsRules.competitionMatchers],
  },
});
