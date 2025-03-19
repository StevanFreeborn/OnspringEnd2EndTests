import { FrameLocator } from '@playwright/test';
import { BaseDashboardDesignerTab } from './baseDashboardDesignerTab';

export class DashboardDesignerObjectsTab extends BaseDashboardDesignerTab {
  constructor(frame: FrameLocator) {
    super(frame);
  }

  getObjectFromBank(objectName: string) {
    return this.getItemFromBank('object', objectName);
  }
}
