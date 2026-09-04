export type ApiSurface = 'public' | 'premium' | 'white-label' | 'enterprise';

export type AuthMethod =
  | 'api-key'
  | 'oauth2-client-credentials'
  | 'jwt-bearer'
  | 'signed-request';

export type ContractFormat = 'json' | 'csv' | 'webhook';

export type ClientTier = 'community' | 'premium' | 'enterprise' | 'white-label';

export type ContractStability = 'experimental' | 'stable' | 'deprecated';

export interface ApiVersion {
  major: number;
  minor: number;
  patch: number;
  label: string;
}

export interface ApiContractRef {
  id: string;
  domain: string;
  version: ApiVersion;
  format: ContractFormat;
  stability: ContractStability;
  summary: string;
}

export interface AuthScope {
  key: string;
  description: string;
}

export interface AuthPolicy {
  method: AuthMethod;
  requiredScopes: string[];
  requiredTenant: boolean;
  requireIpAllowList?: boolean;
}

export interface RateLimitWindow {
  periodSeconds: number;
  requests: number;
}

export interface RateLimitProfile {
  id: string;
  burst: number;
  sustained: RateLimitWindow;
  dailyQuota: number;
}

export interface EndpointContract {
  id: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  surface: ApiSurface;
  contract: ApiContractRef;
  auth: AuthPolicy;
  rateLimitProfileId: string;
  supportedTiers: ClientTier[];
  responseSlaMs: number;
}

export interface LicenseCapability {
  key: string;
  description: string;
}

export interface LicensePolicy {
  tier: ClientTier;
  capabilities: LicenseCapability[];
  maxTenants: number;
  maxApiKeys: number;
  maxContractPins: number;
}

export interface WhiteLabelBranding {
  tenantId: string;
  brandName: string;
  logoUrl?: string;
  colorPrimary?: string;
  colorAccent?: string;
  customDomain?: string;
  localeDefault: 'es' | 'en';
}

export interface EnterprisePlatformSpec {
  generatedAt: string;
  supportedSurfaces: ApiSurface[];
  contracts: ApiContractRef[];
  scopes: AuthScope[];
  endpointRegistry: EndpointContract[];
  rateLimitProfiles: RateLimitProfile[];
  licensePolicies: LicensePolicy[];
}

export interface AccessContext {
  clientId: string;
  tier: ClientTier;
  tenantId?: string;
  scopes: string[];
}

export interface AccessEvaluationResult {
  allowed: boolean;
  reason: string;
  missingScopes: string[];
}

export interface VersionResolutionResult {
  selected: ApiVersion;
  fallbackUsed: boolean;
}

export interface RateLimitState {
  periodStartEpochSeconds: number;
  usedInPeriod: number;
  usedToday: number;
}

export interface RateLimitEvaluation {
  allowed: boolean;
  remainingInPeriod: number;
  remainingToday: number;
  retryAfterSeconds: number;
}
