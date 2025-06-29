import { Locator, Page } from '@playwright/test';
import { EmailTemplateGeneralTab } from '../../componentObjectModels/tabs/emailTemplateGeneralTab';
import { BaseAdminPage } from '../baseAdminPage';

export class EditEmailTemplatePage extends BaseAdminPage {
  readonly pathRegex: RegExp;
  readonly generalTabButton: Locator;
  readonly generalTab: EmailTemplateGeneralTab;

  constructor(page: Page) {
    super(page);
    this.pathRegex = /\/Admin\/Messaging\/Template\/\d+\/Edit/;
    this.generalTabButton = this.page.getByRole('tab', { name: 'General' });
    this.generalTab = new EmailTemplateGeneralTab(this.page);
  }

  async goto(id: number) {
    await this.page.goto(`/Admin/Messaging/Template/${id}/Edit`);
  }
}
