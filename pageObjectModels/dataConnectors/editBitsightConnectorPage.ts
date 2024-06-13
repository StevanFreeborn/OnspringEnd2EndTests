import { Page } from '@playwright/test';
import { BitsightConnectionTab } from '../../componentObjectModels/tabs/bitsightConnectionTab';
import { BitsightDataConnector } from '../../models/bitsightDataConnector';
import { EditConnectorPage } from './editConnectorPage';

export class EditBitsightConnectorPage extends EditConnectorPage {
  readonly connectionTab: BitsightConnectionTab;

  constructor(page: Page) {
    super(page);
    this.connectionTab = new BitsightConnectionTab(page);
  }

  async updateConnector(dataConnector: BitsightDataConnector) {
    await this.connectionTab.fillOutForm(dataConnector);
  }
}
