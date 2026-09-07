import type { SportCode } from '@/lib/domain/entities';

const defaultActiveSports: SportCode[] = ['football'];

const allSports: SportCode[] = ['football', 'basketball', 'tennis', 'formula1', 'cycling', 'baseball', 'esports'];

function parseActiveSportsFromEnv(value?: string): Set<SportCode> {
  if (!value) {
    return new Set(defaultActiveSports);
  }

  const requested = value
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  const allowed = new Set(allSports);
  const parsed = requested.filter((item): item is SportCode => allowed.has(item as SportCode));

  return new Set(parsed.length > 0 ? parsed : defaultActiveSports);
}

const activeSportSet = new Set<SportCode>(['football']);

export const activeSportsMap: Record<SportCode, boolean> = {
  football: activeSportSet.has('football'),
  basketball: activeSportSet.has('basketball'),
  tennis: activeSportSet.has('tennis'),
  formula1: activeSportSet.has('formula1'),
  cycling: activeSportSet.has('cycling'),
  baseball: activeSportSet.has('baseball'),
  esports: activeSportSet.has('esports'),
};

export function isSportActive(sport: SportCode): boolean {
  return activeSportsMap[sport];
}
