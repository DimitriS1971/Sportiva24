import type { EditorialLocale } from '@/lib/intelligence-s24/editorial/editorialDictionary';

export type EditorialTemplateKey =
  | 'titleFavorable'
  | 'titleBalanced'
  | 'titleUncertain'
  | 'strengthsSummary'
  | 'riskSummary'
  | 'factorsSummary'
  | 'executiveClosing'
  | 'methodConclusion';

export const editorialTemplates: Record<EditorialLocale, Record<EditorialTemplateKey, string[]>> = {
  es: {
    titleFavorable: [
      '{team} llega mejor perfilado que {rival} en la previa de este {deporte}',
      'Panorama competitivo favorable para {team} frente a {rival}',
      '{team} parte con ventaja metodologica en el cruce ante {rival}',
    ],
    titleBalanced: [
      '{team} y {rival} llegan con fuerzas parejas y margen corto',
      'Duelo equilibrado entre {team} y {rival} con detalles por resolver',
      'Paridad competitiva entre {team} y {rival} en la previa',
    ],
    titleUncertain: [
      '{team} y {rival} afrontan un escenario abierto con alta incertidumbre',
      'Senales mixtas en la previa de {team} contra {rival}',
      'Cruce exigente entre {team} y {rival} con lectura condicionada',
    ],
    strengthsSummary: [
      'Las fortalezas mas claras de {team} pasan por {factorA} y {factorB}, con impacto directo en el indice.',
      'El mejor tramo de {team} se sostiene en {factorA} junto con {factorB}.',
      '{team} encuentra su diferencial en {factorA} y {factorB} durante este {deporte}.',
    ],
    riskSummary: [
      '{factorA} y {factorB} son los puntos que {rival} puede aprovechar para competir mejor.',
      'Las alertas clave del partido aparecen en {factorA} y {factorB}.',
      'El modelo detecta ajustes pendientes en {factorA} y {factorB} para sostener la ventaja.',
    ],
    factorsSummary: [
      'El S24 Index en este {deporte} combina impulso competitivo, lectura tactica y control del riesgo.',
      'El indice final se explica por el balance entre fortalezas, contexto y estabilidad del rendimiento.',
      'La suma de factores permite entender por que el partido se inclina en pequenos detalles.',
    ],
    executiveClosing: [
      'La lectura final mantiene un tono claro, prudente y apoyado en evidencia.',
      'El cierre evita exageraciones y prioriza lo que muestran los datos.',
      'La sintesis conserva neutralidad tecnica y trazabilidad con el arbol de evidencias.',
    ],
    methodConclusion: [
      'El veredicto se interpreta como lectura de escenario, no como certeza absoluta.',
      'La metodologia prioriza explicabilidad y consistencia por encima de frases tajantes.',
      'El informe mantiene un enfoque objetivo para facilitar una decision informada.',
    ],
  },
  en: {
    titleFavorable: ['The {side} side enters in a favorable competitive moment'],
    titleBalanced: ['Balanced matchup with a slight edge for the {side} side'],
    titleUncertain: ['High-demand contest under uncertainty'],
    strengthsSummary: ['Main strengths appear in {factorA} and {factorB}.'],
    riskSummary: ['{factorA} and {factorB} introduce downside pressure.'],
    factorsSummary: ['Factor contribution explains the resulting S24 Index.'],
    executiveClosing: ['The closing remains professional and traceable.'],
    methodConclusion: ['The verdict is a scenario reading, not a deterministic claim.'],
  },
};
