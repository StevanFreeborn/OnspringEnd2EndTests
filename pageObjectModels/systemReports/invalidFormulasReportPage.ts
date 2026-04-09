import { Locator, Page } from '../../fixtures';
import { BaseAdminPage } from '../baseAdminPage';

export class InvalidFormulasReportPage extends BaseAdminPage {
  private readonly path: string;
  private readonly getInvalidFormulaPath: string;
  private readonly appOrSurveySelector: Locator;
  private readonly reportGrid: Locator;
  private readonly reportGridHeader: Locator;
  private readonly reportGridBody: Locator;

  constructor(page: Page) {
    super(page);
    this.path = '/Admin/Reporting/Apps/InvalidFormulas';
    this.getInvalidFormulaPath = '/Admin/Reporting/Apps/GetInvalidFormulaPage';
    this.appOrSurveySelector = this.page.locator('.label:has-text("App/Survey") + .data').getByRole('listbox');
    this.reportGrid = this.page.locator('#grid');
    this.reportGridHeader = this.reportGrid.locator('.k-grid-header');
    this.reportGridBody = this.reportGrid.locator('.k-grid-content');
  }

  async goto() {
    const response = this.page.waitForResponse(this.getInvalidFormulaPath);
    await this.page.goto(this.path);
    await response;
  }

  private async filterInvalidFormulasReport(action: () => Promise<void>) {
    const getLoginHistoryDataResponse = this.page.waitForResponse(this.getInvalidFormulaPath);
    await action();
    await getLoginHistoryDataResponse;
  }

  private async selectAppOrSurvey(appOrSurvey: string) {
    const existingValue = await this.appOrSurveySelector.innerText();

    if (appOrSurvey == existingValue.trim()) {
      return;
    }

    await this.filterInvalidFormulasReport(async () => {
      await this.appOrSurveySelector.click();
      await this.page.getByRole('option', { name: appOrSurvey }).click();
    });
  }

  async filterReport({ appFilter = 'All Apps & Surveys' }: { appFilter: string }) {
    await this.selectAppOrSurvey(appFilter);
  }

  async getRows() {
    return this.reportGridBody.locator('tr').all();
  }

  getRowByText(name: string | RegExp) {
    return this.reportGridBody.getByRole('row', { name });
  }
}
