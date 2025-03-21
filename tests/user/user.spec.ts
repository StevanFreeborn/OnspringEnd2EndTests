import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { UserFactory } from '../../factories/userFactory';
import { test as base, expect } from '../../fixtures';
import { Role } from '../../models/role';
import { UserStatus } from '../../models/user';
import { AdminHomePage } from '../../pageObjectModels/adminHomePage';
import { AddGroupAdminPage } from '../../pageObjectModels/groups/addGroupAdminPage';
import { EditGroupAdminPage } from '../../pageObjectModels/groups/editGroupAdminPage';
import { GroupsSecurityAdminPage } from '../../pageObjectModels/groups/groupsSecurityAdminPage';
import { AddRoleAdminPage } from '../../pageObjectModels/roles/addRoleAdminPage';
import { EditRoleAdminPage } from '../../pageObjectModels/roles/editRoleAdminPage';
import { RolesSecurityAdminPage } from '../../pageObjectModels/roles/rolesSecurityAdminPage';
import { AddUserAdminPage } from '../../pageObjectModels/users/addUserAdminPage';
import { CopyUserAdminPage } from '../../pageObjectModels/users/copyUserAdminPage';
import { EditUserAdminPage } from '../../pageObjectModels/users/editUserAdminPage';
import { UsersSecurityAdminPage } from '../../pageObjectModels/users/usersSecurityAdminPage';
import { AnnotationType } from '../annotations';

type UserTestFixtures = {
  adminHomePage: AdminHomePage;
  addUserAdminPage: AddUserAdminPage;
  editUserAdminPage: EditUserAdminPage;
  usersSecurityAdminPage: UsersSecurityAdminPage;
};

const test = base.extend<UserTestFixtures>({
  adminHomePage: async ({ sysAdminPage }, use) => {
    const adminHomePage = new AdminHomePage(sysAdminPage);
    await use(adminHomePage);
  },
  addUserAdminPage: async ({ sysAdminPage }, use) => {
    const addUserAdminPage = new AddUserAdminPage(sysAdminPage);
    await use(addUserAdminPage);
  },
  editUserAdminPage: async ({ sysAdminPage }, use) => {
    const editUserAdminPage = new EditUserAdminPage(sysAdminPage);
    await use(editUserAdminPage);
  },
  usersSecurityAdminPage: async ({ sysAdminPage }, use) => {
    const usersSecurityAdminPage = new UsersSecurityAdminPage(sysAdminPage);
    await use(usersSecurityAdminPage);
  },
});

