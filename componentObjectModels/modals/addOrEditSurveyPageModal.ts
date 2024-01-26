import { Locator, Page } from '@playwright/test';

export class AddOrEditSurveyPageModal {
  private readonly modal: Locator;
  readonly nameInput: Locator;
  readonly descriptionEditor: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.modal = page.getByRole('dialog', { name: /Add Page|Page Properties/ });
    this.nameInput = this.modal.getByLabel('Name');
    this.descriptionEditor = this.modal.locator('.content-area.mce-content-body');
    this.saveButton = this.modal.getByRole('button', { name: 'Save' });
  }
}
