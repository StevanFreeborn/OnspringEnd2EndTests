import { Locator } from '@playwright/test';
import { DefinedLibraryContentDefinition } from '../../models/createMultipleRecordsOutcome';
import { LibraryContentSelectionSettingsTab } from './libraryContentSelectionSettingsTab';

export class DefinedLibraryContentSelectionSettingsTab extends LibraryContentSelectionSettingsTab {
  private readonly generateRecordsButton: Locator;

  constructor(modal: Locator) {
    super(modal);
    this.generateRecordsButton = modal.getByRole('button', { name: 'Generate Records' });
  }

  async fillOutForm(definition: DefinedLibraryContentDefinition) {
    await this.dataFilterRuleControl.addLogic(definition.dataFilterLogic);

    if (definition.dynamicFilter) {
      await this.dynamicFilterCheckbox.check();
      await this.dynamicFilterDualPaneSelector.selectOptions(definition.dynamicFilterFields);
    }

    await this.generateRecordsButton.click();
  }
}
