import { DateFieldControl } from '../../componentObjectModels/controls/dateFieldControl';
import { Locator, Page } from '../../fixtures';
import { BaseAdminPage } from '../baseAdminPage';

type LoginHistoryFilter = {
  type: '';
};

export class LoginHistory extends BaseAdminPage {
  private readonly path: string;
  private readonly usersSelector: Locator;
  private readonly displayOnlyLoggedInUsersCheckbox: Locator;
  private readonly dateFilterSelector: Locator;
  private readonly fromDateControl: DateFieldControl;
  private readonly toDateControl: DateFieldControl;

  constructor(page: Page) {
    super(page);
    this.path = '/Admin/Reporting/Security/LoginHistory';
    this.usersSelector = this.page.locator('.label:has-text("Users") + .data').getByRole('listbox');
    this.displayOnlyLoggedInUsersCheckbox = this.page.getByRole('checkbox', {
      name: 'Display users currently logged in',
    });
    this.dateFilterSelector = this.page.locator('.label:has-text("Date") + .data').getByRole('listbox');
    this.fromDateControl = new DateFieldControl(this.page.locator('.k-datetimepicker').first());
    this.toDateControl = new DateFieldControl(this.page.locator('.k-datetimepicker').last());
  }

  async goto() {
    await this.page.goto(this.path);
  }

  private async selectUser(user: string) {
    await this.usersSelector.click();
    await this.page.getByRole('option', { name: user }).click();
  }
}
