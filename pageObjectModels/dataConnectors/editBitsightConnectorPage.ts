import { Locator, Page } from '@playwright/test';
import { BitsightAppMappingTab } from '../../componentObjectModels/tabs/bitsightAppMappingTab';
import { BitsightConnectionTab } from '../../componentObjectModels/tabs/bitsightConnectionTab';
import { BitsightDataMapping } from '../../componentObjectModels/tabs/bitsightDataMappingTab';
import { BitsightSchedulingTab } from '../../componentObjectModels/tabs/bitsightSchedulingTab';
import { BitsightDataConnector } from '../../models/bitsightDataConnector';
import { EditConnectorPage } from './editConnectorPage';

export class EditBitsightConnectorPage extends EditConnectorPage {
  private readonly savePath: RegExp;
  readonly appMappingTabButton: Locator;
  readonly dataMappingTabButton: Locator;
  readonly schedulingTabButton: Locator;
  readonly connectionTab: BitsightConnectionTab;
  readonly appMappingTab: BitsightAppMappingTab;
  readonly dataMappingTab: BitsightDataMapping;
  readonly schedulingTab: BitsightSchedulingTab;

  constructor(page: Page) {
    super(page);
    this.savePath = /\/Admin\/Integration\/DataConnector\/EditBitsightConnector/;
    this.appMappingTabButton = page.getByRole('tab', { name: /app mapping/i });
    this.dataMappingTabButton = page.getByRole('tab', { name: /data mapping/i });
    this.schedulingTabButton = page.getByRole('tab', { name: /scheduling/i });
    this.connectionTab = new BitsightConnectionTab(page);
    this.appMappingTab = new BitsightAppMappingTab(page);
    this.dataMappingTab = new BitsightDataMapping(page);
    this.schedulingTab = new BitsightSchedulingTab(page);
  }

  private async save() {
    const saveResponse = this.page.waitForResponse(this.savePath);
    await this.saveButton.click();
    await saveResponse;
  }

  async updateConnector(dataConnector: BitsightDataConnector) {
    await this.connectionTabButton.click();
    await this.connectionTab.fillOutForm(dataConnector);

    await this.appMappingTabButton.click();
    await this.appMappingTab.fillOutForm(dataConnector);

    await this.dataMappingTabButton.click();
    await this.dataMappingTab.fillOutForm(dataConnector);

    await this.schedulingTabButton.click();
    await this.schedulingTab.fillOutForm(dataConnector);

    await this.save();
  }
}
