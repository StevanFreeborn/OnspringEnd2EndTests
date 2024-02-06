import { FrameLocator } from '@playwright/test';
import { DateQuestion } from '../../models/dateQuestion';
import { BaseAddOrEditQuestionForm } from './baseAddOrEditQuestionForm';

export class AddOrEditDateQuestionForm extends BaseAddOrEditQuestionForm {
  constructor(frame: FrameLocator) {
    super(frame);
  }

  async fillOutForm(question: DateQuestion) {
    await this.baseFillOutForm(question);
  }

  async clearForm() {
    await this.baseClearForm();
  }
}
