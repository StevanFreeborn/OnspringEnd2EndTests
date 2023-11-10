import { Page } from '@playwright/test';
import { AttachmentFieldGeneralTab } from '../tabs/attachmentFieldGeneralTab';
import { AddOrEditFieldModal } from './addOrEditFieldModal';

export class AddOrEditAttachmentFieldModal extends AddOrEditFieldModal {
  readonly generalTab: AttachmentFieldGeneralTab;

  constructor(page: Page, frameNumber: number = 0) {
    super(page, frameNumber);
    this.generalTab = new AttachmentFieldGeneralTab(this.frame);
  }
}
