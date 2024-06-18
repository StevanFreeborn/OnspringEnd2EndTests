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
  readonly emailBodyCreateMenuOption: Locator;
  readonly listCreateMenuOption: Locator;
  readonly textCreateMenuOption: Locator;
  readonly sendingNumberCreateMenuOption: Locator;
  readonly dynamicDocumentCreateMenuOption: Locator;
  readonly dataConnectorCreateMenuOption: Locator;

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
    this.emailBodyCreateMenuOption = this.getMenuOption('Email Body');
    this.listCreateMenuOption = this.getMenuOption('List');
    this.textCreateMenuOption = this.getMenuOption('Text Message');
    this.sendingNumberCreateMenuOption = this.getMenuOption('Sending Number');
    this.dynamicDocumentCreateMenuOption = this.getMenuOption('Document');
    this.dataConnectorCreateMenuOption = this.getMenuOption('Data Connector');
  }
}
