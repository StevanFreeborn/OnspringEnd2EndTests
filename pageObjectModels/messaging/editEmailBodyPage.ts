import { Locator, Page } from '@playwright/test';
import { BaseAdminPage } from '../baseAdminPage';
import { EmailGeneralTab } from '../../componentObjectModels/tabs/emailGeneralTab';

export class EditEmailBodyPage extends BaseAdminPage {
  readonly pathRegex: RegExp;

  readonly generalTabButton: Locator;

  readonly generalTab: EmailGeneralTab;

  constructor(page: Page) {
    super(page);
    this.pathRegex = /\/Admin\/Messaging\/EmailBody\/\d+\/Edit/;
    this.generalTabButton = page.getByRole('tab', { name: 'General' });
    this.generalTab = new EmailGeneralTab(page);
  }
}
