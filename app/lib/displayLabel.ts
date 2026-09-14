export function displayLabel(value: string): string {
  const trimmed = value.trim();
  return trimmed ? trimmed.toLocaleUpperCase('es-ES') : value;
}
