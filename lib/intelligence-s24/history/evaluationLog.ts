import type { BuildS24EvaluationRecordInput, S24EvaluationRecord } from '@/lib/intelligence-s24/history/learningTypes';

function createRecordId(slug: string, createdAt: string): string {
  const compactDate = createdAt.replace(/[:.]/g, '-');
  return `s24-${slug}-${compactDate}`;
}

export function buildS24EvaluationRecord(input: BuildS24EvaluationRecordInput): S24EvaluationRecord {
  return {
    id: createRecordId(input.match.slug, input.createdAt),
    createdAt: input.createdAt,
    match: input.match,
    model: input.model,
    provider: input.provider,
    factorsUsed: input.factorsUsed,
    narrativeUsed: input.narrativeUsed,
    insightGenerated: input.insightGenerated,
    verdict: input.verdict,
    metrics: input.metrics,
    intelligenceProfile: input.intelligenceProfile,
    comparison: {
      status: 'pending',
      expectedWinner: input.verdict.competitiveEdge,
      expectedIndex: input.metrics.s24Index,
      expectedConfidence: input.metrics.confidence,
      expectedRisk: input.metrics.risk,
    },
  };
}
