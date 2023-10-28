import { Locator, Page } from '@playwright/test';

export class AddLayoutItemDialog {
  readonly continueButton: Locator;

  constructor(page: Page) {
    this.continueButton = page.getByRole('button', { name: 'Continue' });
  }
}
