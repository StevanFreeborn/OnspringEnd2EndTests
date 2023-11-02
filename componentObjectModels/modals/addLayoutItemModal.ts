import { Locator, Page } from '@playwright/test';

export class AddLayoutItemModal {
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }
}
