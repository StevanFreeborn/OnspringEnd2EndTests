import { Locator, Page } from '@playwright/test';
import { CreateAppDialogComponent } from '../componentObjectModels/createAppDialogComponent';
import { CreateAppModalComponent } from '../componentObjectModels/createAppModalComponent';
import { BaseAdminPage } from './baseAdminPage';

export class AdminHomePage extends BaseAdminPage {
  readonly page: Page;
  readonly path: string;
  readonly appTileLink: Locator;
  readonly appTileCreateButton: Locator;
  readonly createAppDialog: CreateAppDialogComponent;
  readonly createAppModal: CreateAppModalComponent;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.path = '/Admin/Home';
    this.appTileLink = page.locator(
      'div.landing-list-item-container:nth-child(1) > div:nth-child(1) > a:nth-child(1)'
    );
    this.appTileCreateButton = page.locator('#card-create-button-Apps');
    this.createAppDialog = new CreateAppDialogComponent(page);
    this.createAppModal = new CreateAppModalComponent(page);
  }

  async goto() {
    await this.page.goto(this.path, { waitUntil: 'domcontentloaded' });
  }
}
