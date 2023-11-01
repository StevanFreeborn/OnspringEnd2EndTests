import { Locator, Page } from '@playwright/test';
import { CreateAppDialog } from '../componentObjectModels/createAppDialog';
import { CreateAppModal } from '../componentObjectModels/createAppModal';
import { DeleteAppDialog } from '../componentObjectModels/deleteAppDialog';
import { BaseAdminPage } from './baseAdminPage';

export class AppsAdminPage extends BaseAdminPage {
  readonly path: string;
  readonly createAppButton: Locator;
  readonly appGrid: Locator;
  readonly createAppDialog: CreateAppDialog;
  readonly createAppModal: CreateAppModal;
  readonly deleteAppDialog: DeleteAppDialog;

  constructor(page: Page) {
    super(page);
    this.path = '/Admin/App';
    this.createAppButton = page.locator('.create-button');
    this.appGrid = page.locator('#grid');
    this.createAppDialog = new CreateAppDialog(page);
    this.createAppModal = new CreateAppModal(page);
    this.deleteAppDialog = new DeleteAppDialog(page);
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

  async deleteApps(appsToDelete: string[]) {
    await this.goto();

    for (const appName of appsToDelete) {
      const appRow = this.appGrid.getByRole('row', { name: appName }).first();
      const rowElement = await appRow.elementHandle();

      if (rowElement === null) {
        continue;
      }

      await appRow.hover();
      await appRow.getByTitle('Delete App').click();
      await this.deleteAppDialog.confirmationInput.pressSequentially('OK', {
        delay: 100,
      });
      await this.deleteAppDialog.deleteButton.click();
      await this.deleteAppDialog.waitForDialogToBeDismissed();
      await rowElement.waitForElementState('hidden');
    }
  }
}
