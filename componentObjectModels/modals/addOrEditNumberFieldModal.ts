import { Page } from '@playwright/test';
import { NumberFieldGeneralTab } from '../tabs/numberFieldGeneralTab';
import { AddOrEditLayoutItemModal } from './addOrEditLayoutItemModal';

export class AddOrEditNumberFieldModal extends AddOrEditLayoutItemModal {
  readonly generalTab: NumberFieldGeneralTab;

  // FIX: Shouldn't need to explicitly pass frameNumber here.
  // https://corp.onspring.com/Content/8/4092
  constructor(page: Page, frameNumber: number = 0) {
    super(page, frameNumber);
    this.generalTab = new NumberFieldGeneralTab(this.frame);
  }
}
