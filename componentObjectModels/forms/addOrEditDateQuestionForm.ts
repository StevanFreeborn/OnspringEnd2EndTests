import { FrameLocator } from '@playwright/test';
import { DateQuestion } from '../../models/dateQuestion';
import { BaseAddOrEditQuestionForm } from './baseAddOrEditQuestionForm';

export class AddOrEditDateQuestionForm extends BaseAddOrEditQuestionForm {
  constructor(frame: FrameLocator) {
    super(frame);
  }

  async fillOutForm(question: DateQuestion) {
    await super.fillOutForm(question);
  }

  async clearForm() {
    await super.clearForm();
  }
}
