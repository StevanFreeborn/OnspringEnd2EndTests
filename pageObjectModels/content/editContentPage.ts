import { Locator, Page } from '@playwright/test';
import { BASE_URL } from '../../playwright.config';
import { EditableContentPage } from './editableContentPage';

export class EditContentPage extends EditableContentPage {
  private readonly getVersionHistoryPathRegex: RegExp;
  private readonly concurrentEditAlertModal: Locator;
  readonly pathRegex: RegExp;
  readonly viewRecordButton: Locator;

  constructor(page: Page) {
    super(page);
    this.getVersionHistoryPathRegex = /\/Content\/\d+\/\d+\/GetRecordVersionsPaged/;
    this.concurrentEditAlertModal = this.page.getByRole('dialog', { name: 'Concurrent Editing Alert' });
    this.pathRegex = new RegExp(`${BASE_URL}/Content/[0-9]+/[0-9]+/Edit`);
    this.viewRecordButton = this.page.getByRole('link', { name: 'View Record' });
  }

  async goto(appId: number, recordId: number) {
    await this.page.addLocatorHandler(
      this.concurrentEditAlertModal,
      async locator => {
        await locator.getByRole('button', { name: 'Close' }).click();
      },
      { times: 1 }
    );

    await this.page.goto(`/Content/${appId}/${recordId}/Edit`);
  }

  getRecordIdFromUrl() {
    if (this.page.url().match(this.pathRegex) === null) {
      throw new Error('The current page is not a content edit page.');
    }

    const url = this.page.url();
    const urlParts = url.split('/');
    const recordId = urlParts[urlParts.length - 2];
    return parseInt(recordId);
  }

  async save() {
    const saveResponse = this.page.waitForResponse(
      response => response.url().match(this.pathRegex) !== null && response.request().method() === 'POST'
    );

    await this.saveRecordButton.click();
    await saveResponse;
  }

  async openVersionHistory() {
    await this.actionMenuButton.click();
    await this.actionMenu.waitFor();

    const viewVersionHistoryResponse = this.page.waitForResponse(this.getVersionHistoryPathRegex);
    await this.actionMenu.viewVersionHistoryLink.click();
    await this.viewVersionHistoryModal.waitFor();
    await viewVersionHistoryResponse;
  }
}
