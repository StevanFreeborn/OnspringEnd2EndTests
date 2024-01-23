import { FrameLocator } from '@playwright/test';
import { AttachmentQuestion } from '../../models/attachmentQuestion';
import { BaseQuestionEditForm } from './BaseQuestionEditForm';

export class AttachmentQuestionEditForm extends BaseQuestionEditForm {
  constructor(frame: FrameLocator) {
    super(frame);
  }

  async fillOutForm(question: AttachmentQuestion) {
    await this.baseFillOutForm(question);
  }
}
