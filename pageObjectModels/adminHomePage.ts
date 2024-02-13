import { Locator, Page } from '@playwright/test';
import { CreateApiKeyDialog } from '../componentObjectModels/dialogs/createApiKeyDialog';
import { CreateAppDialog } from '../componentObjectModels/dialogs/createAppDialog';
import { CreateSurveyDialog } from '../componentObjectModels/dialogs/createSurveyDialog';
import { CreateAppModal } from '../componentObjectModels/modals/createAppModal';
import { CreateSurveyModal } from '../componentObjectModels/modals/createSurveyModal';
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

  readonly surveyTileLink: Locator;
  readonly surveyTileCreateButton: Locator;
  readonly createSurveyDialog: CreateSurveyDialog;
  readonly createSurveyModal: CreateSurveyModal;

  readonly createApiKeyDialog: CreateApiKeyDialog;

  readonly dashboardTileLink: Locator;
  readonly dashboardTileCreateButton: Locator;
  readonly dashboardCreateMenu: Locator;

  private getTileLink(tilePosition: number) {
    return this.page.locator(
      `div.landing-list-item-container:nth-child(${tilePosition}) > div:nth-child(1) > a:nth-child(1)`
    );
  }

  private getTileCreateButton(tileName: string) {
    return this.page.locator(`#card-create-button-${tileName}`);
  }

  constructor(page: Page) {
    super(page);
    this.path = '/Admin/Home';

    this.appTileLink = this.getTileLink(1);
    this.appTileCreateButton = this.getTileCreateButton('Apps');
    this.createAppDialog = new CreateAppDialog(page);
    this.createAppModal = new CreateAppModal(page);

    this.securityTileLink = this.getTileLink(6);
    this.securityTileCreateButton = this.getTileCreateButton('Security');
    this.securityCreateMenu = page.locator('[data-create-menu-for="card-create-button-Security"]');

    this.surveyTileLink = this.getTileLink(2);
    this.surveyTileCreateButton = this.getTileCreateButton('Surveys');
    this.createSurveyDialog = new CreateSurveyDialog(page);
    this.createSurveyModal = new CreateSurveyModal(page);

    this.createApiKeyDialog = new CreateApiKeyDialog(page);

    this.dashboardTileLink = this.getTileLink(4);
    this.dashboardTileCreateButton = this.getTileCreateButton('Dashboards');
    this.dashboardCreateMenu = page.locator('[data-create-menu-for="card-create-button-Dashboards"]');
  }

  async goto() {
    await this.page.goto(this.path);
  }

  async createContainerUsingHeaderCreateButton() {
    await this.adminNav.adminCreateButton.hover();
    await this.adminNav.adminCreateMenu.waitFor();
    await this.adminNav.containerCreateMenuOption.click();
  }

  async createContainerUsingDashboardTileButton() {
    await this.dashboardTileLink.hover();
    await this.dashboardTileCreateButton.waitFor();
    await this.dashboardTileCreateButton.click();
    await this.dashboardCreateMenu.getByText('Container').click();
  }

  async createApiKeyUsingSecurityTileButton(apiKeyName: string) {
    await this.securityTileLink.hover();
    await this.securityTileCreateButton.waitFor();
    await this.securityTileCreateButton.click();
    await this.securityCreateMenu.getByText('API Key').click();

    await this.page.waitForLoadState('networkidle');

    await this.createApiKeyDialog.nameInput.waitFor();
    await this.createApiKeyDialog.nameInput.fill(apiKeyName);
    await this.createApiKeyDialog.saveButton.click();
  }

  async createApiKeyUsingHeaderCreateButton(apiKeyName: string) {
    await this.adminNav.adminCreateButton.hover();
    await this.adminNav.adminCreateMenu.waitFor();
    await this.adminNav.apiKeyCreateMenuOption.click();

    await this.createApiKeyDialog.nameInput.waitFor();
    await this.createApiKeyDialog.nameInput.fill(apiKeyName);
    await this.createApiKeyDialog.saveButton.click();
  }

  async createSurveyUsingSurveyTileButton(surveyName: string) {
    await this.surveyTileLink.hover();
    await this.surveyTileCreateButton.waitFor();
    await this.surveyTileCreateButton.click();

    await this.page.waitForLoadState('networkidle');

    await this.createSurveyDialog.continueButton.waitFor();
    await this.createSurveyDialog.continueButton.click();

    await this.createSurveyModal.nameInput.waitFor();

    await this.createSurveyModal.nameInput.fill(surveyName);
    await this.createSurveyModal.saveButton.click();
  }

  async createSurveyUsingHeaderCreateButton(surveyName: string) {
    await this.adminNav.adminCreateButton.hover();
    await this.adminNav.adminCreateMenu.waitFor();
    await this.adminNav.surveyCreateMenuOption.click();

    await this.createSurveyDialog.continueButton.waitFor();
    await this.createSurveyDialog.continueButton.click();

    await this.page.waitForLoadState('networkidle');

    await this.createSurveyModal.nameInput.waitFor();
    await this.createSurveyModal.nameInput.fill(surveyName);
    await this.createSurveyModal.saveButton.click();
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

  async createSurvey(surveyName: string) {
    await this.goto();
    await this.createSurveyUsingHeaderCreateButton(surveyName);
  }

  async createApiKey(apiKeyName: string) {
    await this.goto();
    await this.createApiKeyUsingHeaderCreateButton(apiKeyName);
  }
}
