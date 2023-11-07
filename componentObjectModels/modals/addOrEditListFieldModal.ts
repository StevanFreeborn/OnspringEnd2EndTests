import { Page } from '@playwright/test';
import { ListFieldGeneralTab } from './../tabs/listFieldGeneralTab';
import { AddOrEditLayoutItemModal } from './addOrEditLayoutItemModal';

export class AddOrEditListFieldModal extends AddOrEditLayoutItemModal {
  readonly generalTab: ListFieldGeneralTab;

  constructor(page: Page, frameNumber: number = 0) {
    super(page, frameNumber);
    this.generalTab = new ListFieldGeneralTab(this.frame);
  }
}
