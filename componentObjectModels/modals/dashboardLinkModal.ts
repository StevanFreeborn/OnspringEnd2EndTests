import { Locator, Page } from '@playwright/test';
import { WaitForOptions } from '../../utils';

export class DashboardLinkModal {
  private readonly modal: Locator;
  private readonly link: Locator;
  private readonly closeButton: Locator;

  constructor(page: Page) {
    this.modal = page.locator('#messageDialog');
    this.link = this.modal.getByText(/\/Dashboard\/\d+/);
    this.closeButton = page.getByRole('button', { name: 'Close' });
  }

  async waitFor(options?: WaitForOptions) {
    await this.modal.waitFor(options);
  }

  async close() {
    await this.closeButton.click();
    await this.modal.waitFor({ state: 'hidden' });
  }

  async getLink() {
    return this.link;
  }
}
