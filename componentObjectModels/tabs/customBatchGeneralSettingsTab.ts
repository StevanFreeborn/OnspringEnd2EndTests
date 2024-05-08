import { Locator } from '@playwright/test';
import { CustomBatchContentDefinition } from '../../models/createMultipleRecordsOutcome';

export class CustomBatchGeneralSettingsTab {
  private readonly batchRecordNameInput: Locator;
  private readonly descriptionEditor: Locator;

  constructor(modal: Locator) {
    this.batchRecordNameInput = modal.locator('#CustomContentName');
    this.descriptionEditor = modal.locator('.content-area.mce-content-body');
  }

  async fillOutForm(definition: CustomBatchContentDefinition) {
    await this.batchRecordNameInput.fill(definition.batchRecordName);
    await this.descriptionEditor.fill(definition.description);
  }
}
