import { test as base, expect, Page } from '../../fixtures';
import { createTestUserPageFixture } from '../../fixtures/auth.fixtures';
import { createRoleFixture } from '../../fixtures/role.fixures';
import { createUserFixture } from '../../fixtures/user.fixtures';
import { Role } from '../../models/role';
import { User, UserStatus } from '../../models/user';
import { EditRoleAdminPage } from '../../pageObjectModels/roles/editRoleAdminPage';
import { RoleConfigurationsReportPage } from '../../pageObjectModels/systemReports/roleConfigurationsReportPage';
import { AnnotationType } from '../annotations';

type RoleConfigurationReportTestFixtures = {
  roleConfigurationsReportPage: RoleConfigurationsReportPage;
  testSystemAdmin: User;
  testSystemAdminPage: Page;
  testRole: Role;
  editRoleAdminPage: EditRoleAdminPage;
};

const test = base.extend<RoleConfigurationReportTestFixtures>({
  roleConfigurationsReportPage: async ({ sysAdminPage }, use) =>
    await use(new RoleConfigurationsReportPage(sysAdminPage)),
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
  testRole: async ({ sysAdminPage }, use) =>
    await createRoleFixture(
      {
        sysAdminPage,
        roleStatus: 'Active',
        appPermissions: [],
      },
      use
    ),
  editRoleAdminPage: async ({ sysAdminPage }, use) => await use(new EditRoleAdminPage(sysAdminPage)),
});

test.describe('role configurations report', () => {
  test('Filter the role configurations report', async ({ roleConfigurationsReportPage, testRole }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-633',
    });

    await test.step('Navigate to the role configurations report', async () => {
      await roleConfigurationsReportPage.goto();
    });

    await test.step('Filter the role configurations report', async () => {
      await roleConfigurationsReportPage.filterByName(testRole.name);
    });

    await test.step('Verify the role configurations report is filtered', async () => {
      const roleItem = await roleConfigurationsReportPage.getRoleItemByName(testRole.name);
      await expect(roleItem).toBeVisible();
    });
  });

  test('Edit a role in the role configurations report', async ({
    roleConfigurationsReportPage,
    testRole,
    editRoleAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-635',
    });

    await test.step('Navigate to the role configurations report', async () => {
      await roleConfigurationsReportPage.goto();
    });

    await test.step("Edit a role's configurations", async () => {
      await roleConfigurationsReportPage.clickEditRole(testRole.name);
      await roleConfigurationsReportPage.page.waitForURL(editRoleAdminPage.pathRegex);
    });

    await test.step('Verify the role configurations have been updated', async () => {
      await expect(roleConfigurationsReportPage.page).toHaveURL(editRoleAdminPage.pathRegex);
      await expect(editRoleAdminPage.generalTab.nameInput).toHaveValue(testRole.name);
    });
  });

  test('Export the role configurations report', async ({
    testRole,
    testSystemAdmin,
    testSystemAdminPage,
    sysAdminEmail,
    downloadService,
    sheetParser,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-636',
    });

    const testUserRoleConfigurationsReportPage = new RoleConfigurationsReportPage(testSystemAdminPage);

    await test.step('Navigate to the role configurations report page', async () => {
      await testUserRoleConfigurationsReportPage.goto();
    });

    await test.step('Export the role configurations report', async () => {
      await testUserRoleConfigurationsReportPage.exportReport();
    });

    let exportEmailContent: string;

    await test.step('Verify the role configurations report is exported', async () => {
      await expect(async () => {
        const searchCriteria = [['TO', testSystemAdmin.email], ['TEXT', 'Role Configurations'], ['UNSEEN']];
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

    await test.step('Download the exported role configurations report', async () => {
      await testSystemAdminPage.setContent(exportEmailContent);

      const reportDownload = testSystemAdminPage.waitForEvent('download');
      await testSystemAdminPage.getByRole('link', { name: 'Download the export file' }).click();
      const report = await reportDownload;
      reportPath = await downloadService.saveDownload(report);
    });

    await test.step('Verify report contains expected data', async () => {
      const reportData = sheetParser.parseFile(reportPath);
      expect(reportData.length).toBeGreaterThan(0);

      const roleFound = reportData.some(sheet => {
        return sheet.data.some((row: Record<string, unknown>) => {
          const nameValue = row['Name'] ?? row['Role Name'] ?? row['Role'];
          return typeof nameValue === 'string' && nameValue.includes(testRole.name);
        });
      });

      expect(roleFound).toBe(true);
    });
  });
});
