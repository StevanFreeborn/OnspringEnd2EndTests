import { DateFieldControl } from '../../componentObjectModels/controls/dateFieldControl';
import { Locator, Page } from '../../fixtures';
import { BaseAdminPage } from '../baseAdminPage';

type LoginHistoryDateFilter =
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

type LoginHistoryFilter = {
  user?: string;
  displayLoggedInUsersOnly?: boolean;
  dateFilter?: LoginHistoryDateFilter;
};

export class LoginHistoryPage extends BaseAdminPage {
  private readonly path: string;
  private readonly getLoginHistoryPath: string;
  private readonly usersSelector: Locator;
  private readonly displayOnlyLoggedInUsersCheckbox: Locator;
  private readonly dateFilterSelector: Locator;
  private readonly fromDateControl: DateFieldControl;
  private readonly toDateControl: DateFieldControl;
  private readonly exportReportLink: Locator;
  private readonly reportGridBody: Locator;

  constructor(page: Page) {
    super(page);
    this.path = '/Admin/Reporting/Security/LoginHistory';
    this.getLoginHistoryPath = '/Admin/Reporting/Security/GetLoginHistory';
    this.usersSelector = this.page.locator('.label:has-text("User") + .data').getByRole('listbox');
    this.displayOnlyLoggedInUsersCheckbox = this.page.getByRole('checkbox', {
      name: 'Display users currently logged in',
    });
    this.dateFilterSelector = this.page.locator('.label:has-text("Date") + .data').getByRole('listbox');
    this.fromDateControl = new DateFieldControl(this.page.locator('.k-datetimepicker').first());
    this.toDateControl = new DateFieldControl(this.page.locator('.k-datetimepicker').last());
    this.exportReportLink = this.page.getByRole('link', { name: 'Export' });
    this.reportGridBody = this.page.locator('#login-grid .k-grid-content');
  }

  async goto() {
    await this.page.goto(this.path);
  }

  private async filterLoginHistory(action: () => Promise<void>) {
    const getLoginHistoryDataResponse = this.page.waitForResponse(this.getLoginHistoryPath);
    await action();
    await getLoginHistoryDataResponse;
  }

  private async selectDateFilter(type: string) {
    const currentValue = await this.dateFilterSelector.textContent();

    if (currentValue?.toLowerCase().includes(type.toLowerCase())) {
      return;
    }

    await this.filterLoginHistory(async () => {
      await this.dateFilterSelector.click();
      await this.page.getByRole('option', { name: type }).click();
    });
  }

  private async selectUser(user: string) {
    const currentValue = await this.usersSelector.textContent();

    if (currentValue?.toLowerCase().includes(user.toLowerCase())) {
      return;
    }

    await this.filterLoginHistory(async () => {
      await this.usersSelector.click();
      await this.page.getByRole('option', { name: user }).click();
    });
  }

  private async enterFromDate(date: Date) {
    await this.filterLoginHistory(async () => {
      await this.fromDateControl.enterDate(date);
    });
  }

  private async enterToDate(date: Date) {
    await this.filterLoginHistory(async () => {
      await this.toDateControl.enterDate(date);
    });
  }

  async filterReport({
    user = 'All Users',
    displayLoggedInUsersOnly = false,
    dateFilter = { type: 'All Dates' },
  }: LoginHistoryFilter) {
    await this.displayOnlyLoggedInUsersCheckbox.setChecked(displayLoggedInUsersOnly);

    if (displayLoggedInUsersOnly === true) {
      return;
    }

    await this.selectUser(user);

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

  getReportRowsByText(query: string) {
    return this.reportGridBody.locator('tr', { hasText: new RegExp(query, 'i') }).all();
  }
}
