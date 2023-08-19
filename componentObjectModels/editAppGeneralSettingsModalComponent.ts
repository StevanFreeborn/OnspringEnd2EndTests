import { Locator, Page } from '@playwright/test';

export class EditAppGeneralSettingsModalComponent {
  private readonly page: Page;
  readonly nameInput: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.getByLabel('Name');
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }
}
