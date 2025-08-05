import { Locator } from '@playwright/test';

export class ReferenceAnswerValueGrid {
  private readonly getSurveyAnswerValuesPathRegex: RegExp;
  private readonly control: Locator;
  private readonly gridBody: Locator;
  readonly addValuesButton: Locator;
  readonly addAllValuesButton: Locator;

  constructor(control: Locator) {
    this.getSurveyAnswerValuesPathRegex = /\/Admin\/App\/\d+\/SurveyReference\/GetListPage/;
    this.control = control;
    this.gridBody = this.control.locator('.k-grid-content');
    this.addValuesButton = this.control.getByRole('button', { name: 'Add Values' });
    this.addAllValuesButton = this.control.getByRole('button', { name: 'Add All Values' });
  }

  async addAllValues() {
    const page = this.control.page();
    const addAllValuesModal = page.getByRole('dialog', { name: 'Add All Values' });

    await this.addAllValuesButton.click();
    await addAllValuesModal.waitFor();

    const okButton = addAllValuesModal.getByRole('button', { name: 'Ok' });
    const isOkButtonVisible = await okButton.isVisible();

    if (isOkButtonVisible) {
      const addAllValuesResponse = page.waitForResponse(this.getSurveyAnswerValuesPathRegex);
      await addAllValuesModal.getByRole('button', { name: 'Ok' }).click();
      await addAllValuesResponse;
    } else {
      await addAllValuesModal.getByRole('button', { name: 'Close' }).click();
    }
  }

  // TODO: Need to implement this method
  // if need to be able to add specific
  // values to the grid. Will have to deal
  // with the add answer value modal.
  async addValues(values: string[]) {
    throw new Error(`Method not implemented. Could not add value: ${values.join(', ')}`);
  }

  async clearGrid() {
    const valuesCount = await this.gridBody.getByRole('row').count();

    for (let i = 0; i < valuesCount; i++) {
      const row = this.gridBody.getByRole('row').last();
      const rowElement = await row.elementHandle();

      if (rowElement === null) {
        continue;
      }

      await row.hover();
      await row.getByTitle('Delete').click();
      await rowElement.waitForElementState('hidden');
    }
  }
}
