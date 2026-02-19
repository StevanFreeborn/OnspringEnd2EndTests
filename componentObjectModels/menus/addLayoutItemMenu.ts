import { Locator, Page } from '@playwright/test';
import { FieldType } from './addFieldTypeMenu';

export type ObjectType = 'Formatted Text Block' | 'Section Label';

export type LayoutItemType = FieldType | ObjectType;

export class AddLayoutItemMenu {
  private readonly menu: Locator;

  constructor(page: Page) {
    this.menu = page.locator(`[data-add-menu="layout-item"]`).first();
  }

  async selectItem(itemType: LayoutItemType) {
    await this.menu.getByText(itemType, { exact: true }).click();
  }
}
