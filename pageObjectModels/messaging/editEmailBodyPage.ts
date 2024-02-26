import { Locator, Page } from '@playwright/test';
import { EmailContentsTab } from '../../componentObjectModels/tabs/emailContentsTab';
import { EmailGeneralTab } from '../../componentObjectModels/tabs/emailGeneralTab';
import { EmailBody } from '../../models/emailBody';
import { BaseAdminPage } from '../baseAdminPage';

export class EditEmailBodyPage extends BaseAdminPage {
  readonly pathRegex: RegExp;

  readonly generalTabButton: Locator;
  readonly contentsTabButton: Locator;

  readonly generalTab: EmailGeneralTab;
  readonly contentsTab: EmailContentsTab;

  constructor(page: Page) {
    super(page);
    this.pathRegex = /\/Admin\/Messaging\/EmailBody\/\d+\/Edit/;

    this.generalTabButton = page.getByRole('tab', { name: 'General' });
    this.contentsTabButton = page.getByRole('tab', { name: 'Contents' });

    this.generalTab = new EmailGeneralTab(page);
    this.contentsTab = new EmailContentsTab(page);
  }

  async updateEmailBody(emailBody: EmailBody) {
    throw new Error('Not implemented');
  }
}
