import { Locator, Page } from '@playwright/test';

export class DownloadsWarningDialog {
  private readonly dialog: Locator;
  readonly okButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.dialog = page.getByRole('dialog', { name: 'Warning' });
    this.okButton = this.dialog.getByRole('button', { name: 'OK' });
    this.cancelButton = this.dialog.getByRole('button', { name: 'Cancel' });
  }
}
