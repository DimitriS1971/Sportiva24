import type {
  AccessContext,
  AccessEvaluationResult,
  AuthScope,
  EndpointContract,
} from '@/lib/enterprise-platform/types';

export const ENTERPRISE_AUTH_SCOPES: AuthScope[] = [
  { key: 'analysis:read', description: 'Lectura de analisis S24 por partido.' },
  { key: 'center:read', description: 'Lectura del centro de inteligencia S24.' },
  { key: 'knowledge-graph:read', description: 'Lectura del grafo de conocimiento S24.' },
  { key: 'premium:access', description: 'Acceso a endpoints premium de S24.' },
  { key: 'enterprise:access', description: 'Acceso a endpoints enterprise de S24.' },
  { key: 'tenant:brand', description: 'Acceso a configuraciones white label por tenant.' },
];

export function evaluateEndpointAccess(endpoint: EndpointContract, context: AccessContext): AccessEvaluationResult {
  if (!endpoint.supportedTiers.includes(context.tier)) {
    return {
      allowed: false,
      reason: `tier-not-allowed:${context.tier}`,
      missingScopes: [],
    };
  }

  if (endpoint.auth.requiredTenant && !context.tenantId) {
    return {
      allowed: false,
      reason: 'tenant-required',
      missingScopes: [],
    };
  }

  const missingScopes = endpoint.auth.requiredScopes.filter((scope) => !context.scopes.includes(scope));
  if (missingScopes.length > 0) {
    return {
      allowed: false,
      reason: 'missing-scopes',
      missingScopes,
    };
  }

  return {
    allowed: true,
    reason: 'allowed',
    missingScopes: [],
  };
}
