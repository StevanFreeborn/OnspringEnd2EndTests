import { Locator, Page } from '@playwright/test';
import { CreateMultipleRecordsOutcome } from '../../models/createMultipleRecordsOutcome';
import { CreateMultipleRecordsCreationSettingsTab } from '../tabs/createMultipleRecordsCreationSettingsTab';
import { EditOutcomeModalWithTabs } from './editOutcomeModalWithTabs';

export class EditCreateMultipleRecordsOutcomeModal extends EditOutcomeModalWithTabs {
  readonly creationSettingsTabButton: Locator;
  readonly creationSettingsTab: CreateMultipleRecordsCreationSettingsTab;

  constructor(page: Page) {
    super(page);
    this.creationSettingsTabButton = this.modal.getByRole('tab', { name: 'Creation Settings' });
    this.creationSettingsTab = new CreateMultipleRecordsCreationSettingsTab(this.modal);
  }

  async fillOutForm(outcome: CreateMultipleRecordsOutcome) {
    await super.fillOutForm(outcome);

    await this.creationSettingsTabButton.click();
    await this.creationSettingsTab.fillOutForm(outcome);
  }
}
