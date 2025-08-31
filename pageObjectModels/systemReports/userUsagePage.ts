import { Locator, Page } from '../../fixtures';
import { BaseAdminPage } from '../baseAdminPage';

type UserTier = 'Full User' | 'Portal User' | 'Lite User';
type UserStatus = 'Active' | 'Inactive';
type SortableGridColumn = 'Full Name' | 'Username' | 'Email Address';
type SortDirection = 'ascending' | 'descending';

export class UserUsagePage extends BaseAdminPage {
  private readonly getUsagePath: string;
  private readonly nameInput: Locator;
  private readonly statusSelector: Locator;
  private readonly tierSelector: Locator;
  private readonly grid: Locator;
  private readonly gridHeader: Locator;
  private readonly gridBody: Locator;
  readonly path: string;

  constructor(page: Page) {
    super(page);
    this.getUsagePath = '/Admin/Reporting/Apps/GetUserUsagePage';
    this.path = '/Admin/Reporting/Apps/UserUsage';
    this.nameInput = this.page.locator('.label:has-text("Filter by Name") + .data').getByRole('textbox');
    this.statusSelector = this.page.locator('.label:has-text("Filter by Status") + .data').getByRole('listbox');
    this.tierSelector = this.page.locator('.label:has-text("Filter by User Tier") + .data').getByRole('listbox');
    this.grid = this.page.locator('#grid');
    this.gridHeader = this.grid.locator('.k-grid-header');
    this.gridBody = this.grid.locator('.k-grid-content');
  }

  async goto() {
    const response = this.page.waitForResponse(this.getUsagePath);
    await this.page.goto(this.path);
    await response;
  }

  private async filterUsage(action: () => Promise<void>) {
    const getUsageResponse = this.page.waitForResponse(this.getUsagePath);
    await action();
    await getUsageResponse;
  }

  private async hasSameValue(value: string, locator: Locator) {
    const currentValue = await locator.textContent();
    return currentValue?.toLowerCase().trim() === value.toLowerCase().trim();
  }

  private async selectStatus(status: UserStatus) {
    await this.statusSelector.click();
    await this.page.getByRole('option', { name: status, exact: true }).click();
  }

  private async selectTier(tier: UserTier) {
    await this.tierSelector.click();
    await this.page.getByRole('option', { name: tier }).click();
  }

  private async filterByName(name: string) {
    if (await this.hasSameValue(name, this.nameInput)) {
      return;
    }

    await this.filterUsage(async () => {
      await this.nameInput.fill(name);
    });
  }

  private async filterByStatus(status: UserStatus) {
    if (await this.hasSameValue(status, this.statusSelector)) {
      return;
    }

    await this.filterUsage(async () => {
      await this.selectStatus(status);
    });
  }

  private async filterByTier(tier: UserTier) {
    if (await this.hasSameValue(tier, this.tierSelector)) {
      return;
    }

    await this.filterUsage(async () => {
      await this.selectTier(tier);
    });
  }

  async filterReport({
    name = '',
    status = 'Inactive',
    tier = 'Full User',
  }: {
    name?: string;
    status?: UserStatus;
    tier?: UserTier;
  }) {
    await this.filterByName(name);
    await this.filterByStatus(status);
    await this.filterByTier(tier);
  }

  async sortGridBy(column: SortableGridColumn, direction: SortDirection = 'ascending') {
    const columnHeader = this.gridHeader.getByRole('columnheader', { name: column });
    let currentSortDirection = await columnHeader.getAttribute('aria-sort');

    while (currentSortDirection !== direction) {
      const sortResponse = this.page.waitForResponse(this.getUsagePath);
      await columnHeader.click();
      await sortResponse;

      currentSortDirection = await columnHeader.getAttribute('aria-sort');
    }
  }

  async getRows() {
    return this.gridBody.locator('tr').all();
  }

  async getRowByName(name: string | RegExp) {
    return this.gridBody.getByRole('row', { name });
  }
}