test.describe('User', () => {
  let usersToDelete: string[] = [];

  test.beforeEach(async ({ adminHomePage }) => {
    await adminHomePage.goto();
  });

  test.afterEach(async ({ usersSecurityAdminPage }) => {
    await usersSecurityAdminPage.deleteUsers(usersToDelete);
    usersToDelete = [];
  });

  test('Create a User via the create button in the header of the admin home page', async ({
    adminHomePage,
    addUserAdminPage,
    editUserAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-668',
    });

    const newUser = UserFactory.createNewUser(UserStatus.Inactive);
    usersToDelete.push(newUser.username);

    await test.step('Create the user', async () => {
      await adminHomePage.adminNav.adminCreateButton.hover();
      await adminHomePage.adminNav.adminCreateMenu.waitFor();
      await adminHomePage.adminNav.userCreateMenuOption.click();
      await addUserAdminPage.page.waitForLoadState();
      await addUserAdminPage.fillRequiredUserFields(newUser);
      await addUserAdminPage.generalTab.activeStatusButton.click();
      await addUserAdminPage.saveRecordButton.click();
    });

    await test.step('Verify user is created correctly', async () => {
      await addUserAdminPage.page.waitForURL(editUserAdminPage.pathRegex);
      await editUserAdminPage.page.waitForLoadState();

      expect(editUserAdminPage.page.url()).toMatch(editUserAdminPage.pathRegex);
      await expect(editUserAdminPage.generalTab.firstNameInput).toHaveValue(newUser.firstName);
      await expect(editUserAdminPage.generalTab.lastNameInput).toHaveValue(newUser.lastName);
      await expect(editUserAdminPage.generalTab.usernameInput).toHaveValue(newUser.username);
      await expect(editUserAdminPage.generalTab.emailInput).toHaveValue(newUser.email);
      await expect(editUserAdminPage.generalTab.activeStatusButton).toHaveClass(/active-status/);
    });
  });

  test('Create a User via the create button on the Security tile on the admin home page', async ({
    adminHomePage,
    addUserAdminPage,
    editUserAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-669',
    });

    const newUser = UserFactory.createNewUser(UserStatus.Inactive);
    usersToDelete.push(newUser.username);

    await test.step('Create the user', async () => {
      await adminHomePage.securityTileLink.hover();
      await adminHomePage.securityTileCreateButton.waitFor();
      await adminHomePage.securityTileCreateButton.click();

      await expect(adminHomePage.securityCreateMenu).toBeVisible();

      await adminHomePage.securityCreateMenu.getByText('User').click();
      await addUserAdminPage.page.waitForLoadState();
      await addUserAdminPage.fillRequiredUserFields(newUser);
      await addUserAdminPage.generalTab.inactiveStatusButton.click();
      await addUserAdminPage.saveRecordButton.click();
    });

    await test.step('Verify user is created correctly', async () => {
      await addUserAdminPage.page.waitForURL(editUserAdminPage.pathRegex);
      await editUserAdminPage.page.waitForLoadState();

      expect(editUserAdminPage.page.url()).toMatch(editUserAdminPage.pathRegex);
      await expect(editUserAdminPage.generalTab.firstNameInput).toHaveValue(newUser.firstName);
      await expect(editUserAdminPage.generalTab.lastNameInput).toHaveValue(newUser.lastName);
      await expect(editUserAdminPage.generalTab.usernameInput).toHaveValue(newUser.username);
      await expect(editUserAdminPage.generalTab.emailInput).toHaveValue(newUser.email);
      await expect(editUserAdminPage.generalTab.inactiveStatusButton).toHaveClass(/active-status/);
    });
  });

  test('Create a User via the Create User button on the user home page', async ({
    adminHomePage,
    usersSecurityAdminPage,
    addUserAdminPage,
    editUserAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-670',
    });

    const newUser = UserFactory.createNewUser(UserStatus.Inactive);
    usersToDelete.push(newUser.username);

    await test.step('Navigate to the users security admin page', async () => {
      await adminHomePage.securityTileLink.click();
    });

    await test.step('Create the user', async () => {
      await usersSecurityAdminPage.createUserButton.click();
      await addUserAdminPage.page.waitForLoadState();
      await addUserAdminPage.fillRequiredUserFields(newUser);
      await addUserAdminPage.generalTab.inactiveStatusButton.click();
      await addUserAdminPage.saveRecordButton.click();
    });

    await test.step('Verify user is created correctly', async () => {
      await addUserAdminPage.page.waitForURL(editUserAdminPage.pathRegex);
      await editUserAdminPage.page.waitForLoadState();

      expect(editUserAdminPage.page.url()).toMatch(editUserAdminPage.pathRegex);
      await expect(editUserAdminPage.generalTab.firstNameInput).toHaveValue(newUser.firstName);
      await expect(editUserAdminPage.generalTab.lastNameInput).toHaveValue(newUser.lastName);
      await expect(editUserAdminPage.generalTab.usernameInput).toHaveValue(newUser.username);
      await expect(editUserAdminPage.generalTab.emailInput).toHaveValue(newUser.email);
      await expect(editUserAdminPage.generalTab.inactiveStatusButton).toHaveClass(/active-status/);
    });
  });

  test('Create a copy of a user', async ({
    sysAdminPage,
    addUserAdminPage,
    editUserAdminPage,
    usersSecurityAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-785',
    });

    const copyUserAdminPage = new CopyUserAdminPage(sysAdminPage);
    const newUser = UserFactory.createNewUser(UserStatus.Inactive);
    const copiedUserUsername = `${newUser.username} (Copy)`;
    usersToDelete.push(newUser.username);
    usersToDelete.push(copiedUserUsername);

    await test.step('Create the user to copy', async () => {
      await addUserAdminPage.addUser(newUser);
      await addUserAdminPage.page.waitForURL(editUserAdminPage.pathRegex);
      await editUserAdminPage.page.waitForLoadState();
    });

    await test.step('Copy the user', async () => {
      const userRow = usersSecurityAdminPage.userGrid.getByRole('row', { name: newUser.username }).first();

      await usersSecurityAdminPage.goto();
      await userRow.hover();
      await userRow.getByTitle('Copy User').click();
      await copyUserAdminPage.page.waitForLoadState();

      await expect(copyUserAdminPage.generalTab.firstNameInput).toHaveValue(newUser.firstName);
      await expect(copyUserAdminPage.generalTab.lastNameInput).toHaveValue(newUser.lastName);
      await expect(copyUserAdminPage.generalTab.usernameInput).toHaveValue(newUser.username);
      await expect(copyUserAdminPage.generalTab.emailInput).toHaveValue(newUser.email);
      await expect(copyUserAdminPage.generalTab.inactiveStatusButton).toHaveClass(/active-status/);

      await copyUserAdminPage.generalTab.usernameInput.clear();
      await copyUserAdminPage.generalTab.usernameInput.fill(copiedUserUsername);
      await copyUserAdminPage.saveRecordButton.click();
    });

    await test.step('Verify the user is copied', async () => {
      await copyUserAdminPage.page.waitForURL(editUserAdminPage.pathRegex);
      await editUserAdminPage.page.waitForLoadState();

      expect(editUserAdminPage.page.url()).toMatch(editUserAdminPage.pathRegex);
      await expect(editUserAdminPage.generalTab.firstNameInput).toHaveValue(newUser.firstName);
      await expect(editUserAdminPage.generalTab.lastNameInput).toHaveValue(newUser.lastName);
      await expect(editUserAdminPage.generalTab.usernameInput).toHaveValue(copiedUserUsername);
      await expect(editUserAdminPage.generalTab.emailInput).toHaveValue(newUser.email);
      await expect(editUserAdminPage.generalTab.inactiveStatusButton).toHaveClass(/active-status/);
    });
  });

  test('Update a user', async ({ addUserAdminPage, editUserAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-674',
    });

    const newUser = UserFactory.createNewUser(UserStatus.Inactive);
    usersToDelete.push(newUser.username);

    await test.step('Create the user to update', async () => {
      await addUserAdminPage.addUser(newUser);
      await addUserAdminPage.page.waitForURL(editUserAdminPage.pathRegex);
      await editUserAdminPage.page.waitForLoadState();
    });

    await test.step('Update the user', async () => {
      await editUserAdminPage.generalTab.lockedStatusButton.click();
      await editUserAdminPage.saveUser();
    });

    await test.step('Verify user is updated correctly', async () => {
      await expect(editUserAdminPage.generalTab.lockedStatusButton).toHaveClass(/active-status/);
    });
  });

  test('Assign a role to a user', async ({ sysAdminPage, addUserAdminPage, editUserAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-676',
    });

    const roleName = FakeDataFactory.createFakeRoleName();
    const newUser = UserFactory.createNewUser(UserStatus.Inactive);
    usersToDelete.push(newUser.username);

    await test.step('Create the role to assign to the user', async () => {
      const addRoleAdminPage = new AddRoleAdminPage(sysAdminPage);
      const editRoleAdminPage = new EditRoleAdminPage(sysAdminPage);

      await addRoleAdminPage.addRole(new Role({ name: roleName }));
      await addRoleAdminPage.page.waitForURL(editRoleAdminPage.pathRegex);
      await editRoleAdminPage.page.waitForLoadState();
    });

    await test.step('Create the user to assign the role to', async () => {
      await addUserAdminPage.addUser(newUser);
      await addUserAdminPage.page.waitForURL(editUserAdminPage.pathRegex);
      await editUserAdminPage.page.waitForLoadState();
    });

    await test.step('Assign the role to the user', async () => {
      await editUserAdminPage.securityTabButton.click();
      expect(await editUserAdminPage.securityTab.rolesReferenceFieldGird.isGridEmpty()).toBe(true);
      await editUserAdminPage.securityTab.rolesReferenceFieldGird.filterInput.click();

      await expect(editUserAdminPage.securityTab.rolesReferenceFieldGird.searchResults).toBeVisible();

      await editUserAdminPage.securityTab.rolesReferenceFieldGird.searchForAndSelectRecords([roleName]);
      await editUserAdminPage.saveUser();
    });

    await test.step('Verify the role is assigned to the user', async () => {
      const roleRow = editUserAdminPage.securityTab.rolesReferenceFieldGird.gridTable.getByRole('row', {
        name: roleName,
      });
      await expect(roleRow).toBeVisible();
    });

    await test.step('Delete the role', async () => {
      const rolesSecurityAdminPage = new RolesSecurityAdminPage(sysAdminPage);
      await rolesSecurityAdminPage.goto();
      await rolesSecurityAdminPage.deleteRoles([roleName]);
    });
  });

  test('Assign a group to a user', async ({ sysAdminPage, addUserAdminPage, editUserAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-677',
    });

    const groupName = FakeDataFactory.createFakeGroupName();
    const newUser = UserFactory.createNewUser(UserStatus.Inactive);
    usersToDelete.push(newUser.username);

    await test.step('Create the group to assign to the user', async () => {
      const addGroupAdminPage = new AddGroupAdminPage(sysAdminPage);
      const editGroupAdminPage = new EditGroupAdminPage(sysAdminPage);

      await addGroupAdminPage.addGroup(groupName);
      await addGroupAdminPage.page.waitForURL(editGroupAdminPage.pathRegex);
      await editGroupAdminPage.page.waitForLoadState();
    });

    await test.step('Create the user to assign the group to', async () => {
      await addUserAdminPage.addUser(newUser);
      await addUserAdminPage.page.waitForURL(editUserAdminPage.pathRegex);
      await editUserAdminPage.page.waitForLoadState();
    });

    await test.step('Assign the group to the user', async () => {
      await editUserAdminPage.securityTabButton.click();
      expect(await editUserAdminPage.securityTab.groupsReferenceFieldGird.isGridEmpty()).toBe(true);
      await editUserAdminPage.securityTab.groupsReferenceFieldGird.filterInput.click();

      await expect(editUserAdminPage.securityTab.groupsReferenceFieldGird.searchResults).toBeVisible();

      await editUserAdminPage.securityTab.groupsReferenceFieldGird.searchForAndSelectRecords([groupName]);
      await editUserAdminPage.saveUser();
    });

    await test.step('Verify the group is assigned to the user', async () => {
      const groupRow = editUserAdminPage.securityTab.groupsReferenceFieldGird.gridTable.getByRole('row', {
        name: groupName,
      });
      await expect(groupRow).toBeVisible();
    });

    await test.step('Delete the group', async () => {
      const groupsSecurityAdminPage = new GroupsSecurityAdminPage(sysAdminPage);
      await groupsSecurityAdminPage.goto();
      await groupsSecurityAdminPage.deleteGroups([groupName]);
    });
  });

  test('Delete a user', async ({ addUserAdminPage, usersSecurityAdminPage, editUserAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-675',
    });

    const newUser = UserFactory.createNewUser(UserStatus.Inactive);
    const userRow = usersSecurityAdminPage.userGrid.getByRole('row', { name: newUser.username }).first();

    await test.step('Create user to delete', async () => {
      await addUserAdminPage.addUser(newUser);
      await addUserAdminPage.page.waitForURL(editUserAdminPage.pathRegex);
      await editUserAdminPage.page.waitForLoadState();
    });

    await test.step('Navigate to users security admin page', async () => {
      await usersSecurityAdminPage.goto();
      await expect(userRow).toBeVisible();
    });

    await test.step('Delete user', async () => {
      await userRow.hover();
      await userRow.getByTitle('Delete User').click();

      const deleteUserResponse = usersSecurityAdminPage.page.waitForResponse(
        usersSecurityAdminPage.deleteUserPathRegex
      );
      await usersSecurityAdminPage.deleteUserDialog.deleteButton.click();
      await deleteUserResponse;
      await usersSecurityAdminPage.deleteUserDialog.waitForDialogToBeDismissed();
    });

    await test.step('Verify user is deleted', async () => {
      await expect(userRow).not.toBeAttached();
    });
  });
});
