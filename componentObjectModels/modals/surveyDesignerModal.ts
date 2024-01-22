import { FrameLocator, Locator, Page } from '@playwright/test';
import { QuestionType } from '../../models/question';
import { AutoSaveDialog } from '../dialogs/autoSaveDialog';
import { AttachmentQuestionEditForm } from '../forms/AttachmentQuestionEditForm';
import { BaseQuestionEditForm } from '../forms/BaseQuestionEditForm';

export class SurveyDesignerModal {
  private readonly designer: Locator;
  private readonly frame: FrameLocator;
  readonly attachmentButton: Locator;
  readonly previewButton: Locator;
  readonly saveIndicator: Locator;
  readonly autoSaveDialog: AutoSaveDialog;

  constructor(page: Page) {
    this.designer = page.getByRole('dialog', { name: /Survey Designer/ });
    this.frame = this.designer.frameLocator('iframe').first();
    this.attachmentButton = this.frame.getByRole('button', { name: 'Attachment' });
    this.previewButton = this.frame.getByRole('link', { name: 'Preview' });
    this.saveIndicator = this.frame.locator('#record-status .animation');
    this.autoSaveDialog = new AutoSaveDialog(page);
  }

  getQuestionEditForm(questionType: 'Attachment'): AttachmentQuestionEditForm;
  getQuestionEditForm(questionType: QuestionType): BaseQuestionEditForm {
    switch (questionType) {
      case 'Attachment':
        return new AttachmentQuestionEditForm(this.frame);
      default:
        throw new Error(`Question type ${questionType} is not supported.`);
    }
  }
}
