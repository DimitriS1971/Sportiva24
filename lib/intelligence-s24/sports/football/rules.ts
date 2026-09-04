export const footballRules = {
  supportedCompetitionTypes: ['league', 'cup', 'international'],
  providers: ['football-data', 'api-football', 'football', 'soccer'],
  competitionMatchers: ['premier', 'laliga', 'serie a', 'bundesliga', 'ligue 1', 'champions', 'libertadores'],
} as const;
