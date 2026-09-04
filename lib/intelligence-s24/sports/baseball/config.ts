import {
  DEFAULT_INDICATOR_CONFIGURATION,
  DEFAULT_INTERPRETATION_CONFIGURATION,
  DEFAULT_NARRATIVE_CONFIGURATION,
  DEFAULT_VALIDATION_CONFIGURATION,
} from '@/lib/intelligence-s24/sports/shared/defaultValues';
import { createSportProfile } from '@/lib/intelligence-s24/sports/shared/profileFactory';
import { baseballFactors } from '@/lib/intelligence-s24/sports/baseball/factors';
import { baseballInterpretation } from '@/lib/intelligence-s24/sports/baseball/interpretation';
import { baseballRules } from '@/lib/intelligence-s24/sports/baseball/rules';

export const baseballProfile = createSportProfile({
  id: 'baseball',
  slug: 'beisbol',
  name: 'Baseball',
  category: 'team-sport',
  supportedCompetitionTypes: [...baseballRules.supportedCompetitionTypes],
  availableFactors: [...baseballFactors],
  factorWeights: {
    recentForm: 23,
    offensivePerformance: 17,
    defensivePerformance: 16,
    squadQuality: 12,
    squadAvailability: 12,
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
    vocabulary: ['consistencia del pitcheo', 'produccion de carreras', 'control de entradas'],
  },
  interpretationConfiguration: {
    ...DEFAULT_INTERPRETATION_CONFIGURATION,
    factorAdvantageLabels: baseballInterpretation.factorAdvantageLabels,
    factorDisplayOrder: [...baseballFactors],
  },
  validationConfiguration: DEFAULT_VALIDATION_CONFIGURATION,
  version: 'baseball-profile-v1',
  methodologyVersion: 'baseball-methodology-v1',
  resolutionMatchers: {
    slugs: ['beisbol', 'baseball'],
    providers: [...baseballRules.providers],
    competitions: [...baseballRules.competitionMatchers],
  },
});
