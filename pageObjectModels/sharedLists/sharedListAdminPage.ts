import { Locator, Page } from '@playwright/test';
import { CreateListDialog } from '../../componentObjectModels/dialogs/createListDialog';
import { DeleteListDialog } from '../../componentObjectModels/dialogs/deleteListDialog';
import { TEST_LIST_NAME } from '../../factories/fakeDataFactory';
import { BaseAdminPage } from '../baseAdminPage';

export class SharedListAdminPage extends BaseAdminPage {
  private readonly getSharedListPath: string;
  readonly pathRegex: RegExp;
  readonly deleteListPathRegex: RegExp;
  private readonly createListButton: Locator;
  readonly listsGrid: Locator;
  private readonly createListDialog: CreateListDialog;
  readonly deleteListDialog: DeleteListDialog;

  constructor(page: Page) {
    super(page);
    this.getSharedListPath = '/Admin/SharedList/GetListPage';
    this.pathRegex = /\/Admin\/SharedList/;
    this.deleteListPathRegex = /\/Admin\/SharedList\/\d+\/Delete/;
    this.createListButton = this.page.getByRole('button', { name: 'Create List' });
    this.listsGrid = this.page.locator('#grid');
    this.createListDialog = new CreateListDialog(this.page);
    this.deleteListDialog = new DeleteListDialog(this.page);
  }

  async goto() {
    const getSharedListsResponse = this.page.waitForResponse(this.getSharedListPath);
    await this.page.goto('/Admin/SharedList');
    await getSharedListsResponse;
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

  async deleteLists(listsToDelete: string[]) {
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

  async deleteAllTestLists() {
    await this.goto();

    const scrollableElement = this.listsGrid.locator('.k-grid-content.k-auto-scrollable').first();

    const pager = this.listsGrid.locator('.k-pager-info').first();
    const pagerText = await pager.innerText();
    const totalNumOfLists = parseInt(pagerText.trim().split(' ')[0]);

    if (Number.isNaN(totalNumOfLists) === false) {
      const listRows = this.listsGrid.getByRole('row');
      let listRowsCount = await listRows.count();

      while (listRowsCount < totalNumOfLists) {
        const getSharedListsResponse = this.page.waitForResponse(this.getSharedListPath);
        await scrollableElement.evaluate(el => (el.scrollTop = el.scrollHeight));
        await getSharedListsResponse;
        listRowsCount = await listRows.count();
      }
    }

    const deleteListRow = this.listsGrid.getByRole('row', { name: new RegExp(TEST_LIST_NAME, 'i') }).last();

    let isVisible = await deleteListRow.isVisible();

    while (isVisible) {
      await deleteListRow.hover();
      await deleteListRow.getByTitle('Delete List').click();

      const deleteResponse = this.page.waitForResponse(this.deleteListPathRegex);

      await this.deleteListDialog.deleteButton.click();

      await deleteResponse;

      isVisible = await deleteListRow.isVisible();
    }
  }
}
