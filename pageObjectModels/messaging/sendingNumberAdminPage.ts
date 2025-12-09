import { Locator, Page } from '@playwright/test';
import { DeleteSendingNumberDialog } from '../../componentObjectModels/dialogs/deleteSendingNumberDialog';
import { TEST_SENDING_NUMBER_NAME } from '../../factories/fakeDataFactory';
import { BaseAdminPage } from '../baseAdminPage';

export class SendingNumberAdminPage extends BaseAdminPage {
  private readonly getSendingNumbersPath: string;
  readonly path: string;
  readonly deleteNumberPath: string;
  readonly sendingNumberGrid: Locator;
  readonly deleteNumberDialog: DeleteSendingNumberDialog;

  constructor(page: Page) {
    super(page);
    this.getSendingNumbersPath = '/Admin/TextSendingNumber/GetListPage';
    this.path = '/Admin/TextSendingNumber';
    this.deleteNumberPath = '/Admin/TextSendingNumber/Delete';
    this.sendingNumberGrid = this.page.locator('#grid');
    this.deleteNumberDialog = new DeleteSendingNumberDialog(this.page);
  }

  async goto() {
    const getSendingNumbersResponse = this.page.waitForResponse(this.getSendingNumbersPath);
    await this.page.goto(this.path);
    await getSendingNumbersResponse;
  }

  async deleteAllTestNumbers() {
    await this.goto();

    const scrollableElement = this.sendingNumberGrid.locator('.k-grid-content.k-auto-scrollable').first();

    const pager = this.sendingNumberGrid.locator('.k-pager-info').first();
    const pagerText = await pager.innerText();
    const totalNumOfSendingNumbers = parseInt(pagerText.trim().split(' ')[0]);

    if (Number.isNaN(totalNumOfSendingNumbers) === false) {
      const numberRows = this.sendingNumberGrid.getByRole('row');
      let numberRowsCount = await numberRows.count();

      while (numberRowsCount < totalNumOfSendingNumbers) {
        const getResponse = this.page.waitForResponse(this.getSendingNumbersPath);
        await scrollableElement.evaluate(el => (el.scrollTop = el.scrollHeight));
        await getResponse;
        numberRowsCount = await numberRows.count();
      }
    }

    const deleteNumberRow = this.sendingNumberGrid
      .getByRole('row', { name: new RegExp(TEST_SENDING_NUMBER_NAME, 'i') })
      .last();

    let isVisible = await deleteNumberRow.isVisible();

    while (isVisible) {
      await deleteNumberRow.hover();
      await deleteNumberRow.getByTitle('Delete SMS Sending Number').click();
      const rowElement = await deleteNumberRow.elementHandle();

      try {
        await this.deleteNumberDialog.numberSelector.click({ timeout: 2000 });
        await this.deleteNumberDialog.numberSelector.page().getByRole('option').first().click();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-empty
      } catch (error) {}

      await this.deleteNumberDialog.okInput.pressSequentially('OK', { delay: 150 });

      const deleteResponse = this.page.waitForResponse(this.deleteNumberPath);

      await this.deleteNumberDialog.deleteButton.click();

      await deleteResponse;
      await rowElement?.waitForElementState('hidden');

      isVisible = await deleteNumberRow.isVisible();
    }
  }

  async deleteSendingNumbers(sendingNumbersToDelete: string[]) {
    await this.goto();

    for (const numberName of sendingNumbersToDelete) {
      const numberRow = this.sendingNumberGrid.getByRole('row', { name: numberName }).first();
      const rowElement = await numberRow.elementHandle();

      if (rowElement === null) {
        continue;
      }

      await numberRow.hover();
      await numberRow.getByTitle('Delete SMS Sending Number').click();

      try {
        await this.deleteNumberDialog.numberSelector.click({ timeout: 2000 });
        await this.deleteNumberDialog.numberSelector.page().getByRole('option').first().click();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-empty
      } catch (error) {}

      await this.deleteNumberDialog.okInput.pressSequentially('OK', { delay: 150 });
      await this.deleteNumberDialog.deleteButton.click();
      await this.deleteNumberDialog.waitForDialogToBeDismissed();
      await rowElement.waitForElementState('hidden');
    }
  }
}
