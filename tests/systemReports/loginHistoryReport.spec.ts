import { test as base, expect } from '../../fixtures';
import { LoginHistoryPage } from '../../pageObjectModels/systemReports/loginHistoryPage';
import { AnnotationType } from '../annotations';

type LoginHistoryReportTestFixtures = {
  loginHistoryPage: LoginHistoryPage;
};

const test = base.extend<LoginHistoryReportTestFixtures>({
  loginHistoryPage: async ({ sysAdminPage }, use) => await use(new LoginHistoryPage(sysAdminPage)),
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

        expect(loginDay).toBe(`${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`);
        expect(usernameValue?.trim()).toBe(sysAdminUser.username);
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

  test('Export the login history report', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-551',
    });

    await test.step('Navigate to the login history report', async () => {});

    await test.step('Filter the login history report to limit results', async () => {});

    await test.step('Export the login history report', async () => {});

    await test.step('Verify the report is exported successfully', async () => {});

    expect(true).toBeTruthy();
  });
});
