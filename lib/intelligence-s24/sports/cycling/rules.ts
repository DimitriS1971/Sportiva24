export const cyclingRules = {
  supportedCompetitionTypes: ['stage-race', 'classic', 'tour'],
  providers: ['cycling', 'procyclingstats'],
  competitionMatchers: ['tour', 'giro', 'vuelta', 'classic', 'criterium'],
} as const;
