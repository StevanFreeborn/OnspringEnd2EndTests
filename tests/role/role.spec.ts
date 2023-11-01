import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { AddRoleAdminPage } from '../../pageObjectModels/addRoleAdminPage';
import { AdminHomePage } from '../../pageObjectModels/adminHomePage';
import { CopyRoleAdminPage } from '../../pageObjectModels/copyRoleAdminPage';
import { EditRoleAdminPage } from '../../pageObjectModels/editRoleAdminPage';
import { RolesSecurityAdminPage } from '../../pageObjectModels/rolesSecurityAdminPage';
import { UsersSecurityAdminPage } from '../../pageObjectModels/usersSecurityAdminPage';
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

    await test.step('Create the role', async () => {
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
      await editRoleAdminPage.page.waitForURL(editRoleAdminPage.pathRegex);
      await editRoleAdminPage.page.waitForLoadState();

      expect(editRoleAdminPage.page.url()).toMatch(editRoleAdminPage.pathRegex);
      await expect(editRoleAdminPage.nameInput).toHaveValue(roleName);
      await expect(editRoleAdminPage.statusSwitch).toHaveAttribute('aria-checked', 'false');
    });
  });

  test('Create a Role via the create button on the Security tile on the admin home page', async ({
    adminHomePage,
    addRoleAdminPage,
    editRoleAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-626',
    });

    const roleName = FakeDataFactory.createFakeRoleName();
    rolesToDelete.push(roleName);

    await test.step('Create the role', async () => {
      await adminHomePage.securityTileLink.hover();
      await adminHomePage.securityTileCreateButton.waitFor();
      await adminHomePage.securityTileCreateButton.click();

      await expect(adminHomePage.securityCreateMenu).toBeVisible();

      await adminHomePage.securityCreateMenu.getByText('Role').click();
      await addRoleAdminPage.page.waitForLoadState();
      await addRoleAdminPage.nameInput.fill(roleName);

      // TODO: Remove the following when #3983 is fixed
      // https://corp.onspring.com/Content/8/3983
      await addRoleAdminPage.statusToggle.click();
      await addRoleAdminPage.statusToggle.click();

      await addRoleAdminPage.saveRecordButton.click();
    });

    await test.step('Verify the role is created correctly', async () => {
      await editRoleAdminPage.page.waitForURL(editRoleAdminPage.pathRegex);
      await editRoleAdminPage.page.waitForLoadState();

      expect(editRoleAdminPage.page.url()).toMatch(editRoleAdminPage.pathRegex);
      await expect(editRoleAdminPage.nameInput).toHaveValue(roleName);
      await expect(editRoleAdminPage.statusSwitch).toHaveAttribute('aria-checked', 'false');
    });
  });

  test('Create a Role via the Create Role button on the role home page', async ({
    sysAdminPage,
    adminHomePage,
    rolesSecurityAdminPage,
    addRoleAdminPage,
    editRoleAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-627',
    });

    const usersSecurityAdminPage = new UsersSecurityAdminPage(sysAdminPage);
    const roleName = FakeDataFactory.createFakeRoleName();
    rolesToDelete.push(roleName);

    await test.step('Navigate to the roles security admin page', async () => {
      await adminHomePage.securityTileLink.click();
      await usersSecurityAdminPage.pillNav.rolesPillButton.click();
    });

    await test.step('Create the role', async () => {
      await rolesSecurityAdminPage.createRoleButton.click();
      await addRoleAdminPage.page.waitForLoadState();
      await addRoleAdminPage.nameInput.fill(roleName);

      // TODO: Remove the following when #3983 is fixed
      // https://corp.onspring.com/Content/8/3983
      await addRoleAdminPage.statusToggle.click();
      await addRoleAdminPage.statusToggle.click();

      await addRoleAdminPage.saveRecordButton.click();
    });

    await test.step('Verify the role is created correctly', async () => {
      await editRoleAdminPage.page.waitForURL(editRoleAdminPage.pathRegex);
      await editRoleAdminPage.page.waitForLoadState();

      expect(editRoleAdminPage.page.url()).toMatch(editRoleAdminPage.pathRegex);
      await expect(editRoleAdminPage.nameInput).toHaveValue(roleName);
      await expect(editRoleAdminPage.statusSwitch).toHaveAttribute('aria-checked', 'false');
    });
  });

  test('Update a role', async ({ addRoleAdminPage, editRoleAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-631',
    });

    const roleName = FakeDataFactory.createFakeRoleName();
    rolesToDelete.push(roleName);
    const description = 'This is a test description';

    await test.step('Create the role to update', async () => {
      await addRoleAdminPage.addRole(roleName);
      await addRoleAdminPage.page.waitForURL(editRoleAdminPage.pathRegex);
      await addRoleAdminPage.page.waitForLoadState();
    });

    await test.step('Update the role', async () => {
      await editRoleAdminPage.descriptionEditor.fill(description);
      await editRoleAdminPage.saveRole();
    });

    await test.step('Verify the role is updated', async () => {
      await expect(editRoleAdminPage.descriptionEditor).toHaveText(description);
    });
  });

  test('Create a copy of a role', async ({
    sysAdminPage,
    addRoleAdminPage,
    editRoleAdminPage,
    rolesSecurityAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-786',
    });

    const copyRoleAdminPage = new CopyRoleAdminPage(sysAdminPage);
    const roleName = FakeDataFactory.createFakeRoleName();
    const copiedRoleName = `${roleName} (Copy)`;
    rolesToDelete.push(roleName);
    rolesToDelete.push(copiedRoleName);

    await test.step('Create the role to copy', async () => {
      await addRoleAdminPage.addRole(roleName);
      await addRoleAdminPage.page.waitForURL(editRoleAdminPage.pathRegex);
      await editRoleAdminPage.page.waitForLoadState();
    });

    await test.step('Copy the role', async () => {
      const roleRow = rolesSecurityAdminPage.roleGrid.getByRole('row', { name: roleName }).first();

      await rolesSecurityAdminPage.goto();
      await roleRow.hover();
      await roleRow.getByTitle('Copy Role').click();
      await copyRoleAdminPage.page.waitForLoadState();

      await expect(copyRoleAdminPage.nameInput).toHaveValue(roleName);

      await copyRoleAdminPage.nameInput.clear();
      await copyRoleAdminPage.nameInput.fill(copiedRoleName);
      await copyRoleAdminPage.saveRecordButton.click();
    });

    await test.step('Verify the role is copied', async () => {
      await copyRoleAdminPage.page.waitForURL(editRoleAdminPage.pathRegex);
      await editRoleAdminPage.page.waitForLoadState();

      expect(editRoleAdminPage.page.url()).toMatch(editRoleAdminPage.pathRegex);
      await expect(editRoleAdminPage.nameInput).toHaveValue(copiedRoleName);
    });
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
