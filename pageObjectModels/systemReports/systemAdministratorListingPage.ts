import { DateFieldControl } from '../../componentObjectModels/controls/dateFieldControl';
import { Locator, Page } from '../../fixtures';
import { BaseAdminPage } from '../baseAdminPage';

type SystemAdministratorListingDateFilter =
  | {
      type:
        | 'All Dates'
        | 'Last 24 Hours'
        | 'Last 2 Days'
        | 'Last 5 Days'
        | 'Last 7 Days'
        | 'Last 14 Days'
        | 'Last Month';
    }
  | {
      type: 'Custom Dates';
      from: Date;
      to: Date;
    };

type SystemAdministratorListingFilter = {
  dateFilter?: SystemAdministratorListingDateFilter;
};

type SortableGridColumn = 'Name' | 'Username' | 'Email Address' | 'Added';

type SortDirection = 'ascending' | 'descending';

export class SystemAdministratorListingPage extends BaseAdminPage {
  private readonly path: string;
  private readonly getSysAdminListingPath: string;
  private readonly reportGrid: Locator;
  private readonly reportGridHeader: Locator;
  private readonly reportGridBody: Locator;
  private readonly exportReportButton: Locator;
  private readonly exportReportDialog: Locator;
  private readonly dateFilterSelector: Locator;
  private readonly fromDateControl: DateFieldControl;
  private readonly toDateControl: DateFieldControl;

  constructor(page: Page) {
    super(page);
    this.path = '/Admin/Reporting/Security/Listing';
    this.getSysAdminListingPath = '/Admin/Reporting/Security/GetSysadminListingPage';
    this.reportGrid = this.page.locator('#grid');
    this.reportGridHeader = this.reportGrid.locator('.k-grid-header');
    this.reportGridBody = this.reportGrid.locator('.k-grid-content');
    this.exportReportButton = this.page.getByRole('link', { name: 'Export Report' });
    this.exportReportDialog = this.page.getByRole('dialog', { name: 'Export Report' });
    this.dateFilterSelector = this.page.locator('.label:has-text("Date") + .data').getByRole('listbox');
    this.fromDateControl = new DateFieldControl(this.page.locator('.k-datetimepicker').first());
    this.toDateControl = new DateFieldControl(this.page.locator('.k-datetimepicker').last());
  }

  async goto() {
    const response = this.page.waitForResponse(this.getSysAdminListingPath);
    await this.page.goto(this.path);
    await response;
  }

  private async filterSystemAdministratorListing(action: () => Promise<void>) {
    const getLoginHistoryDataResponse = this.page.waitForResponse(this.getSysAdminListingPath);
    await action();
    await getLoginHistoryDataResponse;
  }

  private async selectDateFilter(type: string) {
    const currentValue = await this.dateFilterSelector.textContent();

    if (currentValue?.toLowerCase().includes(type.toLowerCase())) {
      return;
    }

    await this.filterSystemAdministratorListing(async () => {
      await this.dateFilterSelector.click();
      await this.page.getByRole('option', { name: type }).click();
    });
  }

  private async enterFromDate(date: Date) {
    await this.filterSystemAdministratorListing(async () => {
      await this.fromDateControl.enterDate(date);
    });
  }

  private async enterToDate(date: Date) {
    await this.filterSystemAdministratorListing(async () => {
      await this.toDateControl.enterDate(date);
    });
  }

  async sortGridBy(column: SortableGridColumn, direction: SortDirection = 'ascending') {
    const columnHeader = this.reportGridHeader.getByRole('columnheader', { name: column });
    let currentSortDirection = await columnHeader.getAttribute('aria-sort');

    while (currentSortDirection !== direction) {
      const sortResponse = this.page.waitForResponse(this.getSysAdminListingPath);
      await columnHeader.click();
      await sortResponse;

      currentSortDirection = await columnHeader.getAttribute('aria-sort');
    }
  }

  async getRows() {
    return this.reportGridBody.locator('tr').all();
  }

  async getRowByText(name: string | RegExp) {
    return this.reportGridBody.getByRole('row', { name });
  }

  async exportReport() {
    await this.exportReportButton.click();
    await this.exportReportDialog.waitFor();
    await this.exportReportDialog.getByRole('button', { name: 'Export' }).click();
  }

  async filterReport({ dateFilter = { type: 'All Dates' } }: SystemAdministratorListingFilter) {
    await this.selectDateFilter(dateFilter.type);

    if (dateFilter.type === 'Custom Dates') {
      await this.enterFromDate(dateFilter.from);
      await this.enterToDate(dateFilter.to);
    }
  }
}
