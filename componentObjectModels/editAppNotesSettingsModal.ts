import { Locator, Page } from '@playwright/test';

export class EditAppNotesSettingsModalComponent {
  readonly notesEditor: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.notesEditor = page.locator('.content-area.mce-content-body');
    this.saveButton = page.getByRole('button', {
      name: 'Save',
    });
  }
}
