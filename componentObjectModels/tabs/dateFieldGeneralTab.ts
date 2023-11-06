import { FrameLocator } from '@playwright/test';
import { DateField } from '../../models/dateField';
import { FieldGeneralTab } from './fieldGeneralTab';

export class DateFieldGeneralTab extends FieldGeneralTab {
  constructor(frame: FrameLocator) {
    super(frame);
  }

  async fillOutGeneralTab(dateField: DateField) {
    await this.fieldInput.fill(dateField.name);
  }
}
