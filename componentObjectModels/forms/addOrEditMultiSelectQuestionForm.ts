import { FrameLocator } from '@playwright/test';
import { MultiSelectQuestion } from '../../models/multiSelectQuestion';
import { ListValuesGrid } from '../controls/listValuesGrid';
import { BaseAddOrEditQuestionForm } from './baseAddOrEditQuestionForm';

export class AddOrEditMultiSelectQuestionForm extends BaseAddOrEditQuestionForm {
  readonly answerValuesGrid: ListValuesGrid;

  constructor(frame: FrameLocator) {
    super(frame);
    this.answerValuesGrid = new ListValuesGrid(frame.locator('.list-values').first(), frame);
  }

  async fillOutForm(question: MultiSelectQuestion) {
    await super.fillOutForm(question);

    for (const value of question.answerValues) {
      await this.answerValuesGrid.addValue(value);
    }
  }

  async clearForm() {
    await super.clearForm();
    await this.answerValuesGrid.clearGrid();
  }
}
