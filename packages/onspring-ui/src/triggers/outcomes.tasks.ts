import { ObjectVisibilityOutcome, Outcome } from '@stevanfreeborn/onspring-models';
import { Task } from '@stevanfreeborn/screenplay';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { StatusSwitchTasks } from '../common/controls/statusSwitch.js';
import { OutcomeModalTargets } from './outcomes.targets.js';

async function fillOutcomeGeneralTab(actor: WebActor, outcome: Outcome): Promise<void> {
  await actor.browse().click(OutcomeModalTargets.generalTabButton);
  await actor.browse().fill(OutcomeModalTargets.generalTab.descriptionEditor, outcome.description);
  await actor.attemptsTo(
    StatusSwitchTasks.setAriaSwitch({
      switchTarget: OutcomeModalTargets.generalTab.statusSwitch,
      toggleTarget: OutcomeModalTargets.generalTab.statusToggle,
      enabled: outcome.status,
    })
  );
}

async function fillObjectVisibilityOutcome(actor: WebActor, outcome: ObjectVisibilityOutcome): Promise<void> {
  const { objectVisibility } = OutcomeModalTargets;

  await fillOutcomeGeneralTab(actor, outcome);
  await actor.browse().click(objectVisibility.displayTabButton);
  await actor.browse().click(objectVisibility.layoutSelect);
  await actor.browse().click(objectVisibility.layoutOption(outcome.layoutName));

  for (const section of outcome.sections) {
    const tabTarget = objectVisibility.layoutTab(section.tabName);
    const tabClasses = await actor.browse().getAttribute(tabTarget, 'class');

    if (tabClasses === null) {
      throw new Error(`Could not find classes for tab: ${section.tabName}`);
    }

    if (tabClasses.includes('collapsed')) {
      await actor.browse().click(tabTarget);
    }

    await actor.browse().click(objectVisibility.sectionVisibilityButton(section.tabName, section.name));
    await actor
      .browse()
      .waitForState(objectVisibility.sectionDisplayModeMenu(section.tabName, section.name), 'visible');
    await actor
      .browse()
      .click(objectVisibility.sectionDisplayModeOption(section.tabName, section.name, section.visibility));
  }
}

export const OutcomeTasks = {
  configureOutcome:
    (outcome: Outcome): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().waitForState(OutcomeModalTargets.modal, 'visible');

      if (outcome instanceof ObjectVisibilityOutcome) {
        await fillObjectVisibilityOutcome(actor, outcome);
      } else {
        throw new Error(`Unsupported outcome type: ${outcome.type}`);
      }

      await actor.browse().click(OutcomeModalTargets.okButton);
      await actor.browse().waitForState(OutcomeModalTargets.modal, 'hidden');
    },
};
