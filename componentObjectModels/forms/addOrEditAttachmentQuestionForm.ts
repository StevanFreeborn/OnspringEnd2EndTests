import { FrameLocator } from '@playwright/test';
import { AttachmentQuestion } from '../../models/attachmentQuestion';
import { BaseAddOrEditQuestionForm } from './baseAddOrEditQuestionForm';

export class AddOrEditAttachmentQuestionForm extends BaseAddOrEditQuestionForm {
  constructor(frame: FrameLocator) {
    super(frame);
  }

  async fillOutForm(question: AttachmentQuestion) {
    await super.fillOutForm(question);
  }

  async clearForm() {
    await super.clearForm();
  }
}
