import { FrameLocator, Locator } from '@playwright/test';

export class BaseLayoutItemsSection {
  protected readonly frame: FrameLocator;
  protected readonly section: Locator;
  protected readonly tabsContainer: Locator;

  constructor(frame: FrameLocator) {
    this.frame = frame;
    this.section = frame.locator('.item-container').first();
    this.tabsContainer = this.section.locator('#tabstrip-container');
  }

  protected getTabButton(tabName: string) {
    return this.tabsContainer.getByRole('tab', { name: tabName });
  }
}
