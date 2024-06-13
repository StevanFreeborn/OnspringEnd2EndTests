import { Locator, Page } from '@playwright/test';
import { BitsightDataConnector } from '../../models/bitsightDataConnector';
import { DataConnectorConnectionTab } from './dataConnectorConnectionTab';

export class BitsightConnectionTab extends DataConnectorConnectionTab {
  readonly bitsightApiKeyInput: Locator;

  constructor(page: Page) {
    super(page);
    this.bitsightApiKeyInput = page.getByLabel('BitSight API Token');
  }

  async fillOutForm(dataConnector: BitsightDataConnector) {
    await this.nameInput.fill(dataConnector.name);
    await this.descriptionEditor.fill(dataConnector.description);
    await this.bitsightApiKeyInput.fill(dataConnector.apiKey);
    await this.updateStatus(dataConnector.status);
  }
}
