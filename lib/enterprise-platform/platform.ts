import { ENTERPRISE_AUTH_SCOPES } from '@/lib/enterprise-platform/auth';
import { ENTERPRISE_CONTRACTS, ENTERPRISE_ENDPOINT_REGISTRY } from '@/lib/enterprise-platform/contracts';
import { ENTERPRISE_LICENSE_POLICIES } from '@/lib/enterprise-platform/licensing';
import { ENTERPRISE_RATE_LIMIT_PROFILES } from '@/lib/enterprise-platform/rateLimits';
import type { EnterprisePlatformSpec } from '@/lib/enterprise-platform/types';

export function buildEnterprisePlatformSpec(): EnterprisePlatformSpec {
  return {
    generatedAt: new Date().toISOString(),
    supportedSurfaces: ['public', 'premium', 'white-label', 'enterprise'],
    contracts: ENTERPRISE_CONTRACTS,
    scopes: ENTERPRISE_AUTH_SCOPES,
    endpointRegistry: ENTERPRISE_ENDPOINT_REGISTRY,
    rateLimitProfiles: ENTERPRISE_RATE_LIMIT_PROFILES,
    licensePolicies: ENTERPRISE_LICENSE_POLICIES,
  };
}
