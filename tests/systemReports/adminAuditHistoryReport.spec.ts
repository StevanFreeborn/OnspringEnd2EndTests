import { expect, test as base, Page } from "../../fixtures";
import { app } from "../../fixtures/app.fixtures";
import { testUserPage } from "../../fixtures/auth.fixtures";
import { createUserFixture } from "../../fixtures/user.fixtures";
import { App } from "../../models/app";
import { User, UserStatus } from "../../models/user";
import { AdminAuditHistoryPage } from "../../pageObjectModels/systemReports/adminAuditHistoryPage";
import { AnnotationType } from "../annotations";

type AdminAuditHistoryTestFixtures = {
  app: App;
  adminAuditHistoryPage: AdminAuditHistoryPage;
  testUser: User;
  testUserPage: Page;
}

const test = base.extend<AdminAuditHistoryTestFixtures>({
  app: app,
  adminAuditHistoryPage: async ({ sysAdminPage }, use) => await use(new AdminAuditHistoryPage(sysAdminPage)),
  testUser: async ({ browser, sysAdminPage }, use) => {
    await createUserFixture(
      {
        browser,
        sysAdminPage,
        sysAdmin: true,
        userStatus: UserStatus.Active,
        roles: [],
      },
      use
    );
  },
  testUserPage: async ({ browser, testUser }, use, testInfo) =>
    await testUserPage({ browser, user: testUser }, use, testInfo),
});

test.describe('admin audit history report', function() {
  test('Filter the Audit History Report', async ({ adminAuditHistoryPage, sysAdminUser, app }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-280',
    });

    await test.step('Navigate to the audit history report', async () => {
      await adminAuditHistoryPage.goto();
    });

    await test.step('Filter the audit history report', async () => {
      await adminAuditHistoryPage.applyFilter({ user: sysAdminUser.fullName, saveType: 'Added', itemType: 'App', appOrSurvey: app.name });
    });

    await test.step('Verify the audit history report has been filtered', async () => {
      const rows = await adminAuditHistoryPage.getRows();

      expect(rows.length).toBe(1);
    });
  });

  test('Export the Audit History Report', async ({
    app,
    sysAdminUser,
    sysAdminEmail,
    testUser,
    testUserPage,
    downloadService,
    sheetParser,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-281',
    });

    test.slow();

    const adminAuditHistoryPage = new AdminAuditHistoryPage(testUserPage);

    await test.step('Navigate to the audit history report', async () => {
      await adminAuditHistoryPage.goto();
    });

    await test.step('Filter the audit history report', async () => {
      await adminAuditHistoryPage.applyFilter({ user: sysAdminUser.fullName, saveType: 'Added', itemType: 'App', appOrSurvey: app.name });
    });

    await test.step('Export the audit history report', async () => {
      await adminAuditHistoryPage.exportReport();
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
      expect(sheet.data).toHaveLength(1);
      expect(sheet.data[0]).toEqual({
        'Date': expect.any(Date),
        'Name': `${sysAdminUser.lastName}, ${sysAdminUser.firstName}`,
        'Type': 'App Added',
        'Details': app.name,
      });
    });
  });
});
