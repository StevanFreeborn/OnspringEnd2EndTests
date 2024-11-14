import { Locator, Page } from '@playwright/test';
import { WaitForOptions } from '../../utils';

export class PrintReportModal {
  private readonly modal: Locator;
  readonly okButton: Locator;

  constructor(page: Page) {
    this.modal = page.getByRole('dialog', { name: 'Print Report' });
    this.okButton = this.modal.getByRole('button', { name: 'OK' });
  }

  async waitFor(options?: WaitForOptions) {
    await this.modal.waitFor(options);
  }
}
