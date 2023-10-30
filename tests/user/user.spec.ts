import { UserFactory } from '../../factories/userFactory';
import { test as base, expect } from '../../fixtures';
import { UserStatus } from '../../models/user';
import { AddUserAdminPage } from '../../pageObjectModels/addUserAdminPage';
import { AdminHomePage } from '../../pageObjectModels/adminHomePage';
import { EditUserAdminPage } from '../../pageObjectModels/editUserAdminPage';
import { UsersSecurityAdminPage } from '../../pageObjectModels/usersSecurityAdminPage';
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
      await addUserAdminPage.activeStatusButton.click();
      await addUserAdminPage.saveRecordButton.click();
    });

    await test.step('Verify user is created correctly', async () => {
      await addUserAdminPage.page.waitForURL(editUserAdminPage.pathRegex);
      await editUserAdminPage.page.waitForLoadState();

      expect(editUserAdminPage.page.url()).toMatch(editUserAdminPage.pathRegex);
      await expect(editUserAdminPage.firstNameInput).toHaveValue(newUser.firstName);
      await expect(editUserAdminPage.lastNameInput).toHaveValue(newUser.lastName);
      await expect(editUserAdminPage.usernameInput).toHaveValue(newUser.username);
      await expect(editUserAdminPage.emailInput).toHaveValue(newUser.email);
      await expect(editUserAdminPage.activeStatusButton).toHaveClass(/active-status/);
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
      await addUserAdminPage.inactiveStatusButton.click();
      await addUserAdminPage.saveRecordButton.click();
    });

    await test.step('Verify user is created correctly', async () => {
      await addUserAdminPage.page.waitForURL(editUserAdminPage.pathRegex);
      await editUserAdminPage.page.waitForLoadState();

      expect(editUserAdminPage.page.url()).toMatch(editUserAdminPage.pathRegex);
      await expect(editUserAdminPage.firstNameInput).toHaveValue(newUser.firstName);
      await expect(editUserAdminPage.lastNameInput).toHaveValue(newUser.lastName);
      await expect(editUserAdminPage.usernameInput).toHaveValue(newUser.username);
      await expect(editUserAdminPage.emailInput).toHaveValue(newUser.email);
      await expect(editUserAdminPage.inactiveStatusButton).toHaveClass(/active-status/);
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
      await addUserAdminPage.inactiveStatusButton.click();
      await addUserAdminPage.saveRecordButton.click();
    });

    await test.step('Verify user is created correctly', async () => {
      await addUserAdminPage.page.waitForURL(editUserAdminPage.pathRegex);
      await editUserAdminPage.page.waitForLoadState();

      expect(editUserAdminPage.page.url()).toMatch(editUserAdminPage.pathRegex);
      await expect(editUserAdminPage.firstNameInput).toHaveValue(newUser.firstName);
      await expect(editUserAdminPage.lastNameInput).toHaveValue(newUser.lastName);
      await expect(editUserAdminPage.usernameInput).toHaveValue(newUser.username);
      await expect(editUserAdminPage.emailInput).toHaveValue(newUser.email);
      await expect(editUserAdminPage.inactiveStatusButton).toHaveClass(/active-status/);
    });
  });

  test('Create a copy of a user', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-785',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Update a user', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-674',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Assign a role to a user', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-676',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Assign a group to a user', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-677',
    });

    // TODO: Implement test
    expect(false).toBe(true);
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
      await usersSecurityAdminPage.deleteUserDialog.deleteButton.click();
      await usersSecurityAdminPage.deleteUserDialog.waitForDialogToBeDismissed();
      await usersSecurityAdminPage.page.waitForLoadState('networkidle');
    });

    await test.step('Verify user is deleted', async () => {
      await expect(userRow).not.toBeAttached();
    });
  });
});
