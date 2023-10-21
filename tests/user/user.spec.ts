import { UserFactory } from '../../factories/userFactory';
import { expect, test } from '../../fixtures';
import { AddUserAdminPage } from '../../pageObjectModels/addUserAdminPage';
import { AdminHomePage } from '../../pageObjectModels/adminHomePage';
import { EditUserAdminPage } from '../../pageObjectModels/editUserAdminPage';
import { TestHelper } from '../utils/testHelper';

test.describe('User', () => {
  let usersToDelete: string[] = [];

  test.beforeEach(async ({ sysAdminPage }) => {
    await TestHelper.navigateToAdminHomePage(sysAdminPage);
  });

  test.afterEach(async () => {
    usersToDelete = [];
  });

  test('Create a User via the create button in the header of the admin home page', async ({
    sysAdminPage,
  }) => {
    const adminHomePage = new AdminHomePage(sysAdminPage);
    const addUserPage = new AddUserAdminPage(sysAdminPage);
    const editUserPage = new EditUserAdminPage(sysAdminPage);
    const newUser = UserFactory.createNewUser();
    usersToDelete.push(newUser.username);

    await adminHomePage.page.waitForLoadState();
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
