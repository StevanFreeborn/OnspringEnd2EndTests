import { FrameLocator } from '@playwright/test';
import { BaseDashboardDesignerTab } from './baseDashboardDesignerTab';

export class DashboardDesignerReportsTab extends BaseDashboardDesignerTab {
  constructor(frame: FrameLocator) {
    super(frame);
  }

  getReportFromBank(reportName: string) {
    return this.getItemFromBank('report', reportName);
  }
}
