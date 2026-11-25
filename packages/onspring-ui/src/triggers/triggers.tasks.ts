import { OutcomeType, Trigger } from '@stevanfreeborn/onspring-models';
import { Task } from '@stevanfreeborn/screenplay';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { RuleControlTasks } from '../common/controls/ruleControl.js';
import { StatusSwitchTasks } from '../common/controls/statusSwitch.js';
import { CreateDialogTargets, DeleteDialogTargets } from '../common/dialogs/dialogs.targets.js';
import { OutcomeTasks } from './outcomes.tasks.js';
import { AppTriggersTabTargets, TriggerModalTargets, triggerModalFrameOwner } from './triggers.targets.js';

export const TriggerTasks = {
  setModalStatus:
    (enabled: boolean): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      if (await actor.browse().isVisible(TriggerModalTargets.generalTab.statusButtons)) {
        await actor.browse().click(TriggerModalTargets.generalTab.statusButton(enabled ? 'Enabled' : 'Disabled'));
        return;
      }

      await actor.attemptsTo(
        StatusSwitchTasks.setAriaSwitch({
          switchTarget: TriggerModalTargets.generalTab.statusSwitch,
          toggleTarget: TriggerModalTargets.generalTab.statusToggle,
          enabled,
        })
      );
    },

  saveModal:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(TriggerModalTargets.saveButton);
      await actor.browse().waitForState(TriggerModalTargets.modal, 'hidden');
    },

  openTrigger:
    (triggerName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(AppTriggersTabTargets.triggerRowByName(triggerName));
      await actor.browse().waitForState(TriggerModalTargets.generalTab.nameInput, 'visible');
    },

  addTrigger:
    (trigger: Trigger): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(AppTriggersTabTargets.addTriggerLink);
      await actor.browse().fill(CreateDialogTargets.nameInput, trigger.name);
      await actor.browse().click(CreateDialogTargets.saveButton);

      await actor.browse().waitForState(TriggerModalTargets.generalTab.nameInput, 'visible');
      await actor.browse().click(TriggerModalTargets.generalSettingsTabButton);
      await actor.browse().fill(TriggerModalTargets.generalTab.nameInput, trigger.name);
      await actor.browse().fill(TriggerModalTargets.generalTab.descriptionEditor, trigger.description);
      await actor.attemptsTo(TriggerTasks.setModalStatus(trigger.status));

      await actor.browse().click(TriggerModalTargets.rulesTabButton);
      await actor.attemptsTo(
        RuleControlTasks.applyLogic({
          controlTarget: TriggerModalTargets.rulesTab.ruleSetControl,
          logic: trigger.ruleSet,
          frameOwner: triggerModalFrameOwner,
          supportRecordIsNew: true,
        })
      );

      if (trigger.outcomes.length > 0) {
        for (const outcome of trigger.outcomes) {
          await actor.browse().click(TriggerModalTargets.outcomesTabButton);
          await actor.browse().click(TriggerModalTargets.outcomesTab.outcomeRowByType(outcome.type));
          await actor.attemptsTo(OutcomeTasks.configureOutcome(outcome));
        }
      }

      await actor.attemptsTo(TriggerTasks.saveModal());
    },

  deleteTrigger:
    (triggerName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(AppTriggersTabTargets.triggerRowByName(triggerName));
      await actor.browse().click(AppTriggersTabTargets.deleteTriggerButtonInRow(triggerName));
      await actor.browse().click(DeleteDialogTargets.deleteButton);
      await actor.browse().waitForDetached(DeleteDialogTargets.dialog, DeleteDialogTargets.overlay);
    },

  filterTriggersByOutcome:
    (outcome: OutcomeType): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(AppTriggersTabTargets.filterByOutcomeSelector);

      if (outcome === 'All Types') {
        await actor.browse().click(AppTriggersTabTargets.allOutcomeTypesOption);
        return;
      }

      await actor.browse().click(AppTriggersTabTargets.outcomeFilterOption(outcome));
    },
};
