import { Page } from '@playwright/test';
import { NumberFieldGeneralTab } from '../tabs/numberFieldGeneralTab';
import { AddOrEditFieldModal } from './addOrEditFieldModal';

export class AddOrEditNumberFieldModal extends AddOrEditFieldModal {
  readonly generalTab: NumberFieldGeneralTab;

  constructor(page: Page, frameNumber: number = 0) {
    super(page, frameNumber);
    this.generalTab = new NumberFieldGeneralTab(this.frame);
  }
}
