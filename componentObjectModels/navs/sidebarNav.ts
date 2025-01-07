import { Locator, Page } from '@playwright/test';
import { UserMenu } from '../menus/userMenu';
import { UserPreferencesModal } from '../modals/userPreferencesModal';

// TODO: Rename as primary nav cause their are multiple navs and now this one can be left or top
export class SidebarNav {
  readonly page: Page;
  readonly usersFullName: Locator;
  readonly dashboardsTab: Locator;
  readonly adminGearIcon: Locator;
  readonly pinnedContent: Locator;
  private readonly userImage: Locator;
  private readonly userMenu: UserMenu;
  private readonly userPreferenceModal: UserPreferencesModal;
  private readonly containerList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usersFullName = this.page.locator('#user-name');
    this.dashboardsTab = this.page.locator('#dashboard-tab');
    this.adminGearIcon = this.page.locator('#admin-tab');
    this.pinnedContent = this.page.locator('#pinned-items');
    this.userImage = this.page.locator('#user-image');
    this.userMenu = new UserMenu(this.page);
    this.userPreferenceModal = new UserPreferencesModal(page);
    this.containerList = this.page.locator('#container-list');
  }

  async setDefaultDashboard(dashboardName: string) {
    await this.userImage.hover();
    await this.userMenu.waitFor();
    await this.userMenu.preferencesLink.click();
    await this.userPreferenceModal.waitFor();
    await this.userPreferenceModal.selectDefaultDashboard(dashboardName);
    await this.userPreferenceModal.save();
  }

  async logout() {
    await this.userImage.hover();
    await this.userMenu.waitFor();
    await this.userMenu.logoutLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getContainerLink(containerName: string) {
    return this.containerList.getByRole('link', { name: containerName });
  }
}
