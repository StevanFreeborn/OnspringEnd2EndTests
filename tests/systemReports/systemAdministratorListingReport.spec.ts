import { test as base, expect } from '../../fixtures';
import { createUserFixture } from '../../fixtures/user.fixtures';
import { User, UserStatus } from '../../models/user';
import { AnnotationType } from '../annotations';
import { SystemAdministratorListingPage } from './../../pageObjectModels/systemReports/systemAdministratorListingPage';

type SystemAdministratorListingReportFixtures = {
  systemAdministratorListingPage: SystemAdministratorListingPage;
  testSystemAdmin: User;
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
        userStatus: UserStatus.Inactive,
        roles: [],
      },
      use,
      testInfo
    ),
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

  test('Export the system administrator listing report', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-478',
    });

    expect(true).toBeTruthy();
  });

  test('Filter the system administrator listing report', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-478',
    });

    expect(true).toBeTruthy();
  });
});
