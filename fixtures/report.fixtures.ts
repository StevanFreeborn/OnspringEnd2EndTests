import { App, FakeDataFactory, ReportSecurity, SavedReportAsReportDataOnly } from '@stevanfreeborn/onspring-models';
import { ReportQuestions, ReportTasks } from '@stevanfreeborn/onspring-ui';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';

export class ReportFixtureBuilder {
  private name?: string;
  private security: ReportSecurity = 'Public';

  withName(name: string): this {
    this.name = name;
    return this;
  }

  withSecurity(security: ReportSecurity): this {
    this.security = security;
    return this;
  }

  build() {
    return async (
      { sysAdminActor, app }: { sysAdminActor: WebActor; app: App },
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
