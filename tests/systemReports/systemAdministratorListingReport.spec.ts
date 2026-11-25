import { User } from '@stevanfreeborn/onspring-models';
import {
  SystemAdministratorListingReportTargets,
  SystemAdministratorListingReportTasks,
  SystemReportQuestions,
} from '@stevanfreeborn/onspring-ui';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { ActorFixture, expect, test as base, UserFixture } from '../../fixtures';
import { AnnotationType } from '../annotations';

type SystemAdministratorListingReportFixtures = {
  user: User;
  testSystemAdminActor: WebActor;
};

const test = base.extend<SystemAdministratorListingReportFixtures>({
  user: UserFixture.create().withStatus('Active').withSysAdmin(true).build(),
  testSystemAdminActor: ActorFixture.forUser().build(),
});

test.describe('system administrator listing report', () => {
  test('Sort the system administrator listing report', async ({
    sysAdminActor,
    sysAdminUser,
    user: testSystemAdmin,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-478',
    });

    await test.step('Navigate to the system administrator listing report page', async () => {
      await sysAdminActor.attemptsTo(SystemAdministratorListingReportTasks.goto());
    });

    await test.step('Sort the email messaging configurations report', async () => {
      await sysAdminActor.attemptsTo(SystemAdministratorListingReportTasks.sortGridBy('Added', 'ascending'));
    });

    await test.step('Verify the email messaging configurations report is sorted', async () => {
      const usernames = await sysAdminActor.browse().getAllTexts(SystemAdministratorListingReportTargets.usernameCells);
      const sysAdminIndex = usernames.findIndex(u => u?.trim().includes(sysAdminUser.username));
      const testAdminIndex = usernames.findIndex(u => u?.trim().includes(testSystemAdmin.username));

      expect(testAdminIndex).toBeGreaterThan(sysAdminIndex);
    });
  });

  test('Export the system administrator listing report', async ({
    user: testSystemAdmin,
    testSystemAdminActor,
    sysAdminEmail,
    downloadService,
    sheetParser,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-479',
    });

    await test.step('Navigate to the system administrator listing report page', async () => {
      await testSystemAdminActor.attemptsTo(SystemAdministratorListingReportTasks.goto());
    });

    await test.step('Export the system administrator listing report', async () => {
      await testSystemAdminActor.attemptsTo(SystemAdministratorListingReportTasks.exportReport());
    });

    let exportEmailContent: string;

    await test.step('Verify the system administrator listing report is exported', async () => {
      await expect(async () => {
        const searchCriteria = [['TO', testSystemAdmin.email], ['TEXT', 'System Administrator Listing'], ['UNSEEN']];
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

    await test.step('Download the exported system administrator listing report', async () => {
      const report = await testSystemAdminActor.asks(
        SystemReportQuestions.downloadedExportFromEmailHtml(exportEmailContent)
      );
      reportPath = await downloadService.saveDownload(report);
    });

    await test.step('Verify report contains expected data', async () => {
      const reportData = sheetParser.parseFile(reportPath);
      expect(reportData).toHaveLength(1);

      const sheet = reportData[0];
      expect(sheet.name).toEqual('Report Data');
      expect(sheet.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            Username: testSystemAdmin.username,
          }),
        ])
      );
    });
  });

  test('Filter the system administrator listing report', async ({ sysAdminActor, user: testSystemAdmin }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-480',
    });

    await test.step('Navigate to the system administrator listing report page', async () => {
      await sysAdminActor.attemptsTo(SystemAdministratorListingReportTasks.goto());
    });

    await test.step('Filter the system administrator listing report', async () => {
      await sysAdminActor.attemptsTo(
        SystemAdministratorListingReportTasks.filterReport({
          dateFilter: { type: 'Last 24 Hours' },
        })
      );
    });

    await test.step('Verify the system administrator listing report is filtered', async () => {
      await sysAdminActor
        .browse()
        .check(SystemAdministratorListingReportTargets.rowByText(testSystemAdmin.email))
        .isVisible();
    });
  });
});
