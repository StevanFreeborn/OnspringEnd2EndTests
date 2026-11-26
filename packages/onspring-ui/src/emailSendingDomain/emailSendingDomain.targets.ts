import { Locator, Page } from '@playwright/test';
import { Target } from '@stevanfreeborn/screenplay-playwright';

export const EmailSendingDomainPageTargets = {
  route: '/Admin/EmailSendingDomain',
  getListPagePath: '/Admin/EmailSendingDomain/GetListPage',
  deletePathRegex: /Admin\/EmailSendingDomain\/\d+\/Delete/,
  grid: (page: Page): Locator => page.locator('#grid'),
  gridScrollableContent: (page: Page): Locator => page.locator('#grid .k-grid-content.k-auto-scrollable').first(),
  gridPagerInfo: (page: Page): Locator => page.locator('#grid .k-pager-info').first(),
  createButton: (page: Page): Locator => page.getByRole('button', { name: 'Create Email Sending Domain' }),
  domainInput: (page: Page): Locator => page.locator('input#Domain'),
  rowByName:
    (domain: string): Target =>
    (page: Page): Locator =>
      page.locator('#grid').getByRole('row', { name: domain }).first(),
  deleteButtonInRow:
    (domain: string): Target =>
    (page: Page): Locator =>
      page.locator('#grid').getByRole('row', { name: domain }).first().getByTitle('Delete Email Sending Domain'),
};

export const EditEmailSendingDomainPageTargets = {
  pathRegex: /Admin\/EmailSendingDomain\/\d+\/Details/,
  domainName: (page: Page): Locator => page.locator('.label:has-text("Domain") + .data .data-text-only'),
  dnsRecordsGrid: (page: Page): Locator => page.locator('.label:has-text("DNS Records") + .data .grid'),
  ownershipRow: (page: Page): Locator => page.locator('.label:has-text("DNS Records") + .data .grid tbody tr').nth(1),
  dkimRow: (page: Page): Locator => page.locator('.label:has-text("DNS Records") + .data .grid tbody tr').nth(2),
  returnPathRow: (page: Page): Locator => page.locator('.label:has-text("DNS Records") + .data .grid tbody tr').nth(3),
  recordCell:
    (recordType: 'ownership' | 'dkim' | 'returnPath', cellIndex: number): Target =>
    (page: Page): Locator => {
      const rowIndex = recordType === 'ownership' ? 1 : recordType === 'dkim' ? 2 : 3;
      return page
        .locator('.label:has-text("DNS Records") + .data .grid tbody tr')
        .nth(rowIndex)
        .locator('td')
        .nth(cellIndex);
    },
  recordTypeRow:
    (recordType: 'ownership' | 'dkim' | 'returnPath'): Target =>
    (page: Page): Locator => {
      const index = recordType === 'ownership' ? 1 : recordType === 'dkim' ? 2 : 3;
      return page.locator('.label:has-text("DNS Records") + .data .grid tbody tr').nth(index);
    },
  recordStatusSuccess:
    (recordType: 'ownership' | 'dkim' | 'returnPath'): Target =>
    (page: Page): Locator => {
      const index = recordType === 'ownership' ? 1 : recordType === 'dkim' ? 2 : 3;
      return page
        .locator('.label:has-text("DNS Records") + .data .grid tbody tr')
        .nth(index)
        .locator('td')
        .nth(4)
        .locator('.success');
    },
  recordVerifyLink:
    (recordType: 'ownership' | 'dkim' | 'returnPath'): Target =>
    (page: Page): Locator => {
      const index = recordType === 'ownership' ? 1 : recordType === 'dkim' ? 2 : 3;
      return page
        .locator('.label:has-text("DNS Records") + .data .grid tbody tr')
        .nth(index)
        .getByRole('link', { name: 'Verify' });
    },
  verifyOwnershipPathRegex: /Admin\/EmailSendingDomain\/\d+\/VerifyOwnership/,
  verifyDkimPathRegex: /Admin\/EmailSendingDomain\/\d+\/VerifyDkim/,
  verifyReturnPathPathRegex: /Admin\/EmailSendingDomain\/\d+\/VerifyReturnPath/,
  verificationFailureDialog: (page: Page): Locator => page.getByRole('dialog', { name: 'Warning' }),
  verificationFailureDialogCloseButton: (page: Page): Locator =>
    page.getByRole('dialog', { name: 'Warning' }).getByRole('button', { name: 'Close' }),
};
