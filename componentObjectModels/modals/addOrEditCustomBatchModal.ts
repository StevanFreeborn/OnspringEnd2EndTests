import { Locator, Page } from '@playwright/test';
import { CustomBatchContentDefinition } from '../../models/createMultipleRecordsOutcome';
import { CustomBatchContentSettingsTab } from '../tabs/customBatchContentSettingsTab';
import { CustomBatchGeneralSettingsTab } from '../tabs/customBatchGeneralSettingsTab';

export class AddOrEditCustomBatchModal {
  private readonly modal: Locator;
  private readonly generalSettingsTabButton: Locator;
  private readonly contentSettingsTabButton: Locator;
  private readonly generalSettingsTab: CustomBatchGeneralSettingsTab;
  private readonly contentSettingsTab: CustomBatchContentSettingsTab;
  readonly okButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.modal = page.getByRole('dialog', { name: /content definition/i });
    this.generalSettingsTabButton = this.modal.getByRole('tab', { name: 'General Settings' });
    this.contentSettingsTabButton = this.modal.getByRole('tab', { name: 'Content Settings' });
    this.generalSettingsTab = new CustomBatchGeneralSettingsTab(this.modal);
    this.contentSettingsTab = new CustomBatchContentSettingsTab(this.modal);
    this.okButton = this.modal.getByRole('button', { name: 'OK' });
    this.cancelButton = this.modal.getByRole('button', { name: 'Cancel' });
  }

  async fillOutForm(definition: CustomBatchContentDefinition) {
    await this.generalSettingsTabButton.click();
    await this.generalSettingsTab.fillOutForm(definition);

    await this.contentSettingsTabButton.click();
    await this.contentSettingsTab.fillOutForm(definition);
  }
}
