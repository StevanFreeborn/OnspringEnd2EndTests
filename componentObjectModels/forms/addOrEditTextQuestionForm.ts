import { FrameLocator } from '@playwright/test';
import { TextQuestion } from '../../models/textQuestion';
import { BaseAddOrEditQuestionForm } from './baseAddOrEditQuestionForm';

export class AddOrEditTextQuestionForm extends BaseAddOrEditQuestionForm {
  constructor(frame: FrameLocator) {
    super(frame);
  }

  async fillOutForm(question: TextQuestion) {
    await super.fillOutForm(question);
  }

  async clearForm() {
    await super.clearForm();
  }
}
