import { Locator, Page } from '@playwright/test';
import { CreateOneRecordOnSaveOutcome, CreateOneRecordOutcome } from '../../models/createOneRecordOutcome';
import { CreateOneRecordCreationSettingsTab } from '../tabs/createOneRecordCreationSettingsTab';
import { EditOutcomeModalWithTabs } from './editOutcomeModalWithTabs';

export class EditCreateOneRecordOutcomeModal extends EditOutcomeModalWithTabs {
  readonly creationSettingsTabButton: Locator;
  readonly creationSettingsTab: CreateOneRecordCreationSettingsTab;

  constructor(page: Page) {
    super(page);
    this.creationSettingsTabButton = this.modal.getByRole('tab', { name: 'Creation Settings' });
    this.creationSettingsTab = new CreateOneRecordCreationSettingsTab(this.modal);
  }

  async fillOutForm(outcome: CreateOneRecordOutcome) {
    await super.fillOutForm(outcome);

    if (outcome instanceof CreateOneRecordOnSaveOutcome) {
      await this.creationSettingsTabButton.click();

      const page = this.modal.page();

      await this.creationSettingsTab.appSelector.click();
      await page.getByRole('option', { name: outcome.targetApp }).click();

      await this.creationSettingsTab.frequencySelector.click();
      await page.getByRole('option', { name: outcome.frequency }).click();

      await this.creationSettingsTab.layoutSelector.click();
      await page.getByRole('option', { name: outcome.layout }).click();
      return;
    }

    throw new Error(`Unsupported outcome type: ${outcome.constructor.name}`);
  }
}
