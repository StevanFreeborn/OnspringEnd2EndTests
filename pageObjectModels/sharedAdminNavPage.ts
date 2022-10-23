import { Locator, Page } from '@playwright/test';

export class SharedAdminNavPage {
  readonly page: Page;
  readonly adminCreateButton: Locator;
  readonly adminCreateMenu: Locator;
  readonly appCreateMenuOption: Locator;
  readonly createDialogContinueButton: Locator;
  readonly nameInput: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.adminCreateButton = page.locator('#admin-create-button');
    this.adminCreateMenu = page.locator('#admin-create-menu');
    this.appCreateMenuOption = this.adminCreateMenu.getByText('App');
    this.createDialogContinueButton = page.locator('text=Continue');
    this.nameInput = page.getByLabel('Name');
    this.saveButton = page.locator('button >> text=Save');
  }
}