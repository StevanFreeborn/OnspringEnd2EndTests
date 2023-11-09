import { FrameLocator } from '@playwright/test';
import { ImageField } from '../../models/imageField';
import { FieldGeneralTab } from './fieldGeneralTab';

export class ImageFieldGeneralTab extends FieldGeneralTab {
  constructor(frame: FrameLocator) {
    super(frame);
  }

  async fillOutGeneralTab(imageField: ImageField) {
    await this.fieldInput.fill(imageField.name);
  }
}
