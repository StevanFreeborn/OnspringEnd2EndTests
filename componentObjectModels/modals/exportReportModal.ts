import { Locator, Page } from '@playwright/test';

type ExportFormat = 'Microsoft Excel' | 'PDF';
type Data = 'Export Report Data';
type DataFormat = 'Excel Readability' | 'Onspring Import';
type NumberDateFormat = 'For Excel Functions or Import' | 'Onspring Display Format';

export class ExportReportModal {
  private page: Page;
  private modal: Locator;
  private readonly exportFormatSelector: Locator;
  private readonly dataSelector: Locator;
  private readonly dataFormatSelector: Locator;
  private readonly numberDateFormatSelector: Locator;
  readonly exportButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modal = this.page.getByRole('dialog', { name: 'Export Report' });
    this.exportFormatSelector = this.modal.locator('.label:has-text("Export Format") + .data').getByRole('listbox');
    this.dataSelector = this.modal.locator('.label:has-text("Data") + .data').getByRole('listbox');
    this.dataFormatSelector = this.modal.locator('.label:has-text("Data Format") + .data').getByRole('listbox');
    this.numberDateFormatSelector = this.modal
      .locator('.label:has-text("Number/Date Format") + .data')
      .getByRole('listbox');

    this.exportButton = this.modal.getByRole('button', { name: 'Export' });
    this.cancelButton = this.modal.getByRole('button', { name: 'Cancel' });
  }

  async selectFormat(format: ExportFormat) {
    await this.exportFormatSelector.click();
    await this.page.getByRole('option', { name: format }).click();
  }

  async selectData(data: Data) {
    await this.dataSelector.click();
    await this.page.getByRole('option', { name: data }).click();
  }

  async selectDataFormat(format: DataFormat) {
    await this.dataFormatSelector.click();
    await this.page.getByRole('option', { name: format }).click();
  }

  async selectNumberDateFormat(format: NumberDateFormat) {
    await this.numberDateFormatSelector.click();
    await this.page.getByRole('option', { name: format }).click();
  }
}
