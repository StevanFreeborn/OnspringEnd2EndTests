import { Locator, Page } from '@playwright/test';
import { DateFieldControl } from '../../componentObjectModels/controls/dateFieldControl';
import { BaseAdminPage } from '../baseAdminPage';

type UsageHistoryFilterIncrement = 'Day' | 'Week' | 'Month' | 'Year';

type UsageHistoryFilter =
  | {
      type: 'All Dates' | 'Last Month' | 'Last 3 Months' | 'Last 6 Months' | 'Last 12 Months';
      increment: UsageHistoryFilterIncrement;
    }
  | {
      type: 'Custom Dates';
      startDate: Date;
      endDate: Date;
      increment: UsageHistoryFilterIncrement;
    };

const DETAILED_DATA_USAGE_BY_APP_STATISTICS_COLUMNS = [
  'App ID',
  'App Name',
  'Total Records',
  'Total Size (GB)',
] as const;

const DETAILED_FILE_STORAGE_BY_APP_STATISTICS_COLUMNS = [
  'App ID',
  'App/Survey Name',
  'Total Files',
  'File Size (GB)',
] as const;

type DetailedDataUsageByAppStatisticsColumn = (typeof DETAILED_DATA_USAGE_BY_APP_STATISTICS_COLUMNS)[number];
type SortableDetailedDataUsageByAppStatisticsColumn = DetailedDataUsageByAppStatisticsColumn;
type DetailedFileStorageByAppStatisticsColumn = (typeof DETAILED_FILE_STORAGE_BY_APP_STATISTICS_COLUMNS)[number];
type SortableDetailedFileStorageByAppStatisticsColumn = DetailedFileStorageByAppStatisticsColumn;
type SortDirection = 'ascending' | 'descending';

export class BillingReportPage extends BaseAdminPage {
  private readonly path: string;
  private readonly chartDataPath: string;
  private readonly getDataUsagePath: string;
  private readonly getFileStoragePath: string;
  private readonly usageHistorySection: Locator;
  private readonly dateSelector: Locator;
  private readonly fromDateControl: DateFieldControl;
  private readonly toDateControl: DateFieldControl;
  private readonly incrementSelector: Locator;
  private readonly detailedDataUsageByAppStatisticsSection: Locator;
  private readonly detailedDataUsageByAppStatisticsReportGridHeader: Locator;
  private readonly detailedDataUsageByAppStatisticsReportGridBody: Locator;
  private readonly detailedFileStorageByAppStatisticsSection: Locator;
  private readonly detailedFileStorageByAppStatisticsReportGridHeader: Locator;
  private readonly detailedFileStorageByAppStatisticsReportGridBody: Locator;
  private readonly exportReportDialog: Locator;

  constructor(page: Page) {
    super(page);
    this.path = '/Admin/Reporting/Billing/Usage';
    this.chartDataPath = '/Admin/Reporting/Billing/UsageChartData';
    this.getDataUsagePath = '/Admin/Reporting/Billing/GetBillingDataUsagePage';
    this.getFileStoragePath = '/Admin/Reporting/Billing/GetBillingFileStoragePage';
    this.usageHistorySection = this.page.locator('section', {
      has: this.page.getByRole('heading', { name: 'Usage History' }),
    });
    this.dateSelector = this.usageHistorySection.getByRole('listbox').first();
    this.fromDateControl = new DateFieldControl(this.usageHistorySection.locator('.k-datetimepicker').first());
    this.toDateControl = new DateFieldControl(this.usageHistorySection.locator('.k-datetimepicker').last());
    this.incrementSelector = this.usageHistorySection.getByRole('listbox').last();
    this.detailedDataUsageByAppStatisticsSection = this.page.locator('section', {
      has: this.page.getByRole('heading', { name: 'Detailed Data Usage By App Statistics' }),
    });
    this.detailedDataUsageByAppStatisticsReportGridHeader = this.detailedDataUsageByAppStatisticsSection.locator(
      '#data-usage-grid .k-grid-header'
    );
    this.detailedDataUsageByAppStatisticsReportGridBody = this.detailedDataUsageByAppStatisticsSection.locator(
      '#data-usage-grid .k-grid-content'
    );
    this.detailedFileStorageByAppStatisticsSection = this.page.locator('section', {
      has: this.page.getByRole('heading', { name: 'Detailed File Storage By App Statistics' }),
    });
    this.detailedFileStorageByAppStatisticsReportGridHeader = this.detailedFileStorageByAppStatisticsSection.locator(
      '#file-storage-grid .k-grid-header'
    );
    this.detailedFileStorageByAppStatisticsReportGridBody = this.detailedFileStorageByAppStatisticsSection.locator(
      '#file-storage-grid .k-grid-content'
    );
    this.exportReportDialog = this.page.getByRole('dialog', { name: 'Export Report' });
  }

  async goto() {
    await this.page.goto(this.path);
  }

  private async filterUsageHistory(action: () => Promise<void>) {
    const getChartDataResponse = this.page.waitForResponse(this.chartDataPath);
    await action();
    await getChartDataResponse;
  }

