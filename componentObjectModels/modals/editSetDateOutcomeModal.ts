import { Locator, Page } from '@playwright/test';
import { SetDateOutcome, SetDateToCurrentDateRule } from '../../models/setDateOutcome';
import { SetDateRule } from './../../models/setDateOutcome';
import { EditOutcomeModal } from './editOutcomeModal';

export class EditSetDateOutcomeModal extends EditOutcomeModal {
  private readonly ruleControl: Locator;
  private readonly inputContainer: Locator;
  private readonly fieldSelector: Locator;
  private readonly typeSelector: Locator;
  private readonly addRuleButton: Locator;

  constructor(page: Page) {
    super(page);
    this.ruleControl = this.modal.locator('.label:has-text("Field") + .data');
    this.inputContainer = this.ruleControl.locator('.input-container');
    this.fieldSelector = this.inputContainer.locator('.field-list').getByRole('listbox');
    this.typeSelector = this.inputContainer.locator('.outcome-type-container').getByRole('listbox');
    this.addRuleButton = this.inputContainer.getByRole('button', { name: 'Add' });
  }

  private async addRule(rule: SetDateRule) {
    const page = this.modal.page();

    await this.fieldSelector.click();
    await page.getByRole('option', { name: rule.fieldName }).click();

    if (rule instanceof SetDateToCurrentDateRule) {
      await this.typeSelector.click();
      await page.getByRole('option', { name: 'Current Date' }).click();
      await this.addRuleButton.click();
      return;
    }

    throw new Error(`Unsupported rule type: ${rule.constructor.name}`);
  }

  async fillOutForm(outcome: SetDateOutcome) {
    await super.fillOutForm(outcome);

    for (const rule of outcome.setDateRules) {
      await this.addRule(rule);
    }
  }
}
