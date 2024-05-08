import { Locator } from '@playwright/test';
import { CustomBatchContentDefinition } from '../../models/createMultipleRecordsOutcome';

export class CustomBatchContentSettingsTab {
  readonly appSelector: Locator;
  readonly layoutSelector: Locator;

  constructor(modal: Locator) {
    this.appSelector = modal.locator('.label:has-text("App/Survey") + .data').getByRole('listbox');
    this.layoutSelector = modal.locator('.label:has-text("Layout") + .data').getByRole('listbox');
  }

  async fillOutForm(definition: CustomBatchContentDefinition) {
    await this.appSelector.click();
    await this.appSelector.page().getByRole('option', { name: definition.targetApp }).click();

    await this.layoutSelector.click();
    await this.layoutSelector.page().getByRole('option', { name: definition.layout }).click();
  }
}
