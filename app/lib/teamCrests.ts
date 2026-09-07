const localTeamCrests: Record<string, string> = {
  'Real Madrid': '/teams-official/real-madrid.png',
  Barcelona: '/teams-official/barcelona.png',
  'Manchester City': '/teams-official/manchester-city.png',
  Arsenal: '/teams-official/arsenal.png',
  'Los Angeles Lakers': '/teams-official/lakers.png',
  'Boston Celtics': '/teams-official/celtics.png',
  Juventus: '/teams/juventus.svg',
  Inter: '/teams/inter.svg',
  Chelsea: '/teams/chelsea.svg',
  'Atlético Madrid': '/teams/atletico.svg',
};

export function getTeamCrest(teamName: string, providedCrest?: string): string {
  if (providedCrest) {
    return providedCrest;
  }

  return localTeamCrests[teamName] ?? '/icons/football-premium.svg';
}
