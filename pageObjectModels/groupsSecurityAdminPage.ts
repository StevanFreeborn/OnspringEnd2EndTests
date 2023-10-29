import { Locator, Page } from '@playwright/test';
import { DeleteGroupDialogComponent } from '../componentObjectModels/deleteGroupDialogComponent';
import { BaseAdminPage } from './baseAdminPage';

export class GroupsSecurityAdminPage extends BaseAdminPage {
  readonly path: string;
  readonly groupsGrid: Locator;
  readonly deleteGroupDialog: DeleteGroupDialogComponent;

  constructor(page: Page) {
    super(page);
    this.path = '/Admin/Security/Group';
    this.groupsGrid = page.locator('#grid');
    this.deleteGroupDialog = new DeleteGroupDialogComponent(page);
  }

  async goto() {
    await this.page.goto(this.path, { waitUntil: 'networkidle' });
  }

  async deleteGroups(groupsToDelete: string[]) {
    await this.goto();

    for (const groupName of groupsToDelete) {
      const groupRow = this.groupsGrid.getByRole('row', { name: groupName }).first();

      // eslint-disable-next-line playwright/no-force-option
      await groupRow.hover({ force: true });

      // eslint-disable-next-line playwright/no-force-option
      await groupRow.getByTitle('Delete Group').click({ force: true });

      await this.deleteGroupDialog.deleteButton.click();
      await this.deleteGroupDialog.waitForDialogToBeDismissed();
      await this.page.waitForLoadState('networkidle');
    }
  }
}
