import { App, User } from '@stevanfreeborn/onspring-models';
import {
  AdminAuditHistoryReportTargets,
  AdminAuditHistoryReportTasks,
  SystemReportQuestions,
} from '@stevanfreeborn/onspring-ui';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { ActorFixture, AppFixture, expect, test as base, UserFixture } from '../../fixtures';
import { AnnotationType } from '../annotations';

type AdminAuditHistoryTestFixtures = {
  app: App;
  user: User;
  testUserActor: WebActor;
};

const test = base.extend<AdminAuditHistoryTestFixtures>({
  app: AppFixture.create().build(),
  user: UserFixture.create().withStatus('Active').withSysAdmin(true).build(),
  testUserActor: ActorFixture.forUser().build(),
});

test.describe('admin audit history report', function () {
  test('Filter the Audit History Report', async ({ sysAdminActor, sysAdminUser, app }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-280',
    });

    await test.step('Navigate to the audit history report', async () => {
      await sysAdminActor.attemptsTo(AdminAuditHistoryReportTasks.goto());
    });

    await test.step('Filter the audit history report', async () => {
      await sysAdminActor.attemptsTo(
        AdminAuditHistoryReportTasks.applyFilter({
          user: sysAdminUser.fullName,
          saveType: 'Added',
          itemType: 'App',
          appOrSurvey: app.name,
        })
      );
    });

    await test.step('Verify the audit history report has been filtered', async () => {
      await sysAdminActor.browse().check(AdminAuditHistoryReportTargets.rows).hasCount(1);
    });
  });

  test('Export the Audit History Report', async ({
    app,
    sysAdminUser,
    sysAdminEmail,
    user: testUser,
    testUserActor,
    downloadService,
    sheetParser,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-281',
    });

    test.slow();

    await test.step('Navigate to the audit history report', async () => {
      await testUserActor.attemptsTo(AdminAuditHistoryReportTasks.goto());
    });

    await test.step('Filter the audit history report', async () => {
      await testUserActor.attemptsTo(
        AdminAuditHistoryReportTasks.applyFilter({
          user: sysAdminUser.fullName,
          saveType: 'Added',
          itemType: 'App',
          appOrSurvey: app.name,
        })
      );
    });

    await test.step('Export the audit history report', async () => {
      await testUserActor.attemptsTo(AdminAuditHistoryReportTasks.exportReport());
    });

    let exportEmailContent: string;

    await test.step('Verify the audit history report is exported', async () => {
      await expect(async () => {
        const searchCriteria = [['TO', testUser.email], ['TEXT', 'Admin Audit History'], ['UNSEEN']];
        const result = await sysAdminEmail.getEmailByQuery(searchCriteria);

        expect(result.isOk()).toBe(true);

        const email = result.unwrap();

        exportEmailContent = email.html as string;
      }).toPass({
        intervals: [30_000],
        timeout: 300_000,
      });
    });

    let reportPath: string;

    await test.step('Download the exported admin history report', async () => {
      const report = await testUserActor.asks(SystemReportQuestions.downloadedExportFromEmailHtml(exportEmailContent));
      reportPath = await downloadService.saveDownload(report);
    });

    await test.step('Verify report contains expected data', async () => {
      const reportData = sheetParser.parseFile(reportPath);
      expect(reportData).toHaveLength(1);

      const sheet = reportData[0];
      expect(sheet.name).toEqual('Report Data');
      expect(sheet.data).toHaveLength(1);
      expect(sheet.data[0]).toEqual({
        Date: expect.any(Date),
        Name: `${sysAdminUser.lastName}, ${sysAdminUser.firstName}`,
        Type: 'App Added',
        Details: app.name,
      });
    });
  });
});
