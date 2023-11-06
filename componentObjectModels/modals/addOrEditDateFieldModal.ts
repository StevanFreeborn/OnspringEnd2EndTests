import { Page } from '@playwright/test';
import { DateFieldGeneralTab } from '../tabs/dateFieldGeneralTab';
import { AddOrEditLayoutItemModal } from './addOrEditLayoutItemModal';

export class AddOrEditDateFieldModal extends AddOrEditLayoutItemModal {
  readonly generalTab: DateFieldGeneralTab;

  constructor(page: Page, frameNumber: number = 0) {
    super(page, frameNumber);
    this.generalTab = new DateFieldGeneralTab(this.frame);
  }
}
