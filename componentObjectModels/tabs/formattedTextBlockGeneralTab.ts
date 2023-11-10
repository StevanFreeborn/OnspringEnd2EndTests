import { Locator } from '@playwright/test';
import { FormattedTextBlock } from '../../models/formattedTextBlock';

export class FormattedTextBlockGeneralTab {
  private readonly frame: Locator;
  readonly nameInput: Locator;
  readonly formattedTextEditor: Locator;

  constructor(frame: Locator) {
    this.frame = frame;
    this.nameInput = this.frame.getByLabel('Name');
    this.formattedTextEditor = this.frame.locator('.content-area.mce-content-body');
  }

  async fillOutGeneralTab(formattedTextBlock: FormattedTextBlock) {
    await this.nameInput.fill(formattedTextBlock.name);
    await this.formattedTextEditor.fill(formattedTextBlock.formattedText);
  }
}
