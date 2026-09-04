import type { ClientTier, LicensePolicy } from '@/lib/enterprise-platform/types';

export const ENTERPRISE_LICENSE_POLICIES: LicensePolicy[] = [
  {
    tier: 'community',
    capabilities: [
      { key: 'api.public.read', description: 'Acceso de solo lectura a API publica.' },
    ],
    maxTenants: 0,
    maxApiKeys: 1,
    maxContractPins: 1,
  },
  {
    tier: 'premium',
    capabilities: [
      { key: 'api.public.read', description: 'Acceso de lectura a API publica.' },
      { key: 'api.premium.read', description: 'Acceso de lectura a API premium.' },
    ],
    maxTenants: 0,
    maxApiKeys: 3,
    maxContractPins: 2,
  },
  {
    tier: 'enterprise',
    capabilities: [
      { key: 'api.public.read', description: 'Acceso a API publica.' },
      { key: 'api.premium.read', description: 'Acceso a API premium.' },
      { key: 'api.enterprise.read', description: 'Acceso a API enterprise.' },
      { key: 'contract.version.pin', description: 'Version pinning por cliente.' },
      { key: 'slo.priority.support', description: 'Soporte de prioridad operativa.' },
    ],
    maxTenants: 15,
    maxApiKeys: 30,
    maxContractPins: 20,
  },
  {
    tier: 'white-label',
    capabilities: [
      { key: 'api.enterprise.read', description: 'Acceso enterprise dedicado.' },
      { key: 'tenant.branding.custom', description: 'Branding visual por tenant.' },
      { key: 'tenant.domain.custom', description: 'Dominio custom por tenant.' },
      { key: 'contract.version.pin', description: 'Version pinning por tenant.' },
    ],
    maxTenants: 50,
    maxApiKeys: 60,
    maxContractPins: 40,
  },
];

export function resolveLicensePolicy(tier: ClientTier): LicensePolicy {
  const policy = ENTERPRISE_LICENSE_POLICIES.find((item) => item.tier === tier);
  if (!policy) {
    throw new Error(`License policy not found for tier: ${tier}`);
  }
  return policy;
}
