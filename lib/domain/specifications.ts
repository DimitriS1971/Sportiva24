import type { Match, SportProfile } from '@/lib/domain/entities';

export interface Specification<T> {
  isSatisfiedBy(candidate: T): boolean;
  and(other: Specification<T>): Specification<T>;
  or(other: Specification<T>): Specification<T>;
  not(): Specification<T>;
}

export type MatchSpecification = Specification<Match>;

export type SportProfileSpecification = Specification<SportProfile>;

export interface DomainRule<T> {
  readonly key: string;
  readonly description: string;
  validate(candidate: T): boolean;
}
