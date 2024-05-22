import { Locator, Page } from '@playwright/test';
import { RequestNumberDialog } from '../../componentObjectModels/dialogs/requestNumberDialog';
import { SendingNumber } from '../../models/sendingNumber';
import { BaseSendingNumberPage } from './baseSendingNumberPage';

export class AddSendingNumberPage extends BaseSendingNumberPage {
  readonly path: string;
  readonly requestPhoneNumberLink: Locator;
  readonly requestNumberDialog: RequestNumberDialog;

  constructor(page: Page) {
    super(page);
    this.path = '/Admin/TextSendingNumber/Add';
    this.requestPhoneNumberLink = page.getByRole('link', { name: 'Request Phone Number' });
    this.requestNumberDialog = new RequestNumberDialog(page);
  }

  async goto() {
    await this.page.goto(this.path);
  }

  async fillOutForm(sendingNumber: SendingNumber) {
    await this.nameInput.fill(sendingNumber.name);
    await this.descriptionEditor.fill(sendingNumber.description);

    const defaultCheckboxDisabled = await this.defaultCheckbox.isDisabled();

    if (defaultCheckboxDisabled === false) {
      await this.defaultCheckbox.setChecked(sendingNumber.isDefault);
    }

    await this.requestPhoneNumberLink.click();
    await this.requestNumberDialog.fillOutForm(sendingNumber);
    await this.requestNumberDialog.acceptButton.click();

    const number = await this.smsSendingNumber.textContent();

    if (number === null) {
      throw new Error('The sending number was not set.');
    }

    return number;
  }
}
