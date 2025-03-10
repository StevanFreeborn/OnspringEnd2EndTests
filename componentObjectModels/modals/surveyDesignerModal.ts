import { FrameLocator, Locator, Page } from '@playwright/test';
import { AttachmentQuestion } from '../../models/attachmentQuestion';
import { DateQuestion } from '../../models/dateQuestion';
import { FormattedText } from '../../models/formattedText';
import { LikertQuestion } from '../../models/likertQuestion';
import { MatrixQuestion } from '../../models/matrixQuestion';
import { MultiSelectQuestion } from '../../models/multiSelectQuestion';
import { NumberQuestion } from '../../models/numberQuestion';
import { Question, QuestionType } from '../../models/question';
import { ReferenceQuestion } from '../../models/referenceQuestion';
import { SingleSelectQuestion } from '../../models/singleSelectQuestion';
import { SurveyPage } from '../../models/surveyPage';
import { TextQuestion } from '../../models/textQuestion';
import { SurveyPreviewPage } from '../../pageObjectModels/surveys/surveyPreviewPage';
import { AddSurveyPageDialog } from '../dialogs/addSurveyPageDialog';
import { AutoSaveDialog } from '../dialogs/autoSaveDialog';
import { DeleteSurveyPageDialog } from '../dialogs/deleteSurveyPageDialog';
import { DeleteSurveyQuestionDialog } from '../dialogs/deleteSurveyQuestionDialog';
import { AddOrEditAttachmentQuestionForm } from '../forms/addOrEditAttachmentQuestionForm';
import { AddOrEditDateQuestionForm } from '../forms/addOrEditDateQuestionForm';
import { AddOrEditFormattedTextForm } from '../forms/addOrEditFormattedTextForm';
import { AddOrEditLikertQuestionForm } from '../forms/addOrEditLikertQuestionForm';
import { AddOrEditMatrixQuestionForm } from '../forms/addOrEditMatrixQuestionForm';
import { AddOrEditMultiSelectQuestionForm } from '../forms/addOrEditMultiSelectQuestionForm';
import { AddOrEditNumberQuestionForm } from '../forms/addOrEditNumberQuestionForm';
import { AddOrEditReferenceQuestionForm } from '../forms/addOrEditReferenceQuestionForm';
import { AddOrEditSingleSelectQuestionForm } from '../forms/addOrEditSingleSelectQuestionForm';
import { AddOrEditTextQuestionForm } from '../forms/addOrEditTextQuestionForm';
import { BaseAddOrEditQuestionForm } from '../forms/baseAddOrEditQuestionForm';
import { SurveyPageMenu } from '../menus/surveyPageMenu';
import { AddOrEditSurveyPageModal } from './addOrEditSurveyPageModal';
import { ImportQuestionModal } from './importQuestionModal';

type DeleteItemRequest = {
  surveyItemId: string;
  pageName?: string;
};

export type DeleteQuestionRequest = DeleteItemRequest & {
  questionText?: string;
};

export class SurveyDesignerModal {
  private readonly designer: Locator;
  private readonly frame: FrameLocator;

  private readonly savePageSortPathRegex: RegExp;
  private readonly saveItemSortPathRegex: RegExp;
  private readonly movePageItemPathRegex

  readonly attachmentButton: Locator;
  readonly dateButton: Locator;
  readonly numberButton: Locator;
  readonly textButton: Locator;
  readonly singleSelectButton: Locator;
  readonly multiSelectButton: Locator;
  readonly likertScaleButton: Locator;
  readonly matrixButton: Locator;
  readonly referenceButton: Locator;

  readonly previewButton: Locator;
  readonly saveIndicator: Locator;
  readonly autoSaveDialog: AutoSaveDialog;
  readonly importQuestionButton: Locator;
  readonly importQuestionModal: ImportQuestionModal;

  readonly addPageButton: Locator;
  readonly addSurveyPageDialog: AddSurveyPageDialog;
  readonly addOrEditSurveyPageModal: AddOrEditSurveyPageModal;
  readonly pageMenu: SurveyPageMenu;
  readonly deleteSurveyPageDialog: DeleteSurveyPageDialog;
  readonly deleteSurveyQuestionDialog: DeleteSurveyQuestionDialog;

