import { Page } from '@playwright/test';
import { ImageFieldGeneralTab } from '../tabs/imageFieldGeneralTab';
import { AddOrEditLayoutItemModal } from './addOrEditLayoutItemModal';

export class AddOrEditImageFieldModal extends AddOrEditLayoutItemModal {
  readonly generalTab: ImageFieldGeneralTab;

  constructor(page: Page, frameNumber: number = 0) {
    super(page, frameNumber);
    this.generalTab = new ImageFieldGeneralTab(this.frame);
  }
}
