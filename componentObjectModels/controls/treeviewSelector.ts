import { FrameLocator, Locator } from '@playwright/test';

export class TreeviewSelector {
  private readonly selector: Locator;
  private readonly frame?: FrameLocator;

  constructor(selector: Locator, frame?: FrameLocator) {
    this.selector = selector;
    this.frame = frame;
  }

  async selectOption(option: string) {
    await this.selector.click();

    const treeItem = this.frame
      ? this.frame.getByRole('treeitem', { name: option })
      : this.selector.page().getByRole('treeitem', { name: option });

    const text = treeItem.getByText(option);
    await text.click();
  }
}