  constructor(page: Page) {
    this.designer = page.getByRole('dialog', { name: /Survey Designer/ });
    this.frame = this.designer.frameLocator('iframe').first();

    this.savePageSortPathRegex = /\/Admin\/App\/\d+\/SurveyPage\/\d+\/SavePageSort/;
    this.saveItemSortPathRegex = /\/Admin\/App\/\d+\/SurveyPageItem\/SaveItemSort/;
    this.movePageItemPathRegex = /\/Admin\/App\/\d+\/SurveyPageItem\/Move/

    this.attachmentButton = this.frame.getByRole('button', { name: 'Attachment' });
    this.dateButton = this.frame.getByRole('button', { name: 'Date/Time' });
    this.numberButton = this.frame.getByRole('button', { name: 'Number' });
    this.textButton = this.frame.getByRole('button', { name: 'Text', exact: true });
    this.singleSelectButton = this.frame.getByRole('button', { name: 'Single Select' });
    this.multiSelectButton = this.frame.getByRole('button', { name: 'Multi-Select' });
    this.likertScaleButton = this.frame.getByRole('button', { name: 'Likert Scale' });
    this.matrixButton = this.frame.getByRole('button', { name: 'Matrix' });
    this.referenceButton = this.frame.getByRole('button', { name: 'Reference' });

    this.previewButton = this.frame.getByRole('link', { name: 'Preview' });
    this.saveIndicator = this.frame.locator('#record-status .animation');
    this.autoSaveDialog = new AutoSaveDialog(page);
    this.importQuestionButton = this.frame.getByRole('button', { name: 'Import Question' });
    this.importQuestionModal = new ImportQuestionModal(page);

    this.addPageButton = this.frame.getByRole('button', { name: 'Add Page' });
    this.addSurveyPageDialog = new AddSurveyPageDialog(page);
    this.addOrEditSurveyPageModal = new AddOrEditSurveyPageModal(page);
    this.pageMenu = new SurveyPageMenu(this.frame);
    this.deleteSurveyPageDialog = new DeleteSurveyPageDialog(page);
    this.deleteSurveyQuestionDialog = new DeleteSurveyQuestionDialog(page);
  }

  getQuestionEditForm(questionType: 'Reference'): AddOrEditReferenceQuestionForm;
  getQuestionEditForm(questionType: 'Matrix'): AddOrEditMatrixQuestionForm;
  getQuestionEditForm(questionType: 'Likert Scale'): AddOrEditLikertQuestionForm;
  getQuestionEditForm(questionType: 'Multi Select'): AddOrEditMultiSelectQuestionForm;
  getQuestionEditForm(questionType: 'Single Select'): AddOrEditSingleSelectQuestionForm;
  getQuestionEditForm(questionType: 'Text'): AddOrEditTextQuestionForm;
  getQuestionEditForm(questionType: 'Number'): AddOrEditNumberQuestionForm;
  getQuestionEditForm(questionType: 'Date/Time'): AddOrEditDateQuestionForm;
  getQuestionEditForm(questionType: 'Attachment'): AddOrEditAttachmentQuestionForm;
  getQuestionEditForm(questionType?: QuestionType): BaseAddOrEditQuestionForm;
  getQuestionEditForm(questionType: QuestionType): BaseAddOrEditQuestionForm {
    switch (questionType) {
      case 'Attachment':
        return new AddOrEditAttachmentQuestionForm(this.frame);
      case 'Date/Time':
        return new AddOrEditDateQuestionForm(this.frame);
      case 'Number':
        return new AddOrEditNumberQuestionForm(this.frame);
      case 'Text':
        return new AddOrEditTextQuestionForm(this.frame);
      case 'Single Select':
        return new AddOrEditSingleSelectQuestionForm(this.frame);
      case 'Multi Select':
        return new AddOrEditMultiSelectQuestionForm(this.frame);
      case 'Likert Scale':
        return new AddOrEditLikertQuestionForm(this.frame);
      case 'Matrix':
        return new AddOrEditMatrixQuestionForm(this.frame);
      case 'Reference':
        return new AddOrEditReferenceQuestionForm(this.frame);
      case undefined:
        return new BaseAddOrEditQuestionForm(this.frame);
      default:
        throw new Error(`Question type ${questionType} is not supported.`);
    }
  }

