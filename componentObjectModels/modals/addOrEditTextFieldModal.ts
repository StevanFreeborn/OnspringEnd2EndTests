import { Page } from '@playwright/test';
import { AddOrEditFieldModal } from './addOrEditFieldModal';

export class AddOrEditTextFieldModal extends AddOrEditFieldModal {
  constructor(page: Page) {
    super(page);
  }
}
