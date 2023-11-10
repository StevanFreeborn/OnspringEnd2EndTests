import { Page } from '@playwright/test';
import { DateFieldGeneralTab } from '../tabs/dateFieldGeneralTab';
import { AddOrEditFieldModal } from './addOrEditFieldModal';

export class AddOrEditDateFieldModal extends AddOrEditFieldModal {
  readonly generalTab: DateFieldGeneralTab;

  constructor(page: Page, frameNumber: number = 0) {
    super(page, frameNumber);
    this.generalTab = new DateFieldGeneralTab(this.frame);
  }
}
