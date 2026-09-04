import type { ApiVersion, VersionResolutionResult } from '@/lib/enterprise-platform/types';

function semverScore(version: ApiVersion): number {
  return (version.major * 1_000_000) + (version.minor * 1_000) + version.patch;
}

export function resolveBestVersion(available: ApiVersion[], requested?: ApiVersion): VersionResolutionResult {
  if (available.length === 0) {
    throw new Error('No available versions defined.');
  }

  const sorted = [...available].sort((a, b) => semverScore(b) - semverScore(a));

  if (!requested) {
    return {
      selected: sorted[0],
      fallbackUsed: false,
    };
  }

  const exact = sorted.find((version) => (
    version.major === requested.major
    && version.minor === requested.minor
    && version.patch === requested.patch
  ));

  if (exact) {
    return {
      selected: exact,
      fallbackUsed: false,
    };
  }

  const sameMajor = sorted.find((version) => version.major === requested.major);
  if (sameMajor) {
    return {
      selected: sameMajor,
      fallbackUsed: true,
    };
  }

  return {
    selected: sorted[0],
    fallbackUsed: true,
  };
}
