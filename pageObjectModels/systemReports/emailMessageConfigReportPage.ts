import { Locator, Page } from '../../fixtures';
import { BaseAdminPage } from '../baseAdminPage';

type EmailType =
  | 'All Email Types'
  | 'Email Body'
  | 'Scheduled Report'
  | 'Scheduled Dashboard'
  | 'Survey Campaign'
  | 'Workflow Approval'
  | 'Workflow Rejection'
  | 'Workflow Step';

type FromAddressStatus = 'All' | 'OK' | 'Requires Attention';

type SortableGridColumn =
  | 'App/Survey Name'
  | 'Email Type'
  | 'Item Name'
  | 'Current From Name'
  | 'Current From Address'
  | 'From Address Status';

type SortDirection = 'ascending' | 'descending';

export class EmailMessageConfigReportPage extends BaseAdminPage {
  private readonly getConfigsPath: string;
  private readonly emailTypeSelector: Locator;
  private readonly fromAddressStatusSelector: Locator;
  private readonly appOrSurveySelector: Locator;
  private readonly reportGrid: Locator;
  private readonly reportGridHeader: Locator;
  private readonly reportGridBody: Locator;
  readonly path: string;

  constructor(page: Page) {
    super(page);
    this.getConfigsPath = '/Admin/Reporting/Messaging/GetConfigurationsPage';
    this.emailTypeSelector = this.page.locator('.label:has-text("Email Type") + .data').getByRole('listbox');
    this.fromAddressStatusSelector = this.page
      .locator('.label:has-text("From Address Status") + .data')
      .getByRole('listbox');
    this.appOrSurveySelector = this.page.locator('.label:has-text("App/Survey") + .data').getByRole('listbox');
    this.reportGrid = this.page.locator('#grid');
    this.reportGridHeader = this.reportGrid.locator('.k-grid-header');
    this.reportGridBody = this.reportGrid.locator('.k-grid-content');
    this.path = '/Admin/Reporting/Messaging/Configurations';
  }

  async goto() {
    const response = this.page.waitForResponse(this.getConfigsPath);
    await this.page.goto(this.path);
    await response;
  }

  private async filterConfigs(action: () => Promise<void>) {
    const getLoginHistoryDataResponse = this.page.waitForResponse(this.getConfigsPath);
    await action();
    await getLoginHistoryDataResponse;
  }

  private async hasSameValue(value: string, locator: Locator) {
    const currentValue = await locator.textContent();
    return currentValue?.toLowerCase().includes(value.toLowerCase());
  }

  private async selectEmailType(emailType: string) {
    if (await this.hasSameValue(emailType, this.emailTypeSelector)) {
      return;
    }

    await this.filterConfigs(async () => {
      await this.emailTypeSelector.click();
      await this.page.getByRole('option', { name: emailType }).click();
    });
  }

  private async selectFromAddressStatus(status: string) {
    if (await this.hasSameValue(status, this.fromAddressStatusSelector)) {
      return;
    }

    await this.filterConfigs(async () => {
      await this.fromAddressStatusSelector.click();
      await this.page.getByRole('option', { name: status }).click();
    });
  }

  private async selectAppOrSurvey(appOrSurvey: string) {
    if (await this.hasSameValue(appOrSurvey, this.appOrSurveySelector)) {
      return;
    }

    await this.filterConfigs(async () => {
      await this.appOrSurveySelector.click();
      await this.page.getByRole('option', { name: appOrSurvey }).click();
    });
  }

  async filterReport({
    type,
    status,
    appOrSurvey,
  }: {
    type: EmailType;
    status: FromAddressStatus;
    appOrSurvey: string;
  }) {
    await this.selectEmailType(type);
    await this.selectFromAddressStatus(status);
    await this.selectAppOrSurvey(appOrSurvey);
  }

  async getRows() {
    return this.reportGridBody.locator('tr').all();
  }

  async getRowByName(name: string | RegExp) {
    return this.reportGridBody.getByRole('row', { name });
  }

  async sortGridBy(column: SortableGridColumn, direction: SortDirection = 'ascending') {
    const columnHeader = this.reportGridHeader.getByRole('columnheader', { name: column });
    let currentSortDirection = await columnHeader.getAttribute('aria-sort');

    while (currentSortDirection !== direction) {
      const sortResponse = this.page.waitForResponse(this.getConfigsPath);
      await columnHeader.click();
      await sortResponse;

      currentSortDirection = await columnHeader.getAttribute('aria-sort');
    }
  }
}
