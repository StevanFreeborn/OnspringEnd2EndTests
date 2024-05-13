import { Locator } from '@playwright/test';
import { LibraryContentDefinition } from '../../models/createMultipleRecordsOutcome';
import { DualPaneSelector } from '../controls/dualPaneSelector';
import { RuleControl } from '../controls/ruleControl';

export abstract class LibraryContentSelectionSettingsTab {
  protected readonly dataFilterRuleControl: RuleControl;
  protected readonly dynamicFilterCheckbox: Locator;
  protected readonly dynamicFilterDualPaneSelector: DualPaneSelector;

  constructor(modal: Locator) {
    this.dataFilterRuleControl = new RuleControl(modal.locator('.label:has-text("Data Filter") + .data .rule-config'));
    this.dynamicFilterCheckbox = modal.locator('.label:has-text("Dynamic Filter") + .data').getByRole('checkbox');
    this.dynamicFilterDualPaneSelector = new DualPaneSelector(modal.locator('[data-dynamic-fields] .onx-selector'));
  }

  abstract fillOutForm(definition: LibraryContentDefinition): Promise<void>;
}
