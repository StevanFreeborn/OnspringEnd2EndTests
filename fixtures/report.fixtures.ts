import { Page } from '@playwright/test';
import { App } from '../models/app';
import { SavedReport } from '../models/report';
import { ReportAppPage } from '../pageObjectModels/reports/reportAppPage';
import { ReportPage } from '../pageObjectModels/reports/reportPage';

export async function createReportFixture(
  {
    sysAdminPage,
    app,
    report,
  }: {
    sysAdminPage: Page;
    app: App;
    report: SavedReport;
  },
  use: (r: SavedReport) => Promise<void>
) {
  const createdReport = await createReport(sysAdminPage, app, report);
  await use(createdReport);
}

export async function createReport(sysAdminPage: Page, app: App, report: SavedReport) {
  const reportAppPage = new ReportAppPage(sysAdminPage);
  const reportPage = new ReportPage(sysAdminPage);

  await reportAppPage.goto(app.id);
  await reportAppPage.createReport(report);
  await reportAppPage.page.waitForURL(reportPage.pathRegex);
  await reportPage.waitUntilLoaded();
  report.id = reportPage.getReportIdFromUrl();
  return report;
}
