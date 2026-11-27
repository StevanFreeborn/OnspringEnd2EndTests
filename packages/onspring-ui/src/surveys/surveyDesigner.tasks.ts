import { Response } from '@playwright/test';
import {
  BaseListValue,
  FormattedText,
  LikertQuestion,
  ListValue,
  MatrixQuestion,
  MultiSelectQuestion,
  Question as SurveyQuestionModel,
  QuestionType,
  ReferenceQuestion,
  SingleSelectQuestion,
  SurveyPage,
} from '@stevanfreeborn/onspring-models';
import { Task } from '@stevanfreeborn/screenplay';
import { Target, WebActor } from '@stevanfreeborn/screenplay-playwright';
import { TabbedColorPickerTasks } from '../common/controls/tabbedColorPicker.js';
import { CreateDialogTargets, DeleteDialogTargets } from '../common/dialogs/dialogs.targets.js';
import {
  AddOrEditSurveyPageModalTargets,
  ImportQuestionModalTargets,
  ListValuesGridPosition,
  SurveyDesignerTargets,
  SurveyFormattedTextFormTargets,
  SurveyListValuesGridTargets,
  SurveyQuestionFormTargets,
  SurveyReferenceQuestionFormTargets,
  surveyDesignerFrameOwner,
} from './surveyDesigner.targets.js';

export type DeleteQuestionRequest = {
  surveyItemId: string;
  pageName?: string;
  questionText?: string;
};

const questionTypeButtonTargets: Record<QuestionType, Target> = {
  Attachment: SurveyDesignerTargets.attachmentButton,
  'Date/Time': SurveyDesignerTargets.dateButton,
  Number: SurveyDesignerTargets.numberButton,
  Text: SurveyDesignerTargets.textButton,
  'Single Select': SurveyDesignerTargets.singleSelectButton,
  'Multi Select': SurveyDesignerTargets.multiSelectButton,
  'Likert Scale': SurveyDesignerTargets.likertScaleButton,
  Matrix: SurveyDesignerTargets.matrixButton,
  Reference: SurveyDesignerTargets.referenceButton,
};

async function clearGridRows(
  actor: WebActor,
  rowsTarget: Target,
  lastRowTarget: Target,
  deleteButtonTarget: Target
): Promise<void> {
  let rowCount = await actor.browse().count(rowsTarget);

  while (rowCount > 0) {
    await actor.browse().hover(lastRowTarget);
    await actor.browse().click(deleteButtonTarget);
    await actor
      .browse()
      .check(rowsTarget)
      .hasCount(rowCount - 1);
    rowCount -= 1;
  }
}

async function addListValues(
  actor: WebActor,
  position: ListValuesGridPosition,
  values: (BaseListValue | ListValue)[]
): Promise<void> {
  for (const value of values) {
    await actor.browse().click(SurveyListValuesGridTargets.addValueButton(position));
    await actor.browse().fill(SurveyListValuesGridTargets.lastRowValueInput(position), value.value);
    await actor
      .browse()
      .fill(SurveyListValuesGridTargets.lastRowNumericValueInput(position), value.numericValue.toString());

    if ('color' in value && value.color) {
      await actor.attemptsTo(
        TabbedColorPickerTasks.selectColor(
          SurveyListValuesGridTargets.lastRowColorPicker(position),
          value.color,
          surveyDesignerFrameOwner
        )
      );
    }
  }
}

async function clearListValuesGrid(actor: WebActor, position: ListValuesGridPosition): Promise<void> {
  await clearGridRows(
    actor,
    SurveyListValuesGridTargets.rows(position),
    SurveyListValuesGridTargets.lastRow(position),
    SurveyListValuesGridTargets.lastRowDeleteButton(position)
  );
}

async function fillReferenceQuestionFields(actor: WebActor, question: ReferenceQuestion): Promise<void> {
  if (await actor.browse().isVisible(SurveyReferenceQuestionFormTargets.appReferenceSelect)) {
    await actor.browse().click(SurveyReferenceQuestionFormTargets.appReferenceSelect);
    await actor.browse().click(SurveyReferenceQuestionFormTargets.appReferenceOption(question.appReference));
  }

  if (question.answerValues !== 'ALL') {
    throw new Error(`Adding specific reference answer values is not implemented: ${question.answerValues.join(', ')}`);
  }

  const modal = SurveyReferenceQuestionFormTargets.addAllValuesModal;
  await actor.browse().click(SurveyReferenceQuestionFormTargets.addAllValuesButton);
  await actor.browse().waitForState(modal.dialog, 'visible');

  if (await actor.browse().isVisible(modal.okButton)) {
    const addAllValuesResponse = actor
      .browse()
      .waitForResponse(SurveyReferenceQuestionFormTargets.getSurveyAnswerValuesPathRegex);
    await actor.browse().click(modal.okButton);
    await addAllValuesResponse;
  } else {
    await actor.browse().click(modal.closeButton);
  }

  await actor.browse().waitForState(modal.dialog, 'hidden');
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
  await fillBaseQuestionForm(actor, question);

  switch (question.type) {
    case 'Text':
    case 'Number':
    case 'Date/Time':
    case 'Attachment':
      break;
    case 'Single Select':
    case 'Multi Select':
    case 'Likert Scale':
      await addListValues(
        actor,
        'first',
        (question as SingleSelectQuestion | MultiSelectQuestion | LikertQuestion).answerValues
      );
      break;
    case 'Matrix': {
      const matrix = question as MatrixQuestion;
      await addListValues(actor, 'first', matrix.rowValues);
      await addListValues(actor, 'last', matrix.columnValues);
      break;
    }
    case 'Reference':
      await fillReferenceQuestionFields(actor, question as ReferenceQuestion);
      break;
    default:
      throw new Error(`Question type ${question.type} is not supported.`);
  }
}

