import { Locator, Page } from '@playwright/test';
import { UserMenu } from '../menus/userMenu';
import { UserPreferencesModal } from '../modals/userPreferencesModal';

// TODO: Rename as primary nav cause their are multiple navs and now this one can be left or top
export class SidebarNav {
  readonly page: Page;
  readonly usersFullName: Locator;
  readonly adminGearIcon: Locator;
  readonly pinnedContent: Locator;
  private readonly userImage: Locator;
  private readonly userMenu: UserMenu;
  private readonly userPreferenceModal: UserPreferencesModal;

  constructor(page: Page) {
    this.page = page;
    this.usersFullName = page.locator('#user-name');
    this.adminGearIcon = page.locator('#admin-tab');
    this.pinnedContent = page.locator('#pinned-items');
    this.userImage = page.locator('#user-image');
    this.userMenu = new UserMenu(page);
    this.userPreferenceModal = new UserPreferencesModal(page);
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
  }
}
