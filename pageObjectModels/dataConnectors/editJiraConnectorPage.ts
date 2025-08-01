import { Page } from '@playwright/test';
import { JiraConnectionTab } from '../../componentObjectModels/tabs/jiraConnectionTab';
import { EditConnectorPage } from './editConnectorPage';

export class EditJiraConnectorPage extends EditConnectorPage {
  readonly connectionTab: JiraConnectionTab;

  constructor(page: Page) {
    super(page);
    this.connectionTab = new JiraConnectionTab(this.page);
  }
}
