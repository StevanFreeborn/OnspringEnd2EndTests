import { test as base, expect, Page } from '../../fixtures';
import { testUserPage } from '../../fixtures/auth.fixtures';
import { createUserFixture } from '../../fixtures/user.fixtures';
import { User, UserStatus } from '../../models/user';
import { LoginHistoryPage } from '../../pageObjectModels/systemReports/loginHistoryPage';
import { AnnotationType } from '../annotations';

type LoginHistoryReportTestFixtures = {
  loginHistoryPage: LoginHistoryPage;
  testUser: User;
  testUserPage: Page;
};

const test = base.extend<LoginHistoryReportTestFixtures>({
  loginHistoryPage: async ({ sysAdminPage }, use) => await use(new LoginHistoryPage(sysAdminPage)),
  testUser: async ({ browser, sysAdminPage }, use, testInfo) => {
    await createUserFixture(
      {
        browser,
        sysAdminPage,
        sysAdmin: true,
        userStatus: UserStatus.Active,
        roles: [],
      },
      use,
      testInfo
    );
  },
  testUserPage: async ({ browser, testUser }, use, testInfo) =>
    await testUserPage({ browser, user: testUser }, use, testInfo),
});

test.describe('login history report', () => {
  test('Filter the login history report', async ({ loginHistoryPage, sysAdminUser }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-549',
    });

    const today = new Date();

    await test.step('Navigate to the login history report', async () => {
      await loginHistoryPage.goto();
    });

    await test.step('Filter the login history report', async () => {
      await loginHistoryPage.filterReport({
        user: sysAdminUser.fullName,
        dateFilter: {
          type: 'Custom Dates',
          from: today,
          to: today,
        },
      });
    });

    await test.step('Verify the report is filtered correctly', async () => {
      const rows = await loginHistoryPage.getReportRows();

      expect(rows.length).toBeGreaterThanOrEqual(1);

      for (const row of rows) {
        const loginDateCell = row.getByRole('gridcell').nth(1);
        const usernameCell = row.getByRole('gridcell').nth(3);
        const loginDateValue = await loginDateCell.textContent();
        const usernameValue = await usernameCell.textContent();
        const loginDay = loginDateValue?.trim().split(' ')[0];

        expect(loginDay).toBe(`${today.toLocaleDateString('en-US', { timeZone: 'America/Chicago' })}`);
        expect(usernameValue?.trim().toLowerCase()).toBe(sysAdminUser.username.toLowerCase());
      }
    });
  });

  test('Display uses currently logged in', async ({ loginHistoryPage, sysAdminUser }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-550',
    });

    await test.step('Navigate to the login history report', async () => {
      await loginHistoryPage.goto();
    });

    await test.step('Display the users currently logged in', async () => {
      await loginHistoryPage.filterReport({ displayLoggedInUsersOnly: true });
    });

    await test.step('Verify the currently logged in users are displayed', async () => {
      const adminRows = await loginHistoryPage.getReportRowsByText(sysAdminUser.username);

      expect(adminRows.length).toBeGreaterThanOrEqual(1);
    });
  });

  test('Export the login history report', async ({
    testUser,
    testUserPage,
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
    const testUserLoginPage = new LoginHistoryPage(testUserPage);

    await test.step('Navigate to the login history report', async () => {
      await testUserLoginPage.goto();
    });

    await test.step('Filter the login history report to limit results', async () => {
      await testUserLoginPage.filterReport({
        user: testUser.fullName,
        dateFilter: {
          type: 'Custom Dates',
          from: today,
          to: today,
        },
      });
    });

    await test.step('Export the login history report', async () => {
      await testUserLoginPage.exportReport();
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
      await testUserPage.setContent(exportEmailContent);

      const reportDownload = testUserPage.waitForEvent('download');
      await testUserPage.getByRole('link', { name: 'Download the export file' }).click();

      const report = await reportDownload;
      reportPath = await downloadService.saveDownload(report);
    });

    await test.step('Verify report contains expected data', async () => {
      const reportData = sheetParser.parseFile(reportPath);
      expect(reportData).toHaveLength(1);

      const sheet = reportData[0];
      expect(sheet.name).toEqual('Report Data');
      expect(sheet.data.length).toBe(1);

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
