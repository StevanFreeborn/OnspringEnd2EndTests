import { Locator, Page } from '@playwright/test';
import { BitsightDataConnector } from '../../models/bitsightDataConnector';
import { DataConnectorConnectionTab } from './dataConnectorConnectionTab';

export class BitsightConnectionTab extends DataConnectorConnectionTab {
  readonly apiKeyInput: Locator;

  constructor(page: Page) {
    super(page);
    this.apiKeyInput = page.getByLabel('BitSight API Token');
  }

  async fillOutForm(dataConnector: BitsightDataConnector) {
    await super.fillOutForm(dataConnector);
    await this.apiKeyInput.fill(dataConnector.apiKey);
  }
}
