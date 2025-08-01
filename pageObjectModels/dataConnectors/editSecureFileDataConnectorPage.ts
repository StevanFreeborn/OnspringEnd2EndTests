import { SecureFileConnectionTab } from '../../componentObjectModels/tabs/secureFileConnectionTab';
import { SecureFileDataMappingTab } from '../../componentObjectModels/tabs/secureFileDataMappingTab';
import { SecureFileSchedulingTab } from '../../componentObjectModels/tabs/secureFileSchedulingTab';
import { Locator, Page } from '../../fixtures';
import { SecureFileIntegrationSettingsTab } from './../../componentObjectModels/tabs/secureFileIntegrationSettingsTab';
import { SecureFileDataConnector } from './../../models/secureFileDataConnector';
import { EditConnectorPage } from './editConnectorPage';

export class EditSecureFileDataConnectorPage extends EditConnectorPage {
  private readonly savePath: string;
  readonly connectionTabButton: Locator;
  readonly connectionTab: SecureFileConnectionTab;
  readonly dataMappingTabButton: Locator;
  readonly dataMappingTab: SecureFileDataMappingTab;
  readonly integrationSettingsTabButton: Locator;
  readonly integrationSettingsTab: SecureFileIntegrationSettingsTab;
  readonly schedulingTabButton: Locator;
  readonly schedulingTab: SecureFileSchedulingTab;

  constructor(page: Page) {
    super(page);
    this.savePath = '/Admin/Integration/DataConnector/EditSecureFile';
    this.connectionTabButton = this.page.getByRole('tab', { name: 'Connection' });
    this.connectionTab = new SecureFileConnectionTab(this.page);
    this.dataMappingTabButton = this.page.getByRole('tab', { name: 'Data Mapping' });
    this.dataMappingTab = new SecureFileDataMappingTab(this.page);
    this.integrationSettingsTabButton = this.page.getByRole('tab', { name: 'Integration Settings' });
    this.integrationSettingsTab = new SecureFileIntegrationSettingsTab(this.page);
    this.schedulingTabButton = this.page.getByRole('tab', { name: 'Scheduling' });
    this.schedulingTab = new SecureFileSchedulingTab(this.page);
  }

  private async save() {
    const saveResponse = this.page.waitForResponse(this.savePath);
    await this.saveButton.click();
    await saveResponse;
  }

  async updateConnector(dataConnector: SecureFileDataConnector) {
    await this.connectionTabButton.click();
    await this.connectionTab.fillOutForm(dataConnector);

    await this.dataMappingTabButton.click();
    await this.dataMappingTab.fillOutForm(dataConnector);

    await this.integrationSettingsTabButton.click();
    await this.integrationSettingsTab.fillOutForm(dataConnector);

    await this.schedulingTabButton.click();
    await this.schedulingTab.fillOutForm(dataConnector);

    await this.save();
  }
}
