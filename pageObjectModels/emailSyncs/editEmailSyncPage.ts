import { EmailSyncDataSyncTab } from '../../componentObjectModels/tabs/emailSyncDataSyncTab';
import { Page } from '../../fixtures';
import { BaseAdminPage } from '../baseAdminPage';

export class EditEmailSyncPage extends BaseAdminPage {
  readonly pathRegex: RegExp;
  readonly dataSyncTab: EmailSyncDataSyncTab;

  constructor(page: Page) {
    super(page);
    this.pathRegex = /\/Admin\/Integration\/EmailSync\/\d+\/Edit/;
    this.dataSyncTab = new EmailSyncDataSyncTab(this.page);
  }
}
