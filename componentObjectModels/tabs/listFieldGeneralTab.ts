import { FrameLocator } from '@playwright/test';
import { ListField } from '../../models/listField';
import { ListValuesGrid } from '../controls/listValuesGrid';
import { FieldGeneralTab } from './fieldGeneralTab';

export class ListFieldGeneralTab extends FieldGeneralTab {
  readonly listValuesGrid: ListValuesGrid;

  constructor(frame: FrameLocator) {
    super(frame);
    this.listValuesGrid = new ListValuesGrid(this.frame.locator('.list-values').first(), this.frame);
  }

  async fillOutGeneralTab(listField: ListField) {
    await this.fieldInput.fill(listField.name);

    for (const value of listField.values) {
      await this.listValuesGrid.addValue(value);
    }
  }
}
