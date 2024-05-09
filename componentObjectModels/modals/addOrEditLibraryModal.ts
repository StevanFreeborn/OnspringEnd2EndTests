import { Locator, Page } from '@playwright/test';
import { LibraryContentDefinition } from '../../models/createMultipleRecordsOutcome';
import { LibraryContentCopySettingsTab } from '../tabs/libraryContentCopySettingsTab';
import { LibraryContentSelectionSettingsTab } from '../tabs/libraryContentSelectionSettingsTab';

export abstract class AddOrEditLibraryModal {
  protected readonly modal: Locator;
  protected readonly contentSelectionSettingsTabButton: Locator;
  protected readonly contentCopySettingsTabButton: Locator;
  protected abstract contentSelectionTab: LibraryContentSelectionSettingsTab;
  protected readonly contentCopySettingsTab: LibraryContentCopySettingsTab;
  readonly okButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.modal = page.getByRole('dialog', { name: /app definition/i });
    this.contentSelectionSettingsTabButton = this.modal.getByRole('tab', { name: 'Content Selection Settings' });
    this.contentCopySettingsTabButton = this.modal.getByRole('tab', { name: 'Content Copy Settings' });
    this.contentCopySettingsTab = new LibraryContentCopySettingsTab(this.modal);
    this.okButton = this.modal.getByRole('button', { name: 'OK' });
    this.cancelButton = this.modal.getByRole('button', { name: 'Cancel' });
  }

  async fillOutForm(definition: LibraryContentDefinition) {
    await this.contentSelectionSettingsTabButton.click();
    await this.contentSelectionTab.fillOutForm(definition);

    await this.contentCopySettingsTabButton.click();
    await this.contentCopySettingsTab.fillOutForm(definition);
  }
}
