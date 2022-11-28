import { Locator, Page } from '@playwright/test';

export class CreateAppDialogComponent {
    readonly page: Page;
    readonly continueButton: Locator;
  
    constructor(page: Page) {
      this.page = page;
      this.continueButton = page.locator('text=Continue');
    }
  }