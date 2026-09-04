import type { EditorialLocale } from '@/lib/intelligence-s24/editorial/editorialDictionary';

export type EditorialSynonymKey =
  | 'equipo'
  | 'ventaja'
  | 'escenario'
  | 'indicador'
  | 'riesgo'
  | 'confianza'
  | 'rendimiento'
  | 'analisis';

export const editorialSynonyms: Record<EditorialLocale, Record<EditorialSynonymKey, string[]>> = {
  es: {
    equipo: ['equipo', 'conjunto', 'bloque competitivo'],
    ventaja: ['ventaja', 'margen', 'diferencial'],
    escenario: ['escenario', 'contexto', 'marco competitivo'],
    indicador: ['indicador', 'senal', 'referencia metodologica'],
    riesgo: ['riesgo', 'incertidumbre', 'exposicion operativa'],
    confianza: ['confianza', 'robustez', 'consistencia'],
    rendimiento: ['rendimiento', 'desempeno', 'nivel competitivo'],
    analisis: ['analisis', 'lectura', 'evaluacion'],
  },
  en: {
    equipo: ['team'],
    ventaja: ['edge'],
    escenario: ['context'],
    indicador: ['indicator'],
    riesgo: ['risk'],
    confianza: ['confidence'],
    rendimiento: ['performance'],
    analisis: ['analysis'],
  },
};
