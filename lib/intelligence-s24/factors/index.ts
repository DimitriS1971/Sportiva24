export { type S24FactorModule } from '@/lib/intelligence-s24/factors/base';
export { recentFormFactor } from '@/lib/intelligence-s24/factors/recentFormFactor';
export { offensivePerformanceFactor } from '@/lib/intelligence-s24/factors/offensivePerformanceFactor';
export { defensivePerformanceFactor } from '@/lib/intelligence-s24/factors/defensivePerformanceFactor';
export { squadQualityFactor } from '@/lib/intelligence-s24/factors/squadQualityFactor';
export { squadAvailabilityFactor } from '@/lib/intelligence-s24/factors/squadAvailabilityFactor';
export { fatigueFactor } from '@/lib/intelligence-s24/factors/fatigueFactor';
export { matchContextFactor } from '@/lib/intelligence-s24/factors/matchContextFactor';
export { headToHeadFactor } from '@/lib/intelligence-s24/factors/headToHeadFactor';

import { type S24FactorModule } from '@/lib/intelligence-s24/factors/base';
import { defensivePerformanceFactor } from '@/lib/intelligence-s24/factors/defensivePerformanceFactor';
import { fatigueFactor } from '@/lib/intelligence-s24/factors/fatigueFactor';
import { headToHeadFactor } from '@/lib/intelligence-s24/factors/headToHeadFactor';
import { matchContextFactor } from '@/lib/intelligence-s24/factors/matchContextFactor';
import { offensivePerformanceFactor } from '@/lib/intelligence-s24/factors/offensivePerformanceFactor';
import { recentFormFactor } from '@/lib/intelligence-s24/factors/recentFormFactor';
import { squadAvailabilityFactor } from '@/lib/intelligence-s24/factors/squadAvailabilityFactor';
import { squadQualityFactor } from '@/lib/intelligence-s24/factors/squadQualityFactor';

export const S24_FACTOR_MODULES: S24FactorModule[] = [
	recentFormFactor,
	offensivePerformanceFactor,
	defensivePerformanceFactor,
	squadQualityFactor,
	squadAvailabilityFactor,
	fatigueFactor,
	matchContextFactor,
	headToHeadFactor,
];

export const S24_FACTOR_MODULE_MAP: Record<string, S24FactorModule> = Object.fromEntries(
	S24_FACTOR_MODULES.map((factor) => [factor.key, factor]),
);
