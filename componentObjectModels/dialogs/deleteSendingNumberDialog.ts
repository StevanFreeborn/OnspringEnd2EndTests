import { Locator, Page } from '@playwright/test';
import { BaseDeleteDialog } from './baseDeleteDialog';

export class DeleteSendingNumberDialog extends BaseDeleteDialog {
  readonly numberSelector: Locator;
  readonly okInput: Locator;

  constructor(page: Page) {
    super(page);
    this.numberSelector = this.dialog.getByRole('listbox');
    this.okInput = this.dialog.getByRole('textbox');
  }
}
