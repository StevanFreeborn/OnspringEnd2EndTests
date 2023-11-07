import { FrameLocator } from '@playwright/test';
import { ListValuesGrid } from '../controls/listValuesGrid';
import { FieldGeneralTab } from './fieldGeneralTab';
import { ListField } from '../../models/listField';

export class ListFieldGeneralTab extends FieldGeneralTab {
  readonly listValuesGrid: ListValuesGrid;

  constructor(frame: FrameLocator) {
    super(frame);
    this.listValuesGrid = new ListValuesGrid(frame.locator('.list-values').first());
  }

  async fillOutGeneralTab(listField: ListField) {
    await this.fieldInput.fill(listField.name);

    for (const value of listField.values) {
      await this.listValuesGrid.addValue(value);
    }
  }
}
