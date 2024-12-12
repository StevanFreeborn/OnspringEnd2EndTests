import { Locator } from '@playwright/test';

export class DashboardActionMenu {
  private readonly menu: Locator;
  readonly editDashboardLink: Locator;
  readonly printDashboardLink: Locator;
  readonly exportDashboardLink: Locator;
  readonly getDashboardUrlLink: Locator;

  constructor(menu: Locator) {
    this.menu = menu;
    this.editDashboardLink = this.menu.getByText('Edit Dashboard');
    this.printDashboardLink = this.menu.getByText('Print Dashboard');
    this.exportDashboardLink = this.menu.getByText('Export Dashboard');
    this.getDashboardUrlLink = this.menu.getByText('Get Dashboard Link');
  }
}
