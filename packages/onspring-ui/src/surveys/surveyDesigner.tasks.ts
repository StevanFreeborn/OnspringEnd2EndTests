import { Response } from '@playwright/test';
import { FormattedText, Question as SurveyQuestionModel, SurveyPage } from '@stevanfreeborn/onspring-models';
import { Task } from '@stevanfreeborn/screenplay';
import { Target, WebActor } from '@stevanfreeborn/screenplay-playwright';
import { CreateDialogTargets, DeleteDialogTargets } from '../common/dialogs/dialogs.targets.js';
import {
  AddOrEditSurveyPageModalTargets,
  SurveyDesignerTargets,
  SurveyFormattedTextFormTargets,
  SurveyQuestionFormTargets,
} from './surveyDesigner.targets.js';

export type DeleteQuestionRequest = {
  surveyItemId: string;
  pageName?: string;
  questionText?: string;
};

async function saveInlineSurveyItemEdit(actor: WebActor): Promise<void> {
  await actor.browse().click(SurveyDesignerTargets.editingDragBar);
  await actor.browse().waitForState(SurveyDesignerTargets.editingSurveyItem, 'hidden');
  await actor.browse().waitForState(SurveyDesignerTargets.saveIndicator, 'hidden');
}

async function fillBaseQuestionForm(actor: WebActor, question: SurveyQuestionModel): Promise<void> {
  await actor.browse().waitForState(SurveyQuestionFormTargets.helpTextEditor, 'visible');
  await actor.browse().fill(SurveyQuestionFormTargets.questionTextEditor, question.questionText);
  await actor.browse().fill(SurveyQuestionFormTargets.questionIdInput, question.questionId);
  await actor.browse().fill(SurveyQuestionFormTargets.helpTextEditor, question.helpText);

  if (question.required) {
    await actor.browse().checkControl(SurveyQuestionFormTargets.requiredCheckbox);
  }

  if (question.correctness) {
    await actor.browse().checkControl(SurveyQuestionFormTargets.correctnessCheckbox);
  }

  if (question.relateToContent) {
    await actor.browse().checkControl(SurveyQuestionFormTargets.relateToContentCheckbox);
  }
}

async function clearBaseQuestionForm(actor: WebActor): Promise<void> {
  await actor.browse().clear(SurveyQuestionFormTargets.questionIdInput);
  await actor.browse().clear(SurveyQuestionFormTargets.questionTextEditor);
  await actor.browse().clear(SurveyQuestionFormTargets.helpTextEditor);
  await actor.browse().uncheckControl(SurveyQuestionFormTargets.requiredCheckbox);
  await actor.browse().uncheckControl(SurveyQuestionFormTargets.correctnessCheckbox);
  await actor.browse().uncheckControl(SurveyQuestionFormTargets.relateToContentCheckbox);
}

async function fillQuestionFormByType(actor: WebActor, question: SurveyQuestionModel): Promise<void> {
  switch (question.type) {
    case 'Text':
      await fillBaseQuestionForm(actor, question);
      break;
    default:
      throw new Error(`Question type ${question.type} is not implemented yet.`);
  }
}

async function fillAndSaveSurveyPageModal(
  actor: WebActor,
  pageData: SurveyPage,
  options?: { clear?: boolean }
): Promise<void> {
  if (options?.clear) {
    await actor.browse().clear(AddOrEditSurveyPageModalTargets.nameInput);
    await actor.browse().clear(AddOrEditSurveyPageModalTargets.descriptionEditor);
  }

  await actor.browse().fill(AddOrEditSurveyPageModalTargets.nameInput, pageData.name);
  await actor.browse().fill(AddOrEditSurveyPageModalTargets.descriptionEditor, pageData.description);
  await actor.browse().click(AddOrEditSurveyPageModalTargets.saveButton);
  await actor.browse().waitForState(AddOrEditSurveyPageModalTargets.modal, 'hidden');
}

type MoveDesignerItemOptions = {
  itemToMove: Target;
  itemToMoveAbove: Target;
  dragSource: Target;
  dragDestination: Target;
  saveSortPathRegex: RegExp;
  missingMoveMessage: string;
  missingAboveMessage: string;
};

async function moveDesignerItemAbove(actor: WebActor, options: MoveDesignerItemOptions): Promise<void> {
  await actor.browse().waitForState(options.itemToMove, 'visible');
  await actor.browse().waitForState(options.itemToMoveAbove, 'visible');

  const movePos = await actor.browse().boundingBox(options.itemToMove);
  const abovePos = await actor.browse().boundingBox(options.itemToMoveAbove);

  if (movePos === null) {
    throw new Error(options.missingMoveMessage);
  }

  if (abovePos === null) {
    throw new Error(options.missingAboveMessage);
  }

  if (movePos.y < abovePos.y) {
    return;
  }

  const saveSortPromise = actor
    .browse()
    .waitForResponse((res: Response) => options.saveSortPathRegex.test(res.url()) && res.request().method() === 'POST');

  await actor.browse().dragTo(options.dragSource, options.dragDestination);

  await Promise.allSettled([
    actor.browse().waitForState(SurveyDesignerTargets.saveIndicator, 'hidden'),
    saveSortPromise,
  ]);
}

