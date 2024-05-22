import { Page } from '@playwright/test';
import { TextMessage } from '../../models/textMessage';
import { MessageRulesTab } from './messageRulesTab';

export class TextRulesTab extends MessageRulesTab {
  constructor(page: Page) {
    super(page);
  }

  async fillOutForm(textMessage: TextMessage) {
    if (textMessage.sendLogic) {
      await this.sendLogic.addLogic(textMessage.sendLogic);
    }
  }
}
