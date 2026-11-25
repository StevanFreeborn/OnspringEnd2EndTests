import { User } from '@stevanfreeborn/onspring-models';
import { LoginHistoryReportTargets, LoginHistoryReportTasks, SystemReportQuestions } from '@stevanfreeborn/onspring-ui';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { ActorFixture, expect, test as base, UserFixture } from '../../fixtures';
import { AnnotationType } from '../annotations';

type LoginHistoryReportTestFixtures = {
  user: User;
  testUserActor: WebActor;
};

const test = base.extend<LoginHistoryReportTestFixtures>({
  user: UserFixture.create().withStatus('Active').withSysAdmin(true).build(),
  testUserActor: ActorFixture.forUser().build(),
});

test.describe('login history report', () => {
  test('Filter the login history report', async ({ sysAdminActor, sysAdminUser }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-549',
    });

    const today = new Date();

    await test.step('Navigate to the login history report', async () => {
      await sysAdminActor.attemptsTo(LoginHistoryReportTasks.goto());
    });

    await test.step('Filter the login history report', async () => {
      await sysAdminActor.attemptsTo(
        LoginHistoryReportTasks.filterReport({
          user: sysAdminUser.fullName,
          dateFilter: {
            type: 'Custom Dates',
            from: today,
            to: today,
          },
        })
      );
    });

    await test.step('Verify the report is filtered correctly', async () => {
      const loginDateValues = await sysAdminActor.browse().getAllTexts(LoginHistoryReportTargets.loginDateCells);
      const usernameValues = await sysAdminActor.browse().getAllTexts(LoginHistoryReportTargets.usernameCells);

      expect(loginDateValues.length).toBeGreaterThanOrEqual(1);
      expect(usernameValues).toHaveLength(loginDateValues.length);

      const expectedDay = today.toLocaleDateString('en-US', { timeZone: 'America/Chicago' });

      for (let i = 0; i < loginDateValues.length; i++) {
        const loginDay = loginDateValues[i]?.trim().split(' ')[0];
        expect(loginDay).toBe(expectedDay);
        expect(usernameValues[i]?.trim().toLowerCase()).toBe(sysAdminUser.username.toLowerCase());
      }
    });
  });

  test('Display users currently logged in', async ({ sysAdminActor, sysAdminUser }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-550',
    });

    await test.step('Navigate to the login history report', async () => {
      await sysAdminActor.attemptsTo(LoginHistoryReportTasks.goto());
    });

    await test.step('Display the users currently logged in', async () => {
      await sysAdminActor.attemptsTo(LoginHistoryReportTasks.filterReport({ displayLoggedInUsersOnly: true }));
    });

    await test.step('Verify the currently logged in users are displayed', async () => {
      const adminRowCount = await sysAdminActor
        .browse()
        .count(LoginHistoryReportTargets.rowsByText(sysAdminUser.username));
      expect(adminRowCount).toBeGreaterThanOrEqual(1);
    });
  });

  test('Export the login history report', async ({
    user: testUser,
    testUserActor,
    sysAdminEmail,
    downloadService,
    sheetParser,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-551',
    });

    test.slow();

    const today = new Date();

    await test.step('Navigate to the login history report', async () => {
      await testUserActor.attemptsTo(LoginHistoryReportTasks.goto());
    });

    await test.step('Filter the login history report to limit results', async () => {
      await testUserActor.attemptsTo(
        LoginHistoryReportTasks.filterReport({
          user: testUser.fullName,
          dateFilter: {
            type: 'Custom Dates',
            from: today,
            to: today,
          },
        })
      );
    });

    await test.step('Export the login history report', async () => {
      await testUserActor.attemptsTo(LoginHistoryReportTasks.exportReport());
    });

    let exportEmailContent: string;

    await test.step('Verify the report is exported successfully', async () => {
      await expect(async () => {
        const searchCriteria = [
          ['TO', testUser.email],
          ['SUBJECT', 'Onspring Report Export Complete'],
          ['TEXT', 'Login History'],
          ['UNSEEN'],
        ];
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

    await test.step('Download the exported login history report', async () => {
      const report = await testUserActor.asks(SystemReportQuestions.downloadedExportFromEmailHtml(exportEmailContent));
      reportPath = await downloadService.saveDownload(report);
    });

    await test.step('Verify report contains expected data', async () => {
      const reportData = sheetParser.parseFile(reportPath);
      expect(reportData).toHaveLength(1);

      const sheet = reportData[0];
      expect(sheet.name).toEqual('Report Data');
      expect(sheet.data).toHaveLength(1);

      const headers = Object.keys(sheet.data[0]);
      expect(headers).toEqual(
        expect.arrayContaining([
          'Login Date',
          'Name',
          'Username',
          'User Tier',
          'Email Address',
          'Login URL',
          'Last Activity',
        ])
      );

      const expectedUsernames = [testUser.username];
      const usernames = sheet.data.map(row => row['Username']);
      expect(usernames).toEqual(expect.arrayContaining(expectedUsernames));
    });
  });
});
