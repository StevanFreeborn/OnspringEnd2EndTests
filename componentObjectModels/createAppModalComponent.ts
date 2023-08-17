import { Locator, Page } from '@playwright/test';

export class CreateAppModalComponent {
  readonly page: Page;
  readonly dialog: Locator;
  readonly nameInput: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dialog = page.getByRole('dialog');
    this.nameInput = page.getByLabel('Name');
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }
}
