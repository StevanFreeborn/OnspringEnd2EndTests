import { Locator, Page } from '@playwright/test';

export class CreateAppDialogComponent {
  readonly page: Page;
  readonly continueButton: Locator;
  readonly copyFromRadioButton: Locator;
  readonly selectAnAppDropdown: Locator;

  constructor(page: Page) {
    this.page = page;
    this.continueButton = page.locator('text=Continue');
    this.copyFromRadioButton = page.getByText('Copy from');
    this.selectAnAppDropdown = page.getByRole('dialog', { name: 'Create App' }).getByText('Select an App');
  }

  appToCopy(appName: string) {
    return this.page.getByRole('option', { name: appName });
  }
}
