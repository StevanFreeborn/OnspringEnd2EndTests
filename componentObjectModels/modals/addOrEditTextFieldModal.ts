import { Page } from '@playwright/test';
import { TextFieldGeneralTab } from '../tabs/textFieldGeneralTab';
import { AddOrEditFieldModal } from './addOrEditFieldModal';

export class AddOrEditTextFieldModal extends AddOrEditFieldModal {
  readonly generalTab: TextFieldGeneralTab;

  constructor(page: Page, frameNumber: number = 0) {
    super(page, frameNumber);
    this.generalTab = new TextFieldGeneralTab(this.frame);
  }
}
