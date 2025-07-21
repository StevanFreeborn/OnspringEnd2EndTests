import { test as base, expect, Page } from '../../fixtures';
import { app } from '../../fixtures/app.fixtures';
import { testUserPage } from '../../fixtures/auth.fixtures';
import { createUserFixture } from '../../fixtures/user.fixtures';
import { App } from '../../models/app';
import { User, UserStatus } from '../../models/user';
import { AppAdminPage } from '../../pageObjectModels/apps/appAdminPage';
import { AnnotationType } from '../annotations';

type FieldsAndObjectsReportTestFixtures = {
  app: App;
  appAdminPage: AppAdminPage;
  testUser: User;
  testUserPage: Page;
};

const test = base.extend<FieldsAndObjectsReportTestFixtures>({
  app: app,
  appAdminPage: async ({ sysAdminPage }, use) => await use(new AppAdminPage(sysAdminPage)),
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

test.describe('fields & objects report', () => {
  test("Search an app's Fields & Objects report", async ({ app, appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-53',
    });

    await test.step('Navigate to the app admin page', async () => {
      await appAdminPage.goto(app.id);
    });

    await test.step('Search for a field in the Fields & Objects report', async () => {
      await appAdminPage.layoutTabButton.click();

      await appAdminPage.layoutTab.searchFieldsAndObjectsReport('Record Id');
    });

    await test.step('Verify the field is found in the report', async () => {
      const rows = await appAdminPage.layoutTab.fieldsAndObjectsGrid.locator('.k-grid-content tr').all();
      const fieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: /Record Id/i });

      expect(rows.length).toBe(1);
      await expect(fieldRow).toBeVisible();
    });
  });

  test("Export an app's Fields & Objects report, including the usage.", async ({
    app,
    testUser,
    testUserPage,
    sysAdminEmail,
    downloadService,
    pdfParser,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-54',
    });

    const testUserAppAdminPage = new AppAdminPage(testUserPage);

    await test.step('Navigate to the app admin page', async () => {
      await testUserAppAdminPage.goto(app.id);
    });

    await test.step('Export the Fields & Objects report', async () => {
      await testUserAppAdminPage.layoutTabButton.click();
      await testUserAppAdminPage.layoutTab.exportFieldsAndObjectsReport({
        format: 'PDF',
        fields: ['Name'],
        includeUsage: true,
      });
    });

    let exportEmailContent: string;

    await test.step('Verify the report is exported successfully', async () => {
      await expect(async () => {
        const searchCriteria = [['TO', testUser.email], ['TEXT', `${app.name} Field Report`], ['UNSEEN']];
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

    await test.step('Download the exported report', async () => {
      await testUserPage.setContent(exportEmailContent);

      const reportDownload = testUserPage.waitForEvent('download');
      await testUserPage.getByRole('link', { name: 'Download the export file' }).click();

      const report = await reportDownload;
      reportPath = await downloadService.saveDownload(report);
    });

    await test.step('Verify the downloaded report contains the expected data', async () => {
      const expectedText = ['Record Id', 'General Data', 'Usage Data'];
      const foundExpectedText = await pdfParser.findTextInPDF(reportPath, expectedText);

      expect(foundExpectedText).toBe(true);
    });
  });
});
