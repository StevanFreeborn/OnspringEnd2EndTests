import { FrameLocator } from '@playwright/test';
import { LikertQuestion } from '../../models/likertQuestion';
import { ListValuesGrid } from '../controls/listValuesGrid';
import { BaseAddOrEditQuestionForm } from './baseAddOrEditQuestionForm';

export class AddOrEditLikertQuestionForm extends BaseAddOrEditQuestionForm {
  readonly answerValuesGrid: ListValuesGrid;

  constructor(frame: FrameLocator) {
    super(frame);
    this.answerValuesGrid = new ListValuesGrid(frame.locator('.list-values').first());
  }

  async fillOutForm(question: LikertQuestion) {
    await this.baseFillOutForm(question);

    for (const value of question.answerValues) {
      await this.answerValuesGrid.addValue(value);
    }
  }

  async clearForm() {
    await this.baseClearForm();
    await this.answerValuesGrid.clearGrid();
  }
}
