import { SlackConnectorGeneralTab } from '../../componentObjectModels/tabs/slackConnectorGeneralTab';
import { Page } from '../../fixtures';
import { EditConnectorPage } from './editConnectorPage';

export class EditSlackConnectorPage extends EditConnectorPage {
  generalTab: SlackConnectorGeneralTab;

  constructor(page: Page) {
    super(page);
    this.generalTab = new SlackConnectorGeneralTab(page);
  }
}
