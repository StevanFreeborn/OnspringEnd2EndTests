import { Locator, Page } from '@playwright/test';

export class EmailMessageDetailModal {
  private readonly modal: Locator;
  readonly subject: Locator;
  readonly toLink: Locator;
  readonly emailBodyLink: Locator;
  readonly recordLink: Locator;

  constructor(page: Page) {
    this.modal = page.getByRole('dialog', { name: 'Message Detail' });
    this.subject = this.modal.locator('.label:has-text("Subject") + .data');
    this.toLink = this.modal.locator('.label:has-text("To") + .data').getByRole('link');
    this.emailBodyLink = this.modal.locator('.label:has-text("Email Body") + .data').getByRole('link');
    this.recordLink = this.modal.locator('.label:has-text("Record") + .data').getByRole('link');
  }
}
