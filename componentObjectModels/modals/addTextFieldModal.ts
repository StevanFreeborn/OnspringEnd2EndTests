import { Page } from '@playwright/test';
import { AddFieldModal } from './addFieldModal';

export class AddTextFieldModal extends AddFieldModal {
  constructor(page: Page) {
    super(page);
  }
}
