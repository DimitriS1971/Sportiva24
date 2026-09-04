import type { SportAdapter } from '@/lib/data/adapters/adapterTypes';
import type { Match } from '@/lib/data/types/domain';

export class BasketballAdapter implements SportAdapter {
  sport = 'basketball' as const;

  adaptFeaturedMatches(input: unknown[], limit: number): Match[] {
    return input.slice(0, limit) as Match[];
  }
}

export const basketballAdapter = new BasketballAdapter();
