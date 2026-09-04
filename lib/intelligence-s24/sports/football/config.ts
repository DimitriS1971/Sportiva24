import {
  DEFAULT_INDICATOR_CONFIGURATION,
  DEFAULT_INTERPRETATION_CONFIGURATION,
  DEFAULT_NARRATIVE_CONFIGURATION,
  DEFAULT_VALIDATION_CONFIGURATION,
} from '@/lib/intelligence-s24/sports/shared/defaultValues';
import { createSportProfile } from '@/lib/intelligence-s24/sports/shared/profileFactory';
import { footballFactors } from '@/lib/intelligence-s24/sports/football/factors';
import { footballInterpretation } from '@/lib/intelligence-s24/sports/football/interpretation';
import { footballRules } from '@/lib/intelligence-s24/sports/football/rules';

export const footballProfile = createSportProfile({
  id: 'football',
  slug: 'futbol',
  name: 'Football',
  category: 'team-sport',
  supportedCompetitionTypes: [...footballRules.supportedCompetitionTypes],
  availableFactors: [...footballFactors],
  factorWeights: {
    recentForm: 25,
    offensivePerformance: 15,
    defensivePerformance: 15,
    squadQuality: 10,
    squadAvailability: 10,
    fatigue: 10,
    matchContext: 10,
    headToHead: 5,
  },
  indicatorConfiguration: {
    ...DEFAULT_INDICATOR_CONFIGURATION,
    trendFactorKeys: ['recentForm', 'offensivePerformance', 'defensivePerformance'],
  },
  narrativeConfiguration: {
    ...DEFAULT_NARRATIVE_CONFIGURATION,
    vocabulary: ['presion alta', 'transicion ofensiva', 'control territorial'],
    terminology: {
      ...DEFAULT_NARRATIVE_CONFIGURATION.terminology,
      tempo: 'Ritmo de juego',
    },
  },
  interpretationConfiguration: {
    ...DEFAULT_INTERPRETATION_CONFIGURATION,
    factorAdvantageLabels: footballInterpretation.factorAdvantageLabels,
    factorDisplayOrder: [...footballFactors],
    factorDetails: {
      ...DEFAULT_INTERPRETATION_CONFIGURATION.factorDetails,
      recentForm: 'Estado competitivo en las ultimas jornadas.',
      offensivePerformance: 'Eficiencia para producir y convertir acciones de gol.',
      defensivePerformance: 'Capacidad de reducir dano rival y proteger area.',
      squadQuality: 'Calidad colectiva de la estructura titular y suplente.',
      squadAvailability: 'Disponibilidad real de piezas clave para competir.',
      fatigue: 'Impacto de carga de minutos y calendario sobre el rendimiento.',
      matchContext: 'Entorno competitivo, localia y dificultad tactica.',
      headToHead: 'Comportamiento historico reciente entre ambos bloques.',
    },
  },
  validationConfiguration: DEFAULT_VALIDATION_CONFIGURATION,
  version: 'football-profile-v1',
  methodologyVersion: 'football-methodology-v1',
  resolutionMatchers: {
    slugs: ['futbol', 'football', 'soccer'],
    providers: [...footballRules.providers],
    competitions: [...footballRules.competitionMatchers],
  },
});
