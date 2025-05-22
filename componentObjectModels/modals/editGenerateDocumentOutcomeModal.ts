import { Locator, Page } from '@playwright/test';
import { GenerateDocumentOutcome } from '../../models/generateDocumentOutcome';
import { EditOutcomeModalWithTabs } from './editOutcomeModalWithTabs';
import { GenerateDocumentCreationSettingsTab } from '../tabs/generateDocumentCreationSettingsTab';

export class EditGenerateDocumentOutcomeModal extends EditOutcomeModalWithTabs {
  private readonly creationSettingsTabButton: Locator;
  private readonly creationSettingsTab: GenerateDocumentCreationSettingsTab;

  constructor(page: Page) {
    super(page);

    this.creationSettingsTabButton = this.modal.getByRole('tab', { name: 'Creation Settings' });
    this.creationSettingsTab = new GenerateDocumentCreationSettingsTab(this.modal);
  }

  async fillOutForm(outcome: GenerateDocumentOutcome) {
    await super.fillOutForm(outcome);

    await this.creationSettingsTabButton.click();
    await this.creationSettingsTab.fillOutForm(outcome);
  }
}
