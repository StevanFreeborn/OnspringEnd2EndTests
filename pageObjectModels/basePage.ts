import { Page } from '@playwright/test';
import { SidebarNav } from '../componentObjectModels/navs/sidebarNav';

export class BasePage {
  readonly page: Page;
  readonly sidebar: SidebarNav;

  protected constructor(page: Page) {
    this.page = page;
    this.sidebar = new SidebarNav(page);
  }
}
