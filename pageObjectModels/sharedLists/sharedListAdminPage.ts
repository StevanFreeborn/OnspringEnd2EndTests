import { Locator, Page } from '@playwright/test';
import { CreateListDialog } from '../../componentObjectModels/dialogs/createListDialog';
import { DeleteListDialog } from '../../componentObjectModels/dialogs/deleteListDialog';
import { BaseAdminPage } from '../baseAdminPage';

export class SharedListAdminPage extends BaseAdminPage {
  readonly pathRegex: RegExp;
  private readonly createListButton: Locator;
  readonly listsGrid: Locator;
  private readonly createListDialog: CreateListDialog;
  readonly deleteListDialog: DeleteListDialog;

  constructor(page: Page) {
    super(page);
    this.pathRegex = /\/Admin\/SharedList/;
    this.createListButton = page.getByRole('button', { name: 'Create List' });
    this.listsGrid = page.locator('#grid');
    this.createListDialog = new CreateListDialog(page);
    this.deleteListDialog = new DeleteListDialog(page);
  }

  async goto() {
    await this.page.goto('/Admin/SharedList');
  }

  async createListCopy(listToCopy: string, listName: string) {
    await this.createListButton.click();

    await this.createListDialog.copyFromRadioButton.waitFor();
    await this.createListDialog.copyFromRadioButton.click();
    await this.createListDialog.copyFromDropdown.click();
    await this.createListDialog.getListToCopy(listToCopy).click();
    await this.createListDialog.nameInput.fill(listName);
    await this.createListDialog.saveButton.click();
  }

  async createList(listName: string) {
    await this.createListButton.click();

    await this.createListDialog.nameInput.waitFor();
    await this.createListDialog.nameInput.fill(listName);
    await this.createListDialog.saveButton.click();
  }

  async deleteList(listsToDelete: string[]) {
    await this.goto();

    for (const listName of listsToDelete) {
      const listRow = this.listsGrid.getByRole('row', { name: listName }).first();
      const rowElement = await listRow.elementHandle();

      if (rowElement === null) {
        continue;
      }

      await listRow.hover();
      await listRow.getByTitle('Delete List').click();
      await this.deleteListDialog.deleteButton.click();
      await this.deleteListDialog.waitForDialogToBeDismissed();
      await rowElement.waitForElementState('hidden');
    }
  }
}
