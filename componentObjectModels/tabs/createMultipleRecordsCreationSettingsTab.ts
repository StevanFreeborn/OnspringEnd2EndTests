import { Locator } from '@playwright/test';
import {
  ContentDefinition,
  CreateMultipleRecordsOutcome,
  CustomBatchContentDefinition,
  DefinedLibraryContentDefinition,
  DynamicLibraryContentDefinition,
} from '../../models/createMultipleRecordsOutcome';
import { AddAppDefinitionDialog } from '../dialogs/addAppDefinitionDialog';
import { AddOrEditCustomBatchModal } from '../modals/addOrEditCustomBatchModal';
import { AddOrEditDefinedLibraryModal } from '../modals/addOrEditDefinedLibraryModal';
import { AddOrEditDynamicLibraryModal } from '../modals/addOrEditDynamicLibraryModal';

export class CreateMultipleRecordsCreationSettingsTab {
  private readonly modal: Locator;
  readonly frequencySelector: Locator;
  readonly batchTypeSelector: Locator;
  readonly addDefinitionLink: Locator;
  readonly customBatchModal: AddOrEditCustomBatchModal;
  readonly addAppDefinitionDialog: AddAppDefinitionDialog;
  readonly definedLibraryModal: AddOrEditDefinedLibraryModal;
  readonly dynamicLibraryModal: AddOrEditDynamicLibraryModal;

  constructor(modal: Locator) {
    this.modal = modal;
    this.frequencySelector = this.modal.locator('.label:has-text("Frequency") + .data').getByRole('listbox');
    this.batchTypeSelector = this.modal.locator('.label:has-text("Batch Type") + .data').getByRole('listbox');
    this.addDefinitionLink = this.modal.getByRole('link', { name: /add (?:app|content) definition/i });

    const page = this.modal.page();
    this.customBatchModal = new AddOrEditCustomBatchModal(page);
    this.addAppDefinitionDialog = new AddAppDefinitionDialog(page);
    this.definedLibraryModal = new AddOrEditDefinedLibraryModal(page);
    this.dynamicLibraryModal = new AddOrEditDynamicLibraryModal(page);
  }

  private async addDefinition(definition: ContentDefinition) {
    if (definition instanceof CustomBatchContentDefinition) {
      await this.customBatchModal.fillOutForm(definition);
      await this.customBatchModal.okButton.click();
      return;
    }

    if (definition instanceof DefinedLibraryContentDefinition) {
      await this.addAppDefinitionDialog.selectSourceApp(definition.sourceApp);
      await this.addAppDefinitionDialog.okButton.click();

      await this.definedLibraryModal.fillOutForm(definition);
      await this.definedLibraryModal.okButton.click();
      return;
    }

    if (definition instanceof DynamicLibraryContentDefinition) {
      await this.addAppDefinitionDialog.selectSourceApp(definition.sourceApp);
      await this.addAppDefinitionDialog.okButton.click();

      await this.dynamicLibraryModal.fillOutForm(definition);
      await this.dynamicLibraryModal.okButton.click();
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
      await this.addDefinitionLink.click();
      await this.addDefinition(definition);
    }
  }
}
