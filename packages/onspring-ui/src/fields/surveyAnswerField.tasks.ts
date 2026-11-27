import { Response } from '@playwright/test';
import { SurveyAnswerField } from '@stevanfreeborn/onspring-models';
import { Task } from '@stevanfreeborn/screenplay';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { AppLayoutTabTargets } from '../apps/apps.targets.js';
import { SurveyDetailTargets } from '../surveys/surveys.targets.js';
import { FieldTargets } from './fields.targets.js';
import { SurveyAnswerFieldTargets } from './surveyAnswerField.targets.js';

async function ensureDesignerFieldsTabSelected(actor: WebActor): Promise<void> {
  const designer = AppLayoutTabTargets.designer;

  if (await actor.browse().isVisible(designer.addObjectButton)) {
    await actor.browse().click(designer.fieldsTabButton);
  }

  await actor.browse().waitForState(designer.addFieldButton, 'visible');
}

async function openDefaultLayoutDesigner(actor: WebActor): Promise<void> {
  if (!(await actor.browse().isVisible(AppLayoutTabTargets.layoutsGrid))) {
    await actor.browse().click(SurveyDetailTargets.layoutsTabButton);
    await actor.browse().waitForState(AppLayoutTabTargets.layoutsGrid, 'visible');
  }

  const layoutDesignResponse = actor
    .browse()
    .waitForResponse((r: Response) => AppLayoutTabTargets.getLayoutDesignPathRegex.test(r.url()) && r.status() === 200);
  await actor.browse().click(AppLayoutTabTargets.layoutRowByName('Default Layout'));
  await layoutDesignResponse;

  await ensureDesignerFieldsTabSelected(actor);
}

async function openEditModal(actor: WebActor, fieldName: string): Promise<void> {
  await actor.browse().hover(FieldTargets.rowByName(fieldName));
  await actor.browse().click(FieldTargets.editButtonInRow(fieldName));
  await actor.browse().waitForState(FieldTargets.modal.nameInput(0), 'visible');
}

async function openAddFieldMenu(actor: WebActor, fieldType: string): Promise<void> {
  const designer = AppLayoutTabTargets.designer;
  const option = designer.addFieldMenuOption(fieldType);

  if (await actor.browse().isVisible(option)) {
    return;
  }

  await actor.browse().click(designer.addFieldButton);

  // The first click can be swallowed while the designer iframe binds its popover
  // handlers. Synchronize on the option being visible and retry the trigger once.
  if (!(await actor.browse().isVisibleWithin(option, 2_000))) {
    await actor.browse().click(designer.addFieldButton);
    await actor.browse().waitForState(option, 'visible');
  }
}

export const SurveyAnswerFieldTasks = {
  addFromSurveyLayout:
    ({
      field,
      questionText = field.questionText,
    }: {
      field: SurveyAnswerField;
      questionText?: string;
    }): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await openDefaultLayoutDesigner(actor);

      const designer = AppLayoutTabTargets.designer;
      await openAddFieldMenu(actor, 'Survey Answer');
      await actor.browse().click(designer.addFieldMenuOption('Survey Answer'));

      await actor.browse().waitForState(SurveyAnswerFieldTargets.dialog, 'visible');
      await actor.browse().setChecked(SurveyAnswerFieldTargets.questionRadioByText(questionText), true);
      await actor.browse().click(SurveyAnswerFieldTargets.continueButton);

      const nameInput = FieldTargets.modal.nameInput(1);
      await actor.browse().waitForState(nameInput, 'visible');
      await actor.browse().fill(nameInput, field.name);

      if (field.description) {
        await actor.browse().fill(SurveyAnswerFieldTargets.modal.descriptionEditor(), field.description);
        await actor.browse().click(nameInput);
      }

      const saveFieldResponse = actor
        .browse()
        .waitForResponse((r: Response) => FieldTargets.addOrEditFieldPathRegex.test(r.url()) && r.status() === 200);
      await actor.browse().click(FieldTargets.modal.saveButton);
      await saveFieldResponse;

      await actor.browse().waitForState(designer.fieldFromBank(field.name), 'visible');
    },

  openFromGrid:
    (fieldName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await openEditModal(actor, fieldName);
    },

  updateFromGrid:
    ({ currentName, updatedField }: { currentName: string; updatedField: SurveyAnswerField }): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await openEditModal(actor, currentName);

      const nameInput = FieldTargets.modal.nameInput(0);
      await actor.browse().fill(nameInput, updatedField.name);
      await actor.browse().fill(SurveyAnswerFieldTargets.modal.descriptionEditor(0), updatedField.description);
      await actor.browse().click(nameInput);

      const saveFieldResponse = actor
        .browse()
        .waitForResponse((r: Response) => FieldTargets.addOrEditFieldPathRegex.test(r.url()) && r.status() === 200);
      await actor.browse().click(FieldTargets.modal.saveButton);
      await saveFieldResponse;

      await actor.browse().waitForState(FieldTargets.rowByName(updatedField.name), 'visible');
    },
};
