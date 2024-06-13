import { Locator, Page } from '@playwright/test';
import { DataConnector } from '../../models/dataConnector';

export abstract class DataConnectorConnectionTab {
  readonly nameInput: Locator;
  readonly descriptionEditor: Locator;
  readonly statusSwitch: Locator;
  readonly statusToggle: Locator;
  readonly viewRunHistoryLink: Locator;

  constructor(page: Page) {
    this.nameInput = page.getByLabel('Name');
    this.descriptionEditor = page.locator('.content-area.mce-content-body');
    this.statusSwitch = page.getByRole('switch', { name: 'Status' });
    this.statusToggle = this.statusSwitch.locator('span').nth(3);
    this.viewRunHistoryLink = page.getByRole('link', { name: 'View Run History' });
  }

  abstract fillOutForm(dataConnector: DataConnector): Promise<void>;

  protected async updateStatus(status: boolean) {
    const currentStatus = await this.statusToggle.getAttribute('aria-checked');

    if ((status === true && currentStatus === 'false') || (status === false && currentStatus === 'true')) {
      await this.statusSwitch.click();
    }
  }
}
