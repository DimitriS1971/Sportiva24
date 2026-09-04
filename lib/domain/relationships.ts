export interface DomainRelationship {
  from: string;
  to: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
  required: boolean;
  description: string;
}

export const DOMAIN_RELATIONSHIPS: DomainRelationship[] = [
  {
    from: 'Sport',
    to: 'Competition',
    type: 'one-to-many',
    required: true,
    description: 'Un deporte agrupa varias competiciones',
  },
  {
    from: 'Competition',
    to: 'Season',
    type: 'one-to-many',
    required: true,
    description: 'Una competición se organiza por temporadas',
  },
  {
    from: 'Season',
    to: 'Stage',
    type: 'one-to-many',
    required: false,
    description: 'Una temporada puede dividirse en etapas',
  },
  {
    from: 'Stage',
    to: 'Round',
    type: 'one-to-many',
    required: false,
    description: 'Una etapa puede incluir rondas',
  },
  {
    from: 'Round',
    to: 'Match',
    type: 'one-to-many',
    required: false,
    description: 'Una ronda agrupa partidos',
  },
  {
    from: 'Match',
    to: 'Club',
    type: 'many-to-many',
    required: true,
    description: 'El partido relaciona equipos participantes',
  },
  {
    from: 'Club',
    to: 'Player',
    type: 'one-to-many',
    required: false,
    description: 'Un club tiene múltiples jugadores',
  },
  {
    from: 'Player',
    to: 'Performance',
    type: 'one-to-many',
    required: false,
    description: 'Cada jugador genera registros de rendimiento',
  },
  {
    from: 'Analysis',
    to: 'Narrative',
    type: 'one-to-one',
    required: false,
    description: 'Un análisis puede producir una narrativa editorial',
  },
  {
    from: 'Prediction',
    to: 'Validation',
    type: 'one-to-many',
    required: false,
    description: 'Una predicción se valida contra resultados reales',
  },
  {
    from: 'Match',
    to: 'HistoryRecord',
    type: 'one-to-many',
    required: false,
    description: 'Los cambios y evaluaciones se trazan en historial',
  },
  {
    from: 'Sport',
    to: 'SportProfile',
    type: 'one-to-one',
    required: true,
    description: 'Cada deporte tiene un perfil metodológico S24',
  },
];
