import { Page } from '@playwright/test';
import { TextMessage } from '../../models/textMessage';
import { MessageRecipientsTab } from './messageRecipientsTab';

export class TextRecipientsTab extends MessageRecipientsTab {
  constructor(page: Page) {
    super(page);
  }

  async fillOutForm(textMessage: TextMessage) {
    await this.basedOnFieldValuesSelector.selectOptions(textMessage.recipientsBasedOnFields);
    await this.specificGroupsSelector.selectOptions(textMessage.specificGroups);
    await this.specificUsersSelector.selectOptions(textMessage.specificUsers);
  }
}
