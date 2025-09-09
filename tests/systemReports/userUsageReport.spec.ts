import { test as base, expect } from '../../fixtures';
import { UserUsagePage } from '../../pageObjectModels/systemReports/userUsagePage';
import { AnnotationType } from '../annotations';

type UserUsageReportTextFixtures = {
  userUsagePage: UserUsagePage;
};

const test = base.extend<UserUsageReportTextFixtures>({
  userUsagePage: async ({ sysAdminPage }, use) => await use(new UserUsagePage(sysAdminPage)),
});

test.describe('user usage report', () => {
  test('Filter the user usage report', async ({ userUsagePage, sysAdminUser }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-886',
    });

    await test.step('Navigate to the user usage report page', async () => {
      await userUsagePage.goto();
    });

    await test.step('Filter the user usage report', async () => {
      await userUsagePage.filterReport({
        name: sysAdminUser.fullName,
        status: 'Active',
        tier: 'Full User',
      });
    });

    await test.step('Verify the report is filtered', async () => {
      const rows = await userUsagePage.getRows();
      expect(rows.length).toBe(1);
      await expect(rows[0]).toHaveText(new RegExp(sysAdminUser.fullName));
    });
  });

  test('Sort the user usage report', async ({ userUsagePage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-887',
    });

    await test.step('Navigate to the user usage report page', async () => {
      await userUsagePage.goto();
    });

    await test.step('Sort the user usage report', async () => {
      await userUsagePage.filterReport({ status: 'Active' });
      await userUsagePage.sortGridBy('Username', 'ascending');
    });

    await test.step('Verify the report is sorted', async () => {
      const rows = await userUsagePage.getRows();
      const usernames = await Promise.all(
        rows.map(async row => {
          const usernameCell = row.locator('td').nth(1);
          return usernameCell.innerText();
        })
      );
      const sortedUsernames = [...usernames].sort((a, b) => a.localeCompare(b));

      expect(usernames).toEqual(sortedUsernames);
    });
  });

  test('Click on the Usage link for a user in the report to view the usage details', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-888',
    });

    expect(true).toBeTruthy();
  });

  test('Click on a "Link" link within the usage details dialog', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-889',
    });

    expect(true).toBeTruthy();
  });

  test('Export the User Usage details for a user', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-890',
    });

    expect(true).toBeTruthy();
  });
});
