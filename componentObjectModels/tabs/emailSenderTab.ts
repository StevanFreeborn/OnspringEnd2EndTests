import { Locator, Page } from '@playwright/test';
import { EmailPriority } from '../../models/emailBody';

export class EmailSenderTab {
  readonly fromNameInput: Locator;
  private readonly fromAddress: Locator;
  private readonly prioritySelect: Locator;

  constructor(page: Page) {
    this.fromNameInput = page.getByLabel('From Name');
    this.fromAddress = page.locator('.from-email-container');
    this.prioritySelect = page.getByRole('listbox', { name: 'Priority' });
  }

  async selectPriority(priority: EmailPriority) {
    await this.prioritySelect.click();
    await this.prioritySelect.page().getByRole('option', { name: priority }).click();
  }

  async enterFromAddress(address: string) {
    const [username, domain] = address.split('@');

    if (username === undefined || domain === undefined) {
      throw new Error('Address must be in the format "username@domain"');
    }

    const fromAddressInput = this.fromAddress.locator('#local-part');
    await fromAddressInput.fill(username);

    const domainSelect = this.fromAddress.getByRole('listbox', { includeHidden: true });

    const domainEditable = await domainSelect.isVisible();
    const selectedDomain = await domainSelect.innerText();

    if (selectedDomain.includes(domain)) {
      return;
    }

    if (domainEditable === false) {
      throw new Error('Domain is not editable');
    }

    await domainSelect.click();
    await domainSelect.page().getByRole('option', { name: domain }).click();
  }
}