export const SurveyDesignerTasks = {
  addQuestion:
    (question: SurveyQuestionModel): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      switch (question.type) {
        case 'Text':
          await actor.browse().click(SurveyDesignerTargets.textButton);
          break;
        default:
          throw new Error(`Question type ${question.type} is not implemented yet.`);
      }

      await actor.browse().waitForFocused(SurveyQuestionFormTargets.questionTextFocusTarget, { timeout: 30_000 });
      await fillQuestionFormByType(actor, question);
      await saveInlineSurveyItemEdit(actor);
    },

  updateQuestion:
    (surveyItemId: string, question: SurveyQuestionModel): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(SurveyDesignerTargets.surveyItemDisplay(surveyItemId));
      await actor.browse().waitForFocused(SurveyQuestionFormTargets.questionTextFocusTarget, { timeout: 30_000 });
      await clearBaseQuestionForm(actor);
      await fillQuestionFormByType(actor, question);
      await saveInlineSurveyItemEdit(actor);
    },

  updateFormattedText:
    (surveyItemId: string, formattedText: FormattedText): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(SurveyDesignerTargets.surveyItemDisplay(surveyItemId));
      await actor.browse().waitForFocused(SurveyFormattedTextFormTargets.formattedTextEditor, { timeout: 5_000 });
      await actor.browse().waitForState(SurveyFormattedTextFormTargets.objectIdInput, 'visible');
      await actor.browse().clear(SurveyFormattedTextFormTargets.objectIdInput);
      await actor.browse().clear(SurveyFormattedTextFormTargets.formattedTextEditor);
      await actor.browse().fill(SurveyFormattedTextFormTargets.formattedTextEditor, formattedText.formattedText);
      await actor.browse().fill(SurveyFormattedTextFormTargets.objectIdInput, formattedText.objectId);
      await saveInlineSurveyItemEdit(actor);
    },

  addPage:
    (newPage: SurveyPage): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(SurveyDesignerTargets.addPageButton);
      await actor.browse().click(CreateDialogTargets.okButton);
      await fillAndSaveSurveyPageModal(actor, newPage);
    },

  updatePage:
    (pageName: string, updatedPage: SurveyPage): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(SurveyDesignerTargets.pageMenuButton(pageName));
      await actor.browse().waitForState(SurveyDesignerTargets.pageMenuEditPropertiesButton, 'visible');
      await actor.browse().click(SurveyDesignerTargets.pageMenuEditPropertiesButton);
      await fillAndSaveSurveyPageModal(actor, updatedPage, { clear: true });
    },

  deletePage:
    (pageName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(SurveyDesignerTargets.pageMenuButton(pageName));
      await actor.browse().waitForState(SurveyDesignerTargets.pageMenuDeleteButton, 'visible');
      await actor.browse().click(SurveyDesignerTargets.pageMenuDeleteButton);
      await actor.browse().waitForState(DeleteDialogTargets.deleteButton, 'visible');
      await actor.browse().click(DeleteDialogTargets.deleteButton);
      await actor.browse().waitForState(SurveyDesignerTargets.saveIndicator, 'hidden');
    },

  goToPage:
    (pageName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(SurveyDesignerTargets.pageItem(pageName));
    },

  movePageAbove:
    (pageToMove: string, pageToMoveAbove: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await moveDesignerItemAbove(actor, {
        itemToMove: SurveyDesignerTargets.pageItem(pageToMove),
        itemToMoveAbove: SurveyDesignerTargets.pageItem(pageToMoveAbove),
        dragSource: SurveyDesignerTargets.pageDragHandle(pageToMove),
        dragDestination: SurveyDesignerTargets.pageItem(pageToMoveAbove),
        saveSortPathRegex: SurveyDesignerTargets.savePageSortPathRegex,
        missingMoveMessage: `Could not find page with name "${pageToMove}".`,
        missingAboveMessage: `Could not find page with name "${pageToMoveAbove}".`,
      });
    },

  moveQuestionAbove:
    (surveyItemIdToMove: string, surveyItemIdToMoveAbove: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await moveDesignerItemAbove(actor, {
        itemToMove: SurveyDesignerTargets.surveyItemById(surveyItemIdToMove),
        itemToMoveAbove: SurveyDesignerTargets.surveyItemById(surveyItemIdToMoveAbove),
        dragSource: SurveyDesignerTargets.surveyItemDragBar(surveyItemIdToMove),
        dragDestination: SurveyDesignerTargets.surveyItemDisplay(surveyItemIdToMoveAbove),
        saveSortPathRegex: SurveyDesignerTargets.saveItemSortPathRegex,
        missingMoveMessage: `Could not find survey item with id "${surveyItemIdToMove}".`,
        missingAboveMessage: `Could not find survey item with id "${surveyItemIdToMoveAbove}".`,
      });
    },

  moveQuestionToPage:
    (surveyItemId: string, pageName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(SurveyDesignerTargets.surveyItemById(surveyItemId));
      await actor.browse().click(SurveyDesignerTargets.surveyItemMoveButton(surveyItemId));

      const moveToPageResponse = actor.browse().waitForResponse(SurveyDesignerTargets.movePageItemPathRegex);
      await actor.browse().click(SurveyDesignerTargets.moveToPageMenuOption(pageName));
      await moveToPageResponse;
      await actor.browse().waitForState(SurveyDesignerTargets.saveIndicator, 'hidden');
    },

  deleteQuestion:
    (req: DeleteQuestionRequest): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      if (req.pageName) {
        await actor.attemptsTo(SurveyDesignerTasks.goToPage(req.pageName));
      }

      const surveyItem = SurveyDesignerTargets.surveyItemByIdAndText(req.surveyItemId, req.questionText ?? /.*/);
      await actor.browse().hover(surveyItem);
      await actor.browse().click(SurveyDesignerTargets.surveyItemDeleteButton(req.surveyItemId, req.questionText));
      await actor.browse().waitForState(DeleteDialogTargets.deleteButton, 'visible');
      await actor.browse().click(DeleteDialogTargets.deleteButton);
      await actor.browse().waitForState(SurveyDesignerTargets.saveIndicator, 'hidden');
      await actor.browse().waitForTimeout(1000);
    },
};
