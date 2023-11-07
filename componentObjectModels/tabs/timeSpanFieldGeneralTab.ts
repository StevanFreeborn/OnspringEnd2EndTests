import { FrameLocator } from '@playwright/test';
import { TimeSpanField } from '../../models/timeSpanField';
import { FieldGeneralTab } from './fieldGeneralTab';

export class TimeSpanFieldGeneralTab extends FieldGeneralTab {
  constructor(frame: FrameLocator) {
    super(frame);
  }

  async fillOutGeneralTab(timeSpanField: TimeSpanField) {
    await this.fieldInput.fill(timeSpanField.name);
  }
}
