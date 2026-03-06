import { Locator, Page } from '../../fixtures';
import { BaseAdminPage } from '../baseAdminPage';

type SortableGridColumn = 'Name' | 'Username' | 'Email Address' | 'Added';

type SortDirection = 'ascending' | 'descending';

export class SystemAdministratorListingPage extends BaseAdminPage {
  private readonly path: string;
  private readonly getSysAdminListing: string;
  private readonly reportGrid: Locator;
  private readonly reportGridHeader: Locator;
  private readonly reportGridBody: Locator;

  constructor(page: Page) {
    super(page);
    this.path = '/Admin/Reporting/Security/Listing';
    this.getSysAdminListing = '/Admin/Reporting/Security/GetSysadminListingPage';
    this.reportGrid = this.page.locator('#grid');
    this.reportGridHeader = this.reportGrid.locator('.k-grid-header');
    this.reportGridBody = this.reportGrid.locator('.k-grid-content');
  }

  async goto() {
    const response = this.page.waitForResponse(this.getSysAdminListing);
    await this.page.goto(this.path);
    await response;
  }

  async sortGridBy(column: SortableGridColumn, direction: SortDirection = 'ascending') {
    const columnHeader = this.reportGridHeader.getByRole('columnheader', { name: column });
    let currentSortDirection = await columnHeader.getAttribute('aria-sort');

    while (currentSortDirection !== direction) {
      const sortResponse = this.page.waitForResponse(this.getSysAdminListing);
      await columnHeader.click();
      await sortResponse;

      currentSortDirection = await columnHeader.getAttribute('aria-sort');
    }
  }

  async getRows() {
    return this.reportGridBody.locator('tr').all();
  }
}
