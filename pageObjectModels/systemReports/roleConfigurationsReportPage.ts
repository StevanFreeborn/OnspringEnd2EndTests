import { Locator, Page } from '../../fixtures';
import { BaseAdminPage } from '../baseAdminPage';

type RoleConfigurationsStatusFilter = 'All Statuses' | 'Active' | 'Inactive';

type RoleConfigurationsTierFilter = 'All Role Tiers' | 'Full User' | 'Portal User';

type RoleConfigurationsFilter = {
  status?: RoleConfigurationsStatusFilter;
  tier?: RoleConfigurationsTierFilter;
  name?: string;
};

export class RoleConfigurationsReportPage extends BaseAdminPage {
  private readonly path: string;
  private readonly getDataPath: string;
  private readonly statusFilterDropdown: Locator;
  private readonly tierFilterDropdown: Locator;
  private readonly nameFilterInput: Locator;
  private readonly nameFilterClear: Locator;
  private readonly exportButton: Locator;
  private readonly exportDialog: Locator;
  private readonly roleItemsContainer: Locator;
  private readonly roleItemsLoading: Locator;

  constructor(page: Page) {
    super(page);
    this.path = '/Admin/Reporting/Security/RoleConfigurations';
    this.getDataPath = '/Admin/Reporting/Security/GetRoleConfigurationItems';
    this.statusFilterDropdown = this.page.locator('span[aria-owns="statusFilter_listbox"]');
    this.tierFilterDropdown = this.page.locator('span[aria-owns="tierFilter_listbox"]');
    this.nameFilterInput = this.page.locator('#textFilter input[type="text"]');
    this.nameFilterClear = this.page.locator('#textFilter [data-clear]');
    this.exportButton = this.page.getByRole('link', { name: 'Export Report' });
    this.exportDialog = this.page.getByRole('dialog', { name: 'Export Report' });
    this.roleItemsContainer = this.page.locator('#role-item-container');
    this.roleItemsLoading = this.page.locator('#role-items-loading-container');
  }

  async goto() {
    const response = this.page.waitForResponse(this.getDataPath);
    await this.page.goto(this.path);
    await response;
  }

  private async filterRoleConfigurations(action: () => Promise<void>) {
    const response = this.page.waitForResponse(this.getDataPath);
    await action();
    await response;
  }

  async selectStatus(status: RoleConfigurationsStatusFilter) {
    const currentValue = await this.statusFilterDropdown.textContent();

    if (currentValue?.toLowerCase().includes(status.toLowerCase())) {
      return;
    }

    await this.filterRoleConfigurations(async () => {
      await this.statusFilterDropdown.click();
      await this.page.getByRole('option', { name: status }).click();
    });
  }

  async selectTier(tier: RoleConfigurationsTierFilter) {
    const currentValue = await this.tierFilterDropdown.textContent();

    if (currentValue?.toLowerCase().includes(tier.toLowerCase())) {
      return;
    }

    await this.filterRoleConfigurations(async () => {
      await this.tierFilterDropdown.click();
      await this.page.getByRole('option', { name: tier }).click();
    });
  }

  async filterByName(name: string) {
    await this.filterRoleConfigurations(async () => {
      await this.nameFilterInput.fill(name);
    });
  }

  async clearNameFilter() {
    await this.filterRoleConfigurations(async () => {
      await this.nameFilterClear.click();
    });
  }

  async filterReport({ status, tier, name }: RoleConfigurationsFilter) {
    if (status) {
      await this.selectStatus(status);
    }

    if (tier) {
      await this.selectTier(tier);
    }

    if (name !== undefined) {
      if (name === '') {
        await this.clearNameFilter();
      } else {
        await this.filterByName(name);
      }
    }
  }

  async getRoleItemByName(roleName: string) {
    return this.roleItemsContainer.locator('h1', { hasText: roleName }).first();
  }

  async getEditRoleLink(roleName: string) {
    return this.roleItemsContainer.locator(`h1:has-text("${roleName}") a[href*="/Admin/Security/Role/"]`);
  }

  async clickEditRole(roleName: string) {
    await this.filterByName(roleName);
    await this.roleItemsContainer.getByRole('link', { name: 'Edit' }).click();
  }

  async exportReport() {
    await this.exportButton.click();
    await this.exportDialog.waitFor();
    await this.exportDialog.getByRole('button', { name: 'Export' }).click();
  }

  async getRoleItemText(roleName: string) {
    const roleItem = await this.getRoleItemByName(roleName);
    return roleItem.textContent();
  }

  async isRoleItemVisible(roleName: string) {
    const roleItem = await this.getRoleItemByName(roleName);
    return roleItem.isVisible();
  }
}
