import { Locator, Page } from '@playwright/test';
import { SendingNumber } from '../../models/sendingNumber';

export class RequestNumberDialog {
  private readonly requestNumberPath: string;
  private readonly dialog: Locator;
  private readonly countrySelector: Locator;
  private readonly digitPatternSelector: Locator;
  private readonly digitPatternInput: Locator;
  private readonly findNumberLink: Locator;
  readonly acceptButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.requestNumberPath = '/Admin/TextSendingNumber/RequestNumber';
    this.dialog = page.getByRole('dialog', { name: 'Request Phone Number' });
    this.countrySelector = this.dialog.locator('.label:has-text("Country") + .data').getByRole('listbox');
    this.digitPatternSelector = this.dialog.locator('.label:has-text("Digit Pattern") + .data').getByRole('listbox');
    this.digitPatternInput = this.dialog.locator('.label:has-text("Digit Pattern") + .data').getByRole('textbox');
    this.findNumberLink = this.dialog.getByRole('link', { name: 'Find a Matching Number' });
    this.acceptButton = this.dialog.getByRole('button', { name: 'Accept' });
    this.cancelButton = this.dialog.getByRole('button', { name: 'Cancel' });
  }

  async fillOutForm(sendingNumber: SendingNumber) {
    const page = this.dialog.page();

    await this.countrySelector.click();
    await page.getByRole('option', { name: sendingNumber.country }).click();

    await this.digitPatternSelector.click();
    await page.getByRole('option', { name: sendingNumber.digitPattern }).click();

    await this.digitPatternInput.fill(sendingNumber.digits);

    const findNumberResponse = page.waitForResponse(this.requestNumberPath);
    await this.findNumberLink.click();
    await findNumberResponse;
  }
}
