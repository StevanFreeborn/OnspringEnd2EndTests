import { Locator, Page } from '@playwright/test';

export class AddLayoutItemMenu {
  private readonly menu: Locator;

  constructor(page: Page) {
    this.menu = page.locator(`[data-add-menu="layout-item"]`).first();
  }

  async selectItem(itemName: string) {
    await this.menu.getByText(itemName, { exact: true }).click();
  }
}
