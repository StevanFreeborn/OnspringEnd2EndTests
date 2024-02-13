import { FrameLocator, Locator } from '@playwright/test';
import { FormattedText } from '../../models/formattedText';

export class AddOrEditFormattedTextForm {
  readonly dragBar: Locator;

  readonly formattedTextEditor: Locator;
  readonly objectIdInput: Locator;

  constructor(frame: FrameLocator) {
    this.dragBar = frame.locator('.survey-item.edit-mode .drag-bar');
    this.formattedTextEditor = frame.locator('.content-area.mce-content-body');
    this.objectIdInput = frame.getByLabel('Object Id');
  }

  async fillOutForm(formattedText: FormattedText) {
    const objectIdElement = await this.objectIdInput.elementHandle();
    await objectIdElement?.waitForElementState('stable');

    await this.formattedTextEditor.fill(formattedText.formattedText);
    await this.objectIdInput.fill(formattedText.objectId);
  }

  async clearForm() {
    await this.objectIdInput.clear();
    await this.formattedTextEditor.clear();
  }
}
