import { Locator, Page } from '@playwright/test';
import { CreateApiKeyDialog } from '../componentObjectModels/dialogs/createApiKeyDialog';
import { CreateAppDialog } from '../componentObjectModels/dialogs/createAppDialog';
import { CreateDashboardDialog } from '../componentObjectModels/dialogs/createDashboardDialog';
import { CreateDataConnectorDialog } from '../componentObjectModels/dialogs/createDataConnectorDialog';
import { CreateDynamicDocumentDialogForApp } from '../componentObjectModels/dialogs/createDynamicDocumentDialog';
import { CreateEmailBodyDialogForApp } from '../componentObjectModels/dialogs/createEmailBodyDialog';
import { CreateEmailTemplateDialog } from '../componentObjectModels/dialogs/createEmailTemplateDialog';
import { CreateImportConfigDialog } from '../componentObjectModels/dialogs/createImportConfigDialog';
import { CreateSurveyDialog } from '../componentObjectModels/dialogs/createSurveyDialog';
import { CreateTextMessageDialogForApp } from '../componentObjectModels/dialogs/createTextMessageDialog';
import { CreateAppModal } from '../componentObjectModels/modals/createAppModal';
import { CreateSurveyModal } from '../componentObjectModels/modals/createSurveyModal';
import { DashboardDesignerModal } from '../componentObjectModels/modals/dashboardDesignerModal';
import { DataConnectorType } from '../models/dataConnector';
import { CreateListDialog } from './../componentObjectModels/dialogs/createListDialog';
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

  readonly integrationTileLink: Locator;
  readonly integrationTileCreateButton: Locator;
  readonly integrationCreateMenu: Locator;
  readonly createImportConfigDialog: CreateImportConfigDialog;

  readonly createEmailBodyDialog: CreateEmailBodyDialogForApp;

  readonly listTileLink: Locator;
  readonly listTileCreateButton: Locator;
  readonly createListDialog: CreateListDialog;

  readonly createTextDialog: CreateTextMessageDialogForApp;

  readonly documentTileLink: Locator;
  readonly documentTileCreateButton: Locator;
  readonly createDocumentDialog: CreateDynamicDocumentDialogForApp;

  readonly createDataConnectorDialog: CreateDataConnectorDialog;

  readonly createDashboardDialog: CreateDashboardDialog;
  readonly dashboardDesigner: DashboardDesignerModal;

  readonly createEmailTemplateDialog: CreateEmailTemplateDialog;

  private getTileLink(tilePosition: number) {
    return this.page.locator(
      `div.landing-list-item-container:nth-child(${tilePosition}) > div:nth-child(1) > a:nth-child(1)`
    );
  }

  private getTileCreateButton(tileName: string) {
    return this.page.locator(`#card-create-button-${tileName}`);
  }

  private getTileCreateMenu(tileName: string) {
    return this.page.locator(`[data-create-menu-for="card-create-button-${tileName}"]`);
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
    this.securityCreateMenu = this.getTileCreateMenu('Security');

    this.surveyTileLink = this.getTileLink(2);
    this.surveyTileCreateButton = this.getTileCreateButton('Surveys');
    this.createSurveyDialog = new CreateSurveyDialog(page);
    this.createSurveyModal = new CreateSurveyModal(page);

    this.createApiKeyDialog = new CreateApiKeyDialog(page);

    this.dashboardTileLink = this.getTileLink(4);
    this.dashboardTileCreateButton = this.getTileCreateButton('Dashboards');
    this.dashboardCreateMenu = this.getTileCreateMenu('Dashboards');
    this.createDashboardDialog = new CreateDashboardDialog(page);
    this.dashboardDesigner = new DashboardDesignerModal(page);

    this.integrationTileLink = this.getTileLink(7);
    this.integrationTileCreateButton = this.getTileCreateButton('Integration');
    this.integrationCreateMenu = this.getTileCreateMenu('Integration');
    this.createImportConfigDialog = new CreateImportConfigDialog(page);

    this.createEmailBodyDialog = new CreateEmailBodyDialogForApp(page);

    this.listTileLink = this.getTileLink(3);
    this.listTileCreateButton = this.getTileCreateButton('Lists');
    this.createListDialog = new CreateListDialog(page);

    this.createTextDialog = new CreateTextMessageDialogForApp(page);

    this.documentTileLink = this.getTileLink(9);
    this.documentTileCreateButton = this.getTileCreateButton('Documents');
    this.createDocumentDialog = new CreateDynamicDocumentDialogForApp(page);

    this.createDataConnectorDialog = new CreateDataConnectorDialog(page);

    this.createEmailTemplateDialog = new CreateEmailTemplateDialog(page);
  }

  async goto() {
    await this.page.goto(this.path);
  }

  async createDashboardCopyUsingDashboardsTileButton(dashboardToCopyName: string, dashboardCopyName: string) {
    await this.dashboardTileLink.hover();
    await this.dashboardTileCreateButton.waitFor();
    await this.dashboardTileCreateButton.click();
    await this.dashboardCreateMenu.waitFor();
    await this.dashboardCreateMenu.getByText('Dashboard').click();

    await this.createDashboardDialog.copyFromRadioButton.waitFor();
    await this.createDashboardDialog.copyFromRadioButton.click();
    await this.createDashboardDialog.copyFromDropdown.click();
    await this.createDashboardDialog.getDashboardToCopy(dashboardToCopyName).click();
    await this.createDashboardDialog.nameInput.fill(dashboardCopyName);
    await this.createDashboardDialog.saveButton.click();
  }

  async createDashboardUsingDashboardsTileButton(dashboardName: string) {
    await this.dashboardTileLink.hover();
    await this.dashboardTileCreateButton.waitFor();
    await this.dashboardTileCreateButton.click();
    await this.dashboardCreateMenu.waitFor();
    await this.dashboardCreateMenu.getByText('Dashboard').click();

    await this.createDashboardDialog.nameInput.waitFor();
    await this.createDashboardDialog.nameInput.fill(dashboardName);
    await this.createDashboardDialog.saveButton.click();
  }

  async createDashboardCopyUsingHeaderCreateButton(dashboardToCopyName: string, dashboardName: string) {
    await this.adminNav.adminCreateButton.hover();
    await this.adminNav.adminCreateMenu.waitFor();
    await this.adminNav.dashboardCreateMenuOption.click();

    await this.createDashboardDialog.copyFromRadioButton.waitFor();
    await this.createDashboardDialog.copyFromRadioButton.click();
    await this.createDashboardDialog.copyFromDropdown.click();
    await this.createDashboardDialog.getDashboardToCopy(dashboardToCopyName).click();
    await this.createDashboardDialog.nameInput.fill(dashboardName);
    await this.createDashboardDialog.saveButton.click();
  }

  async createDashboardUsingHeaderCreateButton(dashboardName: string) {
    await this.adminNav.adminCreateButton.hover();
    await this.adminNav.adminCreateMenu.waitFor();
    await this.adminNav.dashboardCreateMenuOption.click();

    await this.createDashboardDialog.nameInput.waitFor();
    await this.createDashboardDialog.nameInput.fill(dashboardName);
    await this.createDashboardDialog.saveButton.click();
  }

  async createConnectorCopyUsingHeaderCreateButton(
    connectorToCopyName: string,
    connectorName: string,
    connectorType: DataConnectorType
  ) {
    await this.adminNav.adminCreateButton.hover();
    await this.adminNav.adminCreateMenu.waitFor();
    await this.adminNav.dataConnectorCreateMenuOption.click();

    await this.createDataConnectorDialog.selectType(connectorType);
    await this.createDataConnectorDialog.copyFromRadioButton.click();
    await this.createDataConnectorDialog.copyFromDropdown.click();
    await this.createDataConnectorDialog.getConnectorToCopy(connectorToCopyName).click();
    await this.createDataConnectorDialog.nameInput.fill(connectorName);
    await this.createDataConnectorDialog.saveButton.click();
  }

  async createConnectorUsingHeaderCreateButton(connectorName: string, connectorType: DataConnectorType) {
    await this.adminNav.adminCreateButton.hover();
    await this.adminNav.adminCreateMenu.waitFor();
    await this.adminNav.dataConnectorCreateMenuOption.click();

    await this.createDataConnectorDialog.selectType(connectorType);
    await this.createDataConnectorDialog.nameInput.fill(connectorName);
    await this.createDataConnectorDialog.saveButton.click();
  }

  async createDynamicDocumentCopyUsingDocumentTileButton(
    appName: string,
    documentToCopy: string,
    documentName: string
  ) {
    await this.documentTileLink.hover();
    await this.documentTileCreateButton.waitFor();
    await this.documentTileCreateButton.click();

    await this.createDocumentDialog.selectApp(appName);
    await this.createDocumentDialog.copyFromRadioButton.click();
    await this.createDocumentDialog.copyFromDropdown.click();
    await this.createDocumentDialog.getDocumentToCopy(documentToCopy).click();
    await this.createDocumentDialog.nameInput.fill(documentName);
    await this.createDocumentDialog.saveButton.click();
  }

  async createDynamicDocumentUsingDocumentTileButton(appName: string, documentName: string) {
    await this.documentTileLink.hover();
    await this.documentTileCreateButton.waitFor();
    await this.documentTileCreateButton.click();

    await this.createDocumentDialog.selectApp(appName);
    await this.createDocumentDialog.nameInput.fill(documentName);
    await this.createDocumentDialog.saveButton.click();
  }

  async createDynamicDocumentCopyUsingHeaderCreateButton(
    appName: string,
    documentToCopyName: string,
    documentCopyName: string
  ) {
    await this.adminNav.adminCreateButton.hover();
    await this.adminNav.adminCreateMenu.waitFor();
    await this.adminNav.dynamicDocumentCreateMenuOption.click();

    await this.createDocumentDialog.selectApp(appName);
    await this.createDocumentDialog.copyFromRadioButton.click();
    await this.createDocumentDialog.copyFromDropdown.click();
    await this.createDocumentDialog.getDocumentToCopy(documentToCopyName).click();
    await this.createDocumentDialog.nameInput.fill(documentCopyName);
    await this.createDocumentDialog.saveButton.click();
  }

  async createDynamicDocumentUsingHeaderCreateButton(appName: string, documentName: string) {
    await this.adminNav.adminCreateButton.hover();
    await this.adminNav.adminCreateMenu.waitFor();
    await this.adminNav.dynamicDocumentCreateMenuOption.click();

    await this.createDocumentDialog.selectApp(appName);
    await this.createDocumentDialog.nameInput.fill(documentName);
    await this.createDocumentDialog.saveButton.click();
  }

  async createTextCopyUsingHeaderCreateButton(appName: string, textToCopyName: string, textCopyName: string) {
    await this.adminNav.adminCreateButton.hover();
    await this.adminNav.adminCreateMenu.waitFor();
    await this.adminNav.textCreateMenuOption.click();

    await this.createTextDialog.selectApp(appName);
    await this.createTextDialog.copyFromRadioButton.click();
    await this.createTextDialog.copyFromDropdown.click();
    await this.createTextDialog.getTextToCopy(textToCopyName).click();
    await this.createTextDialog.nameInput.fill(textCopyName);
    await this.createTextDialog.saveButton.click();
  }

  async createTextUsingHeaderCreateButton(appName: string, textMessageName: string) {
    await this.adminNav.adminCreateButton.hover();
    await this.adminNav.adminCreateMenu.waitFor();
    await this.adminNav.textCreateMenuOption.click();

    await this.createTextDialog.selectApp(appName);
    await this.createTextDialog.nameInput.fill(textMessageName);
    await this.createTextDialog.saveButton.click();
  }

  async createListCopyUsingListTileButton(listToCopy: string, listName: string) {
    await this.listTileLink.hover();
    await this.listTileCreateButton.waitFor();
    await this.listTileCreateButton.click();

    await this.createListDialog.copyFromRadioButton.waitFor();
    await this.createListDialog.copyFromRadioButton.click();
    await this.createListDialog.copyFromDropdown.click();
    await this.createListDialog.getListToCopy(listToCopy).click();
    await this.createListDialog.nameInput.fill(listName);
    await this.createListDialog.saveButton.click();
  }

  async createListCopyUsingHeaderCreateButton(listToCopy: string, listName: string) {
    await this.adminNav.adminCreateButton.hover();
    await this.adminNav.adminCreateMenu.waitFor();
    await this.adminNav.listCreateMenuOption.click();

    await this.createListDialog.copyFromRadioButton.waitFor();
    await this.createListDialog.copyFromRadioButton.click();
    await this.createListDialog.copyFromDropdown.click();
    await this.createListDialog.getListToCopy(listToCopy).click();
    await this.createListDialog.nameInput.fill(listName);
    await this.createListDialog.saveButton.click();
  }

  async createListUsingListTileButton(listName: string) {
    await this.listTileLink.hover();
    await this.listTileCreateButton.waitFor();
    await this.listTileCreateButton.click();

    await this.createListDialog.nameInput.waitFor();
    await this.createListDialog.nameInput.fill(listName);
    await this.createListDialog.saveButton.click();
  }

  async createListUsingHeaderCreateButton(listName: string) {
    await this.adminNav.adminCreateButton.hover();
    await this.adminNav.adminCreateMenu.waitFor();
    await this.adminNav.listCreateMenuOption.click();

    await this.createListDialog.nameInput.waitFor();
    await this.createListDialog.nameInput.fill(listName);
    await this.createListDialog.saveButton.click();
  }

  async createImportCopyUsingIntegrationsTileButton(importToCopy: string, importName: string) {
    await this.integrationTileLink.hover();
    await this.integrationTileCreateButton.waitFor();
    await this.integrationTileCreateButton.click();

    await this.integrationCreateMenu.waitFor();
    await this.integrationCreateMenu.getByText('Import Configuration').click();

    await this.createImportConfigDialog.copyFromRadioButton.waitFor();
    await this.createImportConfigDialog.copyFromRadioButton.click();
    await this.createImportConfigDialog.copyFromDropdown.click();
    await this.createImportConfigDialog.getImportToCopy(importToCopy).click();
    await this.createImportConfigDialog.nameInput.fill(importName);
    await this.createImportConfigDialog.saveButton.click();
  }

  async createImportConfigUsingIntegrationsTileButton(importName: string) {
    await this.integrationTileLink.hover();
    await this.integrationTileCreateButton.waitFor();
    await this.integrationTileCreateButton.click();

    await this.integrationCreateMenu.waitFor();
    await this.integrationCreateMenu.getByText('Import Configuration').click();

    await this.createImportConfigDialog.nameInput.waitFor();
    await this.createImportConfigDialog.nameInput.fill(importName);
    await this.createImportConfigDialog.saveButton.click();
  }

  async createImportCopyUsingHeaderCreateButton(importToCopy: string, importName: string) {
    await this.adminNav.adminCreateButton.hover();
    await this.adminNav.adminCreateMenu.waitFor();
    await this.adminNav.importConfigCreateMenuOption.click();

    await this.createImportConfigDialog.copyFromRadioButton.waitFor();
    await this.createImportConfigDialog.copyFromRadioButton.click();
    await this.createImportConfigDialog.copyFromDropdown.click();
    await this.createImportConfigDialog.getImportToCopy(importToCopy).click();
    await this.createImportConfigDialog.nameInput.fill(importName);
    await this.createImportConfigDialog.saveButton.click();
  }

  async createImportConfigUsingHeaderCreateButton(importName: string) {
    await this.adminNav.adminCreateButton.hover();
    await this.adminNav.adminCreateMenu.waitFor();
    await this.adminNav.importConfigCreateMenuOption.click();

    await this.createImportConfigDialog.nameInput.waitFor();
    await this.createImportConfigDialog.nameInput.fill(importName);
    await this.createImportConfigDialog.saveButton.click();
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

    await this.createApiKeyDialog.nameInput.waitFor();
    await this.createApiKeyDialog.nameInput.fill(apiKeyName);
    await this.createApiKeyDialog.saveButton.click();
  }

  async createEmailBodyCopyUsingHeaderCreateButton(appName: string, emailBodyToCopy: string, copyName: string) {
    await this.adminNav.adminCreateButton.hover();
    await this.adminNav.adminCreateMenu.waitFor();
    await this.adminNav.emailBodyCreateMenuOption.click();

    await this.createEmailBodyDialog.selectApp(appName);
    await this.createEmailBodyDialog.copyFromRadioButton.click();
    await this.createEmailBodyDialog.copyFromDropdown.click();
    await this.createEmailBodyDialog.getEmailBodyToCopy(emailBodyToCopy).click();
    await this.createEmailBodyDialog.nameInput.fill(copyName);
    await this.createEmailBodyDialog.saveButton.click();
  }

  async createEmailBodyUsingHeaderCreateButton(appName: string, emailBodyName: string) {
    await this.adminNav.adminCreateButton.hover();
    await this.adminNav.adminCreateMenu.waitFor();
    await this.adminNav.emailBodyCreateMenuOption.click();

    await this.createEmailBodyDialog.selectApp(appName);
    await this.createEmailBodyDialog.nameInput.fill(emailBodyName);
    await this.createEmailBodyDialog.saveButton.click();
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

    await this.createAppModal.nameInput.waitFor();
    await this.createAppModal.nameInput.fill(appName);
    await this.createAppModal.saveButton.click();
  }

  async createAppUsingAppTileButton(appName: string) {
    await this.appTileLink.hover();
    await this.appTileCreateButton.waitFor();
    await this.appTileCreateButton.click();

    await this.createAppDialog.continueButton.waitFor();
    await this.createAppDialog.continueButton.click();

    await this.createAppModal.nameInput.waitFor();

    await this.createAppModal.nameInput.fill(appName);
    await this.createAppModal.saveButton.click();
  }

  async createEmailTemplateUsingHeaderCreateButton(emailTemplateName: string) {
    await this.adminNav.adminCreateButton.hover();
    await this.adminNav.adminCreateMenu.waitFor();
    await this.adminNav.emailTemplateCreateMenuOption.click();

    await this.createEmailTemplateDialog.nameInput.waitFor();
    await this.createEmailTemplateDialog.nameInput.fill(emailTemplateName);
    await this.createEmailTemplateDialog.saveButton.click();
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

  async createContainer() {
    await this.goto();
    await this.createContainerUsingHeaderCreateButton();
  }

  async createImportConfig(importName: string) {
    await this.goto();
    await this.createImportConfigUsingHeaderCreateButton(importName);
  }
}
