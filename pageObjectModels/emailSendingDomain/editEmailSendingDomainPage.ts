import { Locator, Page } from '../../fixtures';
import { BaseAdminPage } from '../baseAdminPage';

export class EditEmailSendingDomainPage extends BaseAdminPage {
  private readonly domainName: Locator;
  private readonly dnsRecordsGrid: Locator;
  private readonly dnsRecordsGridBody: Locator;
  private readonly ownershipRow: Locator;
  private readonly dkimRow: Locator;
  private readonly returnPathRow: Locator;
  private readonly verifyOwnershipPathRegex: RegExp;
  private readonly verifyDkimPathRegex: RegExp;
  private readonly verifyReturnPathPathRegex: RegExp;
  private readonly verificationFailureDialog: Locator;
  readonly pathRegex: RegExp;

  constructor(page: Page) {
    super(page);
    this.domainName = this.page.locator('.label:has-text("Domain") + .data').locator('.data-text-only');
    this.dnsRecordsGrid = this.page.locator('.label:has-text("DNS Records") + .data').locator('.grid');
    this.dnsRecordsGridBody = this.dnsRecordsGrid.locator('tbody');
    this.ownershipRow = this.dnsRecordsGridBody.locator('tr').nth(1);
    this.dkimRow = this.dnsRecordsGridBody.locator('tr').nth(2);
    this.returnPathRow = this.dnsRecordsGridBody.locator('tr').nth(3);
    this.verifyOwnershipPathRegex = /Admin\/EmailSendingDomain\/\d+\/VerifyOwnership/;
    this.verifyDkimPathRegex = /Admin\/EmailSendingDomain\/\d+\/VerifyDkim/;
    this.verifyReturnPathPathRegex = /Admin\/EmailSendingDomain\/\d+\/VerifyReturnPath/;
    this.verificationFailureDialog = this.page.getByRole('dialog', { name: 'Warning' });
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
    const statusValue = row.locator('td').nth(4).locator('.success');
    return statusValue.isVisible();
  }

  async dnsRecords() {
    const ownershipRecord = await this.getDnsRecordFromRow(this.ownershipRow);
    const dkimRecord = await this.getDnsRecordFromRow(this.dkimRow);
    const returnPathRecord = await this.getDnsRecordFromRow(this.returnPathRow);
    return { ownershipRecord, dkimRecord, returnPathRecord };
  }

  private async verifyDnsRecord(row: Locator, pathRegex: RegExp) {
    const isVerified = await this.isDnsRecordVerified(row);

    if (isVerified) {
      return true;
    }

    const verifyLink = row.getByRole('link', { name: 'Verify' });
    const verificationPromise = this.page.waitForResponse(
      response => response.url().match(pathRegex) != null && response.status() === 200
    );
    await verifyLink.click();
    const response = await verificationPromise;
    const responseData = await response.json();

    if (responseData.success) {
      return true;
    }

    await this.verificationFailureDialog.getByRole('button', { name: 'Close' }).click();

    return false;
  }

  async verifyOwnershipRecord() {
    return this.verifyDnsRecord(this.ownershipRow, this.verifyOwnershipPathRegex);
  }

  async verifyDkimRecord() {
    return this.verifyDnsRecord(this.dkimRow, this.verifyDkimPathRegex);
  }

  async verifyReturnPathRecord() {
    return this.verifyDnsRecord(this.returnPathRow, this.verifyReturnPathPathRegex);
  }
}
