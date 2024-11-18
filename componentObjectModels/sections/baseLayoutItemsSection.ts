import { FrameLocator, Locator } from '@playwright/test';

export class BaseLayoutItemsSection {
  protected readonly section: Locator;
  protected readonly tabsContainer: Locator;

  protected getTabButton(tabName: string) {
    return this.tabsContainer.getByRole('tab', { name: tabName });
  }

  constructor(frame: FrameLocator) {
    this.section = frame.locator('.item-container').first();
    this.tabsContainer = this.section.locator('#tabstrip-container');
  }
}