async function clearQuestionFormByType(actor: WebActor, questionType: QuestionType): Promise<void> {
  await clearBaseQuestionForm(actor);

  switch (questionType) {
    case 'Text':
    case 'Number':
    case 'Date/Time':
    case 'Attachment':
      break;
    case 'Single Select':
    case 'Multi Select':
    case 'Likert Scale':
      await clearListValuesGrid(actor, 'first');
      break;
    case 'Matrix':
      await clearListValuesGrid(actor, 'first');
      await clearListValuesGrid(actor, 'last');
      break;
    case 'Reference':
      await clearGridRows(
        actor,
        SurveyReferenceQuestionFormTargets.rows,
        SurveyReferenceQuestionFormTargets.lastRow,
        SurveyReferenceQuestionFormTargets.lastRowDeleteButton
      );
      break;
    default:
      throw new Error(`Question type ${questionType} is not supported.`);
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
  close:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(SurveyDesignerTargets.doneButton);
      await actor.browse().waitForState(SurveyDesignerTargets.modal, 'hidden');
    },

  saveInlineEdit:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(SurveyDesignerTargets.editingDragBar);
      await actor.browse().waitForState(SurveyDesignerTargets.editingSurveyItem, 'hidden');
      await actor.browse().waitForState(SurveyDesignerTargets.saveIndicator, 'hidden');
    },

  addQuestion:
    (question: SurveyQuestionModel): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const buttonTarget = questionTypeButtonTargets[question.type];
      await actor.browse().click(buttonTarget);
      await actor.browse().waitForFocused(SurveyQuestionFormTargets.questionTextFocusTarget, { timeout: 30_000 });
      await fillQuestionFormByType(actor, question);
      await actor.attemptsTo(SurveyDesignerTasks.saveInlineEdit());
    },

  updateQuestion:
    (surveyItemId: string, question: SurveyQuestionModel): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(SurveyDesignerTargets.surveyItemDisplay(surveyItemId));
      await actor.browse().waitForFocused(SurveyQuestionFormTargets.questionTextFocusTarget, { timeout: 30_000 });
      await clearQuestionFormByType(actor, question.type);
      await fillQuestionFormByType(actor, question);
      await actor.attemptsTo(SurveyDesignerTasks.saveInlineEdit());
    },

  importQuestion:
    (sourceSurveyName: string, sourceQuestion: SurveyQuestionModel): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(SurveyDesignerTargets.importQuestionButton);
      await actor.browse().click(ImportQuestionModalTargets.surveySourceSelect);
      await actor.browse().click(ImportQuestionModalTargets.surveySourceOption(sourceSurveyName));

      const searchResponse = actor
        .browse()
        .waitForResponse(ImportQuestionModalTargets.searchPathRegex, { timeout: 10_000 })
        .catch(() => null);
      await actor
        .browse()
        .type(ImportQuestionModalTargets.filterInput, sourceQuestion.questionId, { delay: 125, clear: false });
      await searchResponse;

      const row = ImportQuestionModalTargets.searchResultRow(sourceQuestion.questionId);
      await actor.browse().isVisibleWithin(row, 5_000);

      while (
        !(await actor.browse().isVisible(row)) &&
        (await actor.browse().canScrollDown(ImportQuestionModalTargets.scrollableResults))
      ) {
        await actor.browse().scrollToBottom(ImportQuestionModalTargets.scrollableResults);
      }

      await actor.browse().click(ImportQuestionModalTargets.searchResultCheckbox(sourceQuestion.questionId));
      await actor.browse().click(ImportQuestionModalTargets.selectButton);
      await actor.browse().click(ImportQuestionModalTargets.importButton);

      await actor
        .browse()
        .waitForState(SurveyDesignerTargets.surveyItemDataByText(sourceQuestion.questionText), 'visible');
      await actor.browse().waitForState(SurveyDesignerTargets.saveIndicator, 'hidden');
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
      await actor.attemptsTo(SurveyDesignerTasks.saveInlineEdit());
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
