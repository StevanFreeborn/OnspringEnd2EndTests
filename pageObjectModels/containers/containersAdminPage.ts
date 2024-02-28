import { Locator, Page } from '@playwright/test';
import { DeleteContainerDialog } from '../../componentObjectModels/dialogs/deleteContainerDialog';
import { TEST_CONTAINER_NAME } from '../../factories/fakeDataFactory';
import { BaseAdminPage } from '../baseAdminPage';

export class ContainersAdminPage extends BaseAdminPage {
  private readonly path: string;
  private readonly getListPagePath: string;
  private readonly deleteContainerPathRegex: RegExp;
  readonly createContainerButton: Locator;
  readonly containerGrid: Locator;
  readonly deleteContainerDialog: DeleteContainerDialog;

  constructor(page: Page) {
    super(page);
    this.path = '/Admin/Dashboard/Container';
    this.getListPagePath = '/Admin/Dashboard/Container/GetListPage';
    this.deleteContainerPathRegex = /\/Admin\/Dashboard\/Container\/\d+\/Delete/;
    this.createContainerButton = page.getByRole('button', { name: 'Create Container' });
    this.containerGrid = page.locator('#grid');
    this.deleteContainerDialog = new DeleteContainerDialog(page);
  }

  async goto() {
    const getListPagePromise = this.page.waitForResponse(this.getListPagePath);

    await this.page.goto(this.path);
    await getListPagePromise;
  }

  async deleteAllTestContainers() {
    await this.goto();

    const scrollableElement = this.containerGrid.locator('.k-grid-content.k-auto-scrollable').first();

    const pager = this.containerGrid.locator('.k-pager-info').first();
    const pagerText = await pager.innerText();
    const totalNumOfContainers = parseInt(pagerText.trim().split(' ')[0]);

    if (Number.isNaN(totalNumOfContainers) === false) {
      const containerRows = this.containerGrid.getByRole('row');
      let containerRowsCount = await containerRows.count();

      while (containerRowsCount < totalNumOfContainers) {
        await scrollableElement.evaluate(el => (el.scrollTop = el.scrollHeight));
        await this.page.waitForLoadState('networkidle');
        containerRowsCount = await containerRows.count();
      }
    }

    const containerRow = this.containerGrid.getByRole('row', { name: new RegExp(TEST_CONTAINER_NAME, 'i') }).last();

    let isVisible = await containerRow.isVisible();

    while (isVisible) {
      await containerRow.hover();
      await containerRow.getByTitle('Delete Container').click();

      const deleteResponse = this.page.waitForResponse(this.deleteContainerPathRegex);

      await this.deleteContainerDialog.deleteButton.click();

      await deleteResponse;

      isVisible = await containerRow.isVisible();
    }
  }

  async deleteContainers(containersToDelete: string[]) {
    await this.goto();

    for (const container of containersToDelete) {
      const containerRow = this.containerGrid.getByRole('row', { name: container }).first();
      const rowElement = await containerRow.elementHandle();

      if (rowElement === null) {
        continue;
      }

      await containerRow.hover();
      await containerRow.getByTitle('Delete Container').click();
      await this.deleteContainerDialog.deleteButton.click();
      await this.deleteContainerDialog.waitForDialogToBeDismissed();
      await rowElement.waitForElementState('hidden');
    }
  }
}
