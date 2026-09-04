import type { EditorialLocale } from '@/lib/intelligence-s24/editorial/editorialDictionary';

export type EditorialTransitionKind = 'opening' | 'contrast' | 'continuity' | 'closing' | 'paragraphStart';

export const editorialTransitions: Record<EditorialLocale, Record<EditorialTransitionKind, string[]>> = {
  es: {
    opening: [
      'En la previa de este cruce,',
      'Con el panorama actual sobre la mesa,',
      'Mirando el partido desde el rendimiento reciente,',
      'En el contexto competitivo de hoy,',
    ],
    contrast: [
      'Eso si,',
      'Al mismo tiempo,',
      'Del otro lado,',
      'Aun asi,',
    ],
    continuity: [
      'En esa linea,',
      'Ademas,',
      'Con esos datos,',
      'Siguiendo esa lectura,',
    ],
    closing: [
      'Para cerrar,',
      'En resumen del partido,',
      'Como lectura final,',
      'Con esta foto del encuentro,',
    ],
    paragraphStart: [
      'Vale la pena remarcar que',
      'Un punto clave es que',
      'Los datos muestran que',
      'Al comparar ambos equipos, se ve que',
    ],
  },
  en: {
    opening: ['From a methodological standpoint,'],
    contrast: ['However,'],
    continuity: ['Additionally,'],
    closing: ['As a final methodological note,'],
    paragraphStart: ['It is relevant to note that'],
  },
};