  /**
   * Opens the survey in preview mode.
   * @returns The preview page.
   */
  async previewSurvey() {
    const context = this.designer.page().context();
    const previewPagePromise = context.waitForEvent('page');
    await this.previewButton.click();
    const page = await previewPagePromise;
    await page.waitForLoadState('load');
    return new SurveyPreviewPage(page);
  }

  /**
   * Imports a question into the survey via the survey designer modal.
   * @param sourceSurveyName The name of the survey to import the question from.
   * @param sourceQuestion The question to import.
   * @returns The item id of the created survey question.
   */
  async importQuestion(sourceSurveyName: string, sourceQuestion: Question) {
    await this.importQuestionButton.click();
    await this.importQuestionModal.selectQuestionToImport(sourceSurveyName, sourceQuestion.questionId);
    await this.importQuestionModal.importButton.click();

    const createdQuestion = this.frame.locator('[data-item-id]', { hasText: new RegExp(sourceQuestion.questionText) });
    const itemId = await createdQuestion.getAttribute('data-item-id');

    if (itemId === null) {
      throw new Error('Item id was not found on the created survey question.');
    }

    await this.saveIndicator.waitFor({ state: 'hidden' });

    return itemId;
  }

  /**
   * Copies a question in the survey via the survey designer modal.
   * @param surveyItemId The item id of the question to copy.
   * @param questionText The text of the question to copy.
   * @returns The item id of the copied survey question.
   */
  async copyQuestion(surveyItemId: string, questionText: string) {
    const surveyItem = this.frame.locator(`[data-item-id="${surveyItemId}"]`, { hasText: new RegExp(questionText) });
    await surveyItem.hover();

    const copyButton = surveyItem.getByTitle('Duplicate Question');
    await copyButton.click();

    const editQuestionForm = this.getQuestionEditForm();

    const copiedSurveyQuestion = this.frame.locator(`.survey-item.edit-mode`, {
      hasText: new RegExp(questionText),
    });
    const itemId = await copiedSurveyQuestion.getAttribute('data-item-id');

    if (itemId === null) {
      throw new Error('Item id was not found on the copied survey question.');
    }

    await editQuestionForm.dragBar.click();
    await this.saveIndicator.waitFor({ state: 'hidden' });

    return itemId;
  }

  async deleteQuestion(req: DeleteQuestionRequest) {
    if (req.pageName) {
      await this.goToPage(req.pageName);
    }

    const surveyItem = this.frame.locator(`[data-item-id="${req.surveyItemId}"]`, {
      hasText: new RegExp(req.questionText ?? '.*'),
    });

    await surveyItem.hover();

    const deleteButton = surveyItem.getByTitle('Delete Question');
    await deleteButton.click();

    await this.deleteSurveyQuestionDialog.deleteButton.waitFor();
    await this.deleteSurveyQuestionDialog.deleteButton.click();

    await this.saveIndicator.waitFor({ state: 'hidden' });
    // eslint-disable-next-line playwright/no-wait-for-timeout
    await this.saveIndicator.page().waitForTimeout(1000);
  }

  private async waitForQuestionTextToBeFocused() {
    const page = this.designer.page();

    await page.waitForFunction(
      () => {
        const frame = document.querySelector('iframe');
        const activeElement = frame?.contentWindow?.document.activeElement;
        return activeElement?.id === 'QuestionText';
      },
      undefined,
      { timeout: 30_000 }
    );
  }

