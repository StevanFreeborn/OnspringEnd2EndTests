import { Locator, Page } from '../../fixtures';
import { SlackMessage } from '../../models/slackMessage';
import { BaseMessageGeneralTab } from './baseMessageGeneralTab';

export class SlackMessageGeneralTab extends BaseMessageGeneralTab {
  readonly channelNameInput: Locator;

  constructor(page: Page) {
    super(page);
    this.channelNameInput = page.locator('.label:has-text("Channel Name") + .data').locator('input[type="text"]');
  }

  async fillOutForm(slackMessage: SlackMessage) {
    await this.nameInput.fill(slackMessage.name);
    await this.descriptionEditor.fill(slackMessage.description);

    if (slackMessage.status) {
      await this.enableStatus();
    } else {
      await this.disableStatus();
    }

    await this.channelNameInput.fill(slackMessage.channelName);
  }
}
