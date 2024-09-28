import { Locator, Page } from '@playwright/test';
import { EmailPriority } from '../../models/emailBody';
import { EmailAddressControl } from '../controls/emailAddressControl';

export class EmailSenderTab {
  readonly fromNameInput: Locator;
  private readonly fromAddressControl: EmailAddressControl;
  private readonly prioritySelect: Locator;

  constructor(page: Page) {
    this.fromNameInput = page.getByLabel('From Name');
    this.fromAddressControl = new EmailAddressControl(page.locator('.from-email-container'));
    this.prioritySelect = page.getByRole('listbox', { name: 'Priority' });
  }

  async selectPriority(priority: EmailPriority) {
    await this.prioritySelect.click();
    await this.prioritySelect.page().getByRole('option', { name: priority }).click();
  }

  async enterFromAddress(address: string) {
    await this.fromAddressControl.enterAddress(address);
  }
}
