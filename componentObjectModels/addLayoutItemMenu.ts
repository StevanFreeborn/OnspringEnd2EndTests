import { Locator, Page } from '@playwright/test';

export enum LayoutItemType {
  DateField = 'Date/Time',
  ListField = 'List',
  NumberField = 'Number',
  TextField = 'Text',
  AttachmentField = 'Attachment',
  ImageField = 'Image',
  ReferenceField = 'Reference',
  TimeSpanField = 'Time Span',
  FormulaField = 'Formula',
  TextBlock = 'Formatted Text Block',
}

export class AddLayoutItemMenu {
  private readonly menu: Locator;

  constructor(page: Page) {
    this.menu = page.locator(`[data-add-menu="layout-item"]`).first();
  }

  async selectItem(itemType: LayoutItemType) {
    await this.menu.getByText(itemType, { exact: true }).click();
  }
}
