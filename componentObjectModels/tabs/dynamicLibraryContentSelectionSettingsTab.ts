import { Locator } from '@playwright/test';
import { DynamicLibraryContentDefinition } from '../../models/createMultipleRecordsOutcome';
import { LibraryContentSelectionSettingsTab } from './libraryContentSelectionSettingsTab';

export class DynamicLibraryContentSelectionSettingsTab extends LibraryContentSelectionSettingsTab {
  constructor(modal: Locator) {
    super(modal);
  }

  async fillOutForm(definition: DynamicLibraryContentDefinition) {
    await this.dataFilterRuleControl.addLogic(definition.dataFilterLogic);

    if (definition.dynamicFilter) {
      await this.dynamicFilterCheckbox.check();
      await this.dynamicFilterDualPaneSelector.selectOptions(definition.dynamicFilterFields);
    }
  }
}
