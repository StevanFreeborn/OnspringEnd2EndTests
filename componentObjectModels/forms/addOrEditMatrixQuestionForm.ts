import { FrameLocator } from '@playwright/test';
import { MatrixQuestion } from '../../models/matrixQuestion';
import { ListValuesGrid } from '../controls/listValuesGrid';
import { BaseAddOrEditQuestionForm } from './baseAddOrEditQuestionForm';

export class AddOrEditMatrixQuestionForm extends BaseAddOrEditQuestionForm {
  readonly rowValuesGrid: ListValuesGrid;
  readonly columnValuesGrid: ListValuesGrid;

  constructor(frame: FrameLocator) {
    super(frame);
    this.rowValuesGrid = new ListValuesGrid(frame.locator('.list-values').first());
    this.columnValuesGrid = new ListValuesGrid(frame.locator('.list-values').last());
  }

  async fillOutForm(question: MatrixQuestion) {
    await super.fillOutForm(question);

    for (const value of question.rowValues) {
      await this.rowValuesGrid.addValue(value);
    }

    for (const value of question.columnValues) {
      await this.columnValuesGrid.addValue(value);
    }
  }

  async clearForm() {
    await super.clearForm();
    await this.rowValuesGrid.clearGrid();
    await this.columnValuesGrid.clearGrid();
  }
}
