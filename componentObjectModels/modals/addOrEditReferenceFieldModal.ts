import { Page } from '@playwright/test';
import { ReferenceFieldGeneralTab } from '../tabs/referenceFieldGeneralTab';
import { AddOrEditLayoutItemModal } from './addOrEditLayoutItemModal';

export class AddOrEditReferenceFieldModal extends AddOrEditLayoutItemModal {
  readonly generalTab: ReferenceFieldGeneralTab;

  constructor(page: Page, frameNumber: number = 0) {
    super(page, frameNumber);
    this.generalTab = new ReferenceFieldGeneralTab(this.frame);
  }
}
