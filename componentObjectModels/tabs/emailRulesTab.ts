import { Page } from '@playwright/test';
import { RuleControlWithAddNew } from '../controls/ruleControl';

export class EmailRulesTab {
  sendLogic: RuleControlWithAddNew;

  constructor(page: Page) {
    this.sendLogic = new RuleControlWithAddNew(page.locator('.label:has-text("Send Logic") + .data .rule-config'));
  }
}
