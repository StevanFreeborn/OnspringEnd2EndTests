import { FrameLocator, Locator, Page } from '@playwright/test';
import { FieldSecurityTab } from '../tabs/fieldSecurityTab';
import { LayoutItemSecurityTab } from '../tabs/layoutItemSecurityTab';
import { LayoutItemUsageTab } from '../tabs/layoutItemUsageTab';
import { AddOrEditLayoutItemModal } from './addOrEditLayoutItemModal';

export class AddOrEditFieldModal extends AddOrEditLayoutItemModal {
  protected readonly frame: FrameLocator;
  readonly generalSettingsTabButton: Locator;
  readonly securityTabButton: Locator;
  readonly usageTabButton: Locator;
  readonly securityTab: LayoutItemSecurityTab;
  readonly usageTab: LayoutItemUsageTab;
  private readonly addOrEditPathRegex: RegExp = /\/Admin\/App\/\d+\/Field\/(AddUsingSettings|\d+\/Edit)/;

  // FIX: Shouldn't need to explicitly pass frameNumber here.
  // https://corp.onspring.com/Content/8/4092
  constructor(page: Page, frameNumber: number = 0) {
    super(page);
    this.frame = page.frameLocator('iframe').nth(frameNumber);
    this.generalSettingsTabButton = this.frame.getByRole('tab', { name: 'General Settings' });
    this.securityTabButton = this.frame.getByRole('tab', { name: 'Security' });
    this.usageTabButton = this.frame.getByRole('tab', { name: 'Usage' });
    this.securityTab = new FieldSecurityTab(this.frame);
    this.usageTab = new LayoutItemUsageTab();
  }

  async save() {
    const addOrEditFieldResponse = this.saveButton.page().waitForResponse(this.addOrEditPathRegex);

    await this.saveButton.click();
    await addOrEditFieldResponse;
  }
}
