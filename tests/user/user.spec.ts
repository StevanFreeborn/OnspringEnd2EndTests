import { UserFactory } from '../../factories/userFactory';
import { test as base, expect } from '../../fixtures';
import { AddUserAdminPage } from '../../pageObjectModels/addUserAdminPage';
import { AdminHomePage } from '../../pageObjectModels/adminHomePage';
import { EditUserAdminPage } from '../../pageObjectModels/editUserAdminPage';

type UserTestFixtures = {
  adminHomePage: AdminHomePage;
  addUserPage: AddUserAdminPage;
  editUserPage: EditUserAdminPage;
};

const test = base.extend<UserTestFixtures>({
  adminHomePage: async ({ sysAdminPage }, use) => {
    const adminHomePage = new AdminHomePage(sysAdminPage);
    await use(adminHomePage);
  },
  addUserPage: async ({ sysAdminPage }, use) => {
    const addUserPage = new AddUserAdminPage(sysAdminPage);
    await use(addUserPage);
  },
  editUserPage: async ({ sysAdminPage }, use) => {
    const editUserPage = new EditUserAdminPage(sysAdminPage);
    await use(editUserPage);
  },
});

test.describe('User', () => {
  let usersToDelete: string[] = [];

  test.beforeEach(async ({ adminHomePage }) => {
    await adminHomePage.goto();
  });

  test.afterEach(async () => {
    usersToDelete = [];
  });

  test('Create a User via the create button in the header of the admin home page', async ({
    adminHomePage,
    addUserPage,
    editUserPage,
  }) => {
    const newUser = UserFactory.createNewUser();
    usersToDelete.push(newUser.username);

    await adminHomePage.sharedAdminNavPage.adminCreateButton.hover();
    await adminHomePage.sharedAdminNavPage.adminCreateMenu.waitFor();
    await adminHomePage.sharedAdminNavPage.userCreateMenuOption.click();
    await addUserPage.page.waitForLoadState();
    await addUserPage.fillRequiredUserFields(newUser);
    await addUserPage.activeStatusButton.click();
    await addUserPage.saveRecordButton.click();

    await addUserPage.page.waitForURL(editUserPage.pathRegex);
    await editUserPage.page.waitForLoadState();

    expect(editUserPage.page.url()).toMatch(editUserPage.pathRegex);
    await expect(editUserPage.firstNameInput).toHaveValue(newUser.firstName);
    await expect(editUserPage.lastNameInput).toHaveValue(newUser.lastName);
    await expect(editUserPage.usernameInput).toHaveValue(newUser.username);
    await expect(editUserPage.emailInput).toHaveValue(newUser.email);
    await expect(editUserPage.activeStatusButton).toHaveClass(/active-status/);
  });
});
