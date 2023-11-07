import { Page } from '@playwright/test';
import { TimeSpanFieldGeneralTab } from '../tabs/timeSpanFieldGeneralTab';
import { AddOrEditLayoutItemModal } from './addOrEditLayoutItemModal';

export class AddOrEditTimeSpanFieldModal extends AddOrEditLayoutItemModal {
  readonly generalTab: TimeSpanFieldGeneralTab;

  constructor(page: Page, frameNumber: number = 0) {
    super(page, frameNumber);
    this.generalTab = new TimeSpanFieldGeneralTab(this.frame);
  }
}
