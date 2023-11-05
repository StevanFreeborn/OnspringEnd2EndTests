import { FrameLocator } from '@playwright/test';
import { NumberField } from '../../models/numberField';
import { FieldGeneralTab } from './fieldGeneralTab';

export class NumberFieldGeneralTab extends FieldGeneralTab {
  constructor(frame: FrameLocator) {
    super(frame);
  }

  async fillOutGeneralTab(numberField: NumberField) {
    await this.fieldInput.fill(numberField.name);
  }
}
