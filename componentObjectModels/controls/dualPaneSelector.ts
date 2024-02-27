import { Locator } from '@playwright/test';

export class DualPaneSelector {
  private readonly selector: Locator;

  constructor(selector: Locator) {
    this.selector = selector;
  }

  async selectOption(option: string) {
    const selected = await this.selector.locator('.selector-select-list').innerText();

    if (selected.includes(option)) {
      return;
    }

    await this.selector.click();

    const selectorControl = this.selector.page().locator('.selector-control:visible');

    await selectorControl.locator('.unselected-pane').getByText(option).click();
    await selectorControl.getByTitle('Close').click();
  }

  async selectOptions(options: string[]) {
    for (const option of options) {
      await this.selectOption(option);
    }
  }

  async unselectOption(option: string) {
    const selected = await this.selector.locator('.selector-selected-list').innerText();

    if (selected.includes(option) === false) {
      return;
    }

    await this.selector.click();

    const selectorControl = this.selector.page().locator('.selector-control:visible');

    await selectorControl.locator('.selected-pane').getByText(option).getByTitle('Remove').click();
    await selectorControl.getByTitle('Close').click();
  }
}
