import { Locator, Page } from '@playwright/test';
import { SlackMessage } from '../../models/slackMessage';

export class SlackContentsTab {
  readonly messageTitleInput: Locator;
  readonly messageEditor: Locator;
  readonly recordLinkTextInput: Locator;
  readonly viewRecordButtonCheckbox: Locator;
  readonly sidebarColorSelector: Locator;
  readonly sidebarColorInput: Locator;

  constructor(page: Page) {
    this.messageTitleInput = page.getByLabel('Message Title');
    this.messageEditor = page.locator('.content-area.mce-content-body:visible');
    this.recordLinkTextInput = page.getByLabel('Record Link Text');
    this.viewRecordButtonCheckbox = page.getByLabel('"View Record" Button');
    this.sidebarColorSelector = page.getByLabel('Sidebar Color Based On');
    this.sidebarColorInput = page.getByLabel(/Current selected color is/);
  }

  async fillOutForm(slackMessage: SlackMessage) {
    if (slackMessage.messageTitle) {
      await this.messageTitleInput.fill(slackMessage.messageTitle);
    }

    if (slackMessage.message) {
      await this.messageEditor.fill(slackMessage.message);
    }

    if (slackMessage.appendViewRecordButton !== undefined) {
      if (slackMessage.appendViewRecordButton) {
        await this.viewRecordButtonCheckbox.check();
      } else {
        await this.viewRecordButtonCheckbox.uncheck();
      }
    }

    if (slackMessage.sidebarColor) {
      await this.sidebarColorInput.fill(slackMessage.sidebarColor);
    }
  }
}
