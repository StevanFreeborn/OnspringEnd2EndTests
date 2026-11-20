import { Page } from '@playwright/test';
import { App as ScreenplayApp, FakeDataFactory, SavedReportAsReportDataOnly } from '@stevanfreeborn/onspring-models';
import { ReportQuestions, ReportTasks } from '@stevanfreeborn/onspring-ui';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { App } from '../models/app';
import { SavedReport } from '../models/report';
import { ReportAppPage } from '../pageObjectModels/reports/reportAppPage';
import { ReportPage } from '../pageObjectModels/reports/reportPage';

export class ReportFixtureBuilder {
  private name?: string;
  private security: 'Private to me' | 'Private by Role' | 'Public' = 'Public';

  withName(name: string): this {
    this.name = name;
    return this;
  }

  withSecurity(security: 'Private to me' | 'Private by Role' | 'Public'): this {
    this.security = security;
    return this;
  }

  build() {
    return async (
      { sysAdminActor, app }: { sysAdminActor: WebActor; app: ScreenplayApp },
      use: (report: SavedReportAsReportDataOnly) => Promise<void>
    ) => {
      const report = new SavedReportAsReportDataOnly({
        name: this.name ?? FakeDataFactory.createFakeReportName(),
        appName: app.name,
        security: this.security,
      });

      await sysAdminActor.attemptsTo(ReportTasks.createSavedDataReport(app.id, report));
      report.id = await sysAdminActor.asks(ReportQuestions.currentId());
      await use(report);
    };
  }
}

export class ReportFixture {
  static create(): ReportFixtureBuilder {
    return new ReportFixtureBuilder();
  }
}

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
