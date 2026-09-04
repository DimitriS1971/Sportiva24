import {
  editorialDictionary,
  type EditorialConcept,
  type EditorialLocale,
} from '@/lib/intelligence-s24/editorial/editorialDictionary';
import { applyTemplate } from '@/lib/intelligence-s24/editorial/editorialGrammar';
import {
  editorialTemplates,
  type EditorialTemplateKey,
} from '@/lib/intelligence-s24/editorial/editorialTemplates';
import {
  editorialTransitions,
  type EditorialTransitionKind,
} from '@/lib/intelligence-s24/editorial/editorialTransitions';
import {
  editorialSynonyms,
  type EditorialSynonymKey,
} from '@/lib/intelligence-s24/editorial/editorialSynonyms';

interface EditorialPoolMap {
  transition: EditorialTransitionKind;
  template: EditorialTemplateKey;
  concept: EditorialConcept;
  synonym: EditorialSynonymKey;
}

export interface EditorialEngineOptions {
  locale?: EditorialLocale;
  seed?: number;
}

interface EditorialState {
  locale: EditorialLocale;
  seed: number;
  cursor: number;
  used: Set<string>;
}

function nextIndex(state: EditorialState, size: number): number {
  if (size <= 0) return 0;
  const value = (state.seed + state.cursor) % size;
  state.cursor += 1;
  return value;
}

function buildEntryKey(kind: keyof EditorialPoolMap, key: string, value: string): string {
  return `${kind}:${key}:${value}`;
}

function pickUnique(state: EditorialState, kind: keyof EditorialPoolMap, key: string, values: string[]): string {
  if (values.length === 0) {
    return '';
  }

  const start = nextIndex(state, values.length);

  for (let offset = 0; offset < values.length; offset += 1) {
    const idx = (start + offset) % values.length;
    const candidate = values[idx];
    const usedKey = buildEntryKey(kind, key, candidate);

    if (!state.used.has(usedKey)) {
      state.used.add(usedKey);
      return candidate;
    }
  }

  const fallback = values[start];
  state.used.add(buildEntryKey(kind, key, fallback));
  return fallback;
}

function normalizeLocale(locale?: EditorialLocale): EditorialLocale {
  if (locale === 'en') return 'en';
  return 'es';
}

export interface EditorialEngine {
  locale: EditorialLocale;
  pickTransition: (kind: EditorialTransitionKind) => string;
  pickTemplate: (key: EditorialTemplateKey, variables?: Record<string, string>) => string;
  pickConcept: (key: EditorialConcept) => string;
  pickSynonym: (key: EditorialSynonymKey) => string;
}

export function createEditorialEngine(options: EditorialEngineOptions = {}): EditorialEngine {
  const locale = normalizeLocale(options.locale);
  const state: EditorialState = {
    locale,
    seed: Math.abs(Math.trunc(options.seed ?? 13)),
    cursor: 0,
    used: new Set<string>(),
  };

  return {
    locale,
    pickTransition(kind) {
      const values = editorialTransitions[state.locale][kind] ?? [];
      return pickUnique(state, 'transition', kind, values);
    },
    pickTemplate(key, variables = {}) {
      const values = editorialTemplates[state.locale][key] ?? [];
      const template = pickUnique(state, 'template', key, values);
      return applyTemplate(template, variables);
    },
    pickConcept(key) {
      const values = editorialDictionary[state.locale][key] ?? [];
      return pickUnique(state, 'concept', key, values);
    },
    pickSynonym(key) {
      const values = editorialSynonyms[state.locale][key] ?? [];
      return pickUnique(state, 'synonym', key, values);
    },
  };
}
