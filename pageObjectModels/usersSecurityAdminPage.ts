import { Locator, Page } from '@playwright/test';
import { DeleteUserDialogComponent } from '../componentObjectModels/deleteUserDialogComponent';
import { BaseAdminPage } from './baseAdminPage';

export class UsersSecurityAdminPage extends BaseAdminPage {
  readonly page: Page;
  readonly path: string;
  readonly userGrid: Locator;
  readonly deleteUserDialog: DeleteUserDialogComponent;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.path = '/Admin/Security/User';
    this.userGrid = page.locator('#grid');
    this.deleteUserDialog = new DeleteUserDialogComponent(page);
  }

  async goto() {
    await this.page.goto(this.path, { waitUntil: 'networkidle' });
  }

  async deleteUsers(usersToDelete: string[]) {
    await this.goto();

    for (const username of usersToDelete) {
      const userRow = this.userGrid
        .getByRole('row', { name: username })
        .first();

      // eslint-disable-next-line playwright/no-force-option
      await userRow.hover({ force: true });

      // eslint-disable-next-line playwright/no-force-option
      await userRow.getByTitle('Delete User').click({ force: true });

      await this.deleteUserDialog.deleteButton.click();
      await this.deleteUserDialog.waitForDialogToBeDismissed();
      await this.page.waitForLoadState('networkidle');
    }
  }
}
