import { Locator, Page } from '@playwright/test';
import { DeleteGroupDialog } from '../../componentObjectModels/dialogs/deleteGroupDialog';
import { TEST_GROUP_NAME } from '../../factories/fakeDataFactory';
import { BaseAdminPage } from '../baseAdminPage';

export class GroupsSecurityAdminPage extends BaseAdminPage {
  private readonly getGroupsPath: string;
  readonly path: string;
  readonly deleteGroupPathRegex: RegExp;
  readonly createGroupButton: Locator;
  readonly groupsGrid: Locator;
  readonly deleteGroupDialog: DeleteGroupDialog;

  constructor(page: Page) {
    super(page);
    this.getGroupsPath = '/Admin/Security/Group/GroupList';
    this.path = '/Admin/Security/Group';
    this.deleteGroupPathRegex = /\/Admin\/Security\/Group\/\d+\/Delete/;
    this.createGroupButton = page.getByRole('button', { name: 'Create Group' });
    this.groupsGrid = page.locator('#grid');
    this.deleteGroupDialog = new DeleteGroupDialog(page);
  }

  async goto() {
    const getGroupsResponse = this.page.waitForResponse(this.getGroupsPath);
    await this.page.goto(this.path);
    await getGroupsResponse;
  }

  async deleteAllTestGroups() {
    await this.goto();

    const groupRow = this.groupsGrid.getByRole('row', { name: new RegExp(TEST_GROUP_NAME, 'i') }).first();
    let isVisible = await groupRow.isVisible();

    while (isVisible) {
      await groupRow.hover();
      await groupRow.getByTitle('Delete Group').click();

      const deleteResponse = this.page.waitForResponse(this.deleteGroupPathRegex);

      await this.deleteGroupDialog.deleteButton.click();

      await deleteResponse;

      isVisible = await groupRow.isVisible();
    }
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
