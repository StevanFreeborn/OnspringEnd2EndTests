import { Locator, Page } from '@playwright/test';

export class AutoSaveDialog {
  readonly dismissCheckbox: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    this.dismissCheckbox = page.getByLabel("Don't show me this again");
    this.closeButton = page.getByRole('button', { name: 'Close' });
  }

  async dismiss() {
    await this.dismissCheckbox.click();
    await this.closeButton.click();
  }
}
