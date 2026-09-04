import { s24HistoryEngine } from '@/lib/intelligence-s24/history/historyEngine';
import { buildProfileValidationReport, buildValidationDashboard, buildValidationReport } from '@/lib/intelligence-s24/validation/validationEngine';
import { s24ValidationRepository } from '@/lib/intelligence-s24/validation/validationRepository';
import type { IntelligenceProfileValidationReport, ValidationDashboard, ValidationReport } from '@/lib/intelligence-s24/validation/validationTypes';

export class S24ValidationService {
  generateReport(limit?: number): ValidationReport {
    const records = s24HistoryEngine.listEvaluations(limit);
    const report = buildValidationReport({ records });
    return s24ValidationRepository.saveReport(report);
  }

  generateDashboard(limit?: number): ValidationDashboard {
    const report = this.generateReport(limit);
    const dashboard = buildValidationDashboard(report);
    return s24ValidationRepository.saveDashboard(dashboard);
  }

  generateProfileReport(limit?: number): IntelligenceProfileValidationReport {
    const profiles = s24HistoryEngine.listProfileData(limit);
    return buildProfileValidationReport({ profiles });
  }

  latestReport(): ValidationReport | null {
    return s24ValidationRepository.latestReport();
  }

  latestDashboard(): ValidationDashboard | null {
    return s24ValidationRepository.latestDashboard();
  }

  listReports(limit?: number): ValidationReport[] {
    return s24ValidationRepository.listReports(limit);
  }

  listDashboards(limit?: number): ValidationDashboard[] {
    return s24ValidationRepository.listDashboards(limit);
  }
}

export const s24ValidationService = new S24ValidationService();
