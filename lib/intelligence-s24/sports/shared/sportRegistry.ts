import { basketballProfile } from '@/lib/intelligence-s24/sports/basketball/config';
import { baseballProfile } from '@/lib/intelligence-s24/sports/baseball/config';
import { cyclingProfile } from '@/lib/intelligence-s24/sports/cycling/config';
import { esportsProfile } from '@/lib/intelligence-s24/sports/esports/config';
import { footballProfile } from '@/lib/intelligence-s24/sports/football/config';
import { formula1Profile } from '@/lib/intelligence-s24/sports/formula1/config';
import { tennisProfile } from '@/lib/intelligence-s24/sports/tennis/config';
import type { SportProfile, SportResolverInput } from '@/lib/intelligence-s24/sports/shared/types';

const ALL_SPORT_PROFILES: SportProfile[] = [
  footballProfile,
  basketballProfile,
  tennisProfile,
  formula1Profile,
  cyclingProfile,
  baseballProfile,
  esportsProfile,
];

function includesNormalized(values: string[], candidate: string): boolean {
  const target = candidate.toLowerCase();
  return values.some((value) => value.toLowerCase() === target);
}

function matchesCompetition(values: string[], competition: string): boolean {
  const normalized = competition.toLowerCase();
  return values.some((value) => normalized.includes(value.toLowerCase()));
}

export class SportRegistry {
  private readonly profilesById = new Map<string, SportProfile>();
  private readonly profilesBySlug = new Map<string, SportProfile>();
  private readonly profiles: SportProfile[] = [];

  constructor(initialProfiles: SportProfile[] = []) {
    initialProfiles.forEach((profile) => this.register(profile));
  }

  register(profile: SportProfile): void {
    const idKey = profile.id.toLowerCase();
    const slugKey = profile.slug.toLowerCase();

    this.profilesById.set(idKey, profile);
    this.profilesBySlug.set(slugKey, profile);

    const existingIndex = this.profiles.findIndex((item) => item.id.toLowerCase() === idKey);
    if (existingIndex >= 0) {
      this.profiles[existingIndex] = profile;
      return;
    }

    this.profiles.push(profile);
  }

  list(): SportProfile[] {
    return [...this.profiles];
  }

  resolveById(id?: string): SportProfile | null {
    if (!id) return null;
    return this.profilesById.get(id.toLowerCase()) ?? null;
  }

  resolveBySlug(slug?: string): SportProfile | null {
    if (!slug) return null;
    return this.profilesBySlug.get(slug.toLowerCase()) ?? null;
  }

  resolveByProvider(providerId?: string): SportProfile | null {
    if (!providerId) return null;

    return this.profiles.find((profile) => includesNormalized(profile.resolutionMatchers.providers, providerId)) ?? null;
  }

  resolveByCompetition(competition?: string): SportProfile | null {
    if (!competition) return null;

    return this.profiles.find((profile) => matchesCompetition(profile.resolutionMatchers.competitions, competition)) ?? null;
  }

  resolve(input: SportResolverInput): SportProfile | null {
    return this.resolveById(input.sportId)
      ?? this.resolveBySlug(input.slug)
      ?? this.resolveByProvider(input.providerId)
      ?? this.resolveByCompetition(input.competition)
      ?? null;
  }
}

export const sportRegistry = new SportRegistry(ALL_SPORT_PROFILES);
