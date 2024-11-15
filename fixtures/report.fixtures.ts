import { Page } from '@playwright/test';
import { App } from '../models/app';
import { Report } from '../models/report';
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
    report: Report;
  },
  use: (r: Report) => Promise<void>
) {
  const createdReport = await createReport(sysAdminPage, app, report);
  await use(createdReport);
}

export async function createReport(sysAdminPage: Page, app: App, report: Report) {
  const reportAppPage = new ReportAppPage(sysAdminPage);
  const reportPage = new ReportPage(sysAdminPage);

  await reportAppPage.goto(app.id);
  await reportAppPage.createReport(report);
  await reportAppPage.page.waitForURL(reportPage.pathRegex);
  report.id = reportPage.getReportIdFromUrl();
  return report;
}
