export const baseballRules = {
  supportedCompetitionTypes: ['league', 'series', 'postseason'],
  providers: ['baseball', 'mlb'],
  competitionMatchers: ['mlb', 'baseball', 'world series'],
} as const;
