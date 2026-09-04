export const tennisRules = {
  supportedCompetitionTypes: ['tour', 'grand-slam', 'masters'],
  providers: ['tennis', 'atp', 'wta'],
  competitionMatchers: ['atp', 'wta', 'masters', 'open', 'grand slam'],
} as const;
