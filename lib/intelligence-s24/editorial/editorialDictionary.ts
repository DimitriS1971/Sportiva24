export type EditorialLocale = 'es' | 'en';

export type EditorialConcept =
  | 'formPositive'
  | 'formNegative'
  | 'attackPositive'
  | 'defensePositive'
  | 'riskHigh'
  | 'riskMedium'
  | 'riskLow'
  | 'confidenceHigh'
  | 'confidenceMedium'
  | 'confidenceLow'
  | 'homeAdvantage'
  | 'momentumPositive'
  | 'calendarDemanding'
  | 'fatigueImpact';

export const editorialDictionary: Record<EditorialLocale, Record<EditorialConcept, string[]>> = {
  es: {
    formPositive: [
      'atraviesa un buen momento',
      'mantiene una dinamica favorable',
      'llega en una racha positiva',
      'atraviesa una etapa competitiva solida',
      'sostiene un rendimiento consistente',
      'llega fortalecido para este cruce',
    ],
    formNegative: [
      'atraviesa un momento irregular',
      'evidencia dificultades recientes',
      'busca recuperar consistencia',
      'llega con resultados poco convincentes',
    ],
    attackPositive: [
      'muestra produccion ofensiva sostenida',
      'genera volumen de ataque con regularidad',
      'presenta eficiencia ofensiva competitiva',
      'consigue activar zonas de finalizacion con continuidad',
      'llega con buena pegada en los tramos clave',
    ],
    defensePositive: [
      'conserva una estructura defensiva fiable',
      'reduce espacios con buena disciplina tactica',
      'sostiene niveles defensivos estables',
      'mantiene una contencion eficaz ante escenarios de presion',
      'compite bien en duelos individuales y coberturas',
    ],
    riskHigh: [
      'el riesgo operativo se mantiene elevado',
      'la incertidumbre del escenario sigue siendo alta',
      'el contexto conserva un nivel de riesgo significativo',
    ],
    riskMedium: [
      'el riesgo permanece en una franja intermedia',
      'la incertidumbre se ubica en un nivel moderado',
      'el modelo detecta un riesgo medio controlable',
    ],
    riskLow: [
      'el riesgo se mantiene contenido',
      'la incertidumbre del escenario es acotada',
      'el nivel de riesgo resulta bajo para la lectura metodologica',
    ],
    confidenceHigh: [
      'la confianza metodologica respalda la lectura',
      'la robustez de senales sostiene una confianza alta',
      'el informe opera con alta consistencia de evidencia',
    ],
    confidenceMedium: [
      'la confianza es intermedia y exige lectura contextual',
      'la consistencia de evidencia es moderada',
      'el nivel de confianza sugiere prudencia operativa',
    ],
    confidenceLow: [
      'la confianza es limitada y condiciona la interpretacion',
      'la evidencia disponible impone cautela adicional',
      'la confianza baja recomienda una lectura conservadora',
    ],
    homeAdvantage: [
      'la localia aporta un diferencial tactico',
      'la condicion de local agrega estabilidad competitiva',
      'el contexto de sede favorece al equipo que juega en casa',
    ],
    momentumPositive: [
      'el momentum reciente inclina la balanza',
      'la inercia competitiva favorece su desempeno',
      'la secuencia reciente sostiene una trayectoria ascendente',
      'llega con mejor ritmo de competencia',
    ],
    calendarDemanding: [
      'el calendario introduce exigencia acumulada',
      'la carga competitiva del calendario condiciona el margen',
      'la agenda reciente impone una demanda fisica relevante',
    ],
    fatigueImpact: [
      'la fatiga puede reducir la ventaja inicial',
      'el desgaste aparece como variable de ajuste',
      'la gestion de energia sera clave para sostener rendimiento',
      'el cierre del partido puede depender de la reserva fisica',
    ],
  },
  en: {
    formPositive: ['shows positive form'],
    formNegative: ['shows inconsistent form'],
    attackPositive: ['maintains offensive efficiency'],
    defensePositive: ['keeps defensive structure'],
    riskHigh: ['operational risk remains high'],
    riskMedium: ['risk stays at a moderate level'],
    riskLow: ['risk remains controlled'],
    confidenceHigh: ['confidence supports the analysis'],
    confidenceMedium: ['confidence is moderate'],
    confidenceLow: ['confidence is limited'],
    homeAdvantage: ['home context provides an edge'],
    momentumPositive: ['recent momentum supports performance'],
    calendarDemanding: ['schedule load is demanding'],
    fatigueImpact: ['fatigue may reduce upside'],
  },
};
