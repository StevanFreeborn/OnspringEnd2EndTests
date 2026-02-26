import { Page } from '@playwright/test';
import { SlackMessage } from '../../models/slackMessage';
import { MessageRulesTab } from './messageRulesTab';

export class SlackRulesTab extends MessageRulesTab {
  constructor(page: Page) {
    super(page);
  }

  async fillOutForm(slackMessage: SlackMessage) {
    if (slackMessage.sendLogic) {
      await this.sendLogic.addLogic(slackMessage.sendLogic);
    }
  }
}
