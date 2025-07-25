import { EmailSyncDataMappingTab } from '../../componentObjectModels/tabs/emailSyncDataMappingTab';
import { EmailSyncDataSyncSettingsTab } from '../../componentObjectModels/tabs/emailSyncDataSyncSettingsTab';
import { EmailSyncDataSyncTab } from '../../componentObjectModels/tabs/emailSyncDataSyncTab';
import { Locator, Page } from '../../fixtures';
import { EmailSync } from '../../models/emailSync';
import { BaseAdminPage } from '../baseAdminPage';

export class EditEmailSyncPage extends BaseAdminPage {
  private readonly saveChangesLink: Locator;
  private readonly savePathRegex: RegExp;
  private readonly dataSyncTabButton: Locator;
  private readonly dataMappingTabButton: Locator;
  private readonly dataSyncSettingsTabButton: Locator;
  readonly pathRegex: RegExp;
  readonly dataSyncTab: EmailSyncDataSyncTab;
  readonly dataMappingTab: EmailSyncDataMappingTab;
  readonly dataSyncSettings: EmailSyncDataSyncSettingsTab;

  constructor(page: Page) {
    super(page);
    this.saveChangesLink = this.page.getByRole('link', { name: 'Save Changes' });
    this.savePathRegex = /a/;
    this.pathRegex = /\/Admin\/Integration\/EmailSync\/\d+\/Edit/;
    this.dataSyncTabButton = this.page.getByRole('tab', { name: 'Data Sync', exact: true });
    this.dataMappingTabButton = this.page.getByRole('tab', { name: 'Data Mapping' });
    this.dataSyncSettingsTabButton = this.page.getByRole('tab', { name: 'Data Sync Settings' });
    this.dataSyncTab = new EmailSyncDataSyncTab(this.page);
    this.dataMappingTab = new EmailSyncDataMappingTab(this.page);
    this.dataSyncSettings = new EmailSyncDataSyncSettingsTab(this.page);
  }

  async updateEmailSync(emailSync: EmailSync) {
    await this.dataSyncTabButton.click();
    await this.dataSyncTab.fillOutForm(emailSync);

    await this.dataMappingTabButton.click();
    await this.dataMappingTab.fillOutForm(emailSync);

    await this.dataSyncSettingsTabButton.click();
    await this.dataSyncSettings.fillOutForm(emailSync);
  }

  async save() {
    const saveResponse = this.page.waitForResponse(
      r => r.request().method() === 'POST' && r.url().match(this.pathRegex) !== null
    );
    await this.saveChangesLink.click();
    await saveResponse;
  }
}