  /**
   * Adds a question to the survey via the survey designer modal.
   * @param question The question to add to the survey.
   * @returns The item id of the created survey question.
   */
  async addQuestion(question: Question) {
    let addQuestionForm;

    // waiting for question text to be focused
    // is important to avoid focus going to
    // the element while playwright has already
    // started interacting with form.
    switch (question.type) {
      case 'Attachment':
        await this.attachmentButton.click();
        addQuestionForm = this.getQuestionEditForm(question.type);
        await this.waitForQuestionTextToBeFocused();
        await addQuestionForm.fillOutForm(question as AttachmentQuestion);
        break;
      case 'Date/Time':
        await this.dateButton.click();
        addQuestionForm = this.getQuestionEditForm(question.type);
        await this.waitForQuestionTextToBeFocused();
        await addQuestionForm.fillOutForm(question as DateQuestion);
        break;
      case 'Number':
        await this.numberButton.click();
        addQuestionForm = this.getQuestionEditForm(question.type);
        await this.waitForQuestionTextToBeFocused();
        await addQuestionForm.fillOutForm(question as NumberQuestion);
        break;
      case 'Text':
        await this.textButton.click();
        addQuestionForm = this.getQuestionEditForm(question.type);
        await this.waitForQuestionTextToBeFocused();
        await addQuestionForm.fillOutForm(question as TextQuestion);
        break;
      case 'Single Select':
        await this.singleSelectButton.click();
        addQuestionForm = this.getQuestionEditForm(question.type);
        await this.waitForQuestionTextToBeFocused();
        await addQuestionForm.fillOutForm(question as SingleSelectQuestion);
        break;
      case 'Multi Select':
        await this.multiSelectButton.click();
        addQuestionForm = this.getQuestionEditForm(question.type);
        await this.waitForQuestionTextToBeFocused();
        await addQuestionForm.fillOutForm(question as MultiSelectQuestion);
        break;
      case 'Likert Scale':
        await this.likertScaleButton.click();
        addQuestionForm = this.getQuestionEditForm(question.type);
        await this.waitForQuestionTextToBeFocused();
        await addQuestionForm.fillOutForm(question as LikertQuestion);
        break;
      case 'Matrix':
        await this.matrixButton.click();
        addQuestionForm = this.getQuestionEditForm(question.type);
        await this.waitForQuestionTextToBeFocused();
        await addQuestionForm.fillOutForm(question as MatrixQuestion);
        break;
      case 'Reference':
        await this.referenceButton.click();
        addQuestionForm = this.getQuestionEditForm(question.type);
        await this.waitForQuestionTextToBeFocused();
        await addQuestionForm.fillOutForm(question as ReferenceQuestion);
        break;
      default:
        throw new Error(`Question type ${question.type} is not supported.`);
    }

    await addQuestionForm.dragBar.click();
    await this.saveIndicator.waitFor({ state: 'hidden' });
    const createdSurveyQuestion = this.frame.locator('.survey-item', { hasText: new RegExp(question.questionText) });
    const itemId = await createdSurveyQuestion.getAttribute('data-item-id');

    if (itemId === null) {
      throw new Error('Item id was not found on the created survey question.');
    }

    return itemId;
  }

