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
  Sevilla: 'https://media.api-sports.io/football/teams/536.png',
  'Atlético Madrid': 'https://media.api-sports.io/football/teams/530.png',
};

export function getTeamCrest(teamName: string, providedCrest?: string): string {
  const normalize = (value: string) => value.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const normalizedName = normalize(teamName);
  const localEntry = Object.entries(localTeamCrests).find(([name]) => normalize(name) === normalizedName);

  return localEntry?.[1] ?? providedCrest ?? '/icons/football-premium.svg';
}
