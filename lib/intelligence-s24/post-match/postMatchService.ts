import { s24HistoryEngine } from '@/lib/intelligence-s24/history/historyEngine';
import { s24ValidationService } from '@/lib/intelligence-s24/validation/validationService';
import { buildPostMatchReport } from '@/lib/intelligence-s24/post-match/postMatchEngine';
import type { PostMatchReport } from '@/lib/intelligence-s24/post-match/postMatchTypes';

export class S24PostMatchService {
  buildFromEvaluation(evaluationId: string): PostMatchReport | null {
    const records = s24HistoryEngine.listEvaluations();
    const record = records.find((entry) => entry.id === evaluationId);
    if (!record) {
      return null;
    }

    const validationReport = s24ValidationService.generateReport();
    const sample = validationReport.samples.find((entry) => entry.evaluationId === evaluationId);

    return buildPostMatchReport({
      record,
      validationSample: sample,
    });
  }

  buildLatestBySlug(slug: string): PostMatchReport | null {
    const history = s24HistoryEngine.getMatchHistory(slug);
    if (history.length === 0) {
      return null;
    }

    return this.buildFromEvaluation(history[0].id);
  }
}

export const s24PostMatchService = new S24PostMatchService();
