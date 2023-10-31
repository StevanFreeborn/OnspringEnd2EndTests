import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { AddRoleAdminPage } from '../../pageObjectModels/addRoleAdminPage';
import { AdminHomePage } from '../../pageObjectModels/adminHomePage';
import { EditRoleAdminPage } from '../../pageObjectModels/editRoleAdminPage';
import { RolesSecurityAdminPage } from '../../pageObjectModels/rolesSecurityAdminPage';
import { AnnotationType } from '../annotations';

type RoleTestFixtures = {
  adminHomePage: AdminHomePage;
  addRoleAdminPage: AddRoleAdminPage;
  editRoleAdminPage: EditRoleAdminPage;
  rolesSecurityAdminPage: RolesSecurityAdminPage;
};

const test = base.extend<RoleTestFixtures>({
  adminHomePage: async ({ sysAdminPage }, use) => {
    const adminHomePage = new AdminHomePage(sysAdminPage);
    await use(adminHomePage);
  },
  addRoleAdminPage: async ({ sysAdminPage }, use) => {
    const addRoleAdminPage = new AddRoleAdminPage(sysAdminPage);
    await use(addRoleAdminPage);
  },
  editRoleAdminPage: async ({ sysAdminPage }, use) => {
    const editRoleAdminPage = new EditRoleAdminPage(sysAdminPage);
    await use(editRoleAdminPage);
  },
  rolesSecurityAdminPage: async ({ sysAdminPage }, use) => {
    const rolesSecurityAdminPage = new RolesSecurityAdminPage(sysAdminPage);
    await use(rolesSecurityAdminPage);
  },
});

test.describe('Role', () => {
  let rolesToDelete: string[] = [];

  test.beforeEach(async ({ adminHomePage }) => {
    await adminHomePage.goto();
  });

  test.afterEach(async ({ rolesSecurityAdminPage }) => {
    await rolesSecurityAdminPage.deleteRoles(rolesToDelete);
    rolesToDelete = [];
  });

  test('Create a Role via the create button in the header of the admin home page', async ({
    adminHomePage,
    addRoleAdminPage,
    editRoleAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-625',
    });

    const roleName = FakeDataFactory.createFakeRoleName();
    rolesToDelete.push(roleName);

    await test.step('Create a new role', async () => {
      await adminHomePage.adminNav.adminCreateButton.hover();
      await adminHomePage.adminNav.adminCreateMenu.waitFor();
      await adminHomePage.adminNav.roleCreateMenuOption.click();
      await addRoleAdminPage.page.waitForLoadState();
      await addRoleAdminPage.nameInput.fill(roleName);

      // TODO: Remove the following when #3983 is fixed
      // https://corp.onspring.com/Content/8/3983
      await addRoleAdminPage.statusToggle.click();
      await addRoleAdminPage.statusToggle.click();

      await addRoleAdminPage.saveRecordButton.click();
    });

    await test.step('Verify the role is created correctly', async () => {
      await editRoleAdminPage.page.waitForLoadState();
      await editRoleAdminPage.page.waitForURL(editRoleAdminPage.pathRegex);

      expect(editRoleAdminPage.page.url()).toMatch(editRoleAdminPage.pathRegex);
      await expect(editRoleAdminPage.nameInput).toHaveValue(roleName);
    });
  });

  test('Create a Role via the create button on the Security tile on the admin home page', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-626',
    });

    // TODO: Implement this test
    expect(false, 'Test not implemented').toBe(true);
  });

  test('Create a Role via the Create Role button on the role home page', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-627',
    });

    // TODO: Implement this test
    expect(false, 'Test not implemented').toBe(true);
  });

  test('Update a role', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-631',
    });

    // TODO: Implement this test
    expect(false, 'Test not implemented').toBe(true);
  });

  test('Create a copy of a role', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-786',
    });

    // TODO: Implement this test
    expect(false, 'Test not implemented').toBe(true);
  });

  test('Delete a Role', async ({ addRoleAdminPage, editRoleAdminPage, rolesSecurityAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-632',
    });

    const roleName = FakeDataFactory.createFakeRoleName();
    const roleRow = rolesSecurityAdminPage.roleGrid.getByRole('row', { name: roleName }).first();

    await test.step('Create role to delete', async () => {
      await addRoleAdminPage.addRole(roleName);
      await addRoleAdminPage.page.waitForURL(editRoleAdminPage.pathRegex);
      await editRoleAdminPage.page.waitForLoadState();
    });

    await test.step('Navigate to the roles security admin page', async () => {
      await rolesSecurityAdminPage.goto();
      await expect(roleRow).toBeAttached();
    });

    await test.step('Delete the role', async () => {
      await roleRow.hover();
      await roleRow.getByTitle('Delete Role').click();
      await rolesSecurityAdminPage.deleteRoleDialog.deleteButton.click();
      await rolesSecurityAdminPage.deleteRoleDialog.waitForDialogToBeDismissed();
      await rolesSecurityAdminPage.page.waitForLoadState('networkidle');
    });

    await test.step('Verify the role is deleted', async () => {
      await expect(roleRow).not.toBeAttached();
    });
  });
});
