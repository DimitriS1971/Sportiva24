import {
  DEFAULT_INDICATOR_CONFIGURATION,
  DEFAULT_INTERPRETATION_CONFIGURATION,
  DEFAULT_NARRATIVE_CONFIGURATION,
  DEFAULT_VALIDATION_CONFIGURATION,
} from '@/lib/intelligence-s24/sports/shared/defaultValues';
import { createSportProfile } from '@/lib/intelligence-s24/sports/shared/profileFactory';
import { cyclingFactors } from '@/lib/intelligence-s24/sports/cycling/factors';
import { cyclingInterpretation } from '@/lib/intelligence-s24/sports/cycling/interpretation';
import { cyclingRules } from '@/lib/intelligence-s24/sports/cycling/rules';

export const cyclingProfile = createSportProfile({
  id: 'cycling',
  slug: 'ciclismo',
  name: 'Cycling',
  category: 'endurance-sport',
  supportedCompetitionTypes: [...cyclingRules.supportedCompetitionTypes],
  availableFactors: [...cyclingFactors],
  factorWeights: {
    recentForm: 24,
    offensivePerformance: 14,
    defensivePerformance: 12,
    squadQuality: 12,
    squadAvailability: 10,
    fatigue: 14,
    matchContext: 10,
    headToHead: 4,
  },
  indicatorConfiguration: {
    ...DEFAULT_INDICATOR_CONFIGURATION,
    trendFactorKeys: ['recentForm', 'fatigue', 'matchContext'],
  },
  narrativeConfiguration: {
    ...DEFAULT_NARRATIVE_CONFIGURATION,
    vocabulary: ['ritmo sostenido', 'gestion de energia', 'ataque en subida'],
  },
  interpretationConfiguration: {
    ...DEFAULT_INTERPRETATION_CONFIGURATION,
    factorAdvantageLabels: cyclingInterpretation.factorAdvantageLabels,
    factorDisplayOrder: [...cyclingFactors],
  },
  validationConfiguration: DEFAULT_VALIDATION_CONFIGURATION,
  version: 'cycling-profile-v1',
  methodologyVersion: 'cycling-methodology-v1',
  resolutionMatchers: {
    slugs: ['ciclismo', 'cycling'],
    providers: [...cyclingRules.providers],
    competitions: [...cyclingRules.competitionMatchers],
  },
});
