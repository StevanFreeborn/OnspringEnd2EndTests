import { Locator } from '@playwright/test';
import {
  ContentDefinition,
  CreateMultipleRecordsOutcome,
  CustomBatchContentDefinition,
} from '../../models/createMultipleRecordsOutcome';
import { AddOrEditCustomBatchModal } from '../modals/addOrEditCustomBatchModal';

export class CreateMultipleRecordsCreationSettingsTab {
  private readonly modal: Locator;
  readonly frequencySelector: Locator;
  readonly batchTypeSelector: Locator;
  readonly addContentDefinitionLink: Locator;
  readonly customBatchModal: AddOrEditCustomBatchModal;

  constructor(modal: Locator) {
    this.modal = modal;
    this.frequencySelector = modal.locator('.label:has-text("Frequency") + .data').getByRole('listbox');
    this.batchTypeSelector = modal.locator('.label:has-text("Batch Type") + .data').getByRole('listbox');
    this.addContentDefinitionLink = modal.getByRole('link', { name: 'Add Content Definition' });
    this.customBatchModal = new AddOrEditCustomBatchModal(modal.page());
  }

  private async addDefinition(definition: ContentDefinition) {
    if (definition instanceof CustomBatchContentDefinition) {
      await this.customBatchModal.fillOutForm(definition);
      await this.customBatchModal.okButton.click();
      return;
    }

    throw new Error(`Unsupported definition type: ${definition.constructor.name}`);
  }

  async fillOutForm(outcome: CreateMultipleRecordsOutcome) {
    const page = this.modal.page();

    await this.frequencySelector.click();
    await page.getByRole('option', { name: outcome.frequency }).click();

    await this.batchTypeSelector.click();
    await page.getByRole('option', { name: outcome.batchType }).click();

    for (const definition of outcome.definitions) {
      await this.addContentDefinitionLink.click();
      await this.addDefinition(definition);
    }
  }
}
