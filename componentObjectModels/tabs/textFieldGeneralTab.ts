import { FrameLocator } from '@playwright/test';
import { TextField } from '../../models/textField';
import { FieldGeneralTab } from './fieldGeneralTab';

export class TextFieldGeneralTab extends FieldGeneralTab {
  constructor(frame: FrameLocator) {
    super(frame);
  }

  async fillOutGeneralTab(textField: TextField) {
    await this.fieldInput.fill(textField.name);
  }
}
