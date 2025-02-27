import { Locator, Page } from '@playwright/test';
import { BaseAdminPage } from '../baseAdminPage';

type ItemType =
  | 'All Item Types'
  | 'API Key'
  | 'App'
  | 'Dashboard'
  | 'Dashboard Container'
  | 'Dashboard Filter Config'
  | 'Dashboard Object'
  | 'Data Connector'
  | 'Document'
  | 'Email Body'
  | 'Email Sending Domain'
  | 'Email Sync'
  | 'Email Template'
  | 'Field'
  | 'Import'
  | 'Instance Configuration'
  | 'Layout'
  | 'Layout Object'
  | 'List'
  | 'Messaging Task'
  | 'Package'
  | 'Portal'
  | 'Record Retention'
  | 'Role'
  | 'SMS Sending Number'
  | 'Survey'
  | 'Survey Campaign'
  | 'Survey Page'
  | 'Text Message'
  | 'Trigger'
  | 'User'
  | 'Workflow Step';

type AuditHistoryFilter = {
  user?: string | 'All Users';
  saveType?: 'All Save Types' | 'Added' | 'Deleted' | 'Modified' | 'Approved' | 'Denied';
  itemType?: ItemType;
  appOrSurvey?: string | 'All (or Not Applicable)';
};

export class AdminAuditHistoryPage extends BaseAdminPage {
  private readonly path: string;
  private readonly getAuditHistoryPath: string;
  private readonly userSelector: Locator;
  private readonly saveTypeSelector: Locator;
  private readonly itemTypeSelector: Locator;
  private readonly appOrSurveySelector: Locator;
  private readonly historyGridBody: Locator;
  private readonly exportReportButton: Locator;
  private readonly exportReportDialog: Locator;

  constructor(page: Page) {
    super(page);
    this.path = '/Admin/Reporting/Security/Audit';
    this.getAuditHistoryPath = '/Admin/Reporting/Security/GetAuditHistoryPage';
    this.userSelector = this.page.locator('.label:has-text("User") + .data').getByRole('listbox');
    this.saveTypeSelector = this.page.locator('.label:has-text("Save Type") + .data').getByRole('listbox');
    this.itemTypeSelector = this.page.locator('.label:has-text("Item Type") + .data').getByRole('listbox');
    this.appOrSurveySelector = this.page.locator('.label:has-text("App/Survey") + .data').getByRole('listbox');
    this.historyGridBody = this.page.locator('#grid .k-grid-content');
    this.exportReportButton = this.page.getByRole('link', { name: 'Export Report' });
    this.exportReportDialog = this.page.getByRole('dialog', { name: 'Export Report' });
  }

  async goto() {
    const getAuditHistoryResponse = this.page.waitForResponse(this.getAuditHistoryPath);
    await this.page.goto(this.path);
    await getAuditHistoryResponse;
  }

  private async selectUser(user: string) {
    await this.userSelector.click();
    await this.page.getByRole('option', { name: user }).click();
  }

  private async selectSaveType(saveType: string) {
    await this.saveTypeSelector.click();
    await this.page.getByRole('option', { name: saveType }).click();
  }

  private async selectItemType(itemType: string) {
    await this.itemTypeSelector.click();
    await this.page.getByRole('option', { name: itemType }).click();
  }

  private async selectAppOrSurvey(appOrSurvey: string) {
    await this.appOrSurveySelector.click();
    await this.page.getByRole('option', { name: appOrSurvey }).click();
  }

  async applyFilter({
    user = 'All Users',
    saveType = 'All Save Types',
    itemType = 'All Item Types',
    appOrSurvey = 'All (or Not Applicable)',
  }: AuditHistoryFilter) {
    const existingUserFilter = await this.userSelector.innerText();
    
    if (existingUserFilter.trim() !== user) {
      const userFilterResponse = this.page.waitForResponse(this.getAuditHistoryPath);
      await this.selectUser(user);
      await userFilterResponse;
    }

    const existingSaveTypeFilter = await this.saveTypeSelector.innerText();

    if (existingSaveTypeFilter.trim() !== saveType) {
      const saveTypeFilterResponse = this.page.waitForResponse(this.getAuditHistoryPath);
      await this.selectSaveType(saveType);
      await saveTypeFilterResponse;
    }
    
    const existingItemTypeFilter = await this.itemTypeSelector.innerText();

    if (existingItemTypeFilter.trim() !== itemType) {
      const itemTypeFilterResponse = this.page.waitForResponse(this.getAuditHistoryPath);
      await this.selectItemType(itemType);
      await itemTypeFilterResponse;
    }
    
    const existingAppOrSurveyFilter = await this.appOrSurveySelector.innerText();

    if (existingAppOrSurveyFilter.trim() !== appOrSurvey) {
      const appOrSurveyFilterResponse = this.page.waitForResponse(this.getAuditHistoryPath);
      await this.selectAppOrSurvey(appOrSurvey);
      await appOrSurveyFilterResponse;
    }
  }

  async getRows() {
    return this.historyGridBody.locator('tr').all();
  }

  async exportReport() {
    await this.exportReportButton.click();
    await this.exportReportDialog.waitFor();
    await this.exportReportDialog.getByRole('button', { name: 'Export' }).click();
    await this.exportReportDialog.getByRole('button', { name: 'Close' }).click();
  }
}
