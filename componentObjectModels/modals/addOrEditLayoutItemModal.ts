import { Locator, Page } from '@playwright/test';
import { LayoutItemSecurityTab } from '../tabs/layoutItemSecurityTab';
import { LayoutItemUsageTab } from '../tabs/layoutItemUsageTab';

export abstract class AddOrEditLayoutItemModal {
  abstract readonly generalSettingsTabButton: Locator;
  abstract readonly securityTabButton: Locator;
  abstract readonly usageTabButton: Locator;
  abstract readonly securityTab: LayoutItemSecurityTab;
  abstract readonly usageTab: LayoutItemUsageTab;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }
}
