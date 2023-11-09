import { Page } from '@playwright/test';
import { LayoutItemType } from '../menus/addLayoutItemMenu';
import { AddOrEditDateFieldModal } from '../modals/addOrEditDateFieldModal';
import { AddOrEditFormulaFieldModal } from '../modals/addOrEditFormulaFieldModal';
import { AddOrEditImageFieldModal } from '../modals/addOrEditImageFieldModal';
import { AddOrEditLayoutItemModal } from '../modals/addOrEditLayoutItemModal';
import { AddOrEditListFieldModal } from '../modals/addOrEditListFieldModal';
import { AddOrEditNumberFieldModal } from '../modals/addOrEditNumberFieldModal';
import { AddOrEditTextFieldModal } from '../modals/addOrEditTextFieldModal';
import { AddOrEditTimeSpanFieldModal } from '../modals/addOrEditTimeSpanFieldModal';

export class LayoutItemCreator {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // FIX: Shouldn't need to explicitly pass frameNumber here.
  // https://corp.onspring.com/Content/8/4092
  getLayoutItemModal(itemType: 'Image', frameNumber?: number): AddOrEditImageFieldModal;
  getLayoutItemModal(itemType: 'Text', frameNumber?: number): AddOrEditTextFieldModal;
  getLayoutItemModal(itemType: 'Number', frameNumber?: number): AddOrEditNumberFieldModal;
  getLayoutItemModal(itemType: 'Date/Time', frameNumber?: number): AddOrEditDateFieldModal;
  getLayoutItemModal(itemType: 'List', frameNumber?: number): AddOrEditListFieldModal;
  getLayoutItemModal(itemType: 'Time Span', frameNumber?: number): AddOrEditTimeSpanFieldModal;
  getLayoutItemModal(itemType: 'Formula', frameNumber?: number): AddOrEditFormulaFieldModal;
  getLayoutItemModal(itemType: LayoutItemType, frameNumber?: number): AddOrEditLayoutItemModal;
  getLayoutItemModal(itemType: LayoutItemType, frameNumber: number = 0) {
    switch (itemType) {
      case 'Date/Time':
        return new AddOrEditDateFieldModal(this.page, frameNumber);
      case 'List':
        return new AddOrEditListFieldModal(this.page, frameNumber);
      case 'Number':
        return new AddOrEditNumberFieldModal(this.page, frameNumber);
      case 'Text':
        return new AddOrEditTextFieldModal(this.page, frameNumber);
      case 'Attachment':
      case 'Image':
        return new AddOrEditImageFieldModal(this.page, frameNumber);
      case 'Reference':
      case 'Time Span':
        return new AddOrEditTimeSpanFieldModal(this.page, frameNumber);
      case 'Formula':
        return new AddOrEditFormulaFieldModal(this.page, frameNumber);
      case 'Formatted Text Block':
      default:
        return new AddOrEditLayoutItemModal(this.page, frameNumber);
    }
  }
}
