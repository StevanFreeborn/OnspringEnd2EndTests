import { FrameLocator, Locator } from '@playwright/test';
import { DashboardItem } from '../../models/dashboard';
import { SavedReport } from '../../models/report';
import { DashboardDesignerReportsTab } from '../tabs/dashboardDesignerReportsTab';
import { BaseLayoutItemsSection } from './baseLayoutItemsSection';

export class DashboardResourcesSection extends BaseLayoutItemsSection {
  private readonly reportTabButton: Locator;
  private readonly keyMetricTabButton: Locator;
  private readonly layoutsTabButton: Locator;
  private readonly objectsTabButton: Locator;

  private readonly reportsTab: DashboardDesignerReportsTab;

  constructor(frame: FrameLocator) {
    super(frame);
    this.reportTabButton = this.getTabButton('Reports');
    this.keyMetricTabButton = this.getTabButton('Key Metrics');
    this.layoutsTabButton = this.getTabButton('Layouts');
    this.objectsTabButton = this.getTabButton('Objects');
    this.reportsTab = new DashboardDesignerReportsTab(frame);
  }

  private async ensureItemTabSelected(tabButton: Locator) {
    const tabSelected = await tabButton.getAttribute('aria-selected');
    const isTabSelected = tabSelected === 'true';

    if (isTabSelected === false) {
      await tabButton.click();
    }
  }

  async getItemFromTab(item: DashboardItem) {
    if (item.object instanceof SavedReport) {
      await this.ensureItemTabSelected(this.reportTabButton);
      return this.reportsTab.getReportFromBank(item.object.name);
    }

    throw new Error(`Item type not supported: ${item.object.constructor.name}`);
  }
}
