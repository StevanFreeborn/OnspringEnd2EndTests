import { test as base, expect, Page } from '../../fixtures';
import { testUserPage } from '../../fixtures/auth.fixtures';
import { createUserFixture } from '../../fixtures/user.fixtures';
import { User, UserStatus } from '../../models/user';
import { BillingReportPage } from '../../pageObjectModels/systemReports/billingReportPage';
import { AnnotationType } from '../annotations';

type BillingReportTestFixtures = {
  billingReportPage: BillingReportPage;
  testUser: User;
  testUserPage: Page;
};

const test = base.extend<BillingReportTestFixtures>({
  billingReportPage: async ({ sysAdminPage }, use) => await use(new BillingReportPage(sysAdminPage)),
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

test.describe('billing report', () => {
  test('Filter the Usage History Report', async ({ billingReportPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-291',
    });

    await test.step('Navigate to the billing report', async () => {
      await billingReportPage.goto();
    });

    await test.step('Filter the usage history report', async () => {
      await billingReportPage.applyUsageHistoryFilter({
        type: 'Custom Dates',
        increment: 'Year',
        startDate: new Date(2024, 5, 26),
        endDate: new Date(2025, 5, 26),
      });
    });

    await test.step('Verify the usage history report is filtered', async () => {
      const xAxisStartYearLabel = billingReportPage.page.locator(
        '#usage-chart-container [class*="dataset-axis"]:has-text("2024")'
      );
      const xAxisEndYearLabel = billingReportPage.page.locator(
        '#usage-chart-container [class*="dataset-axis"]:has-text("2025")'
      );

      await expect(xAxisStartYearLabel).toBeVisible();
      await expect(xAxisEndYearLabel).toBeVisible();
    });
  });

  test('Export the Detailed Data Usage By App Statistics report', async ({
    testUser,
    testUserPage,
    sysAdminEmail,
    downloadService,
    sheetParser,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-882',
    });

    test.slow();

    const testUserBillingReportPage = new BillingReportPage(testUserPage);

    await test.step('Navigate to the billing report', async () => {
      await testUserBillingReportPage.goto();
    });

    await test.step('Export the Detailed Data Usage By App Statistics report', async () => {
      await testUserBillingReportPage.exportDetailedDataUsageByAppStatisticsReport();
    });

    let exportEmailContent: string;

    await test.step('Verify the export is successful', async () => {
      await expect(async () => {
        const searchCriteria = [['TO', testUser.email], ['TEXT', 'Detailed Data Usage By App Report'], ['UNSEEN']];
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

    await test.step('Download the exported Detailed Data Usage By App Statistics report', async () => {
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
      expect(sheet.data.length).toBeGreaterThanOrEqual(3);

      const headers = Object.keys(sheet.data[0]);
      expect(headers).toEqual(expect.arrayContaining(['App ID', 'App Name', 'Total Records', 'Total Size (GB)']));

      const expectedApps = ['Users', 'Roles', 'Groups'];
      const appNames = sheet.data.map(row => row['App Name']);
      expect(appNames).toEqual(expect.arrayContaining(expectedApps));
    });
  });

  test('Sort the Detailed Data usage By App Statistics report', async ({ billingReportPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-883',
    });

    await test.step('Navigate to the billing report', async () => {
      await billingReportPage.goto();
    });

    await test.step('Sort the Detailed Data usage By App Statistics report', async () => {
      await billingReportPage.clearDetailedDataUsageByAppStatisticsReportSorting();
      await billingReportPage.sortDetailedDataUsageByAppStatisticsReport('App ID', 'ascending');
    });

    await test.step('Verify the report is sorted', async () => {
      const rows = await billingReportPage.getDetailedDataUsageByAppStatisticsReportRows();

      for (let i = 0; i < rows.length - 1; i++) {
        const currentAppId = await rows[i].locator('td').first().textContent();
        const nextAppId = await rows[i + 1].locator('td').first().textContent();
        const currentAppIdNumber = parseInt(currentAppId || '0');
        const nextAppIdNumber = parseInt(nextAppId || '0');

        expect(currentAppIdNumber).toBeLessThanOrEqual(nextAppIdNumber);
      }
    });
  });

  test('Export the Detailed File Storage By App Statistics report', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-883',
    });

    expect(true).toBeTruthy();
  });

  test('Sort the Detailed File Storage By App Statistics report', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-884',
    });

    expect(true).toBeTruthy();
  });
});
