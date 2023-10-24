import { Locator, Page } from '@playwright/test';
import { DeleteRoleDialogComponent } from '../componentObjectModels/deleteRoleDialogComponent';
import { BaseAdminPage } from './baseAdminPage';

export class RolesSecurityAdminPage extends BaseAdminPage {
  readonly path: string;
  readonly roleGrid: Locator;
  readonly deleteRoleDialog: DeleteRoleDialogComponent;

  constructor(page: Page) {
    super(page);
    this.path = '/Admin/Security/Role';
    this.roleGrid = page.locator('#grid');
    this.deleteRoleDialog = new DeleteRoleDialogComponent(page);
  }

  async goto() {
    await this.page.goto(this.path, { waitUntil: 'networkidle' });
  }

  async deleteRoles(rolesToDelete: string[]) {
    await this.goto();

    for (const roleName of rolesToDelete) {
      const userRow = this.roleGrid.getByRole('row', { name: roleName }).first();

      // eslint-disable-next-line playwright/no-force-option
      await userRow.hover({ force: true });

      // eslint-disable-next-line playwright/no-force-option
      await userRow.getByTitle('Delete Role').click({ force: true });

      await this.deleteRoleDialog.deleteButton.click();
      await this.deleteRoleDialog.waitForDialogToBeDismissed();
      await this.page.waitForLoadState('networkidle');
    }
  }
}
