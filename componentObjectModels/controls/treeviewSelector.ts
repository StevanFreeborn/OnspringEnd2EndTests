import { Locator } from '@playwright/test';

export class TreeviewSelector {
  private readonly selector: Locator;

  constructor(selector: Locator) {
    this.selector = selector;
  }

  async selectOption(option: string) {
    await this.selector.click();
    await this.selector.page().getByRole('treeitem', { name: option }).getByText(option).click();
  }
}
