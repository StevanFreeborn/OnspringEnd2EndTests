import { Page } from '@playwright/test';
import { BaseCreateOrAddDialogWithSaveButton } from './baseCreateOrAddDialog';

export class CreateEmailTemplateDialog extends BaseCreateOrAddDialogWithSaveButton {
  constructor(page: Page) {
    super(page);
  }

  getEmailTemplateToCopy(emailTemplate: string) {
    return this.getItemToCopy(emailTemplate);
  }
}
