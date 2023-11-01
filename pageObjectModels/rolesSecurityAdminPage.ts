import { Locator, Page } from '@playwright/test';
import { DeleteRoleDialog } from '../componentObjectModels/dialogs/deleteRoleDialog';
import { BaseAdminPage } from './baseAdminPage';

export class RolesSecurityAdminPage extends BaseAdminPage {
  readonly path: string;
  readonly createRoleButton: Locator;
  readonly roleGrid: Locator;
  readonly deleteRoleDialog: DeleteRoleDialog;

  constructor(page: Page) {
    super(page);
    this.path = '/Admin/Security/Role';
    this.createRoleButton = page.getByRole('button', { name: 'Create Role' });
    this.roleGrid = page.locator('#grid');
    this.deleteRoleDialog = new DeleteRoleDialog(page);
  }

  async goto() {
    await this.page.goto(this.path, { waitUntil: 'networkidle' });
  }

  async deleteRoles(rolesToDelete: string[]) {
    await this.goto();

    for (const roleName of rolesToDelete) {
      const roleRow = this.roleGrid.getByRole('row', { name: roleName }).first();
      const rowElement = await roleRow.elementHandle();

      if (rowElement === null) {
        continue;
      }

      await roleRow.hover();
      await roleRow.getByTitle('Delete Role').click();
      await this.deleteRoleDialog.deleteButton.click();
      await this.deleteRoleDialog.waitForDialogToBeDismissed();
      await rowElement.waitForElementState('hidden');
    }
  }
}
