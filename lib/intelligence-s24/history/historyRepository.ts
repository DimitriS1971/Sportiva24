import type { IntelligenceProfile } from '@/lib/domain/intelligenceProfile';
import type { S24EvaluationRecord, S24ProfileRecord } from '@/lib/intelligence-s24/history/learningTypes';

const MAX_RECORDS = 500;

export class S24HistoryRepository {
  private readonly records: S24EvaluationRecord[] = [];
  private readonly profileRecords: S24ProfileRecord[] = [];

  save(record: S24EvaluationRecord): S24EvaluationRecord {
    this.records.unshift(record);

    if (this.records.length > MAX_RECORDS) {
      this.records.length = MAX_RECORDS;
    }

    return record;
  }

  saveProfile(record: S24ProfileRecord): S24ProfileRecord {
    this.profileRecords.unshift(record);

    if (this.profileRecords.length > MAX_RECORDS) {
      this.profileRecords.length = MAX_RECORDS;
    }

    return record;
  }

  list(limit?: number): S24EvaluationRecord[] {
    if (!limit || limit <= 0) {
      return [...this.records];
    }

    return this.records.slice(0, limit);
  }

  listProfiles(limit?: number): S24ProfileRecord[] {
    if (!limit || limit <= 0) {
      return [...this.profileRecords];
    }

    return this.profileRecords.slice(0, limit);
  }

  listProfileData(limit?: number): IntelligenceProfile[] {
    return this.listProfiles(limit).map((record) => record.profile);
  }

  findByMatchSlug(slug: string): S24EvaluationRecord[] {
    return this.records.filter((record) => record.match.slug === slug);
  }

  findById(id: string): S24EvaluationRecord | null {
    return this.records.find((record) => record.id === id) ?? null;
  }

  attachRealOutcome(
    id: string,
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
    const record = this.records.find((entry) => entry.id === id);
    if (!record) {
      return null;
    }

    record.comparison = {
      ...record.comparison,
      status: 'available',
      realOutcome: outcome,
    };

    return record;
  }
}

export const s24HistoryRepository = new S24HistoryRepository();
