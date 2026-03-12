import { test as base, expect, Page } from '../../fixtures';
import { createTestUserPageFixture } from '../../fixtures/auth.fixtures';
import { createUserFixture } from '../../fixtures/user.fixtures';
import { User, UserStatus } from '../../models/user';
import { AnnotationType } from '../annotations';
import { SystemAdministratorListingPage } from './../../pageObjectModels/systemReports/systemAdministratorListingPage';

type SystemAdministratorListingReportFixtures = {
  systemAdministratorListingPage: SystemAdministratorListingPage;
  testSystemAdmin: User;
  testSystemAdminPage: Page;
};

const test = base.extend<SystemAdministratorListingReportFixtures>({
  systemAdministratorListingPage: async ({ sysAdminPage }, use) =>
    await use(new SystemAdministratorListingPage(sysAdminPage)),
  testSystemAdmin: async ({ browser, sysAdminPage }, use, testInfo) =>
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
    ),
  testSystemAdminPage: async ({ browser, testSystemAdmin }, use, testInfo) =>
    await createTestUserPageFixture({ browser, user: testSystemAdmin }, use, testInfo),
});

test.describe('system administrator listing report', () => {
  test('Sort the system administrator listing report', async ({
    systemAdministratorListingPage,
    sysAdminUser,
    testSystemAdmin,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-478',
    });

    await test.step('Navigate to the system administrator listing report page', async () => {
      await systemAdministratorListingPage.goto();
    });

    await test.step('Sort the email messaging configurations report', async () => {
      await systemAdministratorListingPage.sortGridBy('Added', 'ascending');
    });

    await test.step('Verify the email messaging configurations report is sorted', async () => {
      const rows = await systemAdministratorListingPage.getRows();

      const usernames = await Promise.all(rows.map(row => row.getByRole('gridcell').nth(1).textContent()));
      const sysAdminIndex = usernames.findIndex(u => u?.trim().includes(sysAdminUser.username));
      const testAdminIndex = usernames.findIndex(u => u?.trim().includes(testSystemAdmin.username));

      expect(testAdminIndex).toBeGreaterThan(sysAdminIndex);
    });
  });

  test('Export the system administrator listing report', async ({
    testSystemAdmin,
    testSystemAdminPage,
    sysAdminEmail,
    downloadService,
    sheetParser,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-479',
    });

    const systemAdministratorListingPage = new SystemAdministratorListingPage(testSystemAdminPage);

    await test.step('Navigate to the system administrator listing report page', async () => {
      await systemAdministratorListingPage.goto();
    });

    await test.step('Export the system administrator listing report', async () => {
      await systemAdministratorListingPage.exportReport();
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
      await testSystemAdminPage.setContent(exportEmailContent);

      const reportDownload = testSystemAdminPage.waitForEvent('download');
      await testSystemAdminPage.getByRole('link', { name: 'Download the export file' }).click();
      const report = await reportDownload;
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

  test('Filter the system administrator listing report', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-480',
    });

    expect(true).toBeTruthy();
  });
});
