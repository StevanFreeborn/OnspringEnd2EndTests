import { Page } from '@playwright/test';
import { LayoutItemType } from '../menus/addLayoutItemMenu';
import { AddOrEditLayoutItemModal } from '../modals/addOrEditLayoutItemModal';
import { AddOrEditTextFieldModal } from '../modals/addOrEditTextFieldModal';

export class LayoutItemCreator {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // TODO: Shouldn't need to explicitly pass frameNumber here.
  // https://corp.onspring.com/Content/8/4092
  getLayoutItemModal(itemType: 'Text', frameNumber?: number): AddOrEditTextFieldModal;
  getLayoutItemModal(itemType: LayoutItemType, frameNumber?: number): AddOrEditLayoutItemModal;
  getLayoutItemModal(itemType: LayoutItemType, frameNumber: number = 0) {
    switch (itemType) {
      case 'Date/Time':
      case 'List':
      case 'Number':
      case 'Text':
        return new AddOrEditTextFieldModal(this.page, frameNumber);
      case 'Attachment':
      case 'Image':
      case 'Reference':
      case 'Time Span':
      case 'Formula':
      case 'Formatted Text Block':
      default:
        return new AddOrEditLayoutItemModal(this.page, frameNumber);
    }
  }
}
