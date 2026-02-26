import { Page } from '@playwright/test';
import { SlackMessage } from '../../models/slackMessage';
import { MessageFrequencyTab } from './messageFrequencyTab';

export class SlackFrequencyTab extends MessageFrequencyTab {
  constructor(page: Page) {
    super(page);
  }

  async fillOutForm(slackMessage: SlackMessage) {
    await this.selectSendOnSaveFrequency(slackMessage.sendOnSave);

    if (slackMessage.enableReminders) {
      await this.enableReminders(slackMessage.reminderDateField);
      await this.addReminders(slackMessage.reminders);
    }
  }
}