  async updateQuestion(surveyItemId: string, question: Question) {
    const surveyQuestion = this.frame.locator(`[data-item-id="${surveyItemId}"]`);
    await surveyQuestion.locator('.display-item').click();

    let editQuestionForm;

    // waiting for question text to be focused
    // is important to avoid focus going to
    // the element while playwright has already
    // started interacting with form.
    switch (question.type) {
      case 'Attachment':
        editQuestionForm = this.getQuestionEditForm(question.type);
        await this.waitForQuestionTextToBeFocused();
        await editQuestionForm.clearForm();
        await editQuestionForm.fillOutForm(question as AttachmentQuestion);
        break;
      case 'Date/Time':
        editQuestionForm = this.getQuestionEditForm(question.type);
        await this.waitForQuestionTextToBeFocused();
        await editQuestionForm.clearForm();
        await editQuestionForm.fillOutForm(question as DateQuestion);
        break;
      case 'Number':
        editQuestionForm = this.getQuestionEditForm(question.type);
        await this.waitForQuestionTextToBeFocused();
        await editQuestionForm.clearForm();
        await editQuestionForm.fillOutForm(question as NumberQuestion);
        break;
      case 'Text':
        editQuestionForm = this.getQuestionEditForm(question.type);
        await this.waitForQuestionTextToBeFocused();
        await editQuestionForm.clearForm();
        await editQuestionForm.fillOutForm(question as TextQuestion);
        break;
      case 'Single Select':
        editQuestionForm = this.getQuestionEditForm(question.type);
        await this.waitForQuestionTextToBeFocused();
        await editQuestionForm.clearForm();
        await editQuestionForm.fillOutForm(question as SingleSelectQuestion);
        break;
      case 'Multi Select':
        editQuestionForm = this.getQuestionEditForm(question.type);
        await this.waitForQuestionTextToBeFocused();
        await editQuestionForm.clearForm();
        await editQuestionForm.fillOutForm(question as MultiSelectQuestion);
        break;
      case 'Likert Scale':
        editQuestionForm = this.getQuestionEditForm(question.type);
        await this.waitForQuestionTextToBeFocused();
        await editQuestionForm.clearForm();
        await editQuestionForm.fillOutForm(question as LikertQuestion);
        break;
      case 'Matrix':
        editQuestionForm = this.getQuestionEditForm(question.type);
        await this.waitForQuestionTextToBeFocused();
        await editQuestionForm.clearForm();
        await editQuestionForm.fillOutForm(question as MatrixQuestion);
        break;
      case 'Reference':
        editQuestionForm = this.getQuestionEditForm(question.type);
        await this.waitForQuestionTextToBeFocused();
        await editQuestionForm.clearForm();
        await editQuestionForm.fillOutForm(question as ReferenceQuestion);
        break;
      default:
        throw new Error(`Question type ${question.type} is not supported.`);
    }

    await editQuestionForm.dragBar.click();
    await this.saveIndicator.waitFor({ state: 'hidden' });
  }

  async moveQuestionAbove(surveyItemIdToMove: string, surveyItemIdToMoveAbove: string) {
    const surveyItemToMove = this.frame.locator(`[data-item-id="${surveyItemIdToMove}"]`);
    const surveyItemToMoveAbove = this.frame.locator(`[data-item-id="${surveyItemIdToMoveAbove}"]`);

    const surveyItemToMovePos = await surveyItemToMove.boundingBox();
    const surveyItemToMoveAbovePos = await surveyItemToMoveAbove.boundingBox();

    if (surveyItemToMovePos == null) {
      throw new Error(`Could not find survey item with id ${surveyItemIdToMove}.`);
    }

    if (surveyItemToMoveAbovePos == null) {
      throw new Error(`Could not find survey item with id ${surveyItemIdToMoveAbove}.`);
    }

    if (surveyItemToMovePos.y < surveyItemToMoveAbovePos.y) {
      // item to move above is already above the item to move
      return;
    }

    const saveSortItemPromise = this.designer
      .page()
      .waitForResponse(
        res => res.url().match(this.saveItemSortPathRegex) !== null && res.request().method() === 'POST'
      );

    await surveyItemToMove.locator('.drag-bar').dragTo(surveyItemToMoveAbove.locator('.display-item'));

    await Promise.allSettled([this.saveIndicator.waitFor({ state: 'hidden' }), saveSortItemPromise]);
  }

  async addPage(newPage: SurveyPage) {
    await this.addPageButton.click();
    await this.addSurveyPageDialog.okButton.click();
    await this.addOrEditSurveyPageModal.nameInput.fill(newPage.name);
    await this.addOrEditSurveyPageModal.descriptionEditor.fill(newPage.description);
    await this.addOrEditSurveyPageModal.saveButton.click();
  }

  private getPageLocator(pageName: string) {
    return this.frame.locator('#page-list [data-page-id]', { hasText: new RegExp(pageName) });
  }

  async updatePage(pageName: string, updatedPage: SurveyPage) {
    const page = this.getPageLocator(pageName);
    const pageMenuButton = page.locator('.page-menu-button');

    await pageMenuButton.click();
    await this.pageMenu.editPropertiesButton.waitFor();
    await this.pageMenu.editPropertiesButton.click();

    await this.addOrEditSurveyPageModal.nameInput.clear();
    await this.addOrEditSurveyPageModal.descriptionEditor.clear();

    await this.addOrEditSurveyPageModal.nameInput.fill(updatedPage.name);
    await this.addOrEditSurveyPageModal.descriptionEditor.fill(updatedPage.description);
    await this.addOrEditSurveyPageModal.saveButton.click();
  }

