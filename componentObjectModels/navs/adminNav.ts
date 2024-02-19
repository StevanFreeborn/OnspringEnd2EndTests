import { Locator, Page } from '@playwright/test';

export class AdminNav {
  readonly page: Page;
  readonly adminCreateButton: Locator;
  readonly adminCreateMenu: Locator;
  readonly appCreateMenuOption: Locator;
  readonly surveyCreateMenuOption: Locator;
  readonly userCreateMenuOption: Locator;
  readonly roleCreateMenuOption: Locator;
  readonly groupCreateMenuOption: Locator;
  readonly apiKeyCreateMenuOption: Locator;
  readonly containerCreateMenuOption: Locator;
  readonly importConfigCreateMenuOption: Locator;

  private getMenuOption(menuOptionText: string) {
    return this.adminCreateMenu.getByText(menuOptionText);
  }

  constructor(page: Page) {
    this.page = page;
    this.adminCreateButton = page.locator('#admin-create-button');
    this.adminCreateMenu = page.locator('#admin-create-menu');
    this.appCreateMenuOption = this.getMenuOption('App');
    this.surveyCreateMenuOption = this.getMenuOption('Survey');
    this.userCreateMenuOption = this.getMenuOption('User');
    this.roleCreateMenuOption = this.getMenuOption('Role');
    this.groupCreateMenuOption = this.getMenuOption('Group');
    this.apiKeyCreateMenuOption = this.getMenuOption('API Key');
    this.containerCreateMenuOption = this.getMenuOption('Container');
    this.importConfigCreateMenuOption = this.getMenuOption('Import Configuration');
  }
}
