import { Locator } from '@playwright/test';

export class EmailAddressControl {
  private readonly container: Locator;

  constructor(container: Locator) {
    this.container = container;
  }

  async enterAddress(address: string) {
    const [username, domain] = address.split('@');

    if (username === undefined || domain === undefined) {
      throw new Error('Address must be in the format "username@domain"');
    }

    const fromAddressInput = this.container.locator('#local-part');
    await fromAddressInput.fill(username);

    const domainSelect = this.container.getByRole('listbox', { includeHidden: true });

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
