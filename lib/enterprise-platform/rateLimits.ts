import type { RateLimitEvaluation, RateLimitProfile, RateLimitState } from '@/lib/enterprise-platform/types';

export const ENTERPRISE_RATE_LIMIT_PROFILES: RateLimitProfile[] = [
  {
    id: 'public-default',
    burst: 20,
    sustained: { periodSeconds: 60, requests: 60 },
    dailyQuota: 5_000,
  },
  {
    id: 'premium-analytics',
    burst: 60,
    sustained: { periodSeconds: 60, requests: 240 },
    dailyQuota: 50_000,
  },
  {
    id: 'enterprise-dedicated',
    burst: 180,
    sustained: { periodSeconds: 60, requests: 900 },
    dailyQuota: 500_000,
  },
  {
    id: 'white-label-dedicated',
    burst: 150,
    sustained: { periodSeconds: 60, requests: 700 },
    dailyQuota: 350_000,
  },
];

export function evaluateRateLimit(profile: RateLimitProfile, state: RateLimitState): RateLimitEvaluation {
  const remainingInPeriod = Math.max(0, profile.sustained.requests - state.usedInPeriod);
  const remainingToday = Math.max(0, profile.dailyQuota - state.usedToday);
  const allowed = remainingInPeriod > 0 && remainingToday > 0;

  return {
    allowed,
    remainingInPeriod,
    remainingToday,
    retryAfterSeconds: allowed ? 0 : profile.sustained.periodSeconds,
  };
}
