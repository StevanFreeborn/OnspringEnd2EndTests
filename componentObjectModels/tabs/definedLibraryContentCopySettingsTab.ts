import { Locator } from '@playwright/test';
import { DefinedLibraryContentDefinition } from '../../models/createMultipleRecordsOutcome';

export class DefinedLibraryContentCopySettingsTab {
  private readonly targetAppSelector: Locator;
  private readonly layoutSelector: Locator;

  constructor(modal: Locator) {
    this.targetAppSelector = modal.locator('.label:has-text("Target App") + .data').getByRole('listbox');
    this.layoutSelector = modal.locator('.label:has-text("Layout") + .data').getByRole('listbox');
  }

  async fillOutForm(definition: DefinedLibraryContentDefinition) {
    await this.targetAppSelector.click();
    await this.targetAppSelector.page().getByRole('option', { name: definition.targetApp }).click();

    await this.layoutSelector.click();
    await this.layoutSelector.page().getByRole('option', { name: definition.layout }).click();
  }
}
