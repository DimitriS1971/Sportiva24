import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/data/config/env', () => ({
  dataEnv: {
    apiFootballApiKey: 'test-api-key',
    apiFootballBaseUrl: 'https://v3.football.api-sports.io',
  },
}));

import { apiFootballProvider } from './apiFootballProvider';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('API-Football fixtures', () => {
  it('returns fixtures from a successful response', async () => {
    const fixtures = [{ fixture: { id: 123 } }];
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ response: fixtures, errors: {} }), { status: 200 }),
    ));

    await expect(apiFootballProvider.getFixturesByDate(new Date('2026-11-24T12:00:00Z')))
      .resolves.toEqual(fixtures);
  });

  it('surfaces provider errors even when the HTTP response is successful', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ response: [], errors: { token: 'Invalid API key' } }), { status: 200 }),
    ));

    await expect(apiFootballProvider.getFixturesByDate(new Date('2026-11-24T12:00:00Z')))
      .rejects.toThrow('API-Football request failed: Invalid API key');
  });

  it('surfaces unsuccessful HTTP status codes', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 429 })));

    await expect(apiFootballProvider.getFixturesByDate(new Date('2026-11-24T12:00:00Z')))
      .rejects.toThrow('API-Football request failed with HTTP 429');
  });
});
