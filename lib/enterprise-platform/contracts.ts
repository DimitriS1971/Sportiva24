import type { ApiContractRef, ApiVersion, EndpointContract } from '@/lib/enterprise-platform/types';

const V1_0_0: ApiVersion = { major: 1, minor: 0, patch: 0, label: 'v1.0.0' };

export const ENTERPRISE_CONTRACTS: ApiContractRef[] = [
  {
    id: 's24-match-analysis',
    domain: 'match-analysis',
    version: V1_0_0,
    format: 'json',
    stability: 'stable',
    summary: 'Analisis metodologico de partido con narrativa, insight y veredicto S24.',
  },
  {
    id: 's24-intelligence-center',
    domain: 'intelligence-center',
    version: V1_0_0,
    format: 'json',
    stability: 'stable',
    summary: 'Vista agregada multi-partido para operacion editorial y analitica.',
  },
  {
    id: 's24-knowledge-graph',
    domain: 'knowledge-graph',
    version: V1_0_0,
    format: 'json',
    stability: 'stable',
    summary: 'Nodos y relaciones explicables para consumo de IA hibrida y enterprise.',
  },
];

function findContract(id: string): ApiContractRef {
  const found = ENTERPRISE_CONTRACTS.find((contract) => contract.id === id);
  if (!found) {
    throw new Error(`Contract not found: ${id}`);
  }
  return found;
}

export const ENTERPRISE_ENDPOINT_REGISTRY: EndpointContract[] = [
  {
    id: 'public-match-analysis',
    path: '/api/public/v1/match-analysis/{slug}',
    method: 'GET',
    surface: 'public',
    contract: findContract('s24-match-analysis'),
    auth: {
      method: 'api-key',
      requiredScopes: ['analysis:read'],
      requiredTenant: false,
    },
    rateLimitProfileId: 'public-default',
    supportedTiers: ['community', 'premium', 'enterprise'],
    responseSlaMs: 1500,
  },
  {
    id: 'premium-intelligence-center',
    path: '/api/premium/v1/intelligence-center',
    method: 'GET',
    surface: 'premium',
    contract: findContract('s24-intelligence-center'),
    auth: {
      method: 'jwt-bearer',
      requiredScopes: ['center:read', 'premium:access'],
      requiredTenant: false,
    },
    rateLimitProfileId: 'premium-analytics',
    supportedTiers: ['premium', 'enterprise'],
    responseSlaMs: 1200,
  },
  {
    id: 'enterprise-knowledge-graph',
    path: '/api/enterprise/v1/knowledge-graph',
    method: 'GET',
    surface: 'enterprise',
    contract: findContract('s24-knowledge-graph'),
    auth: {
      method: 'oauth2-client-credentials',
      requiredScopes: ['knowledge-graph:read', 'enterprise:access'],
      requiredTenant: true,
      requireIpAllowList: true,
    },
    rateLimitProfileId: 'enterprise-dedicated',
    supportedTiers: ['enterprise', 'white-label'],
    responseSlaMs: 900,
  },
  {
    id: 'white-label-intelligence-center',
    path: '/api/white-label/v1/intelligence-center',
    method: 'GET',
    surface: 'white-label',
    contract: findContract('s24-intelligence-center'),
    auth: {
      method: 'signed-request',
      requiredScopes: ['center:read', 'tenant:brand'],
      requiredTenant: true,
      requireIpAllowList: true,
    },
    rateLimitProfileId: 'white-label-dedicated',
    supportedTiers: ['white-label', 'enterprise'],
    responseSlaMs: 1000,
  },
];
