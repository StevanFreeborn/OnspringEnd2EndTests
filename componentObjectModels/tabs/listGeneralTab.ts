import { Locator, Page } from '@playwright/test';

export class ListGeneralTab {
  readonly nameInput: Locator;
  readonly descriptionEditor: Locator;
  readonly statusSwitch: Locator;
  readonly statusToggle: Locator;

  constructor(page: Page) {
    this.nameInput = page.getByLabel('Name');
    this.descriptionEditor = page.locator('.content-area.mce-content-body');
    this.statusSwitch = page.getByRole('switch', { name: 'Status' });
    this.statusToggle = this.statusSwitch.locator('span').nth(3);
  }
}
