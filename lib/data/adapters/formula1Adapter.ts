import type { SportAdapter } from '@/lib/data/adapters/adapterTypes';
import type { Match } from '@/lib/data/types/domain';

export class Formula1Adapter implements SportAdapter {
  sport = 'formula1' as const;

  adaptFeaturedMatches(input: unknown[], limit: number): Match[] {
    return input.slice(0, limit) as Match[];
  }
}

export const formula1Adapter = new Formula1Adapter();
