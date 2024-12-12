import { Locator, Page } from '@playwright/test';
import { WaitForOptions } from '../../utils';

export class UserMenu {
  private readonly menu: Locator;
  readonly profileLink: Locator;
  readonly preferencesLink: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.menu = page.locator('#user-menu');
    this.profileLink = this.menu.getByText('Profile');
    this.preferencesLink = this.menu.getByText('Preferences');
    this.logoutLink = this.menu.getByText('Log Out');
  }

  async waitFor(options?: WaitForOptions) {
    await this.menu.waitFor(options);
  }
}
