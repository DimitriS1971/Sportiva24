import { dataEnv } from '@/lib/data/config/env';
import type { TheSportsDbEvent, TheSportsDbEventsResponse } from '@/lib/data/providers/providerTypes';

export class TheSportsDbProvider {
  readonly providerName = 'thesportsdb.com';

  private formatDate(date: Date): string {
    const y = date.getUTCFullYear();
    const m = String(date.getUTCMonth() + 1).padStart(2, '0');
    const d = String(date.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  async getEventsBySportOnDate(sport: string, date: Date): Promise<TheSportsDbEvent[]> {
    const apiKey = dataEnv.theSportsDbApiKey;
    const dateValue = this.formatDate(date);
    const url = `https://www.thesportsdb.com/api/v1/json/${apiKey}/eventsday.php?d=${dateValue}&s=${encodeURIComponent(sport)}`;

    const response = await fetch(url, {
      next: { revalidate: 600 },
    });

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as TheSportsDbEventsResponse;
    return payload.events ?? [];
  }

  async getEventById(id: string): Promise<TheSportsDbEvent | null> {
    const apiKey = dataEnv.theSportsDbApiKey;
    const url = `https://www.thesportsdb.com/api/v1/json/${apiKey}/lookupevent.php?id=${encodeURIComponent(id)}`;

    const response = await fetch(url, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as TheSportsDbEventsResponse;
    return payload.events?.[0] ?? null;
  }

  async getEventsCountBySportOnDate(sport: string, date: Date): Promise<number> {
    const events = await this.getEventsBySportOnDate(sport, date);
    return events.length;
  }
}

export const theSportsDbProvider = new TheSportsDbProvider();
