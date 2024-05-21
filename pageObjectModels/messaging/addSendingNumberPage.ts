import { Locator, Page } from '@playwright/test';
import { RequestNumberDialog } from '../../componentObjectModels/dialogs/requestNumberDialog';
import { SendingNumber } from '../../models/sendingNumber';
import { BaseAdminPage } from '../baseAdminPage';

export class AddSendingNumberPage extends BaseAdminPage {
  readonly path: string;
  readonly saveButton: Locator;
  readonly nameInput: Locator;
  readonly descriptionEditor: Locator;
  readonly defaultCheckbox: Locator;
  readonly requestPhoneNumberLink: Locator;
  readonly smsSendingNumber: Locator;
  readonly requestNumberDialog: RequestNumberDialog;

  constructor(page: Page) {
    super(page);
    this.path = '/Admin/TextSendingNumber/Add';
    this.saveButton = page.getByRole('link', { name: 'Save Changes' });
    this.nameInput = page.getByLabel('Name');
    this.descriptionEditor = page.locator('.content-area.mce-content-body');
    this.defaultCheckbox = page.getByRole('checkbox');
    this.requestPhoneNumberLink = page.getByRole('link', { name: 'Request Phone Number' });
    this.smsSendingNumber = page.locator('#form-selected-number');
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
