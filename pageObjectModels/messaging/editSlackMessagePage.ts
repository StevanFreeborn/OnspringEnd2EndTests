import { SlackMessageGeneralTab } from '../../componentObjectModels/tabs/slackMessageGeneralTab';
import { Locator, Page } from '../../fixtures';
import { BaseAdminPage } from '../baseAdminPage';

export class EditSlackMessagePage extends BaseAdminPage {
  readonly pathRegex: RegExp;

  readonly generalTabButton: Locator;

  readonly generalTab: SlackMessageGeneralTab;

  constructor(page: Page) {
    super(page);

    this.pathRegex = /\/Admin\/Messaging\/Slack\/\d+\/Edit/;

    this.generalTabButton = this.page.getByRole('tab', { name: 'General' });

    this.generalTab = new SlackMessageGeneralTab(this.page);
  }
}
