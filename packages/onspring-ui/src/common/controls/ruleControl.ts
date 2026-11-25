import { FrameLocator, Page } from '@playwright/test';
import {
  AdvancedRuleLogic,
  AutoNumberRuleWithValue,
  DateRule,
  FilterRuleLogic,
  ListRuleWithValues,
  Rule,
  RuleLogic,
  SimpleRuleLogic,
  TextRule,
  TextRuleWithValue,
} from '@stevanfreeborn/onspring-models';
import { Task } from '@stevanfreeborn/screenplay';
import { resolveTarget, Target, WebActor } from '@stevanfreeborn/screenplay-playwright';
import { DualPaneSelector } from './dualPaneSelector.js';
import { FrameOwner, resolveFrameOwner } from './frameOwner.js';
import { TreeviewSelectorTasks } from './treeviewSelector.js';

export type ApplyRuleLogicOptions = {
  controlTarget: Target;
  logic: RuleLogic;
  frameOwner?: FrameOwner;
  supportRecordIsNew?: boolean;
};

export const RuleControlTargets = {
  fieldSelector:
    (controlTarget: Target): Target =>
    (page: Page) =>
      resolveTarget(page, controlTarget).locator('.input-container .field .onx-selector'),
  ruleOperatorSelect:
    (controlTarget: Target): Target =>
    (page: Page) =>
      resolveTarget(page, controlTarget).locator('.rule-operator[role="listbox"]'),
  conjunctionOperatorSelect:
    (controlTarget: Target): Target =>
    (page: Page) =>
      resolveTarget(page, controlTarget).locator('.conjunction-container').getByRole('listbox'),
  optionByName:
    (name: string, frameOwner?: FrameOwner): Target =>
    (page: Page) =>
      resolveFrameOwner(page, frameOwner).getByRole('option', { name }),
  betweenVisibleInput:
    (controlTarget: Target): Target =>
    (page: Page) =>
      resolveTarget(page, controlTarget).locator('.between-container input:visible'),
  numberVisibleInput:
    (controlTarget: Target): Target =>
    (page: Page) =>
      resolveTarget(page, controlTarget).locator('.number-container input:visible'),
  listDualPaneSelector:
    (controlTarget: Target): Target =>
    (page: Page) =>
      resolveTarget(page, controlTarget).locator('.list.selector-container .onx-selector'),
  addRuleButton:
    (controlTarget: Target): Target =>
    (page: Page) =>
      resolveTarget(page, controlTarget).getByRole('button', { name: 'Add' }),
  rulesList:
    (controlTarget: Target): Target =>
    (page: Page) =>
      resolveTarget(page, controlTarget).locator('.rule-list'),
  deleteRuleButtons:
    (controlTarget: Target): Target =>
    (page: Page) =>
      resolveTarget(page, controlTarget).locator('.rule-list').getByTitle('Delete'),
  firstDeleteRuleButton:
    (controlTarget: Target): Target =>
    (page: Page) =>
      resolveTarget(page, controlTarget).locator('.rule-list').getByTitle('Delete').first(),
  simpleModeRadioButton:
    (controlTarget: Target): Target =>
    (page: Page) =>
      resolveTarget(page, controlTarget).getByRole('radio', { name: 'Simple Mode' }),
  advancedModeRadioButton:
    (controlTarget: Target): Target =>
    (page: Page) =>
      resolveTarget(page, controlTarget).getByRole('radio', { name: 'Advanced Mode' }),
  useFilterLogicCheckbox:
    (controlTarget: Target): Target =>
    (page: Page) =>
      resolveTarget(page, controlTarget).getByRole('checkbox', { name: 'Use Filter Logic' }),
  filterLogicInput:
    (controlTarget: Target): Target =>
    (page: Page) =>
      resolveTarget(page, controlTarget).locator('#Rules_FilterLogic'),
  addRecordIsNewRuleCheckbox:
    (controlTarget: Target): Target =>
    (page: Page) =>
      resolveTarget(page, controlTarget).getByLabel('Add "When Record is New" option to rule set.'),
};

