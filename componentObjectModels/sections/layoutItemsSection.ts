import { Locator, Page } from '@playwright/test';

export class LayoutItemsSection {
  private readonly section: Locator;
  private readonly tabStrip: Locator;
  private readonly fieldsTabButton: Locator;
  private readonly objectsTabButton: Locator;

  constructor(page: Page) {
    this.section = page.frameLocator('iframe').locator('.item-container').first();
    this.tabStrip = this.section.locator('#tabstrip-container');
    this.fieldsTabButton = this.tabStrip.getByText('Fields');
    this.objectsTabButton = this.tabStrip.getByText('Objects');
  }
}
