import { FrameLocator, Locator } from '@playwright/test';

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

  constructor(frame: FrameLocator) {
    this.menu = frame.locator(`[data-add-menu="field"]`).first();
  }

  async selectItem(itemType: FieldType) {
    await this.menu.getByText(itemType, { exact: true }).click();
  }
}
