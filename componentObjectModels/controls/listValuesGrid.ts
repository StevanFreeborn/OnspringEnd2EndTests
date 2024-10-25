import { FrameLocator, Locator } from '@playwright/test';
import { BaseListValue, ListValue } from '../../models/listValue';

// TODO: Might make sense
// to create a base class for this kind of grid
// to better represent differences
// between grids for lists
// vs. grids for list questions
// vs. grids for matrix/likert questions
export class ListValuesGrid {
  private readonly frame?: FrameLocator;
  private readonly control: Locator;
  private readonly gridHeader: Locator;
  private readonly gridBody: Locator;
  readonly addValueButton: Locator;
  readonly editAllButton: Locator;
  readonly promoteToSharedListButton: Locator;
  readonly customSortCheckbox: Locator;

  constructor(control: Locator, frame?: FrameLocator) {
    this.control = control;
    this.frame = frame;
    this.gridHeader = this.control.locator('div.k-grid-header');
    this.gridBody = this.control.locator('div.k-grid-content');
    this.addValueButton = this.control.getByRole('button', { name: 'Add Value' });
    this.editAllButton = this.control.getByRole('button', { name: 'Edit All' });
    this.promoteToSharedListButton = this.control.getByRole('button', { name: 'Promote to Shared List' });
    this.customSortCheckbox = this.control.getByLabel('Enable custom sort');
  }

  getRowByValue(value: string) {
    return new ListValueRow(this.gridBody.getByRole('row', { name: value }));
  }

  getLastValueRow() {
    return new ListValueRow(this.gridBody.getByRole('row').last());
  }

  async addValue(listValue: BaseListValue) {
    await this.addValueButton.click();
    const row = this.getLastValueRow();
    await row.valueInput.fill(listValue.value);
    await row.numericValueInput.fill(listValue.numericValue.toString());

    if (listValue instanceof ListValue) {
      if (listValue.color) {
        await row.colorPicker.click();

        const popupOwner = this.frame ?? this.control.page();
        const colorPickerPopup = popupOwner.locator('.tabbed-color-popup:visible');
        const customTab = colorPickerPopup.getByRole('tab', { name: 'Custom' });

        await customTab.click();

        const colorInput = colorPickerPopup.locator('.k-color-value');

        await colorInput.clear();
        await colorInput.pressSequentially(listValue.color, { delay: 150 });
        await colorPickerPopup.locator('.popup-close').click();
      }
    }
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
      await row.getByTitle('Delete List Value').click();
      await rowElement.waitForElementState('hidden');
    }
  }
}

class ListValueRow {
  private readonly row: Locator;
  readonly dragHandle: Locator;
  readonly valueInput: Locator;
  readonly numericValueInput: Locator;
  readonly chooseImageLink: Locator;
  readonly colorPicker: Locator;

  constructor(row: Locator) {
    this.row = row;
    this.dragHandle = this.row.locator('td[data-field="dragHandle"]');
    this.valueInput = this.row.locator('td[data-field="name"] input');
    this.numericValueInput = this.row.locator('td[data-field="numericValue"] input.k-formatted-value');
    this.chooseImageLink = this.row.locator('td[data-field="imageId"] a');
    this.colorPicker = this.row.locator('td[data-field="color"] span.k-colorpicker');
  }
}
