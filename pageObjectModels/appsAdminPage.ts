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
    await this.page.goto(this.path, { waitUntil: 'networkidle' });
  }

  async createApp(appName: string) {
    await this.createAppButton.click();

    await this.createAppDialog.continueButton.waitFor();
    await this.createAppDialog.continueButton.click();

    await this.page.waitForLoadState('networkidle');
    await this.createAppModal.nameInput.waitFor();

    await this.createAppModal.nameInput.fill(appName);
    await this.createAppModal.saveButton.click();
  }
}
