import { Locator, Page } from '@playwright/test';
import { LayoutItemSecurityTab } from '../tabs/layoutItemSecurityTab';
import { LayoutItemUsageTab } from '../tabs/layoutItemUsageTab';

export abstract class AddOrEditLayoutItemModal {
  abstract readonly generalSettingsTabButton: Locator;
  abstract readonly securityTabButton: Locator;
  abstract readonly usageTabButton: Locator;
  abstract readonly securityTab: LayoutItemSecurityTab;
  abstract readonly usageTab: LayoutItemUsageTab;
  protected readonly saveButton: Locator;

  constructor(page: Page) {
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }

  /**
   * Saves the layout item by clicking the Save button and waiting for the response.
   * @returns {Promise<void>}
   */
  abstract save(): Promise<void>;
}