async function selectRuleOperator(
  actor: WebActor,
  controlTarget: Target,
  operator: string,
  frameOwner?: FrameOwner
): Promise<void> {
  await actor.browse().click(RuleControlTargets.ruleOperatorSelect(controlTarget));
  await actor.browse().click(RuleControlTargets.optionByName(operator, frameOwner));
}

async function addRule(actor: WebActor, controlTarget: Target, rule: Rule, frameOwner?: FrameOwner): Promise<void> {
  if (
    !(
      rule instanceof TextRule ||
      rule instanceof TextRuleWithValue ||
      rule instanceof ListRuleWithValues ||
      rule instanceof AutoNumberRuleWithValue ||
      rule instanceof DateRule
    )
  ) {
    throw new Error('Unsupported Rule Type');
  }

  await actor.attemptsTo(
    TreeviewSelectorTasks.selectOption(RuleControlTargets.fieldSelector(controlTarget), rule.fieldName, frameOwner)
  );
  await selectRuleOperator(actor, controlTarget, rule.operator, frameOwner);

  if (rule instanceof TextRuleWithValue) {
    await actor.browse().fill(RuleControlTargets.betweenVisibleInput(controlTarget), rule.value);
  } else if (rule instanceof ListRuleWithValues) {
    await actor.attemptsTo(
      DualPaneSelector.selectOptions(RuleControlTargets.listDualPaneSelector(controlTarget), rule.values, frameOwner)
    );
  } else if (rule instanceof AutoNumberRuleWithValue) {
    await actor.browse().fill(RuleControlTargets.numberVisibleInput(controlTarget), rule.value.toString());
  }

  await actor.browse().click(RuleControlTargets.addRuleButton(controlTarget));
}

async function addRules(actor: WebActor, controlTarget: Target, rules: Rule[], frameOwner?: FrameOwner): Promise<void> {
  for (const rule of rules) {
    await addRule(actor, controlTarget, rule, frameOwner);
  }
}

export const RuleControlTasks = {
  clearRules:
    (controlTarget: Target): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const deleteButtons = RuleControlTargets.deleteRuleButtons(controlTarget);
      const firstDeleteButton = RuleControlTargets.firstDeleteRuleButton(controlTarget);

      while ((await actor.browse().count(deleteButtons)) > 0) {
        await actor.browse().click(firstDeleteButton);
      }
    },

  applyLogic:
    ({ controlTarget, logic, frameOwner, supportRecordIsNew = false }: ApplyRuleLogicOptions): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.attemptsTo(RuleControlTasks.clearRules(controlTarget));

      if (logic instanceof SimpleRuleLogic) {
        await actor.browse().click(RuleControlTargets.simpleModeRadioButton(controlTarget));
        await addRules(actor, controlTarget, logic.rules, frameOwner);
      } else if (logic instanceof AdvancedRuleLogic) {
        await actor.browse().click(RuleControlTargets.advancedModeRadioButton(controlTarget));
        await actor.browse().click(RuleControlTargets.conjunctionOperatorSelect(controlTarget));
        await actor.browse().click(RuleControlTargets.optionByName(logic.operator, frameOwner));
        await addRules(actor, controlTarget, logic.rules, frameOwner);
      } else if (logic instanceof FilterRuleLogic) {
        await actor.browse().click(RuleControlTargets.advancedModeRadioButton(controlTarget));
        await actor.browse().checkControl(RuleControlTargets.useFilterLogicCheckbox(controlTarget));
        await actor.browse().fill(RuleControlTargets.filterLogicInput(controlTarget), logic.filterLogic);
        await addRules(actor, controlTarget, logic.rules, frameOwner);
      } else {
        throw new Error('Invalid Rule Logic');
      }

      if (supportRecordIsNew && logic.addRecordIsNew) {
        await actor.browse().checkControl(RuleControlTargets.addRecordIsNewRuleCheckbox(controlTarget));
      }
    },
};

export type RuleControlFrame = FrameLocator;
