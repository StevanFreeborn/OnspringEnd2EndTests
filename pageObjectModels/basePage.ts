import { Locator, Page } from '@playwright/test';
import { SidebarNav } from '../componentObjectModels/navs/sidebarNav';

export abstract class BasePage {
  readonly page: Page;
  readonly sidebar: SidebarNav;
  readonly copyrightPatentInfo: Locator;

  protected constructor(page: Page) {
    this.page = page;
    this.sidebar = new SidebarNav(page);
    this.copyrightPatentInfo = this.page.getByText('U.S. Patent No. 11,507,628');
  }
}