  private async selectUsageHistoryDateType(type: string) {
    await this.filterUsageHistory(async () => {
      await this.dateSelector.click();
      await this.page.getByRole('option', { name: type }).click();
    });
  }

  private async selectUsageHistoryIncrement(increment: string) {
    await this.filterUsageHistory(async () => {
      await this.incrementSelector.click();
      await this.page.getByRole('option', { name: increment }).click();
    });
  }

  private async enterUsageHistoryFromDate(date: Date) {
    await this.filterUsageHistory(async () => {
      await this.fromDateControl.clearDate();
    });

    await this.filterUsageHistory(async () => {
      await this.fromDateControl.enterDate(date);
    });
  }

  private async enterUsageHistoryToDate(date: Date) {
    await this.filterUsageHistory(async () => {
      await this.toDateControl.clearDate();
    });

    await this.filterUsageHistory(async () => {
      await this.toDateControl.enterDate(date);
    });
  }

  async applyUsageHistoryFilter(filter: UsageHistoryFilter) {
    await this.selectUsageHistoryDateType(filter.type);
    await this.selectUsageHistoryIncrement(filter.increment);

    if (filter.type === 'Custom Dates') {
      await this.enterUsageHistoryFromDate(filter.startDate);
      await this.enterUsageHistoryToDate(filter.endDate);
    }
  }

  async exportDetailedDataUsageByAppStatisticsReport() {
    await this.detailedDataUsageByAppStatisticsSection.getByRole('link', { name: 'Export Report' }).click();
    await this.exportReportDialog.waitFor();
    await this.exportReportDialog.getByRole('button', { name: 'Export' }).click();
  }

  async clearDetailedDataUsageByAppStatisticsReportSorting() {
    const numOfSortableHeaders = await this.detailedDataUsageByAppStatisticsReportGridHeader
      .locator('[data-role="columnsorter"]')
      .count();

    for (let i = 0; i < numOfSortableHeaders; i++) {
      const currentHeader = this.detailedDataUsageByAppStatisticsReportGridHeader
        .locator('[data-role="columnsorter"]')
        .nth(i);
      let isSorted = await currentHeader.getAttribute('aria-sort');

      while (isSorted) {
        const sortResponse = this.page.waitForResponse(this.getDataUsagePath);
        await currentHeader.getByRole('link').click();
        await sortResponse;

        isSorted = await currentHeader.getAttribute('aria-sort');
      }
    }
  }

  async sortDetailedDataUsageByAppStatisticsReport(
    column: SortableDetailedDataUsageByAppStatisticsColumn,
    direction: SortDirection
  ) {
    const columnHeader = this.detailedDataUsageByAppStatisticsReportGridHeader.getByRole('columnheader', {
      name: column,
    });
    let currentSortDirection = await columnHeader.getAttribute('aria-sort');

    while (currentSortDirection !== direction) {
      const sortResponse = this.page.waitForResponse(this.getDataUsagePath);
      await columnHeader.click();
      await sortResponse;

      currentSortDirection = await columnHeader.getAttribute('aria-sort');
    }
  }

  async getDetailedDataUsageByAppStatisticsReportRows() {
    return this.detailedDataUsageByAppStatisticsReportGridBody.locator('tr').all();
  }

  async exportDetailedFileStorageByAppStatisticsReport() {
    await this.detailedFileStorageByAppStatisticsSection.getByRole('link', { name: 'Export Report' }).click();
    await this.exportReportDialog.waitFor();
    await this.exportReportDialog.getByRole('button', { name: 'Export' }).click();
  }

  async clearDetailedFileStorageByAppStatisticsReportSorting() {
    const numOfSortableHeaders = await this.detailedFileStorageByAppStatisticsReportGridHeader
      .locator('[data-role="columnsorter"]')
      .count();

    for (let i = 0; i < numOfSortableHeaders; i++) {
      const currentHeader = this.detailedFileStorageByAppStatisticsReportGridHeader
        .locator('[data-role="columnsorter"]')
        .nth(i);
      let isSorted = await currentHeader.getAttribute('aria-sort');

      while (isSorted) {
        const sortResponse = this.page.waitForResponse(this.getFileStoragePath);
        await currentHeader.getByRole('link').click();
        await sortResponse;

        isSorted = await currentHeader.getAttribute('aria-sort');
      }
    }
  }

  async sortDetailedFileStorageByAppStatisticsReport(
    column: SortableDetailedFileStorageByAppStatisticsColumn,
    direction: SortDirection
  ) {
    const columnHeader = this.detailedFileStorageByAppStatisticsReportGridHeader.getByRole('columnheader', {
      name: column,
    });
    let currentSortDirection = await columnHeader.getAttribute('aria-sort');

    while (currentSortDirection !== direction) {
      const sortResponse = this.page.waitForResponse(this.getFileStoragePath);
      await columnHeader.click();
      await sortResponse;

      currentSortDirection = await columnHeader.getAttribute('aria-sort');
    }
  }

  async getDetailedFileStorageByAppStatisticsReportRows() {
    return this.detailedFileStorageByAppStatisticsReportGridBody.locator('tr').all();
  }
}
