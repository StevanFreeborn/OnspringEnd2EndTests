import { FrameLocator, Locator, Page } from '@playwright/test';
import { LayoutItemSecurityTab } from '../tabs/layoutItemSecurityTab';
import { LayoutItemUsageTab } from '../tabs/layoutItemUsageTab';

export class AddOrEditLayoutItemModal {
  protected readonly frame: FrameLocator;
  readonly generalSettingsTabButton: Locator;
  readonly securityTabButton: Locator;
  readonly usageTabButton: Locator;
  readonly securityTab: LayoutItemSecurityTab;
  readonly usageTab: LayoutItemUsageTab;
  readonly saveButton: Locator;

  // TODO: Shouldn't need to explicitly pass frameNumber here.
  // https://corp.onspring.com/Content/8/4092
  constructor(page: Page, frameNumber: number = 0) {
    this.frame = page.frameLocator('iframe').nth(frameNumber);
    this.generalSettingsTabButton = this.frame.getByRole('tab', { name: 'General Settings' });
    this.securityTabButton = this.frame.getByRole('tab', { name: 'Security' });
    this.usageTabButton = this.frame.getByRole('tab', { name: 'Usage' });
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.securityTab = new LayoutItemSecurityTab(this.frame);
    this.usageTab = new LayoutItemUsageTab();
  }
}
