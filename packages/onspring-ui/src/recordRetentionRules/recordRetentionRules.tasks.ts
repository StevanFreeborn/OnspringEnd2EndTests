import { Response } from '@playwright/test';
import { RecordRetentionRule } from '@stevanfreeborn/onspring-models';
import { Task } from '@stevanfreeborn/screenplay';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { DualPaneSelector } from '../common/controls/dualPaneSelector.js';
import { RuleControlTasks } from '../common/controls/ruleControl.js';
import { StatusSwitchTasks } from '../common/controls/statusSwitch.js';
import { CreateDialogTargets, DeleteDialogTargets } from '../common/dialogs/dialogs.targets.js';
import {
  AppRecordRetentionTabTargets,
  recordRetentionModalFrameOwner,
  RecordRetentionRuleModalTargets,
} from './recordRetentionRules.targets.js';

async function fillAndSaveRuleModal(actor: WebActor, rule: RecordRetentionRule): Promise<void> {
  const { generalTab, rulesTab, messagingTab, saveConfirmation } = RecordRetentionRuleModalTargets;

  await actor.browse().waitForState(generalTab.nameInput, 'visible');

  await actor.browse().click(RecordRetentionRuleModalTargets.generalSettingsTabButton);
  await actor.browse().fill(generalTab.nameInput, rule.name);
  await actor.attemptsTo(
    StatusSwitchTasks.setAriaSwitch({
      switchTarget: generalTab.statusSwitch,
      toggleTarget: generalTab.statusToggle,
      enabled: rule.status,
    })
  );
  await actor.browse().fill(generalTab.descriptionEditor, rule.description);

  await actor.browse().click(RecordRetentionRuleModalTargets.rulesTabButton);
  await actor.browse().click(rulesTab.dataSelect);
  await actor.browse().click(RecordRetentionRuleModalTargets.frameOptionByName(rule.data));
  await actor.attemptsTo(
    RuleControlTasks.applyLogic({
      controlTarget: rulesTab.ruleSetControl,
      logic: rule.ruleSet,
      frameOwner: recordRetentionModalFrameOwner,
    })
  );

  await actor.browse().click(RecordRetentionRuleModalTargets.messagingTabButton);
  await actor.browse().setChecked(messagingTab.notifyCheckbox, rule.notify);
  await actor.attemptsTo(
    DualPaneSelector.selectOptions(messagingTab.recipientsSelector, rule.recipients, recordRetentionModalFrameOwner),
    DualPaneSelector.selectOptions(messagingTab.exportFieldsSelector, rule.exportFields, recordRetentionModalFrameOwner)
  );
  await actor.browse().click(messagingTab.messageCenterSettingsSelect);
  await actor.browse().click(RecordRetentionRuleModalTargets.frameOptionByName(rule.messageCenterSetting));

  const waitForEditPost = (): Promise<Response> =>
    actor
      .browse()
      .waitForResponse(
        (r: Response) => RecordRetentionRuleModalTargets.editPathRegex.test(r.url()) && r.request().method() === 'POST'
      );

  if (rule.status) {
    await actor.browse().click(RecordRetentionRuleModalTargets.saveButton);
    await actor.browse().waitForState(saveConfirmation.dialog, 'visible');
    const saveResponse = waitForEditPost();
    await actor.browse().type(saveConfirmation.okInput, 'OK', { delay: 150 });
    await actor.browse().click(saveConfirmation.okButton);
    await saveResponse;
  } else {
    const saveResponse = waitForEditPost();
    await actor.browse().click(RecordRetentionRuleModalTargets.saveButton);
    await saveResponse;
  }

  await actor.browse().waitForState(RecordRetentionRuleModalTargets.modal, 'hidden');
}

export const RecordRetentionRuleTasks = {
  addRule:
    (rule: RecordRetentionRule): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(AppRecordRetentionTabTargets.addRuleLink);
      await actor.browse().fill(CreateDialogTargets.nameInput, rule.name);
      await actor.browse().click(CreateDialogTargets.saveButton);
      await fillAndSaveRuleModal(actor, rule);
    },

  updateRule:
    (name: string, updatedRule: RecordRetentionRule): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(AppRecordRetentionTabTargets.ruleRowByName(name));
      await actor.browse().click(AppRecordRetentionTabTargets.editRuleButtonInRow(name));
      await fillAndSaveRuleModal(actor, updatedRule);
    },

  deleteRule:
    (name: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(AppRecordRetentionTabTargets.ruleRowByName(name));
      await actor.browse().click(AppRecordRetentionTabTargets.deleteRuleButtonInRow(name));
      await actor.browse().click(DeleteDialogTargets.deleteButton);
      await actor.browse().waitForDetached(DeleteDialogTargets.dialog, DeleteDialogTargets.overlay);
    },
};
