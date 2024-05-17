import { Locator } from '@playwright/test';
import { DefinedLibraryContentDefinition } from '../../models/createMultipleRecordsOutcome';
import { LibraryContentSelectionSettingsTab } from './libraryContentSelectionSettingsTab';

export class DefinedLibraryContentSelectionSettingsTab extends LibraryContentSelectionSettingsTab {
  private modal: Locator;
  private readonly generateRecordsButton: Locator;
  private generatePathRegex = /\/Admin\/App\/\d+\/Trigger\/GenerateDefinedRecords/;
  private getDefinedRecordsPathRegex = /\/Admin\/App\/\d+\/Trigger\/GetDefinedRecordPage/;

  constructor(modal: Locator) {
    super(modal);
    this.modal = modal;
    this.generateRecordsButton = modal.getByRole('button', { name: 'Generate Records' });
  }

  async fillOutForm(definition: DefinedLibraryContentDefinition) {
    await this.dataFilterRuleControl.addLogic(definition.dataFilterLogic);

    if (definition.dynamicFilter) {
      await this.dynamicFilterCheckbox.check();
      await this.dynamicFilterDualPaneSelector.selectOptions(definition.dynamicFilterFields);
    }

    const page = this.modal.page();

    const generateRecordsResponse = page.waitForResponse(this.generatePathRegex);
    const getDefinedRecordsResponse = page.waitForResponse(this.getDefinedRecordsPathRegex);

    await this.generateRecordsButton.click();

    await generateRecordsResponse;
    await getDefinedRecordsResponse;
  }
}
