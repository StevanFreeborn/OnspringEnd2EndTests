import { Page } from '@playwright/test';
import { SharedList } from '../../models/sharedList';
import { ListValuesGrid } from '../controls/listValuesGrid';

export class ListValuesTab {
  readonly valuesGrid: ListValuesGrid;

  constructor(page: Page) {
    this.valuesGrid = new ListValuesGrid(page.locator('.list-values'));
  }

  async fillOutForm(list: SharedList) {
    for (const value of list.values) {
      await this.valuesGrid.addValue(value);
    }

    await this.valuesGrid.customSortCheckbox.setChecked(list.customSort);
  }
}
