import { Locator, Page } from '@playwright/test';
import { AppGeneralTabComponent } from '../componentObjectModels/appGeneralTabComponent';
import { BaseAdminPage } from './baseAdminPage';

export class AppAdminPage extends BaseAdminPage {
  readonly path: string;
  readonly pathRegex: RegExp;
  readonly closeButton: Locator;

  readonly generalTabButton: Locator;
  readonly layoutTabButton: Locator;

  readonly generalTab: AppGeneralTabComponent;

  constructor(page: Page) {
    super(page);
    this.path = '/Admin/App/';
    this.pathRegex = new RegExp(`${process.env.INSTANCE_URL}${this.path}[0-9]+`);
    this.closeButton = page.locator('a:has-text("Close")');

    this.generalTabButton = page.locator('#tab-strip').getByText('General');
    this.layoutTabButton = page.locator('#tab-strip').getByText('Layout');

    this.generalTab = new AppGeneralTabComponent(page);
  }

  async goto(appId: number) {
    const path = `${this.path}/${appId}`;
    await this.page.goto(path);
  }

  getAppIdFromUrl() {
    if (this.page.url().includes(this.path) === false) {
      throw new Error('The current page is not an app admin page.');
    }

    const url = this.page.url();
    const urlParts = url.split('/');
    const appId = urlParts[urlParts.length - 1];
    return parseInt(appId);
  }
}
