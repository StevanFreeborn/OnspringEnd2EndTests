import { Locator, Page } from '@playwright/test';

export class AddFieldDialog {
  readonly continueButton: Locator;

  constructor(page: Page) {
    this.continueButton = page.getByRole('button', { name: 'Continue' });
  }
}
