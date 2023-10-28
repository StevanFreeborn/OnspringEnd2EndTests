import { Locator, Page } from '@playwright/test';

export class AddFieldModal {
  readonly nameInput: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.nameInput = page.frameLocator('iframe').getByText('Field', { exact: true });
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }
}
