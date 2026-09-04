export type { EditorialLocale, EditorialConcept } from '@/lib/intelligence-s24/editorial/editorialDictionary';
export type { EditorialTransitionKind } from '@/lib/intelligence-s24/editorial/editorialTransitions';
export type { EditorialTemplateKey } from '@/lib/intelligence-s24/editorial/editorialTemplates';
export type { EditorialSynonymKey } from '@/lib/intelligence-s24/editorial/editorialSynonyms';
export type { EditorialEngine, EditorialEngineOptions } from '@/lib/intelligence-s24/editorial/editorialEngine';

export { editorialDictionary } from '@/lib/intelligence-s24/editorial/editorialDictionary';
export { editorialTransitions } from '@/lib/intelligence-s24/editorial/editorialTransitions';
export { editorialTemplates } from '@/lib/intelligence-s24/editorial/editorialTemplates';
export { editorialSynonyms } from '@/lib/intelligence-s24/editorial/editorialSynonyms';
export { createEditorialEngine } from '@/lib/intelligence-s24/editorial/editorialEngine';
export { applyTemplate, ensureTerminalPeriod, joinSentences, safeLower } from '@/lib/intelligence-s24/editorial/editorialGrammar';
