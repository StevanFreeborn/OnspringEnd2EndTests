import { Locator, Page } from '@playwright/test';

type WaitForOptions = Parameters<Locator['waitFor']>[0];

export class ExportUnderwayDialog {
  private readonly dialog: Locator;
  private readonly closeButton: Locator;

  constructor(page: Page) {
    this.dialog = page.getByRole('dialog', { name: 'Export Underway' });
    this.closeButton = this.dialog.getByRole('button', { name: 'Close' });
  }

  async waitFor(options?: WaitForOptions) {
    await this.dialog.waitFor(options);
  }

  async close() {
    await this.closeButton.click();
  }
}
