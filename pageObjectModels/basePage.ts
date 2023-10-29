import { Page } from '@playwright/test';
import { SidebarNavComponent } from '../componentObjectModels/sidebarNavComponent';

export class BasePage {
  readonly page: Page;
  readonly sidebar: SidebarNavComponent;

  constructor(page: Page) {
    this.page = page;
    this.sidebar = new SidebarNavComponent(page);
  }
}
