import type { Match, Sport } from '@/lib/data/types/domain';

export interface SportAdapter {
  sport: Sport;
  adaptFeaturedMatches(input: unknown[], limit: number): Match[];
}
