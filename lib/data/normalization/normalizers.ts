export function normalizeTeamName(name: string): string {
  return name
    .trim()
    .replace(/\s+/g, ' ')
    .replace('Atletico', 'Atlético')
    .replace('Juventus FC', 'Juventus');
}

export function normalizeLeagueName(name: string): string {
  return name
    .trim()
    .replace('Primera Division', 'LaLiga')
    .replace('UEFA Champions League', 'UEFA CHAMPIONS LEAGUE');
}

export function normalizeLogoUrl(input?: string): string | undefined {
  if (!input) {
    return undefined;
  }

  if (input.startsWith('//')) {
    return `https:${input}`;
  }

  return input;
}

export function normalizeDateToLabel(utcDate: string): string {
  const eventDate = new Date(utcDate);
  const now = new Date();

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const tomorrow = today + 24 * 60 * 60 * 1000;
  const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate()).getTime();

  const hhmm = eventDate.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  });

  if (eventDay === today) return `Hoy, ${hhmm}`;
  if (eventDay === tomorrow) return `Mañana, ${hhmm}`;

  return `${eventDate.toLocaleDateString('es-ES')}, ${hhmm}`;
}

export function normalizeSlug(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function normalizeInternalId(prefix: string, rawId: string | number): string {
  return `${prefix}-${String(rawId).trim()}`;
}
