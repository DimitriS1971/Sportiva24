export type MatchResult = 'W' | 'D' | 'L';

export interface MockRecentMatch {
  opponent: string;
  result: MatchResult;
  score: string;
  venue: 'Local' | 'Visitante';
  competition: string;
}

export interface MockPlayer {
  name: string;
  position: string;
  number: number;
  x: number;
  y: number;
  status: 'CONFIRMADA' | 'PROBABLE' | 'DUDA';
  age: number;
  minutes: number;
  goals: number;
  assists: number;
  xg: number;
  xa: number;
}

export interface MockTeamIntelligence {
  name: string;
  shortName: string;
  crest: string;
  position: number;
  points: number;
  form: MatchResult[];
  recentMatches: MockRecentMatch[];
  kpis: Record<string, number>;
  attack: Record<string, number>;
  defense: Record<string, number>;
  lineup: { formation: string; players: MockPlayer[] };
}

export const mockMatch = {
  slug: 'demo-atletico-madrid-real-madrid',
  competition: 'LaLiga',
  round: 'Jornada 7',
  status: 'POR JUGAR',
  kickoff: '2026-09-20T18:00:00.000Z',
  kickoffLabel: 'Domingo · 20:00 España',
  venueName: 'Riyadh Air Metropolitano',
  city: 'Madrid',
  confidence: 78,
  model: { home: 42, draw: 28, away: 30, expectedGoals: { home: 1.42, away: 1.51, total: 2.93 } },
  factors: [
    { label: 'Forma reciente', score: 82, note: 'Ambos llegan con señales positivas.' },
    { label: 'Producción ofensiva', score: 76, note: 'Real Madrid genera más volumen.' },
    { label: 'Rendimiento defensivo', score: 71, note: 'Atlético reduce espacios en casa.' },
    { label: 'Localía', score: 84, note: 'El entorno eleva la intensidad local.' },
    { label: 'Disponibilidad', score: 68, note: 'La alineación definitiva puede mover la lectura.' },
  ],
  reading: 'Atlético llega al derbi después de una mejora significativa en sus últimos encuentros, mientras Real Madrid mantiene una dinámica positiva de resultados. La localía, la disponibilidad de jugadores y la capacidad de ambos equipos para gestionar las transiciones aparecen entre las variables principales del encuentro.',
  keys: [
    ['01', 'Momento reciente', 'La secuencia de resultados marca el punto de partida, pero no explica por sí sola el derbi.'],
    ['02', 'Localía', 'El estadio puede empujar al Atlético a presionar más arriba y sostener un ritmo exigente.'],
    ['03', 'Producción ofensiva', 'La calidad de las ocasiones y la eficacia en las áreas serán señales centrales.'],
    ['04', 'Disponibilidad del plantel', 'Las alineaciones pueden cambiar los emparejamientos y el plan de cada equipo.'],
    ['05', 'Duelo táctico', 'Las transiciones y los espacios interiores pueden decidir los momentos de dominio.'],
  ],
  teams: {
    atletico: {
      name: 'Atlético de Madrid', shortName: 'ATL', crest: 'https://media.api-sports.io/football/teams/530.png', position: 4, points: 13,
      form: ['W', 'W', 'L', 'W', 'W'],
      recentMatches: [
        { opponent: 'Osasuna', result: 'W', score: '4-0', venue: 'Local', competition: 'LaLiga' },
        { opponent: 'Real Sociedad', result: 'W', score: '3-0', venue: 'Visitante', competition: 'LaLiga' },
        { opponent: 'Liverpool', result: 'L', score: '1-2', venue: 'Local', competition: 'Champions League' },
        { opponent: 'Athletic Club', result: 'W', score: '3-0', venue: 'Visitante', competition: 'LaLiga' },
        { opponent: 'Sevilla', result: 'W', score: '3-1', venue: 'Local', competition: 'LaLiga' },
      ],
      kpis: { partidos: 6, victorias: 4, empates: 1, derrotas: 1, golesFavor: 14, golesRecibidos: 8, diferencia: 6, posesion: 51, tiros: 13.4, tirosArco: 5.1, corners: 5.8, tarjetas: 2.4 },
      attack: { goles: 14, xg: 12.8, tiros: 13.4, tirosArco: 5.1, ocasiones: 18, conversion: 12, ataques: 42, pasesClave: 9 },
      defense: { goles: 8, xga: 7.1, porteriasCero: 3, recuperaciones: 58, entradas: 16, intercepciones: 11, despejes: 19, erroresTiro: 3, erroresGol: 0, tarjetas: 2.4, faltas: 11.8 },
      lineup: { formation: '4-4-2', players: [
        { name: 'Oblak', position: 'POR', number: 13, x: 50, y: 91, status: 'CONFIRMADA', age: 33, minutes: 540, goals: 0, assists: 0, xg: 0, xa: 0 },
        { name: 'Molina', position: 'LD', number: 16, x: 12, y: 72, status: 'PROBABLE', age: 28, minutes: 420, goals: 0, assists: 2, xg: 0.3, xa: 1.1 },
        { name: 'Giménez', position: 'DFC', number: 2, x: 38, y: 75, status: 'PROBABLE', age: 31, minutes: 450, goals: 1, assists: 0, xg: 0.8, xa: 0.1 },
        { name: 'Le Normand', position: 'DFC', number: 15, x: 62, y: 75, status: 'DUDA', age: 29, minutes: 360, goals: 0, assists: 0, xg: 0.2, xa: 0.1 },
        { name: 'Galán', position: 'LI', number: 21, x: 88, y: 72, status: 'PROBABLE', age: 31, minutes: 405, goals: 1, assists: 1, xg: 0.4, xa: 0.8 },
        { name: 'Koke', position: 'MC', number: 6, x: 25, y: 48, status: 'CONFIRMADA', age: 34, minutes: 470, goals: 1, assists: 2, xg: 0.5, xa: 1.4 },
        { name: 'De Paul', position: 'MC', number: 5, x: 75, y: 48, status: 'PROBABLE', age: 32, minutes: 420, goals: 1, assists: 2, xg: 0.7, xa: 1.2 },
        { name: 'Llorente', position: 'MD', number: 14, x: 12, y: 30, status: 'PROBABLE', age: 31, minutes: 400, goals: 2, assists: 1, xg: 1.1, xa: 0.7 },
        { name: 'Baena', position: 'MI', number: 10, x: 88, y: 30, status: 'DUDA', age: 24, minutes: 300, goals: 1, assists: 2, xg: 0.8, xa: 1.3 },
        { name: 'Julián Álvarez', position: 'DC', number: 19, x: 38, y: 12, status: 'DUDA', age: 26, minutes: 390, goals: 4, assists: 1, xg: 3.6, xa: 0.8 },
        { name: 'Griezmann', position: 'DC', number: 7, x: 62, y: 12, status: 'PROBABLE', age: 35, minutes: 430, goals: 3, assists: 3, xg: 2.9, xa: 1.8 },
      ] },
    },
    real: {
      name: 'Real Madrid', shortName: 'RMA', crest: 'https://media.api-sports.io/football/teams/541.png', position: 2, points: 15,
      form: ['W', 'W', 'W', 'L', 'W'],
      recentMatches: [
        { opponent: 'Elche', result: 'W', score: '3-2', venue: 'Local', competition: 'LaLiga' },
        { opponent: 'Rayo Vallecano', result: 'W', score: '4-1', venue: 'Visitante', competition: 'LaLiga' },
        { opponent: 'Inter', result: 'W', score: '2-1', venue: 'Local', competition: 'Champions League' },
        { opponent: 'Real Betis', result: 'L', score: '0-1', venue: 'Visitante', competition: 'LaLiga' },
        { opponent: 'Málaga', result: 'W', score: '4-0', venue: 'Local', competition: 'LaLiga' },
      ],
      kpis: { partidos: 6, victorias: 5, empates: 0, derrotas: 1, golesFavor: 16, golesRecibidos: 5, diferencia: 11, posesion: 57, tiros: 15.8, tirosArco: 6.4, corners: 6.2, tarjetas: 1.8 },
      attack: { goles: 16, xg: 15.2, tiros: 15.8, tirosArco: 6.4, ocasiones: 23, conversion: 14, ataques: 48, pasesClave: 12 },
      defense: { goles: 5, xga: 6.2, porteriasCero: 3, recuperaciones: 51, entradas: 12, intercepciones: 9, despejes: 14, erroresTiro: 2, erroresGol: 0, tarjetas: 1.8, faltas: 9.6 },
      lineup: { formation: '4-3-3', players: [
        { name: 'Courtois', position: 'POR', number: 1, x: 50, y: 91, status: 'CONFIRMADA', age: 34, minutes: 540, goals: 0, assists: 0, xg: 0, xa: 0 },
        { name: 'Carvajal', position: 'LD', number: 2, x: 12, y: 72, status: 'PROBABLE', age: 34, minutes: 390, goals: 0, assists: 1, xg: 0.2, xa: 0.7 },
        { name: 'Rüdiger', position: 'DFC', number: 22, x: 38, y: 75, status: 'PROBABLE', age: 33, minutes: 450, goals: 1, assists: 0, xg: 0.6, xa: 0.1 },
        { name: 'Militão', position: 'DFC', number: 3, x: 62, y: 75, status: 'PROBABLE', age: 28, minutes: 420, goals: 0, assists: 0, xg: 0.3, xa: 0.1 },
        { name: 'Mendy', position: 'LI', number: 23, x: 88, y: 72, status: 'DUDA', age: 31, minutes: 330, goals: 0, assists: 1, xg: 0.2, xa: 0.8 },
        { name: 'Valverde', position: 'MC', number: 15, x: 20, y: 48, status: 'CONFIRMADA', age: 28, minutes: 490, goals: 2, assists: 2, xg: 1.0, xa: 1.2 },
        { name: 'Tchouaméni', position: 'MC', number: 18, x: 50, y: 43, status: 'PROBABLE', age: 26, minutes: 400, goals: 0, assists: 1, xg: 0.3, xa: 0.5 },
        { name: 'Bellingham', position: 'MC', number: 5, x: 80, y: 48, status: 'PROBABLE', age: 23, minutes: 460, goals: 3, assists: 3, xg: 2.4, xa: 2.1 },
        { name: 'Vinícius Jr.', position: 'ED', number: 7, x: 15, y: 18, status: 'CONFIRMADA', age: 26, minutes: 480, goals: 5, assists: 3, xg: 4.1, xa: 2.4 },
        { name: 'Mbappé', position: 'DC', number: 9, x: 50, y: 12, status: 'PROBABLE', age: 27, minutes: 500, goals: 6, assists: 2, xg: 5.0, xa: 1.6 },
        { name: 'Rodrygo', position: 'EI', number: 11, x: 85, y: 18, status: 'DUDA', age: 25, minutes: 310, goals: 2, assists: 2, xg: 1.8, xa: 1.2 },
      ] },
    },
  },
  h2h: [
    ['22 MAR 2026', 'LaLiga', 'Real Madrid', '3-2', 'Atlético'],
    ['08 ENE 2026', 'Supercopa', 'Atlético', '1-2', 'Real Madrid'],
    ['27 SEP 2025', 'LaLiga', 'Atlético', '5-2', 'Real Madrid'],
    ['12 MAR 2025', 'Champions', 'Atlético', '1-0', 'Real Madrid'],
    ['04 MAR 2025', 'Champions', 'Real Madrid', '2-1', 'Atlético'],
  ],
  league: [
    ['Barcelona', 1, 18, 6, 19], ['Real Madrid', 2, 15, 6, 11], ['Atlético de Madrid', 4, 13, 6, 6], ['Athletic Club', 5, 11, 6, 4],
  ],
  coaches: [{ team: 'Atlético de Madrid', name: 'Diego Simeone', formation: '4-4-2', matches: 612 }, { team: 'Real Madrid', name: 'Xabi Alonso', formation: '4-3-3', matches: 84 }],
  referee: { name: 'José María Sánchez Martínez', matches: 18, cards: 4.8, fouls: 26, penalties: 4, reds: 1 },
  venueInfo: { capacity: '70.460', surface: 'Césped natural', temperature: null, wind: null, humidity: null },
  scenarios: [
    ['ESCENARIO 01', 'Atlético controla el ritmo', 'Presión local, bloque compacto y transiciones cortas. Observar recuperaciones en campo rival, pérdidas del Real Madrid y tiros del Atlético en los primeros 30 minutos.'],
    ['ESCENARIO 02', 'Real Madrid domina las transiciones', 'La calidad individual encuentra espacios tras pérdida. Observar progresiones de Vinícius, recepciones de Bellingham y ataques por fuera.'],
    ['ESCENARIO 03', 'Partido cerrado', 'Ambos equipos protegen el centro y reducen ocasiones. Observar xG, tiros al arco, balón parado y cambios después del minuto 60.'],
  ],
} as const;

export type MockMatchData = typeof mockMatch;
