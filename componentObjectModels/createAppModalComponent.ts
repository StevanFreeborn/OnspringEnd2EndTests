import { Locator, Page } from '@playwright/test';

export class CreateAppModalComponent {
  readonly page: Page;
  readonly path: string;
  readonly nameInput: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.getByLabel('Name');
    this.saveButton = page.locator('button >> text=Save');
  }
}