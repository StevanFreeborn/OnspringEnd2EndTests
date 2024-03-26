import { Locator, Page } from '@playwright/test';

export class EmailMessageDetailModal {
  private readonly modal: Locator;
  readonly subject: Locator;

  constructor(page: Page) {
    this.modal = page.getByRole('dialog', { name: 'Message Detail' });
    this.subject = this.modal.locator('.label:has-text("Subject") + .data');
  }
}
