export const basketballRules = {
  supportedCompetitionTypes: ['league', 'playoff', 'international'],
  providers: ['basketball', 'nba', 'balldontlie'],
  competitionMatchers: ['nba', 'euroleague', 'acb', 'ncaa', 'wnba', 'fiba'],
} as const;
