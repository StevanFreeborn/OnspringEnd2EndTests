import { SlackContentsTab } from '../../componentObjectModels/tabs/slackContentsTab';
import { SlackFrequencyTab } from '../../componentObjectModels/tabs/slackFrequencyTab';
import { SlackMessageGeneralTab } from '../../componentObjectModels/tabs/slackMessageGeneralTab';
import { SlackRulesTab } from '../../componentObjectModels/tabs/slackRulesTab';
import { Locator, Page } from '../../fixtures';
import { SlackMessage } from '../../models/slackMessage';
import { BaseAdminPage } from '../baseAdminPage';

export class EditSlackMessagePage extends BaseAdminPage {
  readonly pathRegex: RegExp;

  readonly saveButton: Locator;

  readonly generalTabButton: Locator;
  readonly contentsTabButton: Locator;
  readonly frequencyTabButton: Locator;
  readonly rulesTabButton: Locator;

  readonly generalTab: SlackMessageGeneralTab;
  readonly contentsTab: SlackContentsTab;
  readonly frequencyTab: SlackFrequencyTab;
  readonly rulesTab: SlackRulesTab;

  constructor(page: Page) {
    super(page);

    this.pathRegex = /\/Admin\/Messaging\/Slack\/\d+\/Edit/;

    this.saveButton = this.page.getByRole('link', { name: 'Save Changes' });

    this.generalTabButton = this.page.getByRole('tab', { name: 'General' });
    this.contentsTabButton = this.page.getByRole('tab', { name: 'Contents' });
    this.frequencyTabButton = this.page.getByRole('tab', { name: 'Frequency' });
    this.rulesTabButton = this.page.getByRole('tab', { name: 'Rules' });

    this.generalTab = new SlackMessageGeneralTab(this.page);
    this.contentsTab = new SlackContentsTab(this.page);
    this.frequencyTab = new SlackFrequencyTab(this.page);
    this.rulesTab = new SlackRulesTab(this.page);
  }

  async updateSlackMessage(slackMessage: SlackMessage) {
    await this.generalTabButton.click();
    await this.generalTab.fillOutForm(slackMessage);

    await this.contentsTabButton.click();
    await this.contentsTab.fillOutForm(slackMessage);

    await this.frequencyTabButton.click();
    await this.frequencyTab.fillOutForm(slackMessage);

    await this.rulesTabButton.click();
    await this.rulesTab.fillOutForm(slackMessage);
  }

  async save() {
    const saveResponse = this.page.waitForResponse(
      response => response.url().match(this.pathRegex) !== null && response.request().method() === 'POST'
    );

    await this.saveButton.click();
    await saveResponse;
  }
}
