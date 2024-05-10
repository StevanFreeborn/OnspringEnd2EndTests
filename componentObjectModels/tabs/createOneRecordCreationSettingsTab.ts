import { Locator } from '@playwright/test';

export class CreateOneRecordCreationSettingsTab {
  readonly appSelector: Locator;
  readonly frequencySelector: Locator;
  readonly layoutSelector: Locator;

  constructor(modal: Locator) {
    this.appSelector = modal.locator('.label:has-text("App/Survey") + .data').getByRole('listbox');
    this.frequencySelector = modal.locator('.label:has-text("Frequency") + .data').getByRole('listbox');
    this.layoutSelector = modal.locator('.label:has-text("Layout") + .data').getByRole('listbox');
  }
}
