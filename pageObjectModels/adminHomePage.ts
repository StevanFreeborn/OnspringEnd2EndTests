import { Locator, Page } from '@playwright/test';
import { BaseAdminPage } from './baseAdminPage';

export class AdminHomePage extends BaseAdminPage {
  readonly page: Page;
  readonly path: string;
  readonly createDialogContinueButton: Locator;
  readonly nameInput: Locator;
  readonly saveButton: Locator;
  readonly appTileLink: Locator;
  readonly appTileCreateButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.path = '/Admin/Home';
    this.createDialogContinueButton = page.locator('text=Continue');
    this.nameInput = page.getByLabel('Name');
    this.saveButton = page.locator('button >> text=Save');
    this.appTileLink = page.locator('div.landing-list-item-container:nth-child(1) > div:nth-child(1) > a:nth-child(1)');
    this.appTileCreateButton = page.locator('#card-create-button-Apps');
  }

  async goto() {
    await this.page.goto(this.path);
  }
}