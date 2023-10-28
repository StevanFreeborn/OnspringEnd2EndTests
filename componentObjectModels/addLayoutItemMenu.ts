import { Locator, Page } from '@playwright/test';

export class AddLayoutItemMenu {
  private readonly menu: Locator;

  constructor(page: Page) {
    this.menu = page.locator(`[data-add-menu="layout-item"]`).first();
  }

  async selectItem(itemType: string) {
    await this.menu.getByText(itemType, { exact: true }).click();
  }
}
