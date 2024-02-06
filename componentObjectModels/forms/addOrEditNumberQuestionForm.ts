import { FrameLocator } from '@playwright/test';
import { NumberQuestion } from '../../models/numberQuestion';
import { BaseAddOrEditQuestionForm } from './baseAddOrEditQuestionForm';

export class AddOrEditNumberQuestionForm extends BaseAddOrEditQuestionForm {
  constructor(frame: FrameLocator) {
    super(frame);
  }

  async fillOutForm(question: NumberQuestion) {
    await this.baseFillOutForm(question);
  }

  async clearForm() {
    await this.baseClearForm();
  }
}
