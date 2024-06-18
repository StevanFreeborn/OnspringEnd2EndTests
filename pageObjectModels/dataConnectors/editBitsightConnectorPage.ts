import { Locator, Page } from '@playwright/test';
import { BitsightAppMappingTab } from '../../componentObjectModels/tabs/bitsightAppMappingTab';
import { BitsightConnectionTab } from '../../componentObjectModels/tabs/bitsightConnectionTab';
import { BitsightDataConnector } from '../../models/bitsightDataConnector';
import { EditConnectorPage } from './editConnectorPage';

export class EditBitsightConnectorPage extends EditConnectorPage {
  readonly appMappingTabButton: Locator;
  readonly connectionTab: BitsightConnectionTab;
  readonly appMappingTab: BitsightAppMappingTab;
  readonly dataMappingTab: BitsightDataMappingTab;

  constructor(page: Page) {
    super(page);
    this.appMappingTabButton = page.getByRole('tab', { name: /app mapping/i });
    this.connectionTab = new BitsightConnectionTab(page);
    this.appMappingTab = new BitsightAppMappingTab(page);
  }

  async updateConnector(dataConnector: BitsightDataConnector) {
    await this.connectionTabButton.click();
    await this.connectionTab.fillOutForm(dataConnector);

    await this.appMappingTabButton.click();
    await this.appMappingTab.fillOutForm(dataConnector);
  }
}
