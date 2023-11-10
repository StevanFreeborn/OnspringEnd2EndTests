import { Page } from '@playwright/test';
import { ListFieldGeneralTab } from './../tabs/listFieldGeneralTab';
import { AddOrEditFieldModal } from './addOrEditFieldModal';

export class AddOrEditListFieldModal extends AddOrEditFieldModal {
  readonly generalTab: ListFieldGeneralTab;

  constructor(page: Page, frameNumber: number = 0) {
    super(page, frameNumber);
    this.generalTab = new ListFieldGeneralTab(this.frame);
  }
}
