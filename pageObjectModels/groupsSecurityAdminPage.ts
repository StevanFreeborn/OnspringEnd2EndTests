import { Locator, Page } from '@playwright/test';
import { DeleteGroupDialog } from '../componentObjectModels/dialogs/deleteGroupDialog';
import { BaseAdminPage } from './baseAdminPage';

export class GroupsSecurityAdminPage extends BaseAdminPage {
  readonly path: string;
  readonly groupsGrid: Locator;
  readonly deleteGroupDialog: DeleteGroupDialog;

  constructor(page: Page) {
    super(page);
    this.path = '/Admin/Security/Group';
    this.groupsGrid = page.locator('#grid');
    this.deleteGroupDialog = new DeleteGroupDialog(page);
  }

  async goto() {
    await this.page.goto(this.path, { waitUntil: 'networkidle' });
  }

  async deleteGroups(groupsToDelete: string[]) {
    await this.goto();

    for (const groupName of groupsToDelete) {
      const groupRow = this.groupsGrid.getByRole('row', { name: groupName }).first();
      const rowElement = await groupRow.elementHandle();

      if (rowElement === null) {
        continue;
      }

      await groupRow.hover();
      await groupRow.getByTitle('Delete Group').click();
      await this.deleteGroupDialog.deleteButton.click();
      await this.deleteGroupDialog.waitForDialogToBeDismissed();
      await rowElement.waitForElementState('hidden');
    }
  }
}
