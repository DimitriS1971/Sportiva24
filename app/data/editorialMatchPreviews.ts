import type { Match } from '@/lib/data/types/domain';
import type { RealMatchContext } from '@/lib/intelligence-s24/realMatchContext';

export interface EditorialMatchPreview {
  slug: string;
  homeTeam: string;
  awayTeam: string;
  homeCrestUrl?: string;
  awayCrestUrl?: string;
  competition: string;
  round: string;
  overview: string;
  standings?: Array<{
    team: string;
    position: string;
    points: number;
    played: number;
    goalsFor: number;
    goalsAgainst: number;
  }>;
  recentForm?: Array<{
    team: string;
    record: string;
    goalsFor: number;
    goalsAgainst: number;
    matches: string[];
  }>;
  headToHead?: {
    summary: string;
    matches: Array<{ date: string; home: string; score: string; away: string }>;
  };
  goalsRead?: string;
  model?: {
    homeWin: number;
    draw: number;
    awayWin: number;
    expectedGoals: string;
  };
  markets?: Array<{ label: string; value: string; note: string; tone: 'green' | 'amber' | 'slate' }>;
  conclusion: string;
}

export function buildEditorialMatchPreview(
  match: Match,
  providerId: string,
  context: RealMatchContext | null,
): EditorialMatchPreview {
  const hasHeadToHead = Boolean(context && context.headToHead.matches.length > 0);
  const h2h = context?.headToHead;
  const overview = hasHeadToHead && h2h
    ? `${match.homeTeam.name} recibe a ${match.awayTeam.name} por ${context.fixture.round ?? 'una nueva jornada'} de ${match.competition}. El historial disponible arroja ${h2h.homeWins} victorias del local, ${h2h.draws} empates y ${h2h.awayWins} triunfos del visitante.`
    : `${match.homeTeam.name} recibe a ${match.awayTeam.name} en ${match.competition}. La ficha se construye con los datos disponibles del proveedor.`;

  return {
    slug: match.slug,
    homeTeam: match.homeTeam.name,
    awayTeam: match.awayTeam.name,
    homeCrestUrl: match.homeTeam.badgeUrl,
    awayCrestUrl: match.awayTeam.badgeUrl,
    competition: match.competition,
    round: context?.fixture.round ?? match.time,
    overview,
    headToHead: h2h ? {
      summary: hasHeadToHead
        ? `El historial disponible reúne ${h2h.matches.length} partido${h2h.matches.length === 1 ? '' : 's'} finalizado${h2h.matches.length === 1 ? '' : 's'}. Debe leerse como contexto, no como predicción.`
        : 'El proveedor no devolvió enfrentamientos directos finalizados para este cruce.',
      matches: h2h.matches.map((item) => ({ date: item.date, home: item.homeTeam, score: item.score, away: item.awayTeam })),
    } : undefined,
    conclusion: providerId === 'api-football'
      ? 'La ficha presenta datos confirmados por API-Football. La cobertura disponible no incluye una recomendación de apuesta ni estadísticas de temporada completas.'
      : 'La ficha presenta los datos disponibles para este partido.',
  };
}

export const editorialMatchPreviews: Record<string, EditorialMatchPreview> = {
  'septemvri-sofia-botev-vratsa-demo': {
    slug: 'septemvri-sofia-botev-vratsa-demo',
    homeTeam: 'FK Septemvri Sofia',
    awayTeam: 'Botev Vratsa',
    homeCrestUrl: 'https://r2.thesportsdb.com/images/media/team/badge/3ss1da1594300740.png',
    awayCrestUrl: 'https://r2.thesportsdb.com/images/media/team/badge/qqbnti1726156886.png',
    competition: 'Parva Liga',
    round: 'Jornada 8',
    overview: 'Septemvri llega mejor posicionado y concede menos goles en el arranque de liga. Botev Vratsa ha sufrido especialmente en defensa, aunque el historial directo reciente evita tratar al local como un favorito absoluto.',
    standings: [
      { team: 'Septemvri Sofia', position: '6.º', points: 8, played: 7, goalsFor: 5, goalsAgainst: 10 },
      { team: 'Botev Vratsa', position: '11.º / 12.º', points: 4, played: 7, goalsFor: 4, goalsAgainst: 15 },
    ],
    recentForm: [
      {
        team: 'Septemvri Sofia',
        record: '2 victorias · 1 empate · 2 derrotas',
        goalsFor: 3,
        goalsAgainst: 7,
        matches: ['Slavia Sofia 1-1 Septemvri', 'Septemvri 1-0 CSKA 1948', 'Spartak Varna 0-1 Septemvri', 'Septemvri 0-3 CSKA Sofia', 'Levski Sofia 3-0 Septemvri'],
      },
      {
        team: 'Botev Vratsa',
        record: '1 victoria · 4 derrotas',
        goalsFor: 2,
        goalsAgainst: 12,
        matches: ['Arda 2-0 Botev Vratsa', 'Botev Vratsa 1-0 Botev Plovdiv', 'CSKA Sofia 5-0 Botev Vratsa', 'Botev Vratsa 0-3 Slavia Sofia', 'Ludogorets 2-1 Botev Vratsa'],
      },
    ],
    headToHead: {
      summary: 'Septemvri no ganó ninguno de los cinco últimos duelos: hubo tres empates y dos victorias de Botev Vratsa. El H2H enfría el favoritismo del local.',
      matches: [
        { date: '10/05/26', home: 'Botev Vratsa', score: '1-1', away: 'Septemvri' },
        { date: '06/04/26', home: 'Septemvri', score: '0-0', away: 'Botev Vratsa' },
        { date: '25/10/25', home: 'Botev Vratsa', score: '2-1', away: 'Septemvri' },
        { date: '02/05/25', home: 'Botev Vratsa', score: '3-2', away: 'Septemvri' },
        { date: '08/02/25', home: 'Septemvri', score: '2-2', away: 'Botev Vratsa' },
      ],
    },
    goalsRead: 'Los dos equipos anotan poco: Septemvri promedia 0,71 goles y Botev 0,57. La diferencia está en la defensa visitante, con 15 goles recibidos en siete jornadas y 12 en los últimos cinco encuentros.',
    model: { homeWin: 48, draw: 31, awayWin: 21, expectedGoals: 'Septemvri 1,15 · 0,65 Botev Vratsa' },
    markets: [
      { label: 'Favorito', value: 'Septemvri Sofia', note: 'Ventaja leve por localía, forma reciente y defensa menos vulnerable.', tone: 'green' },
      { label: 'Resultado protegido', value: '1X', note: 'El historial directo obliga a proteger la selección local.', tone: 'amber' },
      { label: 'Línea de goles', value: 'Under 2,5', note: 'Estimación orientativa: 60-63%.', tone: 'green' },
      { label: 'Ambos marcan', value: 'No', note: 'Señal moderada por la baja producción ofensiva de ambos.', tone: 'slate' },
      { label: 'Marcador probable', value: '1-0', note: 'Alternativa: 2-0 si Botev mantiene su fragilidad defensiva.', tone: 'amber' },
    ],
    conclusion: 'Septemvri es el lado más atractivo de la previa, pero no hay distancia suficiente para una lectura agresiva. El Under 2,5 encaja mejor con el bajo volumen ofensivo y con el tipo de marcadores que ha dejado el cruce.',
  },
};