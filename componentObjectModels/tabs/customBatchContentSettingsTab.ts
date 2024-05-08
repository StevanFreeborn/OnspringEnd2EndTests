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
    const page = this.appSelector.page();

    await this.appSelector.click();
    await page.getByRole('option', { name: definition.targetApp }).click();

    await this.layoutSelector.click();
    await page.getByRole('option', { name: definition.layout }).click();
  }
}
