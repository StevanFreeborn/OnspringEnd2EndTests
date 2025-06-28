import { FrameLocator, Locator } from '@playwright/test';

export class DualPaneSelector {
  private readonly selector: Locator;
  private readonly frame?: FrameLocator;

  constructor(selector: Locator, frame?: FrameLocator) {
    this.selector = selector;
    this.frame = frame;
  }

  private getSelectorControl() {
    return this.frame
      ? this.frame.locator('.selector-control:visible')
      : this.selector.page().locator('.selector-control:visible');
  }

  locator() {
    return this.selector;
  }

  async selectOption(option: string) {
    const selected = await this.selector.locator('.selector-select-list').innerText();

    if (selected.includes(option)) {
      return;
    }

    await this.selector.click();

    const selectorControl = this.getSelectorControl();
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

    const selectorControl = this.getSelectorControl();
    await selectorControl.locator('.selected-pane').getByText(option).getByTitle('Remove').click();
    await selectorControl.getByTitle('Close').click();
  }

  async removalAllOptions() {
    await this.selector.click();

    const selectorControl = this.getSelectorControl();
    const removeAllLink = selectorControl.getByRole('link', { name: 'Remove All' });
    await removeAllLink.click();
    await selectorControl.getByTitle('Close').click();
  }
}
