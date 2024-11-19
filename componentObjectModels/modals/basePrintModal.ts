import { Locator, Page } from '@playwright/test';
import { WaitForOptions } from '../../utils';

export class BasePrintModal {
  protected readonly modal: Locator;
  readonly okButton: Locator;

  constructor(page: Page, modalTitle: string) {
    this.modal = page.getByRole('dialog', { name: modalTitle });
    this.okButton = this.modal.getByRole('button', { name: 'OK' });
  }

  async waitFor(options?: WaitForOptions) {
    await this.modal.waitFor(options);
  }
}
