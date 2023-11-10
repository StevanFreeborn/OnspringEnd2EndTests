import { Page } from '@playwright/test';
import { ReferenceFieldGeneralTab } from '../tabs/referenceFieldGeneralTab';
import { AddOrEditFieldModal } from './addOrEditFieldModal';

export class AddOrEditReferenceFieldModal extends AddOrEditFieldModal {
  readonly generalTab: ReferenceFieldGeneralTab;

  constructor(page: Page, frameNumber: number = 0) {
    super(page, frameNumber);
    this.generalTab = new ReferenceFieldGeneralTab(this.frame);
  }
}
