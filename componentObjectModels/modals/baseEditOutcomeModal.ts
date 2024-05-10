import { Locator, Page } from '@playwright/test';

export abstract class BaseEditOutcomeModal {
  protected readonly modal: Locator;
  readonly okButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.modal = page.getByRole('dialog', { name: /outcome/i });
    this.okButton = this.modal.getByRole('button', { name: 'OK' });
    this.cancelButton = this.modal.getByRole('button', { name: 'Cancel' });
  }
}
