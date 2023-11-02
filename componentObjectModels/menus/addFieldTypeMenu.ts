import { Locator, Page } from '@playwright/test';

export type FieldType =
  | 'Date/Time'
  | 'List'
  | 'Number'
  | 'Text'
  | 'Attachment'
  | 'Image'
  | 'Reference'
  | 'Time Span'
  | 'Formula';

export class AddFieldTypeMenu {
  private readonly menu: Locator;

  constructor(page: Page) {
    this.menu = page.locator(`[data-add-menu="field"]`).first();
  }

  async selectItem(itemType: FieldType) {
    await this.menu.getByText(itemType, { exact: true }).click();
  }
}
