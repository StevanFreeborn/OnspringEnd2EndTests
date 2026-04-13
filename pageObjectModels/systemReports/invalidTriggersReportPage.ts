import { Locator, Page } from '../../fixtures';
import { BaseAdminPage } from '../baseAdminPage';

export class InvalidTriggersReportPage extends BaseAdminPage {
  private readonly path: string;
  private readonly getInvalidTriggersPath: string;
  private readonly appOrSurveySelector: Locator;
  private readonly reportGrid: Locator;
  private readonly reportGridBody: Locator;

  constructor(page: Page) {
    super(page);
    this.path = '/Admin/Reporting/Apps/InvalidTriggers';
    this.getInvalidTriggersPath = '/Admin/Reporting/Apps/GetInvalidTriggerPage';
    this.appOrSurveySelector = this.page.locator('.label:has-text("App/Survey") + .data').getByRole('listbox');
    this.reportGrid = this.page.locator('#grid');
    this.reportGridBody = this.reportGrid.locator('.k-grid-content');
  }

  async goto() {
    const response = this.page.waitForResponse(this.getInvalidTriggersPath);
    await this.page.goto(this.path);
    await response;
  }

  async reload() {
    const response = this.page.waitForResponse(this.getInvalidTriggersPath);
    await this.page.reload();
    await response;
  }

  private async filterInvalidTriggersReport(action: () => Promise<void>) {
    const getDataResponse = this.page.waitForResponse(this.getInvalidTriggersPath);
    await action();
    await getDataResponse;
  }

  private async selectAppOrSurvey(appOrSurvey: string) {
    const existingValue = await this.appOrSurveySelector.innerText();

    if (appOrSurvey == existingValue.trim()) {
      return;
    }

    await this.filterInvalidTriggersReport(async () => {
      await this.appOrSurveySelector.click();
      await this.page.getByRole('option', { name: appOrSurvey }).click();
    });
  }

  async filterReport({ appFilter = 'All Apps & Surveys' }: { appFilter: string }) {
    await this.selectAppOrSurvey(appFilter);
  }

  getRowByText(name: string | RegExp) {
    return this.reportGridBody.getByRole('row', { name });
  }
}
