export function displayLabel(value: string): string {
  const trimmed = value.trim();
  if (!trimmed || trimmed !== trimmed.toLocaleUpperCase('es-ES')) {
    return value;
  }

  const normalized = trimmed.toLocaleLowerCase('es-ES');
  return normalized.charAt(0).toLocaleUpperCase('es-ES') + normalized.slice(1);
}
