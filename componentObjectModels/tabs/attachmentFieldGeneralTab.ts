import { FrameLocator } from '@playwright/test';
import { AttachmentField } from './../../models/attachmentField';
import { FieldGeneralTab } from './fieldGeneralTab';

export class AttachmentFieldGeneralTab extends FieldGeneralTab {
  constructor(frame: FrameLocator) {
    super(frame);
  }

  async fillOutGeneralTab(attachmentField: AttachmentField) {
    await this.fieldInput.fill(attachmentField.name);
  }
}
