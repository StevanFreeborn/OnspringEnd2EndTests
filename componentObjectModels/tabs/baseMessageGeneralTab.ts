import { Locator, Page } from '@playwright/test';

export abstract class BaseMessageGeneralTab {
  readonly nameInput: Locator;
  readonly descriptionEditor: Locator;
  protected readonly statusSwitch: Locator;
  protected readonly statusToggle: Locator;

  constructor(page: Page) {
    this.nameInput = page.getByLabel('Name', { exact: true });
    this.descriptionEditor = page.locator('.content-area.mce-content-body:visible');
    this.statusSwitch = page.getByRole('switch');
    this.statusToggle = this.statusSwitch.locator('span').nth(3);
  }

  async enableStatus() {
    const checked = await this.statusSwitch.getAttribute('aria-checked');

    if (checked === 'false') {
      await this.statusToggle.click();
    }
  }

  async disableStatus() {
    const checked = await this.statusSwitch.getAttribute('aria-checked');

    if (checked === 'true') {
      await this.statusToggle.click();
    }
  }
}
