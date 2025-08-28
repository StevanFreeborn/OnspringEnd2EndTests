import { Locator, Page } from '../../fixtures';
import { BaseAdminPage } from '../baseAdminPage';

export class EditEmailSendingDomainPage extends BaseAdminPage {
  private readonly domainName: Locator;
  private readonly dnsRecordsGrid: Locator;
  private readonly dnsRecordsGridBody: Locator;
  private readonly ownershipRow: Locator;
  private readonly dkimRow: Locator;
  private readonly returnPathRow: Locator;
  readonly pathRegex: RegExp;

  constructor(page: Page) {
    super(page);
    this.domainName = this.page.locator('.label:has-text("Domain") + .data').locator('.data-text-only');
    this.dnsRecordsGrid = this.page.locator('.label:has-text("DNS Records") + .data').locator('.grid');
    this.dnsRecordsGridBody = this.dnsRecordsGrid.locator('tbody');
    this.ownershipRow = this.dnsRecordsGridBody.locator('tr').nth(1);
    this.dkimRow = this.dnsRecordsGridBody.locator('tr').nth(2);
    this.returnPathRow = this.dnsRecordsGridBody.locator('tr').nth(3);
    this.pathRegex = /Admin\/EmailSendingDomain\/\d+\/Details/;
  }

  name() {
    return this.domainName;
  }

  private async getDnsRecordFromRow(row: Locator) {
    const nameColumnIndex = 1;
    const typeColumnIndex = 2;
    const valueColumnIndex = 3;

    const name = await row.locator('td').nth(nameColumnIndex).textContent();
    const type = await row.locator('td').nth(typeColumnIndex).textContent();
    const value = await row.locator('td').nth(valueColumnIndex).textContent();

    if (name === null || type === null || value === null) {
      throw new Error('Failed to extract DNS record information');
    }

    return { name: name.trim(), type: type.trim(), value: value.trim() };
  }

  private async isDnsRecordVerified(row: Locator) {
    const statusValue = await row.locator('td').nth(4).textContent();
    return statusValue?.match(/verified/i) !== null;
  }

  async dnsRecords() {
    const ownershipRecord = await this.getDnsRecordFromRow(this.ownershipRow);
    const dkimRecord = await this.getDnsRecordFromRow(this.dkimRow);
    const returnPathRecord = await this.getDnsRecordFromRow(this.returnPathRow);
    return { ownershipRecord, dkimRecord, returnPathRecord };
  }

  async isOwnershipVerified() {
    return this.isDnsRecordVerified(this.ownershipRow);
  }

  async isDkimVerified() {
    return this.isDnsRecordVerified(this.dkimRow);
  }

  async isReturnPathVerified() {
    return this.isDnsRecordVerified(this.returnPathRow);
  }
}
