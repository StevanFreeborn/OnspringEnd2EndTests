import { Locator } from '@playwright/test';

export class DashboardActionMenu {
  private readonly menu: Locator;
  readonly editDashboardLink: Locator;

  constructor(menu: Locator) {
    this.menu = menu;
    this.editDashboardLink = this.menu.getByText('Edit Dashboard');
  }
}
