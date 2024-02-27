import { Locator } from '@playwright/test';
import { Rule, TextRuleWithValue } from '../../models/rule';
import { AdvancedRuleLogic, FilterRuleLogic, RuleLogic, SimpleRuleLogic } from '../../models/ruleLogic';
import { TreeviewSelector } from './treeviewSelector';

export class RuleControl {
  protected readonly control: Locator;
  protected readonly ruleInputContainer: Locator;
  protected readonly fieldSelector: TreeviewSelector;
  protected readonly ruleOperatorSelect: Locator;
  protected readonly betweenOperatorContainer: Locator;
  protected readonly addRuleButton: Locator;
  protected readonly simpleModeRadioButton: Locator;
  protected readonly advancedModeRadioButton: Locator;
  protected readonly useFilterLogicCheckbox: Locator;
  protected readonly filterLogicInput: Locator;

  constructor(control: Locator) {
    this.control = control;
    this.ruleInputContainer = this.control.locator('.input-container');
    this.fieldSelector = new TreeviewSelector(this.ruleInputContainer.locator('.field .onx-selector'));
    this.ruleOperatorSelect = this.control.locator('.rule-operator[role="listbox"]');
    this.betweenOperatorContainer = this.control.locator('.between-container');
    this.addRuleButton = this.control.getByRole('button', { name: 'Add' });
    this.simpleModeRadioButton = this.control.getByRole('radio', { name: 'Simple Mode' });
    this.advancedModeRadioButton = this.control.getByRole('radio', { name: 'Advanced Mode' });
    this.useFilterLogicCheckbox = this.control.getByRole('checkbox', { name: 'Use Filter Logic' });
    this.filterLogicInput = this.control.locator('.filter-logic-container input');
  }

  private async selectConjunctionOperator(operator: 'AND' | 'OR') {
    const operatorSelect = this.control.locator('.conjunction-container').getByRole('listbox');
    await operatorSelect.click();
    await operatorSelect.page().getByRole('option', { name: operator }).click();
  }

  private async selectRuleOperator(operator: string) {
    await this.ruleOperatorSelect.click();
    await this.ruleOperatorSelect.page().getByRole('option', { name: operator }).click();
  }

  private async addRule(rule: Rule) {
    switch (true) {
      case rule instanceof TextRuleWithValue: {
        await this.fieldSelector.selectOption(rule.fieldName);
        await this.selectRuleOperator(rule.operator);
        await this.betweenOperatorContainer.locator('input:visible').fill(rule.value);
        break;
      }
      default: {
        throw new Error('Rule type not supported');
      }
    }

    await this.addRuleButton.click();
  }

  async addLogic(logic: RuleLogic) {
    switch (true) {
      case logic instanceof SimpleRuleLogic: {
        await this.simpleModeRadioButton.click();
        break;
      }
      case logic instanceof AdvancedRuleLogic: {
        await this.advancedModeRadioButton.click();
        await this.selectConjunctionOperator(logic.operator);
        break;
      }
      case logic instanceof FilterRuleLogic: {
        await this.advancedModeRadioButton.click();
        await this.useFilterLogicCheckbox.check();
        await this.filterLogicInput.fill(logic.filterLogic);
        break;
      }
      default: {
        throw new Error('Logic type not supported');
      }
    }

    for (const rule of logic.rules) {
      await this.addRule(rule);
    }
  }
}

export class RuleControlWithAddNew extends RuleControl {
  readonly addRecordIsNewRuleCheckbox: Locator;

  constructor(control: Locator) {
    super(control);
    this.addRecordIsNewRuleCheckbox = this.control.getByLabel('Add "When Record is New" option to rule set.');
  }

  async addLogic(logic: RuleLogic) {
    await super.addLogic(logic);

    if (logic.addRecordIsNew) {
      await this.addRecordIsNewRuleCheckbox.check();
    }
  }
}
