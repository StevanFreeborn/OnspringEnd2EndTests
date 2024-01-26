import { Locator, Page } from '@playwright/test';

export class AutoSaveDialog {
  private readonly page: Page;
  readonly dismissCheckbox: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dismissCheckbox = page.getByLabel("Don't show me this again");
    this.closeButton = page.getByRole('button', { name: 'Close' });
  }

  async isVisible() {
    return await this.page.getByRole('dialog', { name: /Working with AutoSave/ }).isVisible();
  }

  async dismiss() {
    await this.dismissCheckbox.check();
    await this.closeButton.click();
  }
}
