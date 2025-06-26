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

export class BillingReportPage extends BaseAdminPage {
  private readonly path: string;
  private readonly chartDataPath: string;
  private readonly usageHistorySection: Locator;
  private readonly dateSelector: Locator;
  private readonly fromDateControl: DateFieldControl;
  private readonly toDateControl: DateFieldControl;
  private readonly incrementSelector: Locator;
  private readonly detailedDataUsageByAppStatisticsSection: Locator;
  private readonly exportReportDialog: Locator;

  constructor(page: Page) {
    super(page);
    this.path = '/Admin/Reporting/Billing/Usage';
    this.chartDataPath = '/Admin/Reporting/Billing/UsageChartData';
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
}
