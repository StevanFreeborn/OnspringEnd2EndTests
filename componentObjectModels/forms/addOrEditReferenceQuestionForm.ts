import { FrameLocator, Locator } from '@playwright/test';
import { ReferenceQuestion } from '../../models/referenceQuestion';
import { ReferenceAnswerValueGrid } from '../controls/referenceAnswerValueGrid';
import { BaseAddOrEditQuestionForm } from './baseAddOrEditQuestionForm';

export class AddOrEditReferenceQuestionForm extends BaseAddOrEditQuestionForm {
  private readonly frame: FrameLocator;
  private readonly appReferenceSelect: Locator;
  private readonly answerValuesGrid: ReferenceAnswerValueGrid;

  constructor(frame: FrameLocator) {
    super(frame);
    this.frame = frame;
    this.appReferenceSelect = frame.getByRole('listbox', { name: 'App Reference' });
    this.answerValuesGrid = new ReferenceAnswerValueGrid(frame.locator('.list-values').first());
  }

  private async selectAppReference(appReference: string) {
    await this.appReferenceSelect.click();
    await this.frame.getByRole('option', { name: appReference }).click();
  }

  async fillOutForm(question: ReferenceQuestion) {
    await this.baseFillOutForm(question);

    const isAppReferenceSelectVisible = await this.appReferenceSelect.isVisible();

    // if you are editing a reference question
    // the app reference select is not longer
    // present as it is no longer editable
    if (isAppReferenceSelectVisible) {
      await this.selectAppReference(question.appReference);
    }

    if (question.answerValues === 'ALL') {
      await this.answerValuesGrid.addAllValues();
    } else {
      await this.answerValuesGrid.addValues(question.answerValues as string[]);
    }
  }

  async clearForm() {
    await this.baseClearForm();
    await this.answerValuesGrid.clearGrid();
  }
}
