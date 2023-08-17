import { Locator, Page } from '@playwright/test';
import { CreateAppDialogComponent } from '../componentObjectModels/createAppDialogComponent';
import { CreateAppModalComponent } from '../componentObjectModels/createAppModalComponent';
import { DeleteAppDialogComponent } from '../componentObjectModels/deleteAppDialogComponent';
import { BaseAdminPage } from './baseAdminPage';

export class AppsAdminPage extends BaseAdminPage {
  readonly page: Page;
  readonly path: string;
  readonly createAppButton: Locator;
  readonly appGrid: Locator;
  readonly createAppDialog: CreateAppDialogComponent;
  readonly createAppModal: CreateAppModalComponent;
  readonly deleteAppDialog: DeleteAppDialogComponent;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.path = '/Admin/App';
    this.createAppButton = page.locator('.create-button');
    this.appGrid = page.locator('#grid');
    this.createAppDialog = new CreateAppDialogComponent(page);
    this.createAppModal = new CreateAppModalComponent(page);
    this.deleteAppDialog = new DeleteAppDialogComponent(page);
  }

  async goto() {
    await this.page.goto(this.path, { waitUntil: 'domcontentloaded' });
  }

  async getAppRow(appName: string) {
    return this.appGrid.getByRole('row', { name: appName });
  }
}
