export { ENTERPRISE_CONTRACTS, ENTERPRISE_ENDPOINT_REGISTRY } from '@/lib/enterprise-platform/contracts';
export { ENTERPRISE_AUTH_SCOPES, evaluateEndpointAccess } from '@/lib/enterprise-platform/auth';
export { ENTERPRISE_RATE_LIMIT_PROFILES, evaluateRateLimit } from '@/lib/enterprise-platform/rateLimits';
export { ENTERPRISE_LICENSE_POLICIES, resolveLicensePolicy } from '@/lib/enterprise-platform/licensing';
export { normalizeWhiteLabelBranding, validateWhiteLabelBranding } from '@/lib/enterprise-platform/whiteLabel';
export { resolveBestVersion } from '@/lib/enterprise-platform/versioning';
export { buildEnterprisePlatformSpec } from '@/lib/enterprise-platform/platform';
export type {
  AccessContext,
  AccessEvaluationResult,
  ApiContractRef,
  ApiSurface,
  ApiVersion,
  AuthMethod,
  AuthPolicy,
  AuthScope,
  ClientTier,
  ContractFormat,
  ContractStability,
  EndpointContract,
  EnterprisePlatformSpec,
  LicenseCapability,
  LicensePolicy,
  RateLimitEvaluation,
  RateLimitProfile,
  RateLimitState,
  RateLimitWindow,
  VersionResolutionResult,
  WhiteLabelBranding,
} from '@/lib/enterprise-platform/types';
