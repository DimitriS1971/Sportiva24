export const esportsRules = {
  supportedCompetitionTypes: ['league', 'major', 'international-event'],
  providers: ['esports', 'riot', 'hltv'],
  competitionMatchers: ['lcs', 'lec', 'lck', 'valorant', 'cs2', 'major'],
} as const;
