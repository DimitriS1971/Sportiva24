export function applyTemplate(template: string, variables: Record<string, string>): string {
  return Object.entries(variables).reduce((acc, [key, value]) => {
    return acc.replaceAll(`{${key}}`, value);
  }, template);
}

export function ensureTerminalPeriod(text: string): string {
  const clean = text.trim();
  if (!clean) return '';
  if (/[.!?]$/.test(clean)) return clean;
  return `${clean}.`;
}

export function capitalizeFirst(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function toSentence(text: string): string {
  return ensureTerminalPeriod(capitalizeFirst(text.trim()));
}

export function joinSentences(parts: string[]): string {
  return parts
    .map((part) => toSentence(part))
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function safeLower(text: string): string {
  return text.trim().toLowerCase();
}
