import { AddOrEditFormulaFieldModal } from '../../componentObjectModels/modals/addOrEditFormulaFieldModal';
import { Locator, Page } from '../../fixtures';
import { BaseAdminPage } from '../baseAdminPage';

type SortableGridColumn = 'App/Survey Name' | 'Field Name' | 'Last Saved';

type SortDirection = 'ascending' | 'descending';

export class InvalidFormulasReportPage extends BaseAdminPage {
  private readonly path: string;
  private readonly getInvalidFormulaPath: string;
  private readonly appOrSurveySelector: Locator;
  private readonly reportGrid: Locator;
  private readonly reportGridHeader: Locator;
  private readonly reportGridBody: Locator;
  readonly formulaFieldModal: AddOrEditFormulaFieldModal;

  constructor(page: Page) {
    super(page);
    this.path = '/Admin/Reporting/Apps/InvalidFormulas';
    this.getInvalidFormulaPath = '/Admin/Reporting/Apps/GetInvalidFormulaPage';
    this.appOrSurveySelector = this.page.locator('.label:has-text("App/Survey") + .data').getByRole('listbox');
    this.reportGrid = this.page.locator('#grid');
    this.reportGridHeader = this.reportGrid.locator('.k-grid-header');
    this.reportGridBody = this.reportGrid.locator('.k-grid-content');
    this.formulaFieldModal = new AddOrEditFormulaFieldModal(this.page);
  }

  async goto() {
    const response = this.page.waitForResponse(this.getInvalidFormulaPath);
    await this.page.goto(this.path);
    await response;
  }

  async reload() {
    const response = this.page.waitForResponse(this.getInvalidFormulaPath);
    await this.page.reload();
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

  getRows() {
    return this.reportGridBody.locator('tr').all();
  }

  getRowByText(name: string | RegExp) {
    return this.reportGridBody.getByRole('row', { name });
  }

  async clearSort() {
    const sortedColumn = this.reportGridHeader.locator('th[aria-sort]').first();

    while (await sortedColumn.isVisible()) {
      const clearSortResponse = this.page.waitForResponse(this.getInvalidFormulaPath);
      await sortedColumn.click();
      await clearSortResponse;
    }
  }

  async sortGridBy(column: SortableGridColumn, direction: SortDirection = 'ascending') {
    const columnHeader = this.reportGridHeader.getByRole('columnheader', { name: column });
    let currentSortDirection = await columnHeader.getAttribute('aria-sort');

    while (currentSortDirection !== direction) {
      const sortResponse = this.page.waitForResponse(this.getInvalidFormulaPath);
      await columnHeader.click();
      await sortResponse;

      currentSortDirection = await columnHeader.getAttribute('aria-sort');
    }
  }
}
