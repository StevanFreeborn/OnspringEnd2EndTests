import { FrameLocator, Locator, Page } from '@playwright/test';
import { Question, QuestionType } from '../../models/question';
import { SurveyPreviewPage } from '../../pageObjectModels/surveys/surveyPreviewPage';
import { AutoSaveDialog } from '../dialogs/autoSaveDialog';
import { AddOrEditAttachmentQuestionForm } from '../forms/addOrEditAttachmentQuestionForm';
import { BaseAddOrEditQuestionForm } from '../forms/baseAddOrEditQuestionForm';
import { ImportQuestionModal } from './importQuestionModal';

export class SurveyDesignerModal {
  private readonly designer: Locator;
  private readonly frame: FrameLocator;
  readonly attachmentButton: Locator;
  readonly previewButton: Locator;
  readonly saveIndicator: Locator;
  readonly autoSaveDialog: AutoSaveDialog;
  readonly importQuestionButton: Locator;
  readonly importQuestionModal: ImportQuestionModal;

  constructor(page: Page) {
    this.designer = page.getByRole('dialog', { name: /Survey Designer/ });
    this.frame = this.designer.frameLocator('iframe').first();
    this.attachmentButton = this.frame.getByRole('button', { name: 'Attachment' });
    this.previewButton = this.frame.getByRole('link', { name: 'Preview' });
    this.saveIndicator = this.frame.locator('#record-status .animation');
    this.autoSaveDialog = new AutoSaveDialog(page);
    this.importQuestionButton = this.frame.getByRole('button', { name: 'Import Question' });
    this.importQuestionModal = new ImportQuestionModal(page);
  }

  getQuestionEditForm(questionType: 'Attachment'): AddOrEditAttachmentQuestionForm;
  getQuestionEditForm(questionType?: QuestionType): BaseAddOrEditQuestionForm;
  getQuestionEditForm(questionType: QuestionType): BaseAddOrEditQuestionForm {
    switch (questionType) {
      case 'Attachment':
        return new AddOrEditAttachmentQuestionForm(this.frame);
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

  /**
   * Adds a question to the survey via the survey designer modal.
   * @param question The question to add to the survey.
   * @returns The item id of the created survey question.
   */
  async addQuestion(question: Question) {
    let addQuestionForm;

    switch (question.type) {
      case 'Attachment':
        await this.attachmentButton.click();
        addQuestionForm = this.getQuestionEditForm(question.type);
        addQuestionForm.fillOutForm(question);
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
}
