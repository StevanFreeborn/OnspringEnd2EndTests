import { Locator, Page } from '@playwright/test';
import { DataConnector } from '../../models/dataConnector';

export abstract class DataConnectorConnectionTab {
  readonly nameInput: Locator;
  readonly descriptionEditor: Locator;
  readonly statusSwitch: Locator;
  readonly statusToggle: Locator;
  readonly viewRunHistoryLink: Locator;

  constructor(page: Page) {
    this.nameInput = page.getByRole('textbox', { name: 'Name', exact: true });
    this.descriptionEditor = page.locator('.content-area.mce-content-body');
    this.statusSwitch = page.getByRole('switch', { name: 'Status' });
    this.statusToggle = this.statusSwitch.locator('span').nth(3);
    this.viewRunHistoryLink = page.getByRole('link', { name: 'View Run History' });
  }

  private async updateStatus(status: boolean) {
    const currentStatus = await this.statusSwitch.getAttribute('aria-checked');

    if ((status === true && currentStatus === 'false') || (status === false && currentStatus === 'true')) {
      await this.statusToggle.click();
    }
  }

  async fillOutForm(dataConnector: DataConnector) {
    await this.nameInput.fill(dataConnector.name);
    await this.descriptionEditor.fill(dataConnector.description);
    await this.updateStatus(dataConnector.status);
  }
}
