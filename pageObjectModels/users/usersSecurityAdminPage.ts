import { Locator, Page } from '@playwright/test';
import { DeleteUserDialog } from '../../componentObjectModels/dialogs/deleteUserDialog';
import { SecurityAdminPillNav } from '../../componentObjectModels/navs/securityAdminPillNav';
import { TEST_USER_NAME } from '../../factories/fakeDataFactory';
import { BaseAdminPage } from '../baseAdminPage';

export class UsersSecurityAdminPage extends BaseAdminPage {
  private readonly getUsersPath: string;
  readonly path: string;
  readonly deleteUserPathRegex: RegExp;
  readonly pillNav: SecurityAdminPillNav;
  readonly createUserButton: Locator;
  readonly userGrid: Locator;
  readonly deleteUserDialog: DeleteUserDialog;

  constructor(page: Page) {
    super(page);
    this.getUsersPath = '/Admin/Security/User/UserList';
    this.path = '/Admin/Security/User';
    this.deleteUserPathRegex = /\/Admin\/Security\/User\/\d+\/Delete/;
    this.pillNav = new SecurityAdminPillNav(page);
    this.createUserButton = page.getByRole('button', { name: 'Create User' });
    this.userGrid = page.locator('#grid');
    this.deleteUserDialog = new DeleteUserDialog(page);
  }

  async goto() {
    const getUsersResponse = this.page.waitForResponse(this.getUsersPath);
    await this.page.goto(this.path);
    await getUsersResponse;
  }

  async deleteAllTestUsers() {
    await this.goto();

    const scrollableElement = this.userGrid.locator('.k-grid-content.k-auto-scrollable').first();

    const pager = this.userGrid.locator('.k-pager-info').first();
    const pagerText = await pager.innerText();
    const totalNumOfUsers = parseInt(pagerText.trim().split(' ')[0]);

    if (Number.isNaN(totalNumOfUsers) === false) {
      const userRows = this.userGrid.getByRole('row');
      let userRowsCount = await userRows.count();

      while (userRowsCount < totalNumOfUsers) {
        const getUsersResponse = this.page.waitForResponse(this.getUsersPath);
        await scrollableElement.evaluate(el => (el.scrollTop = el.scrollHeight));
        await getUsersResponse;
        userRowsCount = await userRows.count();
      }
    }

    const userRow = this.userGrid.getByRole('row', { name: new RegExp(TEST_USER_NAME, 'i') }).last();
    let isVisible = await userRow.isVisible();

    while (isVisible) {
      await userRow.hover();
      await userRow.getByTitle('Delete User').click();

      const deleteResponse = this.page.waitForResponse(this.deleteUserPathRegex);

      await this.deleteUserDialog.deleteButton.click();

      await deleteResponse;

      isVisible = await userRow.isVisible();
    }
  }

  async deleteUsers(usersToDelete: string[]) {
    await this.goto();

    for (const username of usersToDelete) {
      const userRow = this.userGrid.getByRole('row', { name: username }).first();
      const rowElement = await userRow.elementHandle();

      if (rowElement === null) {
        continue;
      }

      await userRow.hover();
      await userRow.getByTitle('Delete User').click();
      await this.deleteUserDialog.deleteButton.click();
      await this.deleteUserDialog.waitForDialogToBeDismissed();
      await rowElement.waitForElementState('hidden');
    }
  }
}
