import { Locator, Page } from '@playwright/test';
import { TextMessage } from '../../models/textMessage';

export class TextContentsTab {
  private readonly fromNumberSelector: Locator;
  private readonly messageTextArea: Locator;

  constructor(page: Page) {
    this.fromNumberSelector = page.locator('.label:has-text("From Number") + .data').getByRole('listbox');
    this.messageTextArea = page.getByLabel('Message');
  }

  async fillOutForm(textMessage: TextMessage) {
    await this.fromNumberSelector.click();
    await this.fromNumberSelector.page().getByRole('option', { name: textMessage.fromNumber }).click();
    await this.messageTextArea.fill(textMessage.message);
  }
}
