import { Locator, Page } from '@playwright/test';
import { EmailTemplateGeneralTab } from '../../componentObjectModels/tabs/emailTemplateGeneralTab';
import { EmailTemplate } from '../../models/emailTemplate';
import { BaseAdminPage } from '../baseAdminPage';

export class EditEmailTemplatePage extends BaseAdminPage {
  private readonly saveButton: Locator;
  readonly pathRegex: RegExp;
  readonly generalTabButton: Locator;
  readonly generalTab: EmailTemplateGeneralTab;

  constructor(page: Page) {
    super(page);
    this.saveButton = this.page.getByRole('link', { name: 'Save Changes' });
    this.pathRegex = /\/Admin\/Messaging\/Template\/\d+\/Edit/;
    this.generalTabButton = this.page.getByRole('tab', { name: 'General' });
    this.generalTab = new EmailTemplateGeneralTab(this.page);
  }

  async goto(id: number) {
    await this.page.goto(`/Admin/Messaging/Template/${id}/Edit`);
  }

  getIdFromUrl() {
    if (this.page.url().match(this.pathRegex) === null) {
      throw new Error('The current page is not an email template edit page.');
    }

    const url = this.page.url();
    const urlParts = url.split('/');
    const id = urlParts[urlParts.length - 2];
    return parseInt(id);
  }

  async updateTemplate(emailTemplate: EmailTemplate) {
    await this.generalTab.fillOutForm(emailTemplate);
  }

  async save() {
    const saveResponse = this.page.waitForResponse(
      response => response.url().match(this.pathRegex) !== null && response.request().method() === 'POST'
    );
    await this.saveButton.click();
    await saveResponse;
  }
}
