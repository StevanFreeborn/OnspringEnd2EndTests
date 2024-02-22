import { Locator, Page } from '@playwright/test';

export class EmailGeneralTab {
  readonly nameInput: Locator;

  constructor(page: Page) {
    this.nameInput = page.getByLabel('Name', { exact: true });
  }
}
