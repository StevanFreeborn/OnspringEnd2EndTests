import { Locator, Page } from '@playwright/test';

export abstract class EditBaseNotesSettingsModal {
  readonly notesEditor: Locator;
  readonly saveButton: Locator;

  protected constructor(page: Page) {
    this.notesEditor = page.locator('.content-area.mce-content-body');
    this.saveButton = page.getByRole('button', {
      name: 'Save',
    });
  }
}
