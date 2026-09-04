import { sportRegistry } from '@/lib/intelligence-s24/sports/shared/sportRegistry';
import type { SportProfile, SportResolverInput } from '@/lib/intelligence-s24/sports/shared/types';

export class SportResolver {
  constructor(private readonly registry = sportRegistry) {}

  resolve(input: SportResolverInput): SportProfile {
    const profile = this.registry.resolve(input);
    if (profile) {
      return profile;
    }

    const fallback = this.registry.resolveById('football');
    if (!fallback) {
      throw new Error('SportResolver misconfiguration: default sport profile is not registered');
    }

    return fallback;
  }
}

export const sportResolver = new SportResolver();
