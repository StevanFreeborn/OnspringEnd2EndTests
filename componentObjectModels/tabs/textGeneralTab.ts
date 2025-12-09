import { Page } from '@playwright/test';
import { TextMessage } from '../../models/textMessage';
import { BaseMessageGeneralTab } from './baseMessageGeneralTab';

export class TextGeneralTab extends BaseMessageGeneralTab {
  constructor(page: Page) {
    super(page);
  }

  async fillOutForm(textMessage: TextMessage) {
    await this.nameInput.fill(textMessage.name);
    await this.descriptionEditor.fill(textMessage.description);

    if (textMessage.status) {
      await this.enableStatus();
    } else {
      await this.disableStatus();
    }
  }
}
