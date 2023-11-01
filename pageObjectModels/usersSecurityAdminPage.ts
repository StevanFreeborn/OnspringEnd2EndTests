import { Locator, Page } from '@playwright/test';
import { DeleteUserDialog } from '../componentObjectModels/deleteUserDialog';
import { SecurityAdminPillNav } from '../componentObjectModels/securityAdminPillNav';
import { BaseAdminPage } from './baseAdminPage';

export class UsersSecurityAdminPage extends BaseAdminPage {
  readonly path: string;
  readonly pillNav: SecurityAdminPillNav;
  readonly createUserButton: Locator;
  readonly userGrid: Locator;
  readonly deleteUserDialog: DeleteUserDialog;

  constructor(page: Page) {
    super(page);
    this.path = '/Admin/Security/User';
    this.pillNav = new SecurityAdminPillNav(page);
    this.createUserButton = page.getByRole('button', { name: 'Create User' });
    this.userGrid = page.locator('#grid');
    this.deleteUserDialog = new DeleteUserDialog(page);
  }

  async goto() {
    await this.page.goto(this.path, { waitUntil: 'networkidle' });
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
