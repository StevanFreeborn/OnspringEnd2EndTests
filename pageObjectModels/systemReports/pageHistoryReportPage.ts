import { DateFieldControl } from '../../componentObjectModels/controls/dateFieldControl';
import { Locator, Page } from '../../fixtures';
import { BaseAdminPage } from '../baseAdminPage';

type PageHistoryDateFilter =
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

type PageHistoryFilter = {
  user?: string;
  httpMethod?: 'All HTTP Methods' | 'GET' | 'POST';
  dateFilter?: PageHistoryDateFilter;
};

type SortDirection = 'ascending' | 'descending';

export class PageHistoryReportPage extends BaseAdminPage {
  private readonly path: string;
  private readonly getPageHistoryPath: string;
  private readonly usersSelector: Locator;
  private readonly httpMethodSelector: Locator;
  private readonly dateFilterSelector: Locator;
  private readonly fromDateControl: DateFieldControl;
  private readonly toDateControl: DateFieldControl;
  private readonly exportReportLink: Locator;
  private readonly reportGridHeader: Locator;
  private readonly reportGridBody: Locator;

  constructor(page: Page) {
    super(page);
    this.path = '/Admin/Reporting/Security/PageHistory';
    this.getPageHistoryPath = '/Admin/Reporting/Security/GetPageHistoryPage';
    this.usersSelector = this.page.locator('.label:has-text("User") + .data').getByRole('listbox');
    this.httpMethodSelector = this.page.locator('.label:has-text("HTTP Method") + .data').getByRole('listbox');
    this.dateFilterSelector = this.page.locator('.label:has-text("Date") + .data').getByRole('listbox');
    this.fromDateControl = new DateFieldControl(this.page.locator('.k-datetimepicker').first());
    this.toDateControl = new DateFieldControl(this.page.locator('.k-datetimepicker').last());
    this.exportReportLink = this.page.getByRole('link', { name: 'Export Report' });
    this.reportGridHeader = this.page.locator('#grid .k-grid-header');
    this.reportGridBody = this.page.locator('#grid .k-grid-content');
  }

  async goto() {
    const response = this.page.waitForResponse(this.getPageHistoryPath);
    await this.page.goto(this.path);
    await response;
  }

  private async filterPageHistory(action: () => Promise<void>) {
    const getPageHistoryDataResponse = this.page.waitForResponse(this.getPageHistoryPath);
    await action();
    await getPageHistoryDataResponse;
  }

  private async selectDateFilter(type: string) {
    const currentValue = await this.dateFilterSelector.textContent();

    if (currentValue?.toLowerCase().includes(type.toLowerCase())) {
      return;
    }

    await this.filterPageHistory(async () => {
      await this.dateFilterSelector.click();
      await this.page.getByRole('option', { name: type }).click();
    });
  }

  private async selectUser(user: string) {
    const currentValue = await this.usersSelector.textContent();

    if (currentValue?.toLowerCase().includes(user.toLowerCase())) {
      return;
    }

    await this.filterPageHistory(async () => {
      await this.usersSelector.click();
      await this.page.getByRole('option', { name: user }).click();
    });
  }

  private async selectHttpMethod(method: string) {
    const currentValue = await this.httpMethodSelector.textContent();

    if (currentValue?.toLowerCase().includes(method.toLowerCase())) {
      return;
    }

    await this.filterPageHistory(async () => {
      await this.httpMethodSelector.click();
      await this.page.getByRole('option', { name: method }).click();
    });
  }

  private async enterFromDate(date: Date) {
    await this.filterPageHistory(async () => {
      await this.fromDateControl.enterDate(date);
    });
  }

  private async enterToDate(date: Date) {
    await this.filterPageHistory(async () => {
      await this.toDateControl.enterDate(date);
    });
  }

  async filterReport({
    user = 'All Users',
    httpMethod = 'All HTTP Methods',
    dateFilter = { type: 'All Dates' },
  }: PageHistoryFilter) {
    await this.selectUser(user);
    await this.selectHttpMethod(httpMethod);
    await this.selectDateFilter(dateFilter.type);

    if (dateFilter.type === 'Custom Dates') {
      await this.enterFromDate(dateFilter.from);
      await this.enterToDate(dateFilter.to);
    }
  }

  async exportReport() {
    await this.exportReportLink.click();
    const dialog = this.page.getByRole('dialog', { name: 'Export Report' });
    await dialog.getByRole('button', { name: 'Export' }).click();
    await dialog.getByRole('button', { name: 'Close' }).click();
  }

  getReportRows() {
    return this.reportGridBody.locator('tr').all();
  }

  async sortGridBy(columnName: string, direction: SortDirection = 'ascending') {
    const header = this.reportGridHeader.getByRole('columnheader', { name: columnName });
    let currentSortDirection = await header.getAttribute('aria-sort');

    while (currentSortDirection !== direction) {
      const sortResponse = this.page.waitForResponse(this.getPageHistoryPath);
      await header.click();
      await sortResponse;

      currentSortDirection = await header.getAttribute('aria-sort');
    }
  }
}
