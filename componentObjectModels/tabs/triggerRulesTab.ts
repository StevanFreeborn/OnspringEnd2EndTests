import { FrameLocator } from '@playwright/test';
import { RuleControlWithAddNew } from '../controls/ruleControl';

export class TriggerRulesTab {
  ruleSet: RuleControlWithAddNew;

  constructor(frame: FrameLocator) {
    this.ruleSet = new RuleControlWithAddNew(frame.locator('.label:has-text("Rule Set") + .data .rule-config'));
  }
}
