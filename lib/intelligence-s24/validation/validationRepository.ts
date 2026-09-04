import type { ValidationDashboard, ValidationReport } from '@/lib/intelligence-s24/validation/validationTypes';

const MAX_REPORTS = 100;

export class S24ValidationRepository {
  private readonly reports: ValidationReport[] = [];
  private readonly dashboards: ValidationDashboard[] = [];

  saveReport(report: ValidationReport): ValidationReport {
    this.reports.unshift(report);
    if (this.reports.length > MAX_REPORTS) {
      this.reports.length = MAX_REPORTS;
    }
    return report;
  }

  saveDashboard(dashboard: ValidationDashboard): ValidationDashboard {
    this.dashboards.unshift(dashboard);
    if (this.dashboards.length > MAX_REPORTS) {
      this.dashboards.length = MAX_REPORTS;
    }
    return dashboard;
  }

  latestReport(): ValidationReport | null {
    return this.reports[0] ?? null;
  }

  latestDashboard(): ValidationDashboard | null {
    return this.dashboards[0] ?? null;
  }

  listReports(limit?: number): ValidationReport[] {
    if (!limit || limit <= 0) {
      return [...this.reports];
    }

    return this.reports.slice(0, limit);
  }

  listDashboards(limit?: number): ValidationDashboard[] {
    if (!limit || limit <= 0) {
      return [...this.dashboards];
    }

    return this.dashboards.slice(0, limit);
  }
}

export const s24ValidationRepository = new S24ValidationRepository();
