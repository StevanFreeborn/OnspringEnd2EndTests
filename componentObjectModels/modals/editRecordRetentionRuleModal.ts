import { Locator, Page } from '../../fixtures';

export class EditRecordRetentionRuleModal {
  private readonly editPathRegex: RegExp;
  private readonly page: Page;
  private readonly modal: Locator;
  private readonly cancelButton: Locator;
  private readonly saveButton: Locator;

  constructor(page: Page) {
    this.editPathRegex = /Admin\/App\/\d+\/RecordRetention\/\d+\/Edit/;
    this.page = page;
    this.modal = this.page.getByRole('dialog', { name: /record retention rule/i });
    this.cancelButton = this.modal.getByRole('button', { name: 'Cancel' });
    this.saveButton = this.modal.getByRole('button', { name: 'Save' });
  }

  async cancel() {
    await this.cancelButton.click();
  }

  async save() {
    const saveResponse = this.page.waitForResponse(
      response => response.url().match(this.editPathRegex) !== null && response.request().method() === 'POST'
    );
    await this.saveButton.click();
    await saveResponse;
  }
}
