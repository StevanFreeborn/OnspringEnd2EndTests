import { FrameLocator, Locator } from '@playwright/test';

export enum FieldTypeEnum {
  DateTime = 'Date/Time',
  List = 'List',
  Number = 'Number',
  Text = 'Text',
  Attachment = 'Attachment',
  Image = 'Image',
  Reference = 'Reference',
  TimeSpan = 'Time Span',
  Formula = 'Formula',
  ParallelReference = 'Parallel Reference',
  AutoNumber = 'AutoNumber',
  System = 'System',
}

export type FieldType =
  | 'Date/Time'
  | 'List'
  | 'Number'
  | 'Text'
  | 'Attachment'
  | 'Image'
  | 'Reference'
  | 'Time Span'
  | 'Formula'
  | 'Parallel Reference'
  | 'AutoNumber'
  | 'System';

export class AddFieldTypeMenu {
  private readonly menu: Locator;

  constructor(frame: FrameLocator) {
    this.menu = frame.locator(`[data-add-menu="field"]`).first();
  }

  async selectItem(itemType: FieldType) {
    await this.menu.getByText(itemType, { exact: true }).click();
  }
}
