import { Page } from '@playwright/test';
import { TimeSpanFieldGeneralTab } from '../tabs/timeSpanFieldGeneralTab';
import { AddOrEditFieldModal } from './addOrEditFieldModal';

export class AddOrEditTimeSpanFieldModal extends AddOrEditFieldModal {
  readonly generalTab: TimeSpanFieldGeneralTab;

  constructor(page: Page, frameNumber: number = 0) {
    super(page, frameNumber);
    this.generalTab = new TimeSpanFieldGeneralTab(this.frame);
  }
}
