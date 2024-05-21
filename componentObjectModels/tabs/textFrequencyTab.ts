import { Page } from '@playwright/test';
import { TextMessage } from '../../models/textMessage';
import { MessageFrequencyTab } from './messageFrequencyTab';

export class TextFrequencyTab extends MessageFrequencyTab {
  constructor(page: Page) {
    super(page);
  }

  async fillOutForm(textMessage: TextMessage) {
    await this.selectSendOnSaveFrequency(textMessage.sendOnSave);

    if (textMessage.enableReminders) {
      await this.enableReminders(textMessage.reminderDateField);
      await this.addReminders(textMessage.reminders);
    }
  }
}
