import { Locator } from '@playwright/test';

export class TreeviewSelector {
  private readonly selector: Locator;

  constructor(selector: Locator) {
    this.selector = selector;
  }

  async selectOption(option: string) {
    await this.selector.click();
    const page = this.selector.page();

    const frame = page.mainFrame();
    const childFrames = frame.childFrames();
    const treeItem =
      childFrames.length > 0
        ? childFrames[0].getByRole('treeitem', { name: option })
        : page.getByRole('treeitem', { name: option });

    const text = treeItem.getByText(option);
    await text.click();
  }
}
