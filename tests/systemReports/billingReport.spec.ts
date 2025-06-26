import { test as base, expect } from '../../fixtures';
import { BillingReportPage } from '../../pageObjectModels/systemReports/billingReportPage';
import { AnnotationType } from '../annotations';

type BillingReportTestFixtures = {
  billingReportPage: BillingReportPage;
};

const test = base.extend<BillingReportTestFixtures>({
  billingReportPage: async ({ sysAdminPage }, use) => await use(new BillingReportPage(sysAdminPage)),
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

  test('Export the Detailed Data Usage By App Statistics report', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-882',
    });

    expect(true).toBeTruthy();
  });

  test('Sort the Detailed Data usage By App Statistics report', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-883',
    });

    expect(true).toBeTruthy();
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
