import { Page } from '@playwright/test';
import { ImageFieldGeneralTab } from '../tabs/imageFieldGeneralTab';
import { AddOrEditFieldModal } from './addOrEditFieldModal';

export class AddOrEditImageFieldModal extends AddOrEditFieldModal {
  readonly generalTab: ImageFieldGeneralTab;

  constructor(page: Page, frameNumber: number = 0) {
    super(page, frameNumber);
    this.generalTab = new ImageFieldGeneralTab(this.frame);
  }
}
