import { Locator, Page } from '@playwright/test';
import { WaitForOptions } from '../../utils';
import { DateFieldControl } from '../controls/dateFieldControl';

export class ViewVersionHistoryModal {
  private readonly filterPathRegex: RegExp;
  private readonly page: Page;
  private readonly _modal: Locator;
  private readonly exportReportButton: Locator;
  private readonly exportReportDialog: Locator;
  private readonly fromDateField: DateFieldControl;
  private readonly toDateField: DateFieldControl;
  private readonly versionsGridHeader: Locator;
  private readonly versionsGridBody: Locator;

  modal() {
    return this._modal;
  }

  constructor(page: Page) {
    this.filterPathRegex = /\/Content\/\d+\/\d+\/GetRecordVersionsPage/;
    this.page = page;
    this._modal = this.page.getByRole('dialog', { name: 'Version History' });
    this.exportReportButton = this._modal.getByRole('button', { name: 'Export Report' });
    this.exportReportDialog = this.page.getByRole('dialog', { name: 'Export Report' });
    this.fromDateField = new DateFieldControl(this._modal.locator('.k-datetimepicker').first());
    this.toDateField = new DateFieldControl(this._modal.locator('.k-datetimepicker').last());
    this.versionsGridHeader = this._modal.locator('.k-grid-header');
    this.versionsGridBody = this._modal.locator('.k-grid-content');
  }

  async waitFor(options?: WaitForOptions) {
    await this._modal.waitFor(options);
  }

  async filterBy({ fromDate, toDate }: { fromDate: Date; toDate: Date }) {
    const page = this._modal.page();

    const fromFilterResponse = page.waitForResponse(res => {
      const requestData = res.request().postDataJSON();
      const hasFromDate = requestData.fromDate !== undefined;
      return res.url().match(this.filterPathRegex) !== null && res.request().method() === 'POST' && hasFromDate;
    });

    await this.fromDateField.enterDate(fromDate);
    await fromFilterResponse;

    const toFilterResponse = page.waitForResponse(res => {
      const requestData = res.request().postDataJSON();
      const hasToDate = requestData.toDate !== undefined;
      return res.url().match(this.filterPathRegex) !== null && res.request().method() === 'POST' && hasToDate;
    });

    await this.toDateField.enterDate(toDate);
    await toFilterResponse;
  }

  async getVersionRows() {
    return this.versionsGridBody.locator('tr.k-master-row').all();
  }

  async extractVersionHistoryData() {
    const versionHistoryData: Record<string, unknown>[] = [];

    const headerRow = this.versionsGridHeader.getByRole('row').first();
    const headerCells = await headerRow.locator('th').all();

    await this.versionsGridBody.waitFor();
    const bodyRows = await this.getVersionRows();

    for (const row of bodyRows) {
      const rowData: Record<string, unknown> = {};

      const rowCells = await row.locator('td').all();

      for (let i = 0; i < headerCells.length; i++) {
        const cellText = await headerCells[i].innerText();

        if (!cellText || cellText === 'Actions' || cellText === 'Fields Updated') {
          continue;
        }

        const cellValue = await rowCells[i].innerText();
        const isDateValue = Number.isNaN(Date.parse(cellValue.trim())) === false;

        if (isDateValue) {
          rowData[cellText.trim()] = new Date(cellValue.trim());
        } else {
          rowData[cellText.trim()] = cellValue.trim();
        }
      }

      const expandLink = rowCells[0].getByRole('link');
      await expandLink.click();

      const detailRow = this.versionsGridBody.locator('tr.k-detail-row:visible');
      await detailRow.waitFor();

      const detailHeaderRow = detailRow.locator('thead').getByRole('row').first();
      const detailHeaderCells = await detailHeaderRow.locator('th').all();
      const detailBodyRows = await detailRow.locator('tbody').getByRole('row').all();

      for (const detailBodyRow of detailBodyRows) {
        const detailRowData: Record<string, unknown> = {};

        for (let i = 0; i < detailHeaderCells.length; i++) {
          const detailCellText = await detailHeaderCells[i].innerText();
          const detailCellValue = await detailBodyRow.locator('td').nth(i).innerText();
          const isDateDetailValue = Number.isNaN(Date.parse(detailCellValue.trim())) === false;

          if (isDateDetailValue) {
            detailRowData[detailCellText.trim()] = new Date(detailCellValue.trim());
          } else {
            detailRowData[detailCellText.trim()] = detailCellValue.trim();
          }
        }

        versionHistoryData.push({ ...rowData, ...detailRowData });
      }

      await expandLink.click();
    }

    return versionHistoryData;
  }

  async exportReport() {
    await this.exportReportButton.click();
    await this.exportReportDialog.waitFor();

    await this.exportReportDialog.getByRole('button', { name: 'Export' }).click();
    await this.exportReportDialog.waitFor();

    await this.exportReportDialog.getByRole('button', { name: 'Close' }).click();
  }
}
