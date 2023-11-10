import { Locator, Page } from '@playwright/test';
import { AddOrEditRecordForm } from '../forms/addOrEditRecordForm';

export class CreateRecordModal {
  private readonly createRecordEndpointRegex: RegExp;
  private readonly page: Page;
  readonly modal: Locator;
  readonly closeButton: Locator;
  readonly form: AddOrEditRecordForm;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createRecordEndpointRegex = /\/Content\/\d+\/PopupAdd/;
    this.modal = this.page
      .getByRole('dialog')
      .filter({
        has: this.page.locator('.ui-dialog-title').filter({ hasText: /Create Record/ }),
      })
      .first();
    this.closeButton = this.modal.getByTitle('Close');
    this.form = new AddOrEditRecordForm(this.modal.locator('iframe').locator('div.contentContainer').first());
    this.saveButton = this.modal.getByRole('button', { name: 'Save' });
    this.cancelButton = this.modal.getByRole('button', { name: 'Cancel' });
  }

  async saveRecord() {
    const createRecordResponse = this.page.waitForResponse(this.createRecordEndpointRegex);
    await this.saveButton.click();
    await createRecordResponse;
  }
}
