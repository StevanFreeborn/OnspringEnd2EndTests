import { Locator, Page } from '@playwright/test';
import { CreateAppDialog } from '../componentObjectModels/dialogs/createAppDialog';
import { CreateAppModal } from '../componentObjectModels/modals/createAppModal';
import { BaseAdminPage } from './baseAdminPage';

export class AdminHomePage extends BaseAdminPage {
  readonly path: string;
  readonly appTileLink: Locator;
  readonly appTileCreateButton: Locator;
  readonly createAppDialog: CreateAppDialog;
  readonly createAppModal: CreateAppModal;
  readonly securityTileLink: Locator;
  readonly securityTileCreateButton: Locator;
  readonly securityCreateMenu: Locator;

  constructor(page: Page) {
    super(page);
    this.path = '/Admin/Home';
    this.appTileLink = page.locator('div.landing-list-item-container:nth-child(1) > div:nth-child(1) > a:nth-child(1)');
    this.appTileCreateButton = page.locator('#card-create-button-Apps');
    this.createAppDialog = new CreateAppDialog(page);
    this.createAppModal = new CreateAppModal(page);
    this.securityTileLink = page.locator(
      'div.landing-list-item-container:nth-child(6) > div:nth-child(1) > a:nth-child(1)'
    );
    this.securityTileCreateButton = page.locator('#card-create-button-Security');
    this.securityCreateMenu = page.locator('[data-create-menu-for="card-create-button-Security"]');
  }

  async goto() {
    await this.page.goto(this.path);
  }

  async createAppUsingHeaderCreateButton(appName: string) {
    await this.adminNav.adminCreateButton.hover();
    await this.adminNav.adminCreateMenu.waitFor();
    await this.adminNav.appCreateMenuOption.click();

    await this.createAppDialog.continueButton.waitFor();
    await this.createAppDialog.continueButton.click();

    await this.page.waitForLoadState('networkidle');

    await this.createAppModal.nameInput.waitFor();
    await this.createAppModal.nameInput.fill(appName);
    await this.createAppModal.saveButton.click();
  }

  async createAppUsingAppTileButton(appName: string) {
    await this.appTileLink.hover();
    await this.appTileCreateButton.waitFor();
    await this.appTileCreateButton.click();

    await this.page.waitForLoadState('networkidle');

    await this.createAppDialog.continueButton.waitFor();
    await this.createAppDialog.continueButton.click();

    await this.createAppModal.nameInput.waitFor();

    await this.createAppModal.nameInput.fill(appName);
    await this.createAppModal.saveButton.click();
  }

  async createApp(appName: string) {
    await this.goto();
    await this.createAppUsingHeaderCreateButton(appName);
  }
}
