import { Page } from '@playwright/test';
import { TextFieldGeneralTab } from '../tabs/textFieldGeneralTab';
import { AddOrEditLayoutItemModal } from './addOrEditLayoutItemModal';

export class AddOrEditTextFieldModal extends AddOrEditLayoutItemModal {
  readonly generalTab: TextFieldGeneralTab;

  constructor(page: Page, frameNumber: number = 0) {
    super(page, frameNumber);
    this.generalTab = new TextFieldGeneralTab(this.frame);
  }
}
