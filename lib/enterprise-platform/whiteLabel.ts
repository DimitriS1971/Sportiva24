import type { WhiteLabelBranding } from '@/lib/enterprise-platform/types';

export function normalizeWhiteLabelBranding(input: WhiteLabelBranding): WhiteLabelBranding {
  return {
    ...input,
    brandName: input.brandName.trim(),
    customDomain: input.customDomain?.trim().toLowerCase(),
    colorPrimary: input.colorPrimary?.trim(),
    colorAccent: input.colorAccent?.trim(),
  };
}

export function validateWhiteLabelBranding(input: WhiteLabelBranding): string[] {
  const errors: string[] = [];

  if (!input.tenantId.trim()) {
    errors.push('tenantId-required');
  }

  if (!input.brandName.trim()) {
    errors.push('brandName-required');
  }

  if (input.customDomain && !input.customDomain.includes('.')) {
    errors.push('customDomain-invalid');
  }

  return errors;
}
