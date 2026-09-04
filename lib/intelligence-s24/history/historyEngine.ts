import { buildS24EvaluationRecord } from '@/lib/intelligence-s24/history/evaluationLog';
import { s24HistoryRepository } from '@/lib/intelligence-s24/history/historyRepository';
import type { IntelligenceProfile } from '@/lib/domain/intelligenceProfile';
import type {
  BuildS24EvaluationRecordInput,
  S24EvaluationRecord,
  S24ProfileRecord,
} from '@/lib/intelligence-s24/history/learningTypes';

export class S24HistoryEngine {
  registerEvaluation(input: BuildS24EvaluationRecordInput): S24EvaluationRecord {
    const record = buildS24EvaluationRecord(input);
    const saved = s24HistoryRepository.save(record);

    if (input.intelligenceProfile) {
      this.registerProfile(input.intelligenceProfile, saved.id);
    }

    return saved;
  }

  listEvaluations(limit?: number): S24EvaluationRecord[] {
    return s24HistoryRepository.list(limit);
  }

  registerProfile(profile: IntelligenceProfile, sourceEvaluationId?: string): S24ProfileRecord {
    const createdAt = profile.metadata.generatedAt;
    const id = `profile-${profile.identity.type}-${profile.identity.slug}-${createdAt.replace(/[:.]/g, '-')}`;

    return s24HistoryRepository.saveProfile({
      id,
      createdAt,
      profile,
      sourceEvaluationId,
    });
  }

  listProfiles(limit?: number): S24ProfileRecord[] {
    return s24HistoryRepository.listProfiles(limit);
  }

  listProfileData(limit?: number): IntelligenceProfile[] {
    return s24HistoryRepository.listProfileData(limit);
  }

  getMatchHistory(slug: string): S24EvaluationRecord[] {
    return s24HistoryRepository.findByMatchSlug(slug);
  }

  // Placeholder para sprint futuro: registrar resultado real y habilitar comparativas post-partido.
  registerRealOutcome(
    evaluationId: string,
    outcome: {
      recordedAt: string;
      winner: string;
      scoreLabel?: string;
      notes?: string;
      s24IndexReal?: number;
      verdictAccurate?: boolean;
      changedFactors?: Array<{
        key: string;
        title: string;
        direction: 'up' | 'down' | 'neutral';
        note?: string;
      }>;
      realPerformance?: {
        summary?: string;
        homeScore?: number;
        awayScore?: number;
        winner?: string;
      };
      insightEvaluation?: {
        accurate?: boolean;
        score?: number;
      };
      narrativeEvaluation?: {
        accurate?: boolean;
        score?: number;
      };
    },
  ): S24EvaluationRecord | null {
    return s24HistoryRepository.attachRealOutcome(evaluationId, outcome);
  }
}

export const s24HistoryEngine = new S24HistoryEngine();
