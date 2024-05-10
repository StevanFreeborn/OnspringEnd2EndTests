import { Locator, Page } from '@playwright/test';
import { FilterListValueOutcome, FilterListValueRule } from '../../models/filterListValueOutcome';
import { DualPaneSelector } from '../controls/dualPaneSelector';
import { EditOutcomeModal } from './editOutcomeModal';

export class EditFilterListValueOutcomeModal extends EditOutcomeModal {
  private readonly ruleControl: Locator;
  private readonly inputContainer: Locator;
  private readonly fieldSelector: Locator;
  private readonly valuesDualPaneSelector: DualPaneSelector;
  private readonly addButton: Locator;

  constructor(page: Page) {
    super(page);
    this.ruleControl = this.modal.locator('.label:has-text("Field") + .data');
    this.inputContainer = this.ruleControl.locator('.input-container');
    this.fieldSelector = this.inputContainer.locator('.field-list').getByRole('listbox');
    this.valuesDualPaneSelector = new DualPaneSelector(this.inputContainer.locator('.value-container .onx-selector'));
    this.addButton = this.inputContainer.getByRole('button', { name: 'Add' });
  }

  private async addRule(rule: FilterListValueRule) {
    const page = this.modal.page();

    await this.fieldSelector.click();
    await page.getByRole('option', { name: rule.fieldName }).click();

    await this.valuesDualPaneSelector.selectOptions(rule.valuesToInclude);

    await this.addButton.click();
  }

  async fillOutForm(outcome: FilterListValueOutcome) {
    await super.fillOutForm(outcome);

    for (const rule of outcome.filterListValueRules) {
      await this.addRule(rule);
    }
  }
}
