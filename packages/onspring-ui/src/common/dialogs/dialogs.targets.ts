import { Locator, Page } from '@playwright/test';

export const CreateDialogTargets = {
  nameInput: (page: Page): Locator => page.locator('input#Name'),
  saveButton: (page: Page): Locator => page.getByRole('button', { name: 'Save' }),
  continueButton: (page: Page): Locator => page.getByRole('button', { name: 'Continue' }),
  copyFromRadioButton: (page: Page): Locator => page.getByText('Copy from'),
  copyFromDropdown: (page: Page): Locator => page.locator('.copy-from-dropdown'),
  optionToCopy:
    (name: string) =>
    (page: Page): Locator =>
      page.getByRole('option', { name }),
};

export const DeleteDialogTargets = {
  dialog: (page: Page): Locator =>
    page.locator(
      'body > div.ui-dialog.ui-corner-all.ui-widget.ui-widget-content.ui-front.ui-dialog-buttons.ui-draggable.warning-dialog'
    ),
  overlay: (page: Page): Locator => page.locator('body > div.ui-widget-overlay.ui-front'),
  deleteButton: (page: Page): Locator => page.getByRole('button', { name: 'Delete' }),
};
