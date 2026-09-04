import type { S24NarrativeFactor, S24NarrativeTeamIndicator } from '@/lib/intelligence-s24/narrativa/narrativeTypes';

export function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .length;
}

export function toSentence(text: string): string {
  const cleaned = text.trim();
  if (!cleaned) return '';
  if (/[.!?]$/.test(cleaned)) return cleaned;
  return `${cleaned}.`;
}

export function joinSentences(parts: string[]): string {
  return parts
    .map((part) => toSentence(part))
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function ensureWordRange(base: string, minWords: number, maxWords: number, fillers: string[]): string {
  let result = base.trim();
  let idx = 0;

  while (countWords(result) < minWords && idx < fillers.length) {
    result = joinSentences([result, fillers[idx]]);
    idx += 1;
  }

  const words = result.split(/\s+/).filter(Boolean);
  if (words.length > maxWords) {
    return `${words.slice(0, maxWords).join(' ')}.`;
  }

  return result;
}

export function formatList(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} y ${items[1]}`;
  return `${items.slice(0, -1).join(', ')} y ${items[items.length - 1]}`;
}

export function sortFactorsByImpact(factors: S24NarrativeFactor[]): S24NarrativeFactor[] {
  return [...factors].sort((a, b) => (b.contributionPoints / Math.max(1, b.maxPoints)) - (a.contributionPoints / Math.max(1, a.maxPoints)));
}

export function topFactors(factors: S24NarrativeFactor[], count: number): S24NarrativeFactor[] {
  return sortFactorsByImpact(factors).slice(0, count);
}

export function lowFactors(factors: S24NarrativeFactor[], count: number): S24NarrativeFactor[] {
  return sortFactorsByImpact(factors).reverse().slice(0, count);
}

export function getTeamBySide(teams: S24NarrativeTeamIndicator[], side: 'local' | 'visitante'): S24NarrativeTeamIndicator | null {
  return teams.find((team) => team.side === side) ?? null;
}
