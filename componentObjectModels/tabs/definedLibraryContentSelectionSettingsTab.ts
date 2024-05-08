import { Locator } from '@playwright/test';
import { DefinedLibraryContentDefinition } from '../../models/createMultipleRecordsOutcome';
import { DualPaneSelector } from '../controls/dualPaneSelector';
import { RuleControl } from '../controls/ruleControl';

export class DefinedLibraryContentSelectionSettingsTab {
  private readonly dataFilterRuleControl: RuleControl;
  private readonly generateRecordsButton: Locator;
  private readonly dynamicFilterCheckbox: Locator;
  private readonly dynamicFilterDualPaneSelector: DualPaneSelector;

  constructor(modal: Locator) {
    this.dataFilterRuleControl = new RuleControl(modal.locator('.label:has-text("Data Filter") + .data .rule-config'));
    this.generateRecordsButton = modal.getByRole('button', { name: 'Generate Records' });
    this.dynamicFilterCheckbox = modal.locator('.label:has-text("Dynamic Filter") + .data').getByRole('checkbox');
    this.dynamicFilterDualPaneSelector = new DualPaneSelector(modal.locator('[data-dynamic-fields] .onx-selector'));
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
