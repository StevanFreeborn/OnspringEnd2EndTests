import { Page } from '../../fixtures';
import { EmailTemplate } from '../../models/emailTemplate';
import { BaseMessageGeneralTab } from './baseMessageGeneralTab';

export class EmailTemplateGeneralTab extends BaseMessageGeneralTab {
  constructor(page: Page) {
    super(page);
  }

  async fillOutForm(emailTemplate: EmailTemplate) {
    await this.nameInput.fill(emailTemplate.name);
    await this.descriptionEditor.fill(emailTemplate.description);
    emailTemplate.status ? await this.enableStatus() : await this.disableStatus();
  }
}
