import { Page } from '@playwright/test';
import { AttachmentFieldGeneralTab } from '../tabs/attachmentFieldGeneralTab';
import { AddOrEditLayoutItemModal } from './addOrEditLayoutItemModal';

export class AddOrEditAttachmentFieldModal extends AddOrEditLayoutItemModal {
  readonly generalTab: AttachmentFieldGeneralTab;

  constructor(page: Page, frameNumber: number = 0) {
    super(page, frameNumber);
    this.generalTab = new AttachmentFieldGeneralTab(this.frame);
  }
}
