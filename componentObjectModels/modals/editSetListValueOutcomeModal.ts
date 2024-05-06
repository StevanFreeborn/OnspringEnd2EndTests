import { Locator, Page } from '@playwright/test';
import { SetListValueOutcome, SetListValueRule, SetSingleListValueRule } from '../../models/setListValueOutcome';
import { EditOutcomeModal } from './editOutcomeModal';

export class EditSetListValueOutcomeModal extends EditOutcomeModal {
  private readonly ruleControl: Locator;
  private readonly inputContainer: Locator;
  private readonly fieldSelector: Locator;
  private readonly singleValueSelector: Locator;
  private readonly addRuleButton: Locator;

  constructor(page: Page) {
    super(page);
    this.ruleControl = this.modal.locator('.label:has-text("Field / Value") + .data');
    this.inputContainer = this.ruleControl.locator('.input-container');
    this.fieldSelector = this.inputContainer.locator('.field-list').getByRole('listbox');
    this.singleValueSelector = this.inputContainer.locator('.value-container').getByRole('listbox');
    this.addRuleButton = this.inputContainer.getByRole('button', { name: 'Add' });
  }

  private async addRule(rule: SetListValueRule) {
    const page = this.modal.page();

    await this.fieldSelector.click();
    await page.getByRole('option', { name: rule.fieldName }).click();

    if (rule instanceof SetSingleListValueRule) {
      await this.singleValueSelector.click();
      await page.getByRole('option', { name: rule.value }).click();
      return;
    }

    throw new Error(`Unsupported rule type: ${rule.constructor.name}`);
  }

  async fillOutForm(outcome: SetListValueOutcome) {
    await super.fillOutForm(outcome);

    for (const rule of outcome.setListValueRules) {
      await this.addRule(rule);
    }
  }
}
