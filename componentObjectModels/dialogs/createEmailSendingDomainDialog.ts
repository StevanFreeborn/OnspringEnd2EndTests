import { Locator, Page } from '../../fixtures';
import { BaseCreateOrAddDialogWithSaveButton } from './baseCreateOrAddDialog';

export class CreateEmailSendingDomainDialog extends BaseCreateOrAddDialogWithSaveButton {
  readonly nameInput: Locator;

  constructor(page: Page) {
    super(page);
    this.nameInput = this.page.locator('input#Domain');
  }

  getEmailSendingDomainToCopy(emailSendingDomainToCopy: string) {
    return super.getItemToCopy(emailSendingDomainToCopy);
  }
}