  async deletePage(pageName: string) {
    const page = this.getPageLocator(pageName);
    const pageMenuButton = page.locator('.page-menu-button');

    await pageMenuButton.click();
    await this.pageMenu.deleteButton.waitFor();
    await this.pageMenu.deleteButton.click();

    await this.deleteSurveyPageDialog.deleteButton.waitFor();
    await this.deleteSurveyPageDialog.deleteButton.click();

    await this.saveIndicator.waitFor({ state: 'hidden' });
  }

  async goToPage(pageName: string) {
    const page = this.getPageLocator(pageName);
    await page.click();
  }

  async movePageAbove(pageToMove: string, pageToMoveAbove: string) {
    const page = this.getPageLocator(pageToMove);
    const pageAbove = this.getPageLocator(pageToMoveAbove);

    const pagePos = await page.boundingBox();
    const pageAbovePos = await pageAbove.boundingBox();

    if (pagePos == null) {
      throw new Error(`Could not find page with name ${pageToMove}.`);
    }

    if (pageAbovePos == null) {
      throw new Error(`Could not find page with name ${pageToMoveAbove}.`);
    }

    if (pagePos.y < pageAbovePos.y) {
      // page to move above is already above the page to move
      return;
    }

    const saveSortPagePromise = this.designer
      .page()
      .waitForResponse(
        res => res.url().match(this.savePageSortPathRegex) !== null && res.request().method() === 'POST'
      );

    await page.locator('.page-drag').dragTo(pageAbove);

    await Promise.allSettled([this.saveIndicator.waitFor({ state: 'hidden' }), saveSortPagePromise]);
  }

  async moveQuestionToPage(surveyItemToMove: string, pageName: string) {
    const surveyItem = this.frame.locator(`[data-item-id="${surveyItemToMove}"]`);
    await surveyItem.hover();
    await surveyItem.getByTitle('Move Question').click();

    const moveToPageMenu = this.frame.locator('#move-to-page-menu');

    const moveToPageResponse = this.designer.page().waitForResponse(this.movePageItemPathRegex);
    await moveToPageMenu.getByText(pageName).click();
    await moveToPageResponse;
    await this.saveIndicator.waitFor({ state: 'hidden' });
  }

  /**
   * Gets the item id of the nth survey item displayed on the current page.
   * @param n The zero-based index of the survey item to get the item id of.
   * @returns The item id of the nth survey item.
   */
  async getNthSurveyItemId(n: number) {
    const surveyItem = this.frame.locator('[data-item-id]').nth(n);
    const itemId = await surveyItem.getAttribute('data-item-id');

    if (itemId === null) {
      throw new Error(`Could not find item id for ${n} survey item.`);
    }

    return itemId;
  }

  private async waitForEditorToBeFocused() {
    const page = this.designer.page();
    await page.waitForFunction(
      () => {
        const frame = document.querySelector('iframe');
        const focusedElement = frame?.contentWindow?.document.activeElement;
        const isEditorFocused = focusedElement?.classList.contains('mce-content-body');
        return isEditorFocused;
      },
      undefined,
      { timeout: 5000 }
    );
  }

  async updateFormattedText(surveyItemId: string, formattedText: FormattedText) {
    const existingFormattedText = this.frame.locator(`[data-item-id="${surveyItemId}"]`);
    await existingFormattedText.locator('.display-item').click();
    const editFormattedTextForm = new AddOrEditFormattedTextForm(this.frame);

    // we need to wait for editor to be focused before
    // we can interact because focus is trigger
    // programmatically on the page and can occur
    // after playwright begins interacting with
    // the editor
    await this.waitForEditorToBeFocused();
    await editFormattedTextForm.clearForm();
    await editFormattedTextForm.fillOutForm(formattedText);

    await editFormattedTextForm.dragBar.click();
    await this.saveIndicator.waitFor({ state: 'hidden' });
  }
}
