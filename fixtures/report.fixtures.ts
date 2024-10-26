import { Page } from '@playwright/test';
import { App } from '../models/app';
import { Report } from '../models/report';
import { ReportAppPage } from '../pageObjectModels/reports/reportAppPage';
import { ReportPage } from '../pageObjectModels/reports/reportPage';

export async function createReport(sysAdminPage: Page, app: App, report: Report) {
  const reportAppPage = new ReportAppPage(sysAdminPage);
  const reportPage = new ReportPage(sysAdminPage);

  await reportAppPage.goto(app.id);
  await reportAppPage.createReport(report);
  await reportAppPage.page.waitForURL(reportPage.pathRegex);
  report.id = reportPage.getReportIdFromUrl();
  return report;
}
